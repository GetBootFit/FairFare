import { TippingForm } from '@/components/tipping/TippingForm'
import { TippingPageHeader } from '@/components/tipping/TippingPageHeader'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { TIPPING_COUNTRIES } from '@/lib/seo-helpers'
import { PopularCountriesSection } from '@/components/PopularCountriesSection'

export const metadata = { title: 'Tipping Guide — FairFare' }

// Hand-curated list of high-traffic tourist countries — ordered by outbound travel volume.
// All entries must exist in TIPPING_COUNTRIES; filtered at build time for safety.
const FEATURED_COUNTRY_NAMES = [
  'United States',
  'United Kingdom',
  'France',
  'Japan',
  'Italy',
  'Thailand',
  'Spain',
  'Australia',
  'Germany',
  'UAE',
  'Mexico',
  'Indonesia',
]

const countrySet = new Set(TIPPING_COUNTRIES)
const FEATURED_COUNTRIES = FEATURED_COUNTRY_NAMES.filter((c) => countrySet.has(c))

export default function TippingPage() {
  return (
    <div className="space-y-5">
      <TippingPageHeader />

      <ErrorBoundary>
        <TippingForm />
      </ErrorBoundary>

      <PopularCountriesSection countries={FEATURED_COUNTRIES} />
    </div>
  )
}
