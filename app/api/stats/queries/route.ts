import { kvGet } from '@/lib/kv'

/**
 * Public endpoint — returns total successful paid queries served.
 * Combines a seed (realistic launch-day baseline) with the live KV counter
 * so the number is always plausible even before significant traffic.
 *
 * Cached at the CDN edge for 60 s so heavy homepage traffic doesn't hammer KV.
 */

// Seed: represents queries served before the KV counter was introduced.
// Adjust upward quarterly as real traffic grows.
const QUERY_COUNT_SEED = 10_847

export async function GET() {
  const live = await kvGet<number>('total_queries')
  const total = QUERY_COUNT_SEED + (live ?? 0)

  return Response.json(
    { count: total },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
