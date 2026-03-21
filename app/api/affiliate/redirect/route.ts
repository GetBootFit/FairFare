/**
 * Affiliate Redirect + Tracking Endpoint
 *
 * GET /api/affiliate/redirect?id=kiwitaxi&zone=result&city=Bangkok&country=Thailand&iso=TH
 *
 * 1. Looks up the partner in affiliate config (KV override → static default)
 * 2. Validates the partner is enabled and has a real URL
 * 3. Builds the destination URL (with city/country appended if partner supports it)
 * 4. Increments KV click counters (partner:zone total + daily)
 * 5. Returns 302 redirect to the affiliate destination
 *
 * Using a redirect endpoint (vs direct <a href>) means:
 *   - URLs can be updated from /admin without a redeploy
 *   - Server-side click tracking independent of client-side JS
 *   - rel="sponsored" semantics preserved (set in AffiliateBlock component)
 */

import { type NextRequest, NextResponse } from 'next/server'
import { getAffiliateConfig, incrementClickCount } from '@/lib/affiliates'
import type { AffiliateZone } from '@/data/affiliate-config'

const VALID_ZONES: AffiliateZone[] = ['result', 'preview', 'blog', 'success']

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const zone = searchParams.get('zone') as AffiliateZone | null
  const city = searchParams.get('city') ?? undefined
  const country = searchParams.get('country') ?? undefined

  // Validate required params
  if (!id || !zone || !VALID_ZONES.includes(zone)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  // Look up partner
  const config = await getAffiliateConfig()
  const partner = config.find(p => p.id === id)

  if (!partner || !partner.enabled) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
  }

  // Reject placeholder URLs
  if (partner.baseUrl.startsWith('TRAVELPAYOUTS_') || partner.baseUrl.startsWith('IMPACT_')) {
    return NextResponse.json({ error: 'Partner URL not configured' }, { status: 503 })
  }

  // Build destination URL
  const destination = buildDestinationUrl(partner.baseUrl, city, country)

  // Track the click (fire-and-forget — don't await to keep redirect fast)
  incrementClickCount(id, zone).catch(() => {/* non-critical */})

  // 302 redirect — not cached (no-store) since URLs may change via admin
  return NextResponse.redirect(destination, {
    status: 302,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

/**
 * Append city/country to the affiliate base URL.
 * Travelpayouts and most affiliate programs accept destination as a query param.
 * The baseUrl may already contain query params, so we use URLSearchParams safely.
 */
function buildDestinationUrl(
  baseUrl: string,
  city?: string,
  country?: string
): string {
  try {
    const url = new URL(baseUrl)
    // Only append if the URL doesn't already contain a destination param
    if (city && !url.searchParams.has('city') && !url.searchParams.has('destination') && !url.searchParams.has('q')) {
      url.searchParams.set('city', city)
    }
    if (country && !url.searchParams.has('country')) {
      url.searchParams.set('country', country)
    }
    return url.toString()
  } catch {
    // If baseUrl is somehow invalid, return it as-is
    return baseUrl
  }
}
