import { NextRequest } from 'next/server'
import { getRouteInfo } from '@/lib/google-maps'
import { findCityRate, calculateFareRange } from '@/lib/taxi-rates'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
import { kvIncrement } from '@/lib/kv'
import type { TaxiPreviewResult } from '@/types'

const RATE_LIMIT = 30
const RATE_WINDOW = 3600
const MAX_FIELD_LEN = 200

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const limited = await isRateLimited('preview', ip, RATE_LIMIT, RATE_WINDOW)
  if (limited) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(RATE_WINDOW) } }
    )
  }

  try {
    const body = await req.json()
    const { pickup, destination, pickupPlaceId, destPlaceId } = body

    if (!pickup || !destination) {
      return Response.json({ error: 'Pickup and destination are required' }, { status: 400 })
    }
    if (typeof pickup !== 'string' || typeof destination !== 'string') {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }
    if (pickup.trim().length > MAX_FIELD_LEN || destination.trim().length > MAX_FIELD_LEN) {
      return Response.json({ error: 'Input too long' }, { status: 400 })
    }

    const route = await getRouteInfo(
      pickup.trim(),
      destination.trim(),
      pickupPlaceId,
      destPlaceId,
    )

    // Track cities not in our fare dataset.
    // KV counter per city drives the admin dashboard for prioritising additions.
    const rateData = findCityRate(`${route.city} ${route.country}`)
    const citySupported = !!rateData

    if (!citySupported) {
      const missKey = `city_miss:${route.city.toLowerCase().replace(/\s+/g, '_')}`
      await kvIncrement(missKey)
      console.warn(`[CITY_MISS:preview] ${route.city}, ${route.country}`)
    }

    const fareRange = rateData
      ? calculateFareRange(rateData, route.distanceKm)
      : undefined

    const result: TaxiPreviewResult = {
      pickup,
      destination,
      distance: { km: route.distanceKm, mi: route.distanceMi },
      duration: { text: route.durationText, minutes: route.durationMinutes },
      city: route.city,
      country: route.country,
      citySupported,
      fareRange,
    }

    return Response.json(result)
  } catch (err) {
    console.error('[taxi/preview]', err)
    const message = err instanceof Error ? err.message : 'Failed to calculate route'
    return Response.json({ error: message }, { status: 500 })
  }
}
