import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Car, MapPin, AlertTriangle, Info, ArrowRight } from 'lucide-react'
import { getAirportData, getAllAirportCodes, estimateAirportFare } from '@/lib/airport-data'
import { getPartnersForZone } from '@/lib/affiliates'
import { AffiliatePreviewStrip } from '@/components/AffiliatePreviewStrip'

// ── Static generation + ISR ───────────────────────────────────────────────────

// Regenerate at most once every 24 h (airport rate data changes infrequently)
export const revalidate = 86400

export function generateStaticParams() {
  return getAllAirportCodes().map((code) => ({ code }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ code: string }> }
): Promise<Metadata> {
  const { code } = await params
  const airport = getAirportData(code)
  if (!airport) return { title: 'Airport Not Found' }

  const year = new Date().getFullYear()

  return {
    title: `${airport.code} Taxi Fares — ${airport.name} to ${airport.city} (${year})`,
    description: `Official taxi fares from ${airport.name} to ${airport.city}. ${airport.approxCityFare}. Scam warnings, alternatives and practical tips for ${year}.`,
    alternates: { canonical: `https://www.hootling.com/taxi/airport/${code}` },
    openGraph: {
      title: `${airport.code} Taxi Fares — ${airport.name} (${year})`,
      description: `${airport.approxCityFare} · Avoid scams · Compare alternatives.`,
      url: `https://hootling.com/taxi/airport/${code}`,
      type: 'website',
      images: [
        {
          url: `https://hootling.com/api/og/city?city=${encodeURIComponent(airport.city.toLowerCase())}`,
          width: 1200,
          height: 630,
          alt: `Taxi fares from ${airport.name} — Hootling`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${airport.code} Taxi Fares — ${airport.name}`,
      description: `${airport.approxCityFare} · Know what's fair before you ride.`,
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AirportPage(
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const airport = getAirportData(code)
  if (!airport) notFound()

  const year = new Date().getFullYear()
  const sym = airport.currencySymbol

  // Transfer partners for the airport zone — Kiwitaxi, Welcome Pickups, GetTransfer.
  // Fetched server-side so the strip renders in the initial HTML (no client JS needed).
  // isoCountry geo-ranks partners with regional strength (e.g. Welcome Pickups for GR/ES/IT).
  const transferPartners = await getPartnersForZone('airport', {
    categories: ['transfer'],
    maxItems: 2,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does a taxi from ${airport.name} to ${airport.city} cost?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${airport.approxCityFare} in ${year}. Exact fare depends on your destination and traffic conditions.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is there a flat rate taxi from ${airport.code}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: airport.code === 'JFK'
            ? `Yes — yellow cabs charge a flat $70 to any Manhattan destination, plus tolls and tip.`
            : `${airport.name} taxis use a metered fare. Always insist the driver uses the meter.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the taxi alternatives at ${airport.code}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: airport.alternatives.join('. '),
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-6 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/taxi" className="hover:text-zinc-300 transition-colors">Taxi Fare Check</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400">{airport.code}</span>
        </nav>

        {/* Hero */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-800/50 flex items-center justify-center text-purple-400 shrink-0">
              <Car size={20} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                {airport.name} Taxi Fares
              </h1>
              <p className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                <MapPin size={10} />
                {airport.city}, {airport.country} · {airport.currency} · {year}
              </p>
            </div>
          </div>

          {/* Summary badge */}
          <div className="bg-purple-900/20 border border-purple-800/40 rounded-2xl p-4">
            <p className="text-xs text-purple-400 uppercase tracking-wider mb-1">Typical fare</p>
            <p className="text-white font-bold text-lg">{airport.approxCityFare}</p>
            {airport.taxiColor && (
              <p className="text-zinc-500 text-xs mt-1">Look for: {airport.taxiColor}</p>
            )}
          </div>
        </div>

        {/* Fare table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Fare Estimates by Destination</h2>
          <p className="text-xs text-zinc-500">Based on official meter rates ± 15%</p>
          <div className="space-y-1">
            {airport.routes.map((route) => {
              // JFK Manhattan is a special flat rate
              const isFlat = airport.code === 'JFK' && route.label.includes('Manhattan')
              const est = isFlat
                ? { min: 70, max: 90 }
                : estimateAirportFare(airport, route.km)
              return (
                <div
                  key={route.label}
                  className="flex flex-col gap-0.5 py-2.5 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">{route.label}</span>
                    <span className="text-sm font-semibold text-white whitespace-nowrap ml-2">
                      {sym}{est.min}–{sym}{est.max}
                    </span>
                  </div>
                  {route.note && (
                    <p className="text-xs text-zinc-500">{route.note}</p>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-zinc-600 pt-1">
            Fares in {airport.currency}. Tolls, surcharges, and tips may add extra.
          </p>
        </div>

        {/* Pre-arranged transfer strip — highest-intent affiliate placement.
            Shown between the fare table and tips: reader has just seen the metered
            fare range and is now deciding how to get to their destination. A fixed-price
            transfer is the natural next consideration before they read the scam warnings. */}
        {transferPartners.length > 0 && (
          <AffiliatePreviewStrip
            partners={transferPartners}
            city={airport.city}
            country={airport.country}
            zone="airport"
            label={`Want a fixed price? Book a pre-arranged transfer from ${airport.name}`}
          />
        )}

        {/* Practical tips */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-teal-400 shrink-0" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Practical Tips</h2>
          </div>
          <ul className="space-y-2">
            {airport.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-teal-500 mt-0.5 shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Scam warnings */}
        <div className="bg-zinc-900 border border-red-900/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400 shrink-0" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Scam Warnings</h2>
          </div>
          <ul className="space-y-2">
            {airport.scams.map((scam, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-red-500 mt-0.5 shrink-0">⚠</span>
                {scam}
              </li>
            ))}
          </ul>
        </div>

        {/* Alternatives */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Cheaper Alternatives</h2>
          <ul className="space-y-2">
            {airport.alternatives.map((alt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-purple-400 mt-0.5 shrink-0">→</span>
                {alt}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-2xl p-5 text-center space-y-3">
          <p className="text-white font-semibold">Check your exact route fare</p>
          <p className="text-zinc-500 text-sm">
            Enter your pickup and destination for a precise estimate with scam warnings in real time.
          </p>
          <Link
            href="/taxi"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Check Route Fare <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </>
  )
}
