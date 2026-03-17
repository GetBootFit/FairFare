import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Car, MapPin, ArrowRight } from 'lucide-react'
import { getUSDPrices } from '@/lib/currency'
import {
  getAllCitySlugs,
  getCityData,
  slugToDisplayName,
  sampleFare,
  formatFare,
  taxiBreadcrumbJsonLd,
  faqJsonLd,
  taxiServiceJsonLd,
  taxiPriceJsonLd,
  countryToSlug,
} from '@/lib/seo-helpers'

// ── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }))
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params
  const data = getCityData(city)
  if (!data) return { title: 'City Not Found' }

  const cityName = slugToDisplayName(city)
  const sym = data.currencySymbol
  const fare10 = sampleFare(data, 10)
  const year = new Date().getFullYear()

  return {
    title: `${cityName} Taxi Fares & Scam Alerts (${year}) | Hootling`,
    description: `${cityName} taxi meter rates for ${year}. Flag fall ${sym}${data.baseRate}, ${sym}${data.ratePerKm}/km. Typical 10 km trip: ${sym}${fare10.min}–${sym}${fare10.max}. Avoid scams — check your route before you ride.`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/taxi/${city}` },
    openGraph: {
      title: `${cityName} Taxi Fares (${year}) — Rates & Scam Alerts | Hootling`,
      description: `Real meter rates, fare ranges and AI-powered scam warnings for ${cityName}, ${data.country}. Know the fair price before you get in.`,
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/taxi/${city}`,
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/api/og/city?city=${encodeURIComponent(city)}`,
          width: 1200,
          height: 630,
          alt: `Taxi fares in ${cityName} — Hootling`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cityName} Taxi Fares (${year}) | Hootling`,
      description: `Flag fall ${sym}${data.baseRate} · ${sym}${data.ratePerKm}/km · Typical 10 km: ${sym}${fare10.min}–${sym}${fare10.max} · Know the fair price before you ride.`,
      images: [`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/api/og/city?city=${encodeURIComponent(city)}`],
    },
  }
}

// ── City stickers ─────────────────────────────────────────────────────────────

const CITY_STICKERS = new Set([
  'amsterdam', 'barcelona', 'dubai', 'istanbul', 'london',
  'melbourne', 'new-york', 'paris', 'rome', 'singapore', 'sydney', 'tokyo',
])

// ── Sample distances to show ─────────────────────────────────────────────────

const SAMPLE_KM = [5, 10]

// ── Scam warnings common to most cities ─────────────────────────────────────

const COMMON_SCAM_WARNINGS = [
  'Driver claims the meter is "broken" and offers a flat rate',
  'Quoted price changes after reaching the destination',
  'Driver takes an unnecessarily long route without warning',
  '"Special" tourist pricing at airport ranks and hotel exits',
]

// ── FAQs generated from city data ────────────────────────────────────────────

function buildFaqs(
  cityName: string,
  country: string,
  data: ReturnType<typeof getCityData> & object
) {
  if (!data) return []
  const sym = data.currencySymbol
  const fare3 = sampleFare(data, 3)
  const fare10 = sampleFare(data, 10)

  return [
    {
      q: `How much does a taxi cost in ${cityName}?`,
      a: `${cityName} taxis start with a flag fall of ${sym}${data.baseRate} and charge ${sym}${data.ratePerKm} per km. A typical 3 km city trip costs ${sym}${fare3.min}–${sym}${fare3.max}. A 10 km trip runs ${sym}${fare10.min}–${sym}${fare10.max}. Minimum fare is ${sym}${data.minimumFare}.`,
    },
    {
      q: `Are taxis metered in ${cityName}?`,
      a: data.note
        ? `${data.note.replace(/\*/g, '').trim()}`
        : `Taxi meters are regulated in ${cityName}. Always insist on the meter or agree on a price before the trip.`,
    },
    {
      q: `What currency do taxis use in ${cityName}?`,
      a: `Taxis in ${cityName}, ${country} use ${data.currency} (${sym}). Most drivers prefer cash. Some airport taxis may accept cards.`,
    },
    {
      q: `How do I avoid taxi scams in ${cityName}?`,
      a: `Use a metered taxi or book via a ride-hailing app. Agree on the price before departure if the taxi is unmetered. Scam warning signs include: broken meter claims, asking for payment upfront, and unusually long routes.`,
    },
  ]
}

// ── Page component ────────────────────────────────────────────────────────────

export default async function TaxiCityPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params
  const data = getCityData(city)
  if (!data) notFound()

  const cityName = slugToDisplayName(city)
  const countrySlug = countryToSlug(data.country)
  const faqs = buildFaqs(cityName, data.country, data)
  const year = new Date().getFullYear()
  const { single } = getUSDPrices()

  const jsonLd = [
    taxiBreadcrumbJsonLd(city, cityName),
    taxiServiceJsonLd(cityName, data.country, city),
    taxiPriceJsonLd(cityName, data.country, data, city),
    faqJsonLd(faqs),
  ]

  return (
    <>
      {/* Structured data */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="space-y-6 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/taxi" className="hover:text-zinc-300 transition-colors">Taxi Fare Check</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400">{cityName}</span>
        </nav>

        {/* Hero */}
        <div>
          {CITY_STICKERS.has(city) && (
            <div className="flex justify-center mb-4">
              <Image
                src={`/images/cities/hootling-${city}.png`}
                alt={`${cityName} city sticker`}
                width={160}
                height={160}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          )}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-900/40 flex items-center justify-center text-teal-400 shrink-0">
              <Car size={20} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                {cityName} Taxi Fare Checker
              </h1>
              <p className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                <MapPin size={10} />
                {data.country} · {data.currency} ({data.currencySymbol}) · {year}
              </p>
            </div>
          </div>
        </div>

        {/* Rate card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Official Meter Rates</h2>
            <span className="text-[10px] text-zinc-600">Verified {year}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Flag fall</p>
              <p className="text-white font-bold text-base">{data.currencySymbol}{data.baseRate}</p>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Per km</p>
              <p className="text-white font-bold text-base">{data.currencySymbol}{data.ratePerKm}</p>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Minimum</p>
              <p className="text-white font-bold text-base">{data.currencySymbol}{data.minimumFare}</p>
            </div>
          </div>
        </div>

        {/* Sample fare table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Estimated Fare</h2>
          <p className="text-xs text-zinc-500">Generic distances — enter your route for an exact fare range</p>
          <div className="space-y-2">
            {SAMPLE_KM.map((km) => {
              const { min, max } = sampleFare(data, km)
              return (
                <div key={km} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                  <span className="text-sm text-zinc-400">{km} km trip</span>
                  <span className="text-sm font-semibold text-white">
                    {formatFare(data, min)} – {formatFare(data, max)}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-zinc-600 leading-relaxed pt-1">
            Estimated ranges only (±15% for traffic and surcharges). Hootling provides fare information for reference only —
            actual fares may vary. Always confirm the fare with your driver before travel.
            Hootling accepts no liability for fare discrepancies.
          </p>
        </div>

        {/* Local tips */}
        {data.note && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Local Knowledge</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{data.note}</p>
          </div>
        )}

        {/* Scam warnings teaser */}
        <div className="bg-amber-950/30 border border-amber-900/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">⚠️ Watch Out</h2>
            <span className="text-[10px] text-amber-700 font-medium uppercase tracking-wide border border-amber-900/60 rounded-full px-2 py-0.5">General</span>
          </div>
          <ul className="space-y-2">
            {COMMON_SCAM_WARNINGS.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-amber-500 mt-0.5 shrink-0">›</span>
                {w}
              </li>
            ))}
          </ul>
          <div className="pt-1 border-t border-amber-900/30">
            <p className="text-xs text-amber-700/80">These are worldwide patterns. Your paid result includes AI-generated warnings specific to {cityName} and your exact route.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-teal-950/40 border border-teal-900/50 rounded-2xl p-5 text-center space-y-3">
          <h2 className="text-base font-bold text-white">Check the Exact Fare for Your Route</h2>
          <p className="text-sm text-zinc-400">
            Enter your pickup and destination for a precise fare estimate, city-specific scam warnings, and what to say to your driver.
          </p>
          <Link
            href="/taxi"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Check My Route <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-zinc-600">From {single} · No account required</p>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                <h3 className="text-sm font-semibold text-white">{q}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-link to tipping */}
        <div className="border-t border-zinc-800 pt-4">
          <p className="text-xs text-zinc-600 mb-2">Also useful in {data.country}:</p>
          <Link
            href={`/tipping/${countrySlug}`}
            className="flex items-center gap-2 text-teal-400 text-sm hover:text-teal-300 transition-colors"
          >
            Tipping guide for {data.country}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}
