import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Global Tipping Customs 2026: Country-by-Country Guide | Hootling',
  description:
    'A comprehensive reference for tipping customs in 50+ countries. Where tipping is expected, where it\'s optional, and where it\'s considered rude — for restaurants, taxis, hotels, and more.',
  alternates: { canonical: 'https://hootling.com/tipping/guide' },
  openGraph: {
    title: 'Global Tipping Customs 2026: Country-by-Country Guide',
    description: 'Where tipping is expected, optional, or considered rude — for restaurants, taxis, hotels, and spas in 50+ countries.',
    url: 'https://hootling.com/tipping/guide',
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
  flag: string
  restaurant: TipExpectation
  taxi: TipExpectation
  hotel: TipExpectation
  highlight: string
}

const COUNTRIES: CountryTip[] = [
  // Americas — high tipping culture
  { country: 'United States', slug: 'united-states', flag: '🇺🇸', restaurant: 'expected', taxi: 'expected', hotel: 'expected', highlight: '15–20% restaurant; 15–20% taxi; $1–5/bag porter' },
  { country: 'Canada', slug: 'canada', flag: '🇨🇦', restaurant: 'expected', taxi: 'expected', hotel: 'optional', highlight: '15–18% restaurant; 10–15% taxi' },
  { country: 'Mexico', slug: 'mexico', flag: '🇲🇽', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi fare' },
  { country: 'Brazil', slug: 'brazil', flag: '🇧🇷', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% usually included; round up otherwise' },
  { country: 'Argentina', slug: 'argentina', flag: '🇦🇷', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Round up; inflation makes cash tips complex' },
  { country: 'Colombia', slug: 'colombia', flag: '🇨🇴', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% optional in restaurants; not for taxis' },
  { country: 'Chile', slug: 'chile', flag: '🇨🇱', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% in restaurants; round up taxi fares' },
  { country: 'Peru', slug: 'peru', flag: '🇵🇪', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% in upscale restaurants; not for metered taxis' },

  // Europe — mixed
  { country: 'United Kingdom', slug: 'united-kingdom', flag: '🇬🇧', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10–12.5% restaurant; round up taxi; service often included' },
  { country: 'France', slug: 'france', flag: '🇫🇷', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Service compris included; leave coins if happy' },
  { country: 'Germany', slug: 'germany', flag: '🇩🇪', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Round up to nearest €; say "stimmt so" (keep the change)' },
  { country: 'Italy', slug: 'italy', flag: '🇮🇹', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '€1–2 coperto included; small tip for exceptional service' },
  { country: 'Spain', slug: 'spain', flag: '🇪🇸', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Tipping is not customary; small tip appreciated in tourist areas' },
  { country: 'Portugal', slug: 'portugal', flag: '🇵🇹', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: '5–10% if satisfied; round up taxi' },
  { country: 'Netherlands', slug: 'netherlands', flag: '🇳🇱', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: '5–10% for good service; round up taxi fare' },
  { country: 'Belgium', slug: 'belgium', flag: '🇧🇪', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: 'Service usually included; round up if not' },
  { country: 'Austria', slug: 'austria', flag: '🇦🇹', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Round up or 5–10%; say amount when paying' },
  { country: 'Switzerland', slug: 'switzerland', flag: '🇨🇭', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: 'Service included by law; small tip for good service' },
  { country: 'Denmark', slug: 'denmark', flag: '🇩🇰', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Service included; tipping not expected' },
  { country: 'Sweden', slug: 'sweden', flag: '🇸🇪', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Service included in bill; tipping declining' },
  { country: 'Norway', slug: 'norway', flag: '🇳🇴', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Round up at restaurants; not expected elsewhere' },
  { country: 'Finland', slug: 'finland', flag: '🇫🇮', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Tipping not traditional; uncommon' },
  { country: 'Poland', slug: 'poland', flag: '🇵🇱', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi' },
  { country: 'Czech Republic', slug: 'czech-republic', flag: '🇨🇿', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi; say total when paying' },
  { country: 'Hungary', slug: 'hungary', flag: '🇭🇺', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; common to tip drivers' },
  { country: 'Romania', slug: 'romania', flag: '🇷🇴', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi' },
  { country: 'Croatia', slug: 'croatia', flag: '🇭🇷', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: '10% in restaurants appreciated; not for taxis' },
  { country: 'Greece', slug: 'greece', flag: '🇬🇷', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '5–10% restaurant; round up taxi; €1–2 porter' },
  { country: 'Ireland', slug: 'ireland', flag: '🇮🇪', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi' },
  { country: 'Ukraine', slug: 'ukraine', flag: '🇺🇦', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: '5–10% restaurants; not expected for taxis' },
  { country: 'Russia', slug: 'russia', flag: '🇷🇺', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: '10% in upscale restaurants; not for regular taxis' },
  { country: 'Israel', slug: 'israel', flag: '🇮🇱', restaurant: 'expected', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi' },

  // Asia — generally low tipping
  { country: 'Japan', slug: 'japan', flag: '🇯🇵', restaurant: 'rude', taxi: 'rude', hotel: 'rude', highlight: 'Tipping is considered insulting — do not tip' },
  { country: 'South Korea', slug: 'south-korea', flag: '🇰🇷', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Tipping not customary; may cause awkwardness' },
  { country: 'China', slug: 'china', flag: '🇨🇳', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Not expected; tourist-facing staff may appreciate it' },
  { country: 'Hong Kong', slug: 'hong-kong', flag: '🇭🇰', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% service usually added; small tip appreciated' },
  { country: 'Taiwan', slug: 'taiwan', flag: '🇹🇼', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Not customary; high-end hotels may expect it' },
  { country: 'Singapore', slug: 'singapore', flag: '🇸🇬', restaurant: 'not-expected', taxi: 'not-expected', hotel: 'not-expected', highlight: '10% GST already added; no additional tipping expected' },
  { country: 'Thailand', slug: 'thailand', flag: '🇹🇭', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '20–50 THB restaurant; round up taxi; 20–50 THB porter' },
  { country: 'Vietnam', slug: 'vietnam', flag: '🇻🇳', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi or Grab' },
  { country: 'Indonesia', slug: 'indonesia', flag: '🇮🇩', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '5–10% restaurant; round up Grab/Gojek' },
  { country: 'Malaysia', slug: 'malaysia', flag: '🇲🇾', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '5–10% service usually added; not for taxis' },
  { country: 'Philippines', slug: 'philippines', flag: '🇵🇭', restaurant: 'expected', taxi: 'optional', hotel: 'expected', highlight: '10% service charge common; additional 5–10% welcome' },
  { country: 'India', slug: 'india', flag: '🇮🇳', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; 10 INR per bag porter; round up taxi' },

  // Middle East & Africa
  { country: 'UAE', slug: 'uae', flag: '🇦🇪', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% service often added; AED 5–10 tip for drivers' },
  { country: 'Saudi Arabia', slug: 'saudi-arabia', flag: '🇸🇦', restaurant: 'optional', taxi: 'not-expected', hotel: 'optional', highlight: '10% in upscale restaurants; not for taxis' },
  { country: 'Jordan', slug: 'jordan', flag: '🇯🇴', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10% restaurant; round up taxi; negotiate not to tip guides upfront' },
  { country: 'Egypt', slug: 'egypt', flag: '🇪🇬', restaurant: 'expected', taxi: 'optional', hotel: 'expected', highlight: 'Baksheesh culture — small tips expected for many services' },
  { country: 'Morocco', slug: 'morocco', flag: '🇲🇦', restaurant: 'optional', taxi: 'optional', hotel: 'optional', highlight: '10–15% restaurant; round up taxi; MAD 5–10 porter' },
  { country: 'South Africa', slug: 'south-africa', flag: '🇿🇦', restaurant: 'expected', taxi: 'expected', hotel: 'expected', highlight: '10–15% restaurant; 10% taxi; R5–10 petrol attendant' },

  // Oceania
  { country: 'Australia', slug: 'australia', flag: '🇦🇺', restaurant: 'optional', taxi: 'optional', hotel: 'not-expected', highlight: 'Minimum wage laws mean tipping less expected; 10% appreciated' },
  { country: 'New Zealand', slug: 'new-zealand', flag: '🇳🇿', restaurant: 'optional', taxi: 'not-expected', hotel: 'not-expected', highlight: 'Not expected; 10% for exceptional service' },
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
  { region: 'North America', countries: 'USA, Canada', summary: 'Strong tipping culture. 15–20% in restaurants is standard, not optional. Taxi drivers, hotel porters, and bartenders all expect tips. Skipping a tip is considered rude and signals poor service.', level: 'expected' as TipExpectation },
  { region: 'Latin America', countries: 'Mexico, Brazil, Argentina, Colombia, Chile, Peru', summary: 'Mixed. Mexico and Brazil have growing tipping cultures in restaurants (10–15%). Argentina is complicated by inflation. Smaller countries and informal meals typically don\'t expect tips.', level: 'optional' as TipExpectation },
  { region: 'Western Europe', countries: 'UK, France, Germany, Italy, Spain, Portugal', summary: 'Service charges are often included. Where they are, no additional tip is expected. Leaving small change or rounding up is appreciated but never obligatory. Spain and Scandinavia have the weakest tipping cultures.', level: 'optional' as TipExpectation },
  { region: 'Eastern Europe', countries: 'Poland, Czech Republic, Hungary, Romania', summary: 'Tipping at restaurants (10%) is expected and appreciated — more so than in Western Europe. Staff wages are generally lower. Round up taxi fares.', level: 'expected' as TipExpectation },
  { region: 'East Asia', countries: 'Japan, South Korea, China, Taiwan', summary: 'Japan is the clearest case: tipping is considered insulting — it implies the service was unexpected or that the worker needs charity. South Korea and China are similar. Hong Kong is more accepting due to Western influence.', level: 'rude' as TipExpectation },
  { region: 'Southeast Asia', countries: 'Thailand, Vietnam, Indonesia, Malaysia, Philippines', summary: 'Tipping is appreciated but not expected. Round up the fare, leave 20–50 local currency units at restaurants, and tip hotel staff who assist with luggage. Amounts are small in absolute terms but meaningful to workers.', level: 'optional' as TipExpectation },
  { region: 'South Asia', countries: 'India', summary: 'Tipping is expected at restaurants (10%) and for hotel staff. For taxis, rounding up or leaving a small amount is appreciated. The hospitality sector relies partly on gratuity.', level: 'optional' as TipExpectation },
  { region: 'Middle East', countries: 'UAE, Saudi Arabia, Jordan, Egypt, Morocco', summary: 'Mixed and culturally complex. Egypt has a strong baksheesh culture (small tips for many services). UAE upscale venues add service charges. Morocco: restaurants and taxis expect rounding up.', level: 'optional' as TipExpectation },
  { region: 'Africa', countries: 'South Africa', summary: 'South Africa has a strong tipping culture similar to North America: 10–15% at restaurants, tips for petrol station attendants, guides, and safari staff.', level: 'expected' as TipExpectation },
  { region: 'Oceania', countries: 'Australia, New Zealand', summary: 'Minimum wage legislation means workers are not dependent on tips. Tipping is appreciated but genuinely optional. Rounding up or adding 10% for exceptional service is fine; not doing so is perfectly acceptable.', level: 'optional' as TipExpectation },
]

export default function TippingGuidePage() {
  const grouped = groupByRestaurant(COUNTRIES)

  return (
    <div className="space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
                <p className="text-[10px] text-zinc-500 font-medium">{r.countries}</p>
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
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{c.country}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">{c.highlight}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden min-[380px]:flex gap-1">
                        <span className="text-[9px] text-zinc-600 uppercase">Tax</span>
                        <ExpectationBadge status={c.taxi} />
                      </div>
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
                { country: '🇺🇸 USA', status: 'expected' as TipExpectation, amount: '15–20%' },
                { country: '🇨🇦 Canada', status: 'expected' as TipExpectation, amount: '10–15%' },
                { country: '🇬🇧 UK', status: 'optional' as TipExpectation, amount: 'Round up' },
                { country: '🇫🇷 France', status: 'optional' as TipExpectation, amount: 'Round up' },
                { country: '🇩🇪 Germany', status: 'optional' as TipExpectation, amount: 'Round up' },
                { country: '🇮🇹 Italy', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { country: '🇪🇸 Spain', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { country: '🇿🇦 South Africa', status: 'expected' as TipExpectation, amount: '10%' },
                { country: '🇦🇪 UAE', status: 'optional' as TipExpectation, amount: 'AED 5–10' },
                { country: '🇲🇽 Mexico', status: 'optional' as TipExpectation, amount: 'Round up' },
                { country: '🇹🇭 Thailand', status: 'optional' as TipExpectation, amount: '20–50 THB' },
                { country: '🇻🇳 Vietnam', status: 'optional' as TipExpectation, amount: 'Round up' },
                { country: '🇯🇵 Japan', status: 'rude' as TipExpectation, amount: 'Do not tip' },
                { country: '🇰🇷 South Korea', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { country: '🇨🇳 China', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
                { country: '🇸🇬 Singapore', status: 'not-expected' as TipExpectation, amount: 'Not expected' },
              ].map((row) => (
                <tr key={row.country} className="text-zinc-400">
                  <td className="py-2 pr-4 text-zinc-300">{row.country}</td>
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
              <span className="text-sm">{c.flag}</span>
              <span className="truncate">{c.country}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
