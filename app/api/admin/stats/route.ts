import { NextRequest } from 'next/server'
import { createClient } from '@vercel/kv'

/**
 * GET /api/admin/stats
 * Internal metrics endpoint — protected by ADMIN_SECRET header.
 *
 * Returns:
 *  - cityMisses: cities searched by paying users but absent from taxi-rates.json
 *  - kvStatus: whether KV is reachable
 *
 * Usage:
 *   curl https://hootling.com/api/admin/stats -H "x-admin-secret: <ADMIN_SECRET>"
 */
export async function GET(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    return Response.json({ error: 'Admin endpoint not configured' }, { status: 503 })
  }
  const provided = req.headers.get('x-admin-secret')
  if (provided !== secret) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── KV ──────────────────────────────────────────────────────────────────────
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN
  if (!kvUrl || !kvToken) {
    return Response.json({ error: 'KV not configured' }, { status: 503 })
  }

  try {
    const kv = createClient({ url: kvUrl, token: kvToken })

    // ── City misses (logged by result route as [CITY_MISS]) ──────────────────
    // Keys written by: await kv.incr(`city_miss:${city}:${country}`)
    // (You can add that counter to route.ts alongside the console.warn.)
    const missCursor = kv.scanIterator({ match: 'city_miss:*', count: 200 })
    const cityMisses: Array<{ city: string; count: number }> = []
    for await (const key of missCursor) {
      const count = await kv.get<number>(key)
      const label = (key as string).replace('city_miss:', '').replace(':', ', ')
      cityMisses.push({ city: label, count: count ?? 0 })
    }
    cityMisses.sort((a, b) => b.count - a.count)

    // ── Cache size (rough) ────────────────────────────────────────────────────
    const taxiCacheKeys: string[] = []
    const taxiCursor = kv.scanIterator({ match: 'taxi_v2:*', count: 500 })
    for await (const key of taxiCursor) taxiCacheKeys.push(key as string)

    const tippingCacheKeys: string[] = []
    const tippingCursor = kv.scanIterator({ match: 'tipping_v2:*', count: 500 })
    for await (const key of tippingCursor) tippingCacheKeys.push(key as string)

    return Response.json({
      timestamp: new Date().toISOString(),
      cityMisses,
      cacheEntries: {
        taxi: taxiCacheKeys.length,
        tipping: tippingCacheKeys.length,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'KV error'
    return Response.json({ error: message }, { status: 500 })
  }
}
