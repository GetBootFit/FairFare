import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/tokens'
import { getRouteInfo, buildRouteMapUrl } from '@/lib/google-maps'
import { getTaxiAiInfo } from '@/lib/claude'
import { findCityRate, calculateFareRange } from '@/lib/taxi-rates'
import type { TaxiFullResult, TransportOption } from '@/types'

/**
 * Paid result: full fare range, scam warnings, confirmation phrase.
 * Requires valid Bearer token.
 */
export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return Response.json({ error: 'Payment required' }, { status: 402 })
  }
  let tokenPayload: Awaited<ReturnType<typeof verifyToken>>
  try {
    tokenPayload = await verifyToken(auth.slice(7))
  } catch {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  // Single-query tokens must be for the taxi feature (undefined = legacy compat)
  if (
    (!tokenPayload.tokenType || tokenPayload.tokenType === 'single') &&
    tokenPayload.feature !== 'taxi'
  ) {
    return Response.json({ error: 'Token not valid for taxi' }, { status: 403 })
  }

  try {
    const { pickup, destination, pickupPlaceId, destPlaceId } = await req.json()

    if (!pickup || !destination) {
      return Response.json({ error: 'Pickup and destination are required' }, { status: 400 })
    }

    // ── Route info + AI (parallel) ───────────────────────────────────────────
    const route = await getRouteInfo(pickup, destination, pickupPlaceId, destPlaceId)

    // Country pass: validate token country matches route country
    if (tokenPayload.tokenType === 'country_pass') {
      const norm = (s: string) =>
        s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')
      if (norm(tokenPayload.country ?? '') !== norm(route.country)) {
        return Response.json(
          { error: `Country pass is for ${tokenPayload.country}, not ${route.country}` },
          { status: 403 }
        )
      }
    }

    const aiInfo = await getTaxiAiInfo(route.city, route.country)

    // ── Fare range from static dataset ───────────────────────────────────────
    const rateData = findCityRate(`${route.city} ${route.country}`)
    if (!rateData) {
      // Paying user searched a city not in our dataset — log for manual review.
      // Filter Vercel logs by [CITY_MISS] to find cities worth adding to taxi-rates.json.
      console.warn(`[CITY_MISS] ${route.city}, ${route.country}`)
    }
    const fareRange = rateData
      ? calculateFareRange(rateData, route.distanceKm)
      : {
          min: 0,
          max: 0,
          currency: '',
          currencySymbol: '',
          note: 'Fare data not available for this city. Verify with driver.',
        }

    // ── Map transit options ───────────────────────────────────────────────────
    const transitOptions: TransportOption[] = route.transitOptions.map((t) => {
      const modeStr = t.modes[0]?.toUpperCase() ?? ''
      const mode: TransportOption['mode'] =
        modeStr.includes('RAIL') || modeStr.includes('TRAIN')
          ? 'train'
          : modeStr.includes('SUBWAY') || modeStr.includes('METRO')
          ? 'metro'
          : modeStr.includes('TRAM')
          ? 'tram'
          : modeStr.includes('FERRY')
          ? 'ferry'
          : 'bus'

      return {
        mode,
        duration: t.duration,
        durationMinutes: t.durationMinutes,
        lines: t.lines,
      }
    })

    // ── Route map URL (dark-styled Static Maps) ───────────────────────────────
    let routeMapUrl: string | undefined
    if (route.overviewPolyline && route.startLocation && route.endLocation) {
      try {
        routeMapUrl = buildRouteMapUrl(
          route.overviewPolyline,
          route.startLocation.lat,
          route.startLocation.lng,
          route.endLocation.lat,
          route.endLocation.lng,
        )
      } catch {
        // Non-fatal — map unavailable (e.g. key not configured)
      }
    }

    const result: TaxiFullResult = {
      pickup,
      destination,
      distance: { km: route.distanceKm, mi: route.distanceMi },
      duration: { text: route.durationText, minutes: route.durationMinutes },
      city: route.city,
      country: route.country,
      fareRange,
      transitOptions,
      scamWarnings: aiInfo.scamWarnings,
      tipping: aiInfo.tipping,
      driverPhrases: aiInfo.driverPhrases,
      routeMapUrl,
    }

    return Response.json(result)
  } catch (err) {
    console.error('[taxi/result]', err)
    const message = err instanceof Error ? err.message : 'Failed to fetch taxi data'
    return Response.json({ error: message }, { status: 500 })
  }
}
