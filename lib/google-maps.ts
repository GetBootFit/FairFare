import {
  Client,
  TravelMode,
} from '@googlemaps/google-maps-services-js'

const client = new Client({})

function apiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
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
  overviewPolyline: string | null
  startLocation: { lat: number; lng: number } | null
  endLocation: { lat: number; lng: number } | null
}

/**
 * Build a Google Static Maps URL with a dark theme styled to match the app.
 * The polyline is `encodeURIComponent`-encoded; `|` and `:` separators in
 * style/path/markers values are kept literal so Google can parse them.
 */
export function buildRouteMapUrl(
  polyline: string,
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): string {
  const key = apiKey()

  // Dark map style matching FairFare's zinc/dark palette
  const styles = [
    'element:geometry|color:0x1c1c27',
    'element:geometry.stroke|color:0x2e2e3e',
    'element:labels.text.fill|color:0x686878',
    'element:labels.text.stroke|color:0x1c1c27',
    'feature:road|element:geometry|color:0x2d2d40',
    'feature:road.highway|element:geometry|color:0x3d3d5a',
    'feature:road.highway|element:geometry.stroke|color:0x242432',
    'feature:water|element:geometry|color:0x0d1117',
    'feature:landscape|element:geometry|color:0x1a1a28',
    'feature:poi|visibility:off',
    'feature:transit|visibility:off',
    'feature:administrative.land_parcel|visibility:off',
  ]

  const params = [
    'size=640x320',
    'scale=2',
    'maptype=roadmap',
    ...styles.map(s => `style=${s}`),
    // Route polyline in purple; encodeURIComponent handles all special chars
    `path=color:0xa855f7ff|weight:4|enc:${encodeURIComponent(polyline)}`,
    // Start marker (lighter purple) + end marker (darker purple)
    `markers=color:0x9333ea|size:small|${startLat},${startLng}`,
    `markers=color:0x6b21a8|size:small|${endLat},${endLng}`,
    `key=${encodeURIComponent(key)}`,
  ]

  return `https://maps.googleapis.com/maps/api/staticmap?${params.join('&')}`
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

  // ── Driving directions — gives distance, duration, AND route polyline ─────
  // Using Directions API instead of Distance Matrix so we get overview_polyline
  // for the static route map at the same cost tier ($5/1000 calls).
  const drivingRes = await client.directions({
    params: { origin, destination: dest, mode: TravelMode.driving, key },
  })

  if (!drivingRes.data.routes?.length || !drivingRes.data.routes[0]?.legs?.length) {
    throw new Error('Could not calculate route. Check that the locations are valid.')
  }

  const drivingRoute = drivingRes.data.routes[0]
  const drivingLeg = drivingRoute.legs[0]

  const distanceMeters = drivingLeg.distance.value
  const durationSeconds = drivingLeg.duration.value
  const overviewPolyline = drivingRoute.overview_polyline?.points ?? null
  const startLocation = drivingLeg.start_location
    ? { lat: drivingLeg.start_location.lat, lng: drivingLeg.start_location.lng }
    : null
  const endLocation = drivingLeg.end_location
    ? { lat: drivingLeg.end_location.lat, lng: drivingLeg.end_location.lng }
    : null

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
        params: { address: drivingLeg.start_address ?? pickup, key },
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
    // Last-resort fallback: split the formatted start address string.
    // Format is typically "Street, District, City, PostCode, Country"
    const parts = (drivingLeg.start_address ?? pickup).split(',')
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
    durationText: drivingLeg.duration.text,
    city,
    country,
    transitOptions,
    overviewPolyline,
    startLocation,
    endLocation,
  }
}
