import type { Metadata } from 'next'
import SharePageClient from './SharePageClient'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'

interface Props {
  searchParams: Promise<{
    city?: string
    country?: string
    from?: string
    to?: string
    min?: string
    max?: string
    sym?: string
    curr?: string
    km?: string
    dur?: string
  }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const p = await searchParams
  const { city, country, from, to, min, max, sym, curr } = p

  // Build OG image URL — mirrors the params consumed by /api/og/result
  const ogParams = new URLSearchParams()
  if (city)    ogParams.set('city',    city)
  if (country) ogParams.set('country', country)
  if (from)    ogParams.set('from',    from)
  if (to)      ogParams.set('to',      to)
  if (min)     ogParams.set('min',     min)
  if (max)     ogParams.set('max',     max)
  if (sym)     ogParams.set('sym',     sym)
  if (curr)    ogParams.set('curr',    curr)
  if (p.km)    ogParams.set('km',      p.km)
  if (p.dur)   ogParams.set('dur',     p.dur)

  const ogImageUrl  = `${BASE}/api/og/result?${ogParams.toString()}`
  const sharePageUrl = `${BASE}/share?${ogParams.toString()}`

  const hasFare    = !!(min && max && min !== '0')
  const fareText   = hasFare ? `${sym}${min}–${sym}${max}` : ''
  const location   = [city, country].filter(Boolean).join(', ')
  const routeDesc  = from && to ? `${from} → ${to}. ` : ''
  const fareDesc   = fareText ? `Estimated taxi fare: ${fareText}. ` : ''

  const title       = location
    ? `Taxi fare in ${location}${fareText ? `: ${fareText}` : ''} — Hootling`
    : 'Taxi Fare Check — Hootling'
  const description = `${routeDesc}${fareDesc}Know what's fair before you ride.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: sharePageUrl,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    // Canonical points back to the fare tool, not this ephemeral share URL
    alternates: { canonical: `${BASE}/taxi` },
  }
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams
  return <SharePageClient params={params} />
}
