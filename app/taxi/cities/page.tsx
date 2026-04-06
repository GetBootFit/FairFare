import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { getAllCitySlugs, getCityData, slugToDisplayName } from '@/lib/seo-helpers'
import type { Metadata } from 'next'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Taxi Fares by City — All 160+ Cities | Hootling',
  description: 'Taxi fare rates for 160+ cities worldwide. Find official meter rates, airport transfer costs, and scam warnings for your destination.',
  alternates: { canonical: `${APP_URL}/taxi/cities` },
}

const REGIONS: Record<string, string[]> = {
  Europe: [
    'Albania', 'Austria', 'Belarus', 'Belgium', 'Bulgaria', 'Croatia', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary',
    'Iceland', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'Serbia', 'Slovakia', 'Spain', 'Sweden', 'Switzerland',
    'Turkey', 'Ukraine', 'United Kingdom',
  ],
  'Asia Pacific': [
    'Australia', 'Cambodia', 'China', 'Hong Kong', 'India', 'Indonesia', 'Japan',
    'Macau', 'Malaysia', 'Myanmar', 'Nepal', 'New Zealand', 'Philippines', 'Singapore',
    'South Korea', 'Sri Lanka', 'Taiwan', 'Thailand', 'Vanuatu', 'Vietnam',
  ],
  Americas: [
    'Argentina', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
    'Dominican Republic', 'Ecuador', 'Mexico', 'Peru', 'United States', 'Venezuela',
  ],
  'Middle East & Africa': [
    'Algeria', 'Bahrain', 'Egypt', 'Ethiopia', 'Jordan', 'Kenya', 'Kuwait', 'Morocco',
    'Nigeria', 'Oman', 'Qatar', 'Rwanda', 'Saudi Arabia', 'South Africa', 'Syria',
    'Tunisia', 'United Arab Emirates',
  ],
}

function getRegion(country: string): string {
  for (const [region, countries] of Object.entries(REGIONS)) {
    if (countries.includes(country)) return region
  }
  return 'Other'
}

type CityEntry = {
  slug: string
  name: string
  country: string
  currency: string
  currencySymbol: string
}

export default function TaxiCitiesPage() {
  const slugs = getAllCitySlugs()

  const cities: CityEntry[] = slugs
    .map((slug) => {
      const data = getCityData(slug)
      if (!data) return null
      return {
        slug,
        name: slugToDisplayName(slug),
        country: data.country,
        currency: data.currency,
        currencySymbol: data.currencySymbol,
      }
    })
    .filter((c): c is CityEntry => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name))

  const grouped = cities.reduce<Record<string, CityEntry[]>>((acc, city) => {
    const region = getRegion(city.country)
    if (!acc[region]) acc[region] = []
    acc[region].push(city)
    return acc
  }, {})

  const regionOrder = ['Europe', 'Asia Pacific', 'Americas', 'Middle East & Africa', 'Other']

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Taxi Fare Cities — Hootling',
    description: 'Taxi fare rates for cities worldwide',
    numberOfItems: cities.length,
    itemListElement: cities.slice(0, 50).map((city, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Taxi fares in ${city.name}`,
      url: `https://www.hootling.com/taxi/${city.slug}`,
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
            <Link href="/taxi" className="hover:text-zinc-300 transition-colors">Taxi Fare Check</Link>
            <span>›</span>
            <span className="text-zinc-300">All Cities</span>
          </nav>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-800/50 flex items-center justify-center shrink-0">
              <MapPin size={15} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Taxi Fares by City</h1>
              <p className="text-xs text-zinc-500">{cities.length} cities · official meter rates</p>
            </div>
          </div>
          <p className="text-sm text-zinc-400">
            Find taxi fare rates, airport transfer costs, and scam warnings for your destination.
          </p>
        </div>

        {/* Regions */}
        {regionOrder.map((region) => {
          const regionCities = grouped[region]
          if (!regionCities?.length) return null
          return (
            <section key={region} className="space-y-2">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
                {region} · {regionCities.length} cities
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                {regionCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/taxi/${city.slug}`}
                    className="flex items-center justify-between gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 rounded-xl px-3 py-2.5 transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{city.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{city.country}</p>
                    </div>
                    <ArrowRight size={12} className="text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-white">Don&apos;t see your city?</p>
          <p className="text-xs text-zinc-400">
            Our taxi fare checker works for hundreds of destinations — even unlisted cities get AI scam warnings and local driver phrases.
          </p>
          <Link
            href="/taxi"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Check any route <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </>
  )
}
