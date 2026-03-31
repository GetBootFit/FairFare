import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe } from 'lucide-react'
import { TipCardActions } from '@/components/tipping/TipCardActions'

export const metadata: Metadata = {
  title: 'Global Tipping Customs 2026: Country-by-Country Guide | Hootling',
  description:
    'A comprehensive reference for tipping customs in 50+ countries. Where tipping is expected, where it\'s optional, and where it\'s considered rude — for restaurants, taxis, hotels, and more.',
  alternates: { canonical: 'https://www.hootling.com/tipping/guide' },
  openGraph: {
    title: 'Global Tipping Customs 2026: Country-by-Country Guide',
    description: 'Where tipping is expected, optional, or considered rude — for restaurants, taxis, hotels, and spas in 50+ countries.',
    url: 'https://www.hootling.com/tipping/guide',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Global Tipping Customs 2026: Country-by-Country Guide',
  description: 'A comprehensive reference for tipping customs in 50+ countries.',
  url: 'https://hootling.com/tipping/guide',
  author: { '@type': 'Organization', name: 'Hootling', url: 'https://hootling.com' },
  publisher: { '@type': 'Organization', name: 'Hootling', url: 'https://hootling.com' },
  datePublished: '2026-03-15',
  dateModified: '2026-03-15',
}

// ── Tipping summary data ──────────────────────────────────────────────────────

type TipExpectation = 'expected' | 'optional' | 'not-expected' | 'rude'

interface CountryTip {
  country: string
  slug: string
  iso2: string
  restaurant: TipExpectation
  taxi: TipExpectation
  hotel: TipExpectation
  highlight: string
}

const COUNTRIES: CountryTip[] = [
  // Americas — high tipping culture
  { country: 'United States', slug: 'united-states', iso2: 'us', restaurant: 'expected', taxi: 'expected', hotel: 'expected', highlight: '15–20% restaurant; 15–20% taxi; $1–5/bag porter' },
  { country: 'Canada', slug: 'canada', iso2: 'ca', restaurant: 'expected', taxi: 'expected', hotel: 'optional', highlight: '15–18% restaurant; 10–15% taxi' },
  { country: 'Mexico', slug: 'mexico', iso2: 'mx', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi fare' },
  { country: 'Brazil', slug: 'brazil', iso2: 'br', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% usually included; round up otherwise' },
  { country: 'Argentina', slug: 'argentina', iso2: 'ar', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Round up; inflation makes cash tips complex' },
  { country: 'Colombia', slug: 'colombia', iso2: 'co', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% optional in restaurants; not for taxis' },
  { country: 'Chile', slug: 'chile', iso2: 'cl', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% in restaurants; round up taxi fares' },
  { country: 'Peru', slug: 'peru', iso2: 'pe', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% in upscale restaurants; not for metered taxis' },

  // Europe — mixed
  { country: 'United Kingdom', slug: 'united-kingdom', iso2: 'gb', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10–12.5% restaurant; round up taxi; service often included' },
  { country: 'France', slug: 'france', iso2: 'fr', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Service compris included; leave coins if happy' },
  { country: 'Germany', slug: 'germany', iso2: 'de', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Round up to nearest €; say "stimmt so" (keep the change)' },
  { country: 'Italy', slug: 'italy', iso2: 'it', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '€1–2 coperto included; small tip for exceptional service' },
  { country: 'Spain', slug: 'spain', iso2: 'es', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Tipping is not customary; small tip appreciated in tourist areas' },
  { country: 'Portugal', slug: 'portugal', iso2: 'pt', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: '5–10% if satisfied; round up taxi' },
  { country: 'Netherlands', slug: 'netherlands', iso2: 'nl', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: '5–10% for good service; round up taxi fare' },
  { country: 'Belgium', slug: 'belgium', iso2: 'be', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: 'Service usually included; round up if not' },
  { country: 'Austria', slug: 'austria', iso2: 'at', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Round up or 5–10%; say amount when paying' },
  { country: 'Switzerland', slug: 'switzerland', iso2: 'ch', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Service included by law; small tip for good service' },
  { country: 'Denmark', slug: 'denmark', iso2: 'dk', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Service included; tipping not expected' },
  { country: 'Sweden', slug: 'sweden', iso2: 'se', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Service included in bill; tipping declining' },
  { country: 'Norway', slug: 'norway', iso2: 'no', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Round up at restaurants; not expected elsewhere' },
  { country: 'Finland', slug: 'finland', iso2: 'fi', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Tipping not traditional; uncommon' },
  { country: 'Poland', slug: 'poland', iso2: 'pl', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi' },
  { country: 'Czech Republic', slug: 'czech-republic', iso2: 'cz', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi; say total when paying' },
  { country: 'Hungary', slug: 'hungary', iso2: 'hu', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; common to tip drivers' },
  { country: 'Romania', slug: 'romania', iso2: 'ro', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi' },
  { country: 'Croatia', slug: 'croatia', iso2: 'hr', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: '10% in restaurants appreciated; not for taxis' },
  { country: 'Greece', slug: 'greece', iso2: 'gr', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '5–10% restaurant; round up taxi; €1–2 porter' },
  { country: 'Ireland', slug: 'ireland', iso2: 'ie', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi' },
  { country: 'Ukraine', slug: 'ukraine', iso2: 'ua', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: '5–10% restaurants; not expected for taxis' },
  { country: 'Russia', slug: 'russia', iso2: 'ru', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: '10% in upscale restaurants; not for regular taxis' },
  { country: 'Israel', slug: 'israel', iso2: 'il', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi' },

  // Asia — generally low tipping
  { country: 'Japan', slug: 'japan', iso2: 'jp', restaurant: 'rude', taxi: 'rude', hotel: 'rude', highlight: 'Tipping is considered insulting — do not tip' },
  { country: 'South Korea', slug: 'south-korea', iso2: 'kr', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Tipping not customary; may cause awkwardness' },
  { country: 'China', slug: 'china', iso2: 'cn', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Not expected; tourist-facing staff may appreciate it' },
  { country: 'Hong Kong', slug: 'hong-kong', iso2: 'hk', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% service usually added; small tip appreciated' },
  { country: 'Taiwan', slug: 'taiwan', iso2: 'tw', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Not customary; high-end hotels may expect it' },
  { country: 'Singapore', slug: 'singapore', iso2: 'sg', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: '10% GST already added; no additional tipping expected' },
  { country: 'Thailand', slug: 'thailand', iso2: 'th', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '20–50 THB restaurant; round up taxi; 20–50 THB porter' },
  { country: 'Vietnam', slug: 'vietnam', iso2: 'vn', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi or Grab' },
  { country: 'Indonesia', slug: 'indonesia', iso2: 'id', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '5–10% restaurant; round up Grab/Gojek' },
  { country: 'Malaysia', slug: 'malaysia', iso2: 'my', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '5–10% service usually added; not for taxis' },
  { country: 'Philippines', slug: 'philippines', iso2: 'ph', restaurant: 'expected', taxi: 'optional', hotel: 'expected', highlight: '10% service charge common; additional 5–10% welcome' },
  { country: 'India', slug: 'india', iso2: 'in', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; 10 INR per bag porter; round up taxi' },

  // Middle East & Africa
  { country: 'UAE', slug: 'uae', iso2: 'ae', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% service often added; AED 5–10 tip for drivers' },
  { country: 'Saudi Arabia', slug: 'saudi-arabia', iso2: 'sa', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% in upscale restaurants; not for taxis' },
  { country: 'Jordan', slug: 'jordan', iso2: 'jo', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi; negotiate not to tip guides upfront' },
  { country: 'Egypt', slug: 'egypt', iso2: 'eg', restaurant: 'expected', taxi: 'optional', hotel: 'expected', highlight: 'Baksheesh culture — small tips expected for many services' },
  { country: 'Morocco', slug: 'morocco', iso2: 'ma', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi; MAD 5–10 porter' },
  { country: 'South Africa', slug: 'south-africa', iso2: 'za', restaurant: 'expected', taxi: 'expected', hotel: 'expected', highlight: '10–15% restaurant; 10% taxi; R5–10 petrol attendant' },

  // Oceania
  { country: 'Australia', slug: 'australia', iso2: 'au', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: 'Minimum wage laws mean tipping less expected; 10% appreciated' },
  { country: 'New Zealand', slug: 'new-zealand', iso2: 'nz', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Not expected; 10% for exceptional service' },
]

type SortedByExpectation = {
  expected: CountryTip[]
  optional: CountryTip[]
  'not-expected': CountryTip[]
  rude: CountryTip[]
}

function groupByRestaurant(countries: CountryTip[]): SortedByExpectation {
  return {
    expected: countries.filter((c) => c.restaurant === 'expected'),
    optional: countries.filter((c) => c.restaurant === 'optional'),
    'not-expected': countries.filter((c) => c.restaurant === 'not-expected'),
    rude: countries.filter((c) => c.restaurant === 'rude'),
  }
}

const EXPECTATION_CONFIG: Record<TipExpectation, { label: string; color: string; bg: string; border: string }> = {
  expected: { label: 'Expected', color: 'text-green-400', bg: 'bg-green-950/40', border: 'border-green-900/40' },
  optional: { label: 'Optional', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-900/40' },
  'not-expected': { label: 'Not expected', color: 'text-zinc-400', bg: 'bg-zinc-800/40', border: 'border-zinc-700/40' },
  rude: { label: 'Can be rude', color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-900/40' },
}

function ExpectationBadge({ status }: { status: TipExpectation }) {
  const cfg = EXPECTATION_CONFIG[status]
  return (
    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
      {cfg.label}
    </span>
  )
}

const REGIONS_SUMMARY = [
  { region: 'North America', countries: [{ iso2: 'us', name: 'USA' }, { iso2: 'ca', name: 'Canada' }], summary: 'Strong tipping culture. 15–20% in restaurants is standard, not optional. Taxi drivers, hotel porters, and bartenders all expect tips. Skipping a tip is considered rude and signals poor service.', level: 'expected' as TipExpectation },
  { region: 'Latin America', countries: [{ iso2: 'mx', name: 'Mexico' }, { iso2: 'br', name: 'Brazil' }, { iso2: 'ar', name: 'Argentina' }, { iso2: 'co', name: 'Colombia' }, { iso2: 'cl', name: 'Chile' }, { iso2: 'pe', name: 'Peru' }], summary: 'Mixed. Mexico and Brazil have growing tipping cultures in restaurants (10–15%). Argentina is complicated by inflation. Smaller countries and informal meals typically don\'t expect tips.', level: 'optional' as TipExpectation },
  { region: 'Western Europe', countries: [{ iso2: 'gb', name: 'UK' }, { iso2: 'fr', name: 'France' }, { iso2: 'de', name: 'Germany' }, { iso2: 'it', name: 'Italy' }, { iso2: 'es', name: 'Spain' }, { iso2: 'pt', name: 'Portugal' }], summary: 'Service charges are often included. Where they are, no additional tip is expected. Leaving small change or rounding up is appreciated but never obligatory. Spain and Scandinavia have the weakest tipping cultures.', level: 'optional' as TipExpectation },
  { region: 'Eastern Europe', countries: [{ iso2: 'pl', name: 'Poland' }, { iso2: 'cz', name: 'Czech Rep.' }, { iso2: 'hu', name: 'Hungary' }, { iso2: 'ro', name: 'Romania' }], summary: 'Tipping at restaurants (10%) is expected and appreciated — more so than in Western Europe. Staff wages are generally lower. Round up taxi fares.', level: 'expected' as TipExpectation },
  { region: 'East Asia', countries: [{ iso2: 'jp', name: 'Japan' }, { iso2: 'kr', name: 'S. Korea' }, { iso2: 'cn', name: 'China' }, { iso2: 'tw', name: 'Taiwan' }], summary: 'Japan is the clearest case: tipping is considered insulting — it implies the service was unexpected or that the worker needs charity. South Korea and China are similar. Hong Kong is more accepting due to Western influence.', level: 'rude' as TipExpectation },
  { region: 'Southeast Asia', countries: [{ iso2: 'th', name: 'Thailand' }, { iso2: 'vn', name: 'Vietnam' }, { iso2: 'id', name: 'Indonesia' }, { iso2: 'my', name: 'Malaysia' }, { iso2: 'ph', name: 'Philippines' }], summary: 'Tipping is appreciated but not expected. Round up the fare, leave 20–50 local currency units at restaurants, and tip hotel staff who assist with luggage. Amounts are small in absolute terms but meaningful to workers.', level: 'optional' as TipExpectation },
  { region: 'South Asia', countries: [{ iso2: 'in', name: 'India' }], summary: 'Tipping is expected at restaurants (10%) and for hotel staff. For taxis, rounding up or leaving a small amount is appreciated. The hospitality sector relies partly on gratuity.', level: 'optional' as TipExpectation },
  { region: 'Middle East', countries: [{ iso2: 'ae', name: 'UAE' }, { iso2: 'sa', name: 'Saudi Arabia' }, { iso2: 'jo', name: 'Jordan' }, { iso2: 'eg', name: 'Egypt' }, { iso2: 'ma', name: 'Morocco' }], summary: 'Mixed and culturally complex. Egypt has a strong baksheesh culture (small tips for many services). UAE upscale venues add service charges. Morocco: restaurants and taxis expect rounding up.', level: 'optional' as TipExpectation },
  { region: 'Africa', countries: [{ iso2: 'za', name: 'South Africa' }], summary: 'South Africa has a strong tipping culture similar to North America: 10–15% at restaurants, tips for petrol station attendants, guides, and safari staff.', level: 'expected' as TipExpectation },
  { region: 'Oceania', countries: [{ iso2: 'au', name: 'Australia' }, { iso2: 'nz', name: 'New Zealand' }], summary: 'Minimum wage legislation means workers are not dependent on tips. Tipping is appreciated but genuinely optional. Rounding up or adding 10% for exceptional service is fine; not doing so is perfectly acceptable.', level: 'optional' as TipExpectation },
]

export default function TippingGuidePage() {
  const grouped = groupByRestaurant(COUNTRIES)

  return (
    <div className="space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Link href="/tipping" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            Tipping Guide
          </Link>
          <span className="text-zinc-700 text-xs">›</span>
          <span className="text-xs text-zinc-500">Global Overview</span>
        </div>
        <h1 className="text-2xl font-bold text-white leading-tight">
          Global Tipping Customs 2026
          <span className="block text-lg font-normal text-zinc-400 mt-1">Country-by-Country Reference</span>
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Where tipping is expected, optional, or considered impolite — covering restaurants, taxis, hotels, and spas in 50+ countries. Use the full country guides for scenario-specific advice and cultural context.
        </p>
      </div>

      {/* Key */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="font-medium text-zinc-500 self-center">Key:</span>
        {(Object.entries(EXPECTATION_CONFIG) as [TipExpectation, typeof EXPECTATION_CONFIG[TipExpectation]][]).map(([key, cfg]) => (
          <span key={key} className={`px-2 py-1 rounded border ${cfg.bg} ${cfg.border} ${cfg.color} font-medium`}>
            {cfg.label}
          </span>
        ))}
      </div>

      {/* Regional summaries */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">Tipping Culture by Region</h2>
        <div className="space-y-2">
          {REGIONS_SUMMARY.map((r) => {
            const cfg = EXPECTATION_CONFIG[r.level]
            return (
              <div key={r.region} className={`border rounded-xl p-4 space-y-2 ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-semibold ${cfg.color}`}>{r.region}</h3>
                  <ExpectationBadge status={r.level} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.countries.map((c) => (
                    <span key={c.name} className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-800/60 rounded-full px-2 py-0.5">
                      <Image
                        src={`/images/flags/${c.iso2}.svg`}
                        alt=""
                        width={14}
                        height={11}
                        className="rounded-sm shrink-0"
                        unoptimized
                      />
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{r.summary}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Country table grouped by expectation */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">All Countries — Restaurant Tipping</h2>
        {(
          [
            ['expected', grouped.expected],
            ['optional', grouped.optional],
            ['not-expected', grouped['not-expected']],
            ['rude', grouped.rude],
          ] as [TipExpectation, CountryTip[]][]
        ).map(([status, countries]) => {
          if (countries.length === 0) return null
          const cfg = EXPECTATION_CONFIG[status]
          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                <span className="text-xs text-zinc-700">({countries.length} countries)</span>
              </div>
              <div className="space-y-1.5">
                {countries.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tipping/${c.slug}`}
                    className="flex items-start justify-between gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-3 transition-colors group"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Image src={`/images/flags/${c.iso2}.svg`} alt="" width={20} height={15} className="rounded-sm shrink-0" unoptimized />
                        <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{c.country}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">{c.highlight}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden min-[380px]:flex gap-1">
                        <span className="text-[9px] text-zinc-600 uppercase">Tax</span>
                        <ExpectationBadge status={c.taxi} />
                      </div>
                      <TipCardActions
                        country={c.country}
                        iso2={c.iso2}
                        restaurant={c.restaurant}
                        taxi={c.taxi}
                        hotel={c.hotel}
                        highlight={c.highlight}
                        slug={c.slug}
                      />
                      <ArrowRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Taxi tipping focus */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">Taxi Tipping Quick Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-zinc-500 text-left border-b border-zinc-800">
                <th className="pb-2 pr-4 font-medium">Country</th>
                <th className="pb-2 pr-4 font-medium">Taxi tip</th>
                <th className="pb-2 font-medium">Typical amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {[
                { iso2: 'us', name: 'USA', status: 'expected' as TipExpectation, amount: '15–20%' },
                { iso2: 'ca', name: 'Canada', status: 'expected' as TipExpectation, amount: '10–15%' },
                { iso2: 'gb', name: 'UK', status: 'optional' as TipExpectation, amount: 'Round up' },
                { iso2: 'fr', name: 'France', status: 'optional' as TipExpectation, amount: 'Round up' },
                { iso2: 'de', name: 'Germany', status: 'optional' as TipExpectation, amount: 'Round up' },
                { iso2: 'it', name: 'Italy', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { iso2: 'es', name: 'Spain', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { iso2: 'za', name: 'South Africa', status: 'expected' as TipExpectation, amount: '10%' },
                { iso2: 'ae', name: 'UAE', status: 'optional' as TipExpectation, amount: 'AED 5–10' },
                { iso2: 'mx', name: 'Mexico', status: 'optional' as TipExpectation, amount: 'Round up' },
                { iso2: 'th', name: 'Thailand', status: 'optional' as TipExpectation, amount: '20–50 THB' },
                { iso2: 'vn', name: 'Vietnam', status: 'optional' as TipExpectation, amount: 'Round up' },
                { iso2: 'jp', name: 'Japan', status: 'rude' as TipExpectation, amount: 'Do not tip' },
                { iso2: 'kr', name: 'South Korea', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { iso2: 'cn', name: 'China', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { iso2: 'sg', name: 'Singapore', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
              ].map((row) => (
                <tr key={row.iso2} className="text-zinc-400">
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <Image src={`/images/flags/${row.iso2}.svg`} alt="" width={16} height={12} className="rounded-sm shrink-0" unoptimized />
                      <span className="text-zinc-300">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4"><ExpectationBadge status={row.status} /></td>
                  <td className="py-2 text-zinc-500">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tipping myths */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">3 Common Tipping Myths</h2>
        <div className="space-y-2">
          {[
            {
              myth: '"Tipping is rude everywhere in Asia"',
              reality: 'Only in East Asia (Japan, South Korea, China, Taiwan). Across Southeast Asia — Thailand, Vietnam, Indonesia, Philippines — tipping is appreciated and often important to workers\' livelihoods.',
            },
            {
              myth: '"Service charge means I don\'t need to tip"',
              reality: 'Service charges don\'t always reach the staff who served you. In the UK and many European countries, how service charge is distributed varies by venue. Ask if unclear.',
            },
            {
              myth: '"I should tip the same everywhere"',
              reality: 'Tipping norms are deeply cultural and context-specific. 20% in the USA is expected; 20% in Japan would be confusing or offensive. A 10% tip in Vietnam is generous; in the USA it signals dissatisfaction.',
            },
          ].map(({ myth, reality }) => (
            <div key={myth} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-amber-300">{myth}</p>
              <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-teal-400 font-medium">Reality: </span>{reality}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — paid tool */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-purple-400 shrink-0" />
          <h2 className="text-sm font-semibold text-white">Get the Full Guide for Your Destination</h2>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          This overview covers the basics. Hootling&apos;s full tipping guide gives you scenario-by-scenario advice — restaurants, taxis, hotels, spas, tour guides — with local cultural context generated specifically for the country you&apos;re visiting.
        </p>
        <Link
          href="/tipping"
          className="flex items-center justify-center gap-2 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Get tipping guide for my destination <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid of all countries */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-400">All Country Tipping Guides</h2>
        <div className="grid grid-cols-2 gap-1.5">
          {COUNTRIES.map((c) => (
            <Link
              key={c.slug}
              href={`/tipping/${c.slug}`}
              className="flex items-center gap-2 px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 hover:text-white transition-colors group"
            >
              <Image src={`/images/flags/${c.iso2}.svg`} alt="" width={18} height={14} className="rounded-sm shrink-0" unoptimized />
              <span className="truncate">{c.country}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
