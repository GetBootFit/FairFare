/**
 * BlogCtaWidget — high-conversion in-article CTA.
 *
 * Replaces the small link chips that previously appeared after the intro.
 * Designed to feel like a tool preview rather than an ad — shows specific
 * value bullets so the reader knows exactly what they're clicking into.
 *
 * Server component: no client JS needed, renders as plain anchor tags.
 */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle } from 'lucide-react'

interface Props {
  city?: string | null
  citySlug?: string | null
  country?: string | null
  countrySlug?: string | null
  flagCode?: string | null   // ISO 3166-1 alpha-2 for flag image
  category: 'taxi' | 'tipping' | 'travel'
}

export function BlogCtaWidget({ city, citySlug, country, countrySlug, flagCode, category }: Props) {
  const showTaxi    = (category === 'taxi' || category === 'travel') && city && citySlug
  const showTipping = (category === 'tipping' || category === 'travel') && country && countrySlug

  if (!showTaxi && !showTipping) return null

  return (
    <div className="space-y-2.5 my-1 not-prose">
      {showTaxi && (
        <TaxiCtaCard city={city!} flagCode={flagCode} />
      )}
      {showTipping && (
        <TippingCtaCard country={country!} countrySlug={countrySlug!} flagCode={flagCode} />
      )}
    </div>
  )
}

// ── Taxi card ────────────────────────────────────────────────────────────────

function TaxiCtaCard({ city, flagCode }: { city: string; flagCode?: string | null }) {
  return (
    <Link
      href={`/taxi?city=${encodeURIComponent(city)}`}
      className="flex items-start justify-between gap-3 bg-purple-950/50 border border-purple-700/50 hover:border-purple-500/70 hover:bg-purple-900/40 rounded-2xl p-4 transition-all group"
    >
      <div className="flex-1 space-y-2.5 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2">
          {flagCode && (
            <Image
              src={`/images/flags/${flagCode}.svg`}
              alt=""
              width={18}
              height={14}
              className="rounded-sm shrink-0"
              unoptimized
            />
          )}
          <p className="text-sm font-bold text-white leading-none">{city} Taxi Fare Check</p>
        </div>

        {/* Value bullets */}
        <div className="space-y-1">
          {[
            'Free: route distance + travel time',
            `Exact fare range for your ${city} journey`,
            'Scam warnings + phrases to say to the driver',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle size={11} className="text-purple-400 shrink-0 mt-0.5" />
              <span className="text-xs text-purple-200/80 leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white">Check my {city} fare</span>
          <ArrowRight size={13} className="text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>

        <p className="text-[10px] text-purple-400/50 leading-none">
          {process.env.NEXT_PUBLIC_PAYWALL_ENABLED !== 'false'
            ? 'Route preview free · Full result from $2.99 · No account needed'
            : 'Free · Fares for 163+ cities · No account needed'}
        </p>
      </div>
    </Link>
  )
}

// ── Tipping card ─────────────────────────────────────────────────────────────

function TippingCtaCard({
  country,
  countrySlug,
  flagCode,
}: {
  country: string
  countrySlug: string
  flagCode?: string | null
}) {
  return (
    <Link
      href={`/tipping/${countrySlug}`}
      className="flex items-start justify-between gap-3 bg-teal-950/50 border border-teal-700/50 hover:border-teal-500/70 hover:bg-teal-900/40 rounded-2xl p-4 transition-all group"
    >
      <div className="flex-1 space-y-2.5 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2">
          {flagCode && (
            <Image
              src={`/images/flags/${flagCode}.svg`}
              alt=""
              width={18}
              height={14}
              className="rounded-sm shrink-0"
              unoptimized
            />
          )}
          <p className="text-sm font-bold text-white leading-none">{country} Tipping Guide</p>
        </div>

        {/* Value bullets */}
        <div className="space-y-1">
          {[
            'Restaurants, taxis, hotels, spas & more',
            'Exact amounts — not vague advice',
            `What's expected vs what causes offence in ${country}`,
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle size={11} className="text-teal-400 shrink-0 mt-0.5" />
              <span className="text-xs text-teal-200/80 leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white">Get {country} tipping guide</span>
          <ArrowRight size={13} className="text-teal-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>

        <p className="text-[10px] text-teal-400/50 leading-none">
          {process.env.NEXT_PUBLIC_PAYWALL_ENABLED !== 'false'
            ? '10 scenarios · From $2.99 · No account needed'
            : '10 tipping scenarios · Free · No account needed'}
        </p>
      </div>
    </Link>
  )
}
