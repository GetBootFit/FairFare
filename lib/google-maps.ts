import {
  Client,
  TravelMode,
  Status,
} from '@googlemaps/google-maps-services-js'

const client = new Client({})

function apiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) throw new Error('GOOGLE_MAPS_API_KEY is not set')
  return key
}

export interface RouteInfo {
  distanceMeters: number
  distanceKm: number
  distanceMi: number
  durationSeconds: number
  durationMinutes: number
  durationText: string
  city: string
  country: string
  transitOptions: TransitRouteOption[]
}

export interface TransitRouteOption {
  duration: string
  durationMinutes: number
  modes: string[]
  lines: string[]
}

export async function getRouteInfo(
  pickup: string,
  destination: string,
  pickupPlaceId?: string,
  destPlaceId?: string
): Promise<RouteInfo> {
  const origin = pickupPlaceId ? `place_id:${pickupPlaceId}` : pickup
  const dest = destPlaceId ? `place_id:${destPlaceId}` : destination
  const key = apiKey()

  // ── Driving distance + duration ───────────────────────────────────────────
  const distanceRes = await client.distancematrix({
    params: { origins: [origin], destinations: [dest], mode: TravelMode.driving, key },
  })

  const element = distanceRes.data.rows[0]?.elements[0]
  if (!element || element.status !== Status.OK) {
    throw new Error('Could not calculate route. Check that the locations are valid.')
  }

  const distanceMeters = element.distance.value
  const durationSeconds = element.duration.value

  // ── Get city/country from place details or geocoding ─────────────────────
  // NOTE: reverseGeocode requires lat/lng coordinates, not a text address.
  // We use placeDetails when a placeId is available (autocomplete path),
  // otherwise fall back to geocode() which accepts a text address directly.
  let city = ''
  let country = ''
  try {
    let components: Array<{ types: string[]; long_name: string }> = []

    if (pickupPlaceId) {
      const placeRes = await client.placeDetails({
        params: { place_id: pickupPlaceId, fields: ['address_component'], key },
      })
      components = (placeRes.data.result.address_components ?? []) as Array<{
        types: string[]
        long_name: string
      }>
    } else {
      const geocodeRes = await client.geocode({
        params: { address: distanceRes.data.origin_addresses[0], key },
      })
      components = (geocodeRes.data.results[0]?.address_components ?? []) as Array<{
        types: string[]
        long_name: string
      }>
    }

    const findComponent = (type: string) =>
      components.find((c) => (c.types as string[]).includes(type))

    city =
      findComponent('locality')?.long_name ??
      findComponent('postal_town')?.long_name ??       // UK cities (e.g. London boroughs)
      findComponent('administrative_area_level_2')?.long_name ??
      findComponent('administrative_area_level_1')?.long_name ??
      ''
    country = findComponent('country')?.long_name ?? ''
  } catch {
    // Last-resort fallback: split the formatted address string.
    // Format is typically "Street, District, City, PostCode, Country"
    const parts = distanceRes.data.origin_addresses[0]?.split(',') ?? []
    city = parts[parts.length - 3]?.trim() ?? ''
    country = parts[parts.length - 1]?.trim() ?? ''
  }

  // ── Transit alternatives (best-effort) ───────────────────────────────────
  const transitOptions: TransitRouteOption[] = []
  try {
    const transitRes = await client.directions({
      params: { origin, destination: dest, mode: TravelMode.transit, alternatives: true, key },
    })
    for (const route of transitRes.data.routes.slice(0, 3)) {
      const leg = route.legs[0]
      const transitSteps = leg.steps.filter((s) => (s.travel_mode as string) === 'TRANSIT')
      const modes = [
        ...new Set(
          transitSteps.map((s) => s.transit_details?.line.vehicle.type ?? 'BUS')
        ),
      ]
      const lines = transitSteps
        .map((s) => s.transit_details?.line.short_name ?? s.transit_details?.line.name ?? '')
        .filter(Boolean)
      transitOptions.push({
        duration: leg.duration.text,
        durationMinutes: Math.round(leg.duration.value / 60),
        modes,
        lines: [...new Set(lines)],
      })
    }
  } catch {
    // Transit data unavailable for this route — that's fine
  }

  return {
    distanceMeters,
    distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
    distanceMi: Math.round((distanceMeters / 1609.34) * 10) / 10,
    durationSeconds,
    durationMinutes: Math.round(durationSeconds / 60),
    durationText: element.duration.text,
    city,
    country,
    transitOptions,
  }
}
