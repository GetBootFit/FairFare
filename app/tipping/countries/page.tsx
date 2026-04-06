import Link from 'next/link'
import { Globe, ArrowRight } from 'lucide-react'
import { TIPPING_COUNTRIES, getAllCountrySlugs, countryToSlug } from '@/lib/seo-helpers'
import type { Metadata } from 'next'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Tipping by Country — 56 Countries | Hootling',
  description: 'Tipping customs and expected amounts for 56 countries worldwide. Restaurants, taxis, hotels, spas and more — know before you go.',
  alternates: { canonical: `${APP_URL}/tipping/countries` },
}

const REGION_MAP: Record<string, string> = {
  // Europe
  'Austria': 'Europe', 'Belgium': 'Europe', 'Croatia': 'Europe', 'Czech Republic': 'Europe',
  'Denmark': 'Europe', 'Finland': 'Europe', 'France': 'Europe', 'Germany': 'Europe',
  'Greece': 'Europe', 'Hungary': 'Europe', 'Ireland': 'Europe', 'Italy': 'Europe',
  'Netherlands': 'Europe', 'Norway': 'Europe', 'Poland': 'Europe', 'Portugal': 'Europe',
  'Romania': 'Europe', 'Russia': 'Europe', 'Spain': 'Europe', 'Sweden': 'Europe',
  'Switzerland': 'Europe', 'Ukraine': 'Europe', 'United Kingdom': 'Europe',
  // Asia Pacific
  'Australia': 'Asia Pacific', 'China': 'Asia Pacific', 'Hong Kong': 'Asia Pacific',
  'India': 'Asia Pacific', 'Indonesia': 'Asia Pacific', 'Japan': 'Asia Pacific',
  'Macau': 'Asia Pacific', 'Malaysia': 'Asia Pacific', 'New Zealand': 'Asia Pacific',
  'Philippines': 'Asia Pacific', 'Singapore': 'Asia Pacific', 'South Korea': 'Asia Pacific',
  'Taiwan': 'Asia Pacific', 'Thailand': 'Asia Pacific', 'Vietnam': 'Asia Pacific',
  // Americas
  'Argentina': 'Americas', 'Brazil': 'Americas', 'Canada': 'Americas', 'Chile': 'Americas',
  'Colombia': 'Americas', 'Costa Rica': 'Americas', 'Mexico': 'Americas', 'Peru': 'Americas',
  'United States': 'Americas',
  // Middle East & Africa
  'Egypt': 'Middle East & Africa', 'Israel': 'Middle East & Africa',
  'Jordan': 'Middle East & Africa', 'Morocco': 'Middle East & Africa',
  'Saudi Arabia': 'Middle East & Africa', 'South Africa': 'Middle East & Africa',
  'Tunisia': 'Middle East & Africa', 'Turkey': 'Middle East & Africa',
  'United Arab Emirates': 'Middle East & Africa',
}

const REGION_ORDER = ['Americas', 'Europe', 'Asia Pacific', 'Middle East & Africa']

const TIPPING_NORMS: Record<string, string> = {
  'United States': '15–20%', 'Canada': '15–20%', 'United Kingdom': '10–15%',
  'Australia': 'Optional', 'New Zealand': 'Optional', 'Japan': 'Not expected',
  'South Korea': 'Not expected', 'China': 'Not expected', 'France': '5–10%',
  'Germany': '5–10%', 'Italy': 'Optional', 'Spain': 'Optional',
  'Mexico': '10–15%', 'Brazil': '10%', 'Argentina': '10%',
  'Thailand': '10%', 'Indonesia': '10%', 'Vietnam': 'Optional',
  'India': '10%', 'United Arab Emirates': '10%', 'Turkey': '10%',
}

export default function TippingCountriesPage() {
  const slugs = getAllCountrySlugs()

  const grouped = TIPPING_COUNTRIES.reduce<Record<string, string[]>>((acc, country) => {
    const region = REGION_MAP[country] ?? 'Other'
    if (!acc[region]) acc[region] = []
    acc[region].push(country)
    return acc
  }, {})

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tipping Guides by Country — Hootling',
    description: 'Tipping customs and etiquette for countries worldwide',
    numberOfItems: TIPPING_COUNTRIES.length,
    itemListElement: TIPPING_COUNTRIES.map((country, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Tipping guide for ${country}`,
      url: `https://www.hootling.com/tipping/${countryToSlug(country)}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="space-y-2">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
            <Link href="/tipping" className="hover:text-zinc-300 transition-colors">Tipping Guide</Link>
            <span>›</span>
            <span className="text-zinc-300">All Countries</span>
          </nav>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-900/40 border border-teal-800/50 flex items-center justify-center shrink-0">
              <Globe size={15} className="text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Tipping by Country</h1>
              <p className="text-xs text-zinc-500">{TIPPING_COUNTRIES.length} countries · restaurants, taxis, hotels &amp; more</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">
            Tipping customs vary wildly by country. Overtip in Japan and you&apos;ll cause offence. Undertip in the US and you&apos;ll cause a scene. Know before you go.
          </p>
        </div>

        {/* Quick reference: tip vs no-tip */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-teal-950/40 border border-teal-800/40 rounded-xl p-3">
            <p className="text-xs font-semibold text-teal-400 mb-1.5">Always tip</p>
            <div className="space-y-0.5">
              {['United States', 'Canada', 'Mexico'].map((c) => (
                <Link key={c} href={`/tipping/${countryToSlug(c)}`} className="block text-xs text-zinc-300 hover:text-white transition-colors">
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <p className="text-xs font-semibold text-zinc-400 mb-1.5">Tipping unusual</p>
            <div className="space-y-0.5">
              {['Japan', 'South Korea', 'China'].map((c) => (
                <Link key={c} href={`/tipping/${countryToSlug(c)}`} className="block text-xs text-zinc-300 hover:text-white transition-colors">
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Countries by region */}
        {REGION_ORDER.map((region) => {
          const regionCountries = grouped[region]
          if (!regionCountries?.length) return null
          return (
            <section key={region} className="space-y-2">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
                {region} · {regionCountries.length} countries
              </h2>
              <div className="space-y-1">
                {regionCountries.map((country) => {
                  const slug = countryToSlug(country)
                  const norm = TIPPING_NORMS[country]
                  return (
                    <Link
                      key={slug}
                      href={`/tipping/${slug}`}
                      className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 rounded-xl px-3 py-2.5 transition-all group"
                    >
                      <p className="text-sm font-medium text-white">{country}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        {norm && (
                          <span className="text-[10px] text-zinc-500 font-medium">{norm}</span>
                        )}
                        <ArrowRight size={12} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <div className="bg-teal-950/40 border border-teal-800/40 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-white">Get the full guide for your destination</p>
          <p className="text-xs text-zinc-400">
            Our full tipping guides cover 6 scenarios — restaurants, taxis, hotels, spas, bars, and food delivery — with local context and exact amounts.
          </p>
          <Link
            href="/tipping"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            Check tipping for any country <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </>
  )
}
