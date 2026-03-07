/**
 * DEV-ONLY endpoint — issues long-lived tokens without requiring Stripe payment.
 * Returns 403 in production so it can never be used in a live environment.
 *
 * Usage:
 *   GET /api/dev/token?feature=taxi      → 24h taxi token
 *   GET /api/dev/token?feature=tipping   → 24h tipping token
 */
import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'

function secret(): Uint8Array {
  const s = process.env.ENTITLEMENT_SECRET
  if (!s) throw new Error('ENTITLEMENT_SECRET is not set')
  return new TextEncoder().encode(s)
}

export async function GET(req: NextRequest) {
  // Hard-block in production — this endpoint must never be reachable live
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const feature = req.nextUrl.searchParams.get('feature') as 'taxi' | 'tipping' | null
    if (!feature || !['taxi', 'tipping'].includes(feature)) {
      return Response.json(
        { error: 'Missing or invalid ?feature= param. Use taxi or tipping.' },
        { status: 400 }
      )
    }

    const sessionId = `dev-${feature}-${Date.now()}`

    const token = await new SignJWT({
      sessionId,
      tokenType: 'single',
      feature,
    } as Record<string, unknown>)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // 24h for dev convenience (vs 30min in prod)
      .sign(secret())

    return Response.json({ token, feature, sessionId, expiresIn: '24h' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[dev/token]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
