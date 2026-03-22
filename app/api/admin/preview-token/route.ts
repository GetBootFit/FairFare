/**
 * Admin Preview Token API
 * GET /api/admin/preview-token?feature=taxi|tipping
 *
 * Requires valid admin_token cookie. Issues a long-lived JWT so admins
 * can review paid pages on production without going through Stripe.
 */

import { type NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

function secret(): Uint8Array {
  const s = process.env.ENTITLEMENT_SECRET
  if (!s) throw new Error('ENTITLEMENT_SECRET is not set')
  return new TextEncoder().encode(s)
}

async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_token')?.value
  const adminSecret = process.env.ADMIN_SECRET
  return !!(adminToken && adminSecret && adminToken === adminSecret)
}

export async function GET(req: NextRequest) {
  if (!await isAdminAuthed()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const feature = req.nextUrl.searchParams.get('feature') as 'taxi' | 'tipping' | null
  if (!feature || !['taxi', 'tipping'].includes(feature)) {
    return Response.json(
      { error: 'Missing or invalid ?feature= param. Use taxi or tipping.' },
      { status: 400 }
    )
  }

  try {
    const sessionId = `admin-preview-${feature}-${Date.now()}`

    const token = await new SignJWT({
      sessionId,
      tokenType: 'single',
      feature,
    } as Record<string, unknown>)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // 7 days for admin convenience
      .sign(secret())

    return Response.json({ token, feature, sessionId, expiresIn: '7d' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('[admin/preview-token]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
