'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { slugToDisplayName } from '@/lib/seo-helpers'
import { getCityDisplayName } from '@/lib/place-names'

interface Props {
  /** Pre-filtered slugs passed down from the server component. */
  cities: string[]
}

export function PopularCitiesSection({ cities }: Props) {
  const { t, locale } = useLanguage()

  return (
    <div className="pt-2 pb-2">
      <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2.5">
        {t('popular_cities')}
      </p>
      <div className="flex flex-wrap gap-2">
        {cities.map((slug) => (
          <Link
            key={slug}
            href={`/taxi/${slug}`}
            className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 hover:border-purple-800/50 hover:text-purple-400 rounded-full px-3 py-1 transition-colors"
          >
            {getCityDisplayName(slug, locale, slugToDisplayName(slug))}
          </Link>
        ))}
      </div>
    </div>
  )
}
