import { NextRequest } from 'next/server'

/**
 * Server-side proxy for the Google Static Maps API.
 *
 * Why a proxy?
 * - Keeps GOOGLE_MAPS_API_KEY off the client (it was previously embedded in
 *   <img src="https://maps.googleapis.com/...&key=SECRET">).
 * - Bypasses HTTP referrer restrictions — the request comes from the Vercel
 *   server, not the user's browser, so Google's allowlist check passes.
 * - Images are cached at the edge for 24 h (Cache-Control: public, max-age=86400).
 *
 * Supported query params:
 *   ?sample=bkk          — hardcoded Suvarnabhumi → Sukhumvit sample
 *   ?poly=ENC&slat=&slng=&elat=&elng=  — custom driving route polyline
 */

const DARK_STYLES = [
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

const BASE = [
  'size=640x320',
  'scale=2',
  'maptype=roadmap',
  ...DARK_STYLES.map(s => `style=${s}`),
]

function buildGoogleUrl(sp: URLSearchParams): string {
  const key = process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!key) throw new Error('GOOGLE_MAPS_API_KEY is not configured')

  const parts = [...BASE]

  if (sp.get('sample') === 'bkk') {
    // Hardcoded sample: Suvarnabhumi Airport → Sukhumvit Soi 11, Bangkok
    parts.push(
      'path=color:0xa855f7ff|weight:4|13.6900,100.7501|13.7452,100.5547',
      'markers=color:0x9333ea|size:small|13.6900,100.7501',
      'markers=color:0x6b21a8|size:small|13.7452,100.5547',
    )
  } else {
    const poly = sp.get('poly')
    const slat = sp.get('slat')
    const slng = sp.get('slng')
    const elat = sp.get('elat')
    const elng = sp.get('elng')

    if (!poly || !slat || !slng || !elat || !elng) {
      throw new Error('Missing required params: poly, slat, slng, elat, elng')
    }

    // Basic validation — lat/lng must be numbers, polyline must not be absurdly long
    const coords = [slat, slng, elat, elng]
    if (coords.some(c => isNaN(Number(c)))) {
      throw new Error('Invalid coordinate values')
    }
    if (poly.length > 4096) {
      throw new Error('Polyline too long')
    }

    parts.push(
      `path=color:0xa855f7ff|weight:4|enc:${encodeURIComponent(poly)}`,
      `markers=color:0x9333ea|size:small|${slat},${slng}`,
      `markers=color:0x6b21a8|size:small|${elat},${elng}`,
    )
  }

  parts.push(`key=${key}`)
  return `https://maps.googleapis.com/maps/api/staticmap?${parts.join('&')}`
}

export async function GET(req: NextRequest) {
  try {
    const googleUrl = buildGoogleUrl(req.nextUrl.searchParams)

    const res = await fetch(googleUrl, {
      // Cache at the Next.js data layer for 24 h
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[maps/static] Google API error', res.status, body.slice(0, 300))
      return new Response('Map unavailable', { status: 502 })
    }

    const contentType = res.headers.get('content-type') ?? 'image/png'
    const buffer = await res.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        // Cache at the browser / CDN level for 24 h — map tiles don't change
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[maps/static]', msg)
    return new Response('Map unavailable', { status: 500 })
  }
}
