'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { countryToSlug } from '@/lib/seo-helpers'
import { getCountryDisplayName } from '@/lib/place-names'

interface Props {
  /** Pre-filtered English country names passed down from the server component. */
  countries: string[]
}

export function PopularCountriesSection({ countries }: Props) {
  const { t, locale } = useLanguage()

  return (
    <div className="pt-2 pb-2">
      <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2.5">
        {t('popular_countries')}
      </p>
      <div className="flex flex-wrap gap-2">
        {countries.map((country) => (
          <Link
            key={country}
            href={`/tipping/${countryToSlug(country)}`}
            className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 hover:border-teal-800/50 hover:text-teal-400 rounded-full px-3 py-1 transition-colors"
          >
            {getCountryDisplayName(country, locale)}
          </Link>
        ))}
      </div>
    </div>
  )
}
