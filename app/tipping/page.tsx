import Link from 'next/link'
import { Globe } from 'lucide-react'
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

      {/* Link to the global overview guide */}
      <Link
        href="/tipping/guide"
        className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors group"
      >
        <Globe size={12} className="text-purple-400 shrink-0" />
        <span className="flex-1 min-w-0 truncate text-[11px]">Global Tipping Customs 2026 — country-by-country overview</span>
        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 rtl:rotate-180">→</span>
      </Link>
    </div>
  )
}
