/**
 * GET /api/exchange-rates?from=THB
 * Returns exchange rates from the specified currency to our 6 home currencies.
 * Results are served from KV/memory cache — no auth required.
 */
import { NextRequest } from 'next/server'
import { getExchangeRates } from '@/lib/exchange-rates'

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get('from')?.toUpperCase()

  if (!from) {
    return Response.json({ error: 'Missing ?from= param (e.g. ?from=THB)' }, { status: 400 })
  }

  const rates = await getExchangeRates(from)

  if (!rates) {
    return Response.json({ error: 'Exchange rates temporarily unavailable' }, { status: 503 })
  }

  return Response.json(
    { from, rates },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } }
  )
}
