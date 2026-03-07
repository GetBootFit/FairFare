/**
 * Simple sliding-window rate limiter backed by Vercel KV (Redis).
 * Degrades gracefully — allows all requests when KV is not configured.
 *
 * Usage:
 *   const limited = await isRateLimited('preview', ip, 30, 3600)
 *   if (limited) return Response.json({ error: 'Too many requests' }, { status: 429 })
 */

import { createClient } from '@vercel/kv'

let _kv: ReturnType<typeof createClient> | null = null

function getKv() {
  if (_kv) return _kv
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  _kv = createClient({ url, token })
  return _kv
}

/**
 * Returns true if this request should be blocked.
 *
 * @param namespace  Key prefix (e.g. 'preview', 'tipping')
 * @param identifier IP address or other per-user identifier
 * @param limit      Max requests allowed in the window
 * @param windowSec  Window duration in seconds (e.g. 3600 = 1 hour)
 */
export async function isRateLimited(
  namespace: string,
  identifier: string,
  limit: number,
  windowSec: number
): Promise<boolean> {
  try {
    const kv = getKv()
    if (!kv) return false // KV not configured → allow all (local dev)

    const key = `ff:rl:${namespace}:${identifier}`
    const count = await kv.incr(key)
    if (count === 1) {
      // Set TTL only on first request in the window
      await kv.expire(key, windowSec)
    }
    return count > limit
  } catch {
    // Non-fatal — allow request on Redis errors
    return false
  }
}

/**
 * Extract a best-effort client IP from request headers.
 * In production on Vercel, x-forwarded-for is set by the edge network.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first (client IP)
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'anonymous'
}
