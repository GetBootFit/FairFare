import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createToken, createCountryPassToken, createBundleToken } from '@/lib/tokens'
import { kvExists, kvSet } from '@/lib/kv'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id')
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

    if (product === 'query_bundle') {
      // Issue 10 independent bundle tokens in parallel
      const tokens = await Promise.all(
        Array.from({ length: 10 }, (_, i) => createBundleToken(`${sessionId}_${i}`))
      )
      return Response.json({ tokens, feature, product: 'query_bundle' })
    }

    if (product === 'country_pass' && country) {
      const token = await createCountryPassToken(sessionId, country)
      return Response.json({ token, feature, product: 'country_pass', country })
    }

    const token = await createToken({ sessionId, feature })
    return Response.json({ token, feature, product: 'single' })
  } catch (err) {
    console.error('[verify]', err)
    return Response.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
