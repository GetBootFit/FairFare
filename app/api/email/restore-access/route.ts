import { NextRequest } from 'next/server'
import { kvGet, kvDelete } from '@/lib/kv'
import crypto from 'crypto'

interface MagicRecord { email: string }
interface TokenRecord { tokens: string[]; savedAt: string }

/** Stable KV key matching save-access route */
function emailKey(email: string): string {
  return `access:tokens:${crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 32)}`
}

/**
 * GET /api/email/restore-access?t={magicToken}
 *
 * Validates the single-use magic token, returns saved JWT tokens, then
 * deletes the magic token so it cannot be reused.
 */
export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get('t')
  if (!t || !/^[0-9a-f]{64}$/.test(t)) {
    return Response.json({ error: 'Invalid or missing token' }, { status: 400 })
  }

  try {
    const magic = await kvGet<MagicRecord>(`access:magic:${t}`)
    if (!magic?.email) {
      return Response.json({ error: 'Link expired or already used' }, { status: 410 })
    }

    // Consume — single-use only
    await kvDelete(`access:magic:${t}`)

    const record = await kvGet<TokenRecord>(emailKey(magic.email))
    if (!record?.tokens?.length) {
      return Response.json({ error: 'No saved access found' }, { status: 404 })
    }

    // Server-side expiry filter: decode JWT payload without signature check
    // (signature is verified properly when the token is actually used at the API)
    const now = Math.floor(Date.now() / 1000)
    const validTokens = record.tokens.filter((tok) => {
      try {
        const [, b64] = tok.split('.')
        const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
        return (payload.exp ?? 0) > now
      } catch {
        return false
      }
    })

    if (validTokens.length === 0) {
      return Response.json({ error: 'All saved tokens have expired' }, { status: 410 })
    }

    return Response.json({ tokens: validTokens, count: validTokens.length })
  } catch (err) {
    console.error('[restore-access]', err)
    return Response.json({ error: 'Failed to restore access' }, { status: 500 })
  }
}
