/**
 * Simple sliding-window rate limiter backed by Vercel KV (Redis).
 * Falls back to an in-memory limiter when KV is not configured or Redis errors occur.
 * The in-memory limiter is per-process (resets on cold start) but provides meaningful
 * protection against burst abuse in serverless environments.
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

// ── In-memory fallback ────────────────────────────────────────────────────────

interface MemEntry { count: number; resetAt: number }
const memStore = new Map<string, MemEntry>()
let lastEviction = 0

/** Lazily evict expired entries — at most once per minute to keep overhead low. */
function maybeEvict() {
  const now = Date.now()
  if (now - lastEviction < 60_000) return
  lastEviction = now
  for (const [key, entry] of memStore) {
    if (now > entry.resetAt) memStore.delete(key)
  }
}

function inMemoryRateLimit(key: string, limit: number, windowSec: number): boolean {
  maybeEvict()
  const now = Date.now()
  const entry = memStore.get(key)
  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + windowSec * 1000 })
    return false
  }
  entry.count++
  return entry.count > limit
}

// ─────────────────────────────────────────────────────────────────────────────

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
  const key = `ff:rl:${namespace}:${identifier}`
  try {
    const kv = getKv()
    if (!kv) return inMemoryRateLimit(key, limit, windowSec)

    const count = await kv.incr(key)
    if (count === 1) {
      // Set TTL only on first request in the window
      await kv.expire(key, windowSec)
    }
    return count > limit
  } catch {
    // Redis error — fall back to in-memory limiter rather than allowing all requests
    return inMemoryRateLimit(key, limit, windowSec)
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
