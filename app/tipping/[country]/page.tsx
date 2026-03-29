import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Banknote, ArrowRight, UtensilsCrossed, Car, Hotel, Sparkles } from 'lucide-react'
import { getUSDPrices } from '@/lib/currency'
import {
  getAllCountrySlugs,
  slugToDisplayName,
  faqJsonLd,
  tippingBreadcrumbJsonLd,
  tippingServiceJsonLd,
} from '@/lib/seo-helpers'
import tippingData from '@/data/tipping-seo.json'

// ── Types ────────────────────────────────────────────────────────────────────

interface TippingEntry {
  displayName: string
  expected: 'yes' | 'optional' | 'no' | 'context'
  expectedLabel: string
  summary: string
  restaurant: string
  taxi: string
  hotel: string
  spa: string
  keyFact: string
  faqs: Array<{ q: string; a: string }>
}

const allTipping = tippingData as Record<string, TippingEntry>

// ── City sticker helper ───────────────────────────────────────────────────────

/** Converts a city slug to the PascalCase SVG filename, e.g. 'new-york' → 'NewYork' */
const slugToStickerSvg = (slug: string) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')

// ── Country → city sticker map ────────────────────────────────────────────────

const COUNTRY_STICKER: Record<string, string> = {
  'netherlands': 'amsterdam',
  'spain': 'barcelona',
  'united-arab-emirates': 'dubai',
  'turkey': 'istanbul',
  'united-kingdom': 'london',
  'australia': 'sydney',
  'france': 'paris',
  'italy': 'rome',
  'singapore': 'singapore',
  'japan': 'tokyo',
  'united-states': 'new-york',
}

// ── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllCountrySlugs().map((country) => ({ country }))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCountryData(slug: string): TippingEntry | null {
  return allTipping[slug] ?? null
}

function expectedBadge(expected: TippingEntry['expected']) {
  switch (expected) {
    case 'yes':
      return { label: 'Expected', color: 'bg-amber-900/40 text-amber-400 border-amber-900/60' }
    case 'no':
      return { label: 'Not Expected', color: 'bg-teal-900/40 text-teal-400 border-teal-900/60' }
    case 'optional':
      return { label: 'Optional', color: 'bg-blue-900/40 text-blue-400 border-blue-900/60' }
    default:
      return { label: 'Context-Dependent', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' }
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ country: string }> }
): Promise<Metadata> {
  const { country } = await params
  const data = getCountryData(country)
  if (!data) return { title: 'Country Not Found' }

  const year = new Date().getFullYear()
  const countryName = data.displayName

  return {
    title: `Tipping in ${countryName} (${year}) — How Much & Etiquette`,
    description: `${data.summary.slice(0, 145)}…`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/tipping/${country}` },
    openGraph: {
      title: `Tipping in ${countryName} (${year}) — Hootling`,
      description: `Tipping etiquette for restaurants, taxis, hotels & spas in ${countryName}. ${data.expectedLabel}.`,
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/tipping/${country}`,
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/api/og/city?city=${encodeURIComponent(country)}`,
          width: 1200,
          height: 630,
          alt: `Tipping guide for ${countryName} — Hootling`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tipping in ${countryName} — Hootling`,
      description: `${data.expectedLabel} · Restaurant: ${data.restaurant.slice(0, 60)}`,
      images: [`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/api/og/city?city=${encodeURIComponent(country)}`],
    },
  }
}

// ── Scenario rows ─────────────────────────────────────────────────────────────

function ScenarioRow({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode
  label: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-800 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-zinc-300 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function LockedScenarioRow({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-800 last:border-0 opacity-50">
      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="flex items-center gap-1.5">
          <div className="h-3 bg-zinc-800 rounded w-3/4" />
          <span className="text-zinc-700 text-xs">🔒</span>
        </div>
      </div>
    </div>
  )
}

// ── Page component ────────────────────────────────────────────────────────────

export default async function TippingCountryPage(
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params
  const data = getCountryData(country)
  if (!data) notFound()

  const year = new Date().getFullYear()
  const countryName = data.displayName
  const badge = expectedBadge(data.expected)
  const { single } = getUSDPrices()
  const citySticker = COUNTRY_STICKER[country] ?? null

  const jsonLd = [
    tippingBreadcrumbJsonLd(country, countryName),
    tippingServiceJsonLd(countryName, country),
    faqJsonLd(data.faqs),
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
          <Link href="/tipping" className="hover:text-zinc-300 transition-colors">Tipping Guide</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400">{countryName}</span>
        </nav>

        {/* Hero */}
        <div>
          {citySticker && (
            <div className="flex justify-center mb-4">
              <Image
                src={`/images/cities/${slugToStickerSvg(citySticker)}.svg`}
                alt={`${countryName} city sticker`}
                width={160}
                height={160}
                className="object-contain drop-shadow-lg"
                priority
                unoptimized
              />
            </div>
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-900/40 flex items-center justify-center text-teal-400 shrink-0">
              <Banknote size={20} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                Tipping in {countryName}
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">{year} guide</p>
            </div>
          </div>

          {/* Tipping expectation badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${badge.color}`}>
            {data.expectedLabel}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-sm text-zinc-300 leading-relaxed">{data.summary}</p>
        </div>

        {/* Scenario breakdown — restaurants + taxis shown; rest locked */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">By Situation</h2>
          <ScenarioRow
            icon={<UtensilsCrossed size={15} />}
            label="Restaurants"
            description={data.restaurant}
          />
          <ScenarioRow
            icon={<Car size={15} />}
            label="Taxis & Rideshares"
            description={data.taxi}
          />
          <LockedScenarioRow icon={<Hotel size={15} />} label="Hotels & Porters" />
          <LockedScenarioRow icon={<Sparkles size={15} />} label="Spa & Massage" />
          <div className="pt-2">
            <p className="text-xs text-zinc-600">Full guide includes hotels, spa, bars, tour guides & delivery — plus useful phrases in the local language.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-purple-950/40 border border-purple-900/50 rounded-2xl p-5 text-center space-y-3">
          <h2 className="text-base font-bold text-white">Get the Complete {countryName} Tipping Guide</h2>
          <p className="text-sm text-zinc-400">
            All 6 scenarios with exact amounts, cultural context, useful phrases in the local language, and a currency reference.
          </p>
          <Link
            href="/tipping"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Get Full Guide <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-zinc-600">From {single} · No account required</p>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {data.faqs.map(({ q, a }) => (
              <div key={q} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                <h3 className="text-sm font-semibold text-white">{q}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-link to taxi */}
        <div className="border-t border-zinc-800 pt-4">
          <p className="text-xs text-zinc-600 mb-2">Planning a taxi ride in {countryName}?</p>
          <Link
            href="/taxi"
            className="flex items-center gap-2 text-purple-400 text-sm hover:text-purple-300 transition-colors"
          >
            Check taxi fares in {countryName}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}
