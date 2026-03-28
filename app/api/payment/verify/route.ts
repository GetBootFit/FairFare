import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createToken, createCountryPassToken, createBundleToken } from '@/lib/tokens'
import { kvExists, kvSet } from '@/lib/kv'
import { ENTITLEMENT_COOKIE_OPTS } from '@/lib/server-auth'
import { randomUUID } from 'crypto'

/** 90-day TTL in seconds — matches the longest bundle token lifespan. */
const BUNDLE_KV_TTL = 90 * 24 * 60 * 60

/**
 * POST /api/payment/verify
 * Body: { session_id: string }
 *
 * Session ID is sent in the request body (not URL query string) so it does not
 * appear in:
 *   • Server access logs (URL is logged; body is not)
 *   • Browser history
 *   • Referrer headers sent to third-party scripts
 *   • CDN/proxy cache keys
 *
 * The previous GET ?session_id=… pattern was a low-severity information disclosure
 * risk — session IDs are one-time-use (KV replay check) but leaking them to logs
 * violates the principle of least exposure.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const sessionId: string | undefined = body?.session_id
    if (!sessionId) {
      return Response.json({ error: 'Missing session_id' }, { status: 400 })
    }

    // Prevent replay attacks: reject if session was already used (KV only — skipped in local dev)
    const alreadyUsed = await kvExists(`ff:session:${sessionId}`)
    if (alreadyUsed) {
      return Response.json({ error: 'This payment session has already been used' }, { status: 409 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 402 })
    }

    const feature = session.metadata?.feature as 'taxi' | 'tipping' | undefined
    const product = (session.metadata?.product ?? 'single') as 'single' | 'country_pass' | 'query_bundle'
    const country = session.metadata?.country ?? ''

    if (!feature) {
      return Response.json({ error: 'Invalid session metadata' }, { status: 400 })
    }

    // Mark session as used — TTL 90 days (longest token lifespan = bundle)
    await kvSet(`ff:session:${sessionId}`, '1', 90 * 86400)

    // Expose payment amount so the client can fire an accurate GA4 purchase event.
    // amount_total is in the smallest currency unit (cents/pence/etc.) — divide by 100 for display.
    const amountTotal = session.amount_total ?? 0
    const currency = (session.currency ?? 'usd').toUpperCase()

    // ── Bundle ────────────────────────────────────────────────────────────────
    if (product === 'query_bundle') {
      // Issue 20 independent bundle tokens in parallel (20 queries at $19.99 = ~$1/query)
      const tokens = await Promise.all(
        Array.from({ length: 20 }, (_, i) => createBundleToken(`${sessionId}_${i}`))
      )

      // Store tokens in KV under a session ID; the ID goes in an httpOnly cookie.
      // This means the raw JWTs are never accessible to client-side JS after the
      // initial window event (XSS cannot silently drain unused bundle tokens).
      const bundleSessionId = randomUUID()
      await kvSet(`bundle:tokens:${bundleSessionId}`, tokens, BUNDLE_KV_TTL)

      // bundleSessionId is returned in the response (not sensitive — it's an internal reference
      // used to register the user's email for low-query reminders via /api/email/subscribe).
      const res = NextResponse.json({ tokens, feature, product: 'query_bundle', bundleSessionId, amountTotal, currency })
      res.cookies.set('hootling_bundle_id', bundleSessionId, {
        ...ENTITLEMENT_COOKIE_OPTS,
        maxAge: BUNDLE_KV_TTL,
      })
      return res
    }

    // ── Country pass ──────────────────────────────────────────────────────────
    if (product === 'country_pass' && country) {
      const token = await createCountryPassToken(sessionId, country)
      const res = NextResponse.json({ token, feature, product: 'country_pass', country, amountTotal, currency })
      // 24-hour TTL matches the country-pass JWT expiry
      res.cookies.set('hootling_token', token, {
        ...ENTITLEMENT_COOKIE_OPTS,
        maxAge: 24 * 60 * 60,
      })
      return res
    }

    // ── Single query ──────────────────────────────────────────────────────────
    const token = await createToken({ sessionId, feature })
    const res = NextResponse.json({ token, feature, product: 'single', amountTotal, currency })
    // 8-hour TTL matches the single-query JWT expiry (extended from 30m — see tokens.ts)
    res.cookies.set('hootling_token', token, {
      ...ENTITLEMENT_COOKIE_OPTS,
      maxAge: 8 * 60 * 60,
    })
    return res
  } catch (err) {
    console.error('[verify]', err)
    return Response.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
