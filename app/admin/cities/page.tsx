/**
 * Admin dashboard — Top missing cities
 * Protected by HTTP Basic Auth via Edge Middleware (middleware.ts).
 * Set ADMIN_SECRET env var — middleware enforces auth before this page loads.
 *
 * Shows top 20 cities that users searched for but are not in the fare dataset.
 * Data is written by /api/taxi/preview when findCityRate() returns null.
 */

import { createClient } from '@vercel/kv'

async function getMissingCities(): Promise<{ city: string; count: number }[]> {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return []

  try {
    const client = createClient({ url, token })
    const keys: string[] = await client.keys('city_miss:*')
    if (!keys.length) return []

    const counts = await Promise.all(
      keys.map(async (key) => {
        const count = (await client.get<number>(key)) ?? 0
        const city = key.replace('city_miss:', '').replace(/_/g, ' ')
        return { city, count }
      })
    )

    return counts
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
  } catch {
    return []
  }
}

export default async function AdminCitiesPage() {
  // Auth is enforced by HTTP Basic Auth in middleware.ts before this page loads.
  const cities = await getMissingCities()

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-xl font-bold text-white">Missing Cities Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Top 20 cities users searched for that are not in the fare dataset.
        </p>
      </div>

      {cities.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <p className="text-zinc-500 text-sm">
            {process.env.KV_REST_API_URL
              ? 'No missing city data yet. Data accumulates as users search.'
              : 'KV not configured — set KV_REST_API_URL and KV_REST_API_TOKEN to track misses.'}
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">City</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Searches</span>
          </div>
          {cities.map(({ city, count }, i) => (
            <div
              key={city}
              className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 w-5 text-right">{i + 1}</span>
                <span className="text-sm text-white capitalize">{city}</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-1.5 bg-purple-600/60 rounded-full"
                  style={{
                    width: `${Math.max(4, (count / (cities[0]?.count ?? 1)) * 80)}px`,
                  }}
                />
                <span className="text-sm font-semibold text-purple-400 w-8 text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <p className="text-xs text-zinc-500">
          Data is written to Vercel KV under keys <code className="text-purple-400">city_miss:*</code> when
          a user searches a route but the origin city is not in <code className="text-purple-400">data/taxi-rates.json</code>.
          Add the top cities to the dataset to increase revenue coverage.
        </p>
      </div>
    </div>
  )
}
