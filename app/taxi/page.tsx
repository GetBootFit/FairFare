import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { TaxiForm } from '@/components/taxi/TaxiForm'
import { TaxiPageHeader } from '@/components/taxi/TaxiPageHeader'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getAllCitySlugs } from '@/lib/seo-helpers'
import { PopularCitiesSection } from '@/components/PopularCitiesSection'

export const metadata = { title: 'Taxi Fare Check — FairFare' }

// Hand-curated list of high-traffic tourist cities — ordered by global search volume.
// Must exist in data/taxi-rates.json; validated against the live slug set at build time.
const FEATURED_CITY_SLUGS = [
  'bangkok',
  'london',
  'new-york',
  'dubai',
  'paris',
  'singapore',
  'tokyo',
  'rome',
  'istanbul',
  'amsterdam',
  'barcelona',
  'bali',
]

const allSlugs = new Set(getAllCitySlugs())
const FEATURED_CITIES = FEATURED_CITY_SLUGS.filter((s) => allSlugs.has(s))

export default function TaxiPage() {
  return (
    <div className="space-y-5">
      <TaxiPageHeader />

      <ErrorBoundary>
        <TaxiForm />
      </ErrorBoundary>

      <PopularCitiesSection cities={FEATURED_CITIES} />

      {/* Link to scam guide */}
      <Link
        href="/taxi/scams"
        className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors group"
      >
        <AlertTriangle size={13} className="text-amber-400 shrink-0" />
        <span>Taxi Scam Warning Signs — country-by-country guide</span>
        <span className="ml-auto rtl:ml-0 rtl:mr-auto text-zinc-600 group-hover:text-zinc-400 transition-colors inline-block rtl:rotate-180">→</span>
      </Link>
    </div>
  )
}
