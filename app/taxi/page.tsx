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
    </div>
  )
}
