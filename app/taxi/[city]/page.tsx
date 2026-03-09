import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Car, MapPin, ArrowRight } from 'lucide-react'
import { getUSDPrices } from '@/lib/currency'
import {
  getAllCitySlugs,
  getCityData,
  slugToDisplayName,
  sampleFare,
  formatFare,
  taxiBreadcrumbJsonLd,
  tippingBreadcrumbJsonLd,
  faqJsonLd,
  taxiServiceJsonLd,
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
  const fare3 = sampleFare(data, 3)
  const year = new Date().getFullYear()

  return {
    title: `Taxi Fares in ${cityName}, ${data.country} (${year}) — Rates & Scam Alerts`,
    description: `${cityName} taxi fares: flag fall ${sym}${data.baseRate}, ${sym}${data.ratePerKm}/km. A 3 km trip costs roughly ${sym}${fare3.min}–${fare3.max}. Check exact fares, avoid scams, know what's fair.`,
    alternates: { canonical: `https://fairfare.app/taxi/${city}` },
    openGraph: {
      title: `Taxi Fares in ${cityName} (${year}) — FairFare`,
      description: `Fair taxi fare ranges, local rates, and scam warnings for ${cityName}, ${data.country}.`,
      url: `https://fairfare.app/taxi/${city}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Taxi Fares in ${cityName} — FairFare`,
      description: `Flag fall ${sym}${data.baseRate} · ${sym}${data.ratePerKm}/km · Know what's fair before you ride.`,
    },
  }
}

// ── Sample distances to show ─────────────────────────────────────────────────

const SAMPLE_KM = [3, 5, 10, 20]

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-900/40 flex items-center justify-center text-purple-400 shrink-0">
              <Car size={20} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                Taxi Fares in {cityName}
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
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Official Meter Rates</h2>
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
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Estimated Fare Ranges</h2>
          <p className="text-xs text-zinc-500">Based on meter rates ± 15% for traffic and route variation</p>
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
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">⚠️ Common Scams to Know</h2>
          <ul className="space-y-2">
            {COMMON_SCAM_WARNINGS.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-amber-500 mt-0.5 shrink-0">×</span>
                {w}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 pt-1">Get city-specific scam warnings when you check your exact route →</p>
        </div>

        {/* CTA */}
        <div className="bg-purple-950/40 border border-purple-900/50 rounded-2xl p-5 text-center space-y-3">
          <h2 className="text-base font-bold text-white">Check the Exact Fare for Your Route</h2>
          <p className="text-sm text-zinc-400">
            Enter your pickup and destination for a precise fare estimate,
            route-specific scam warnings, and what to say to your driver.
          </p>
          <Link
            href="/taxi"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
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
