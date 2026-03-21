/**
 * AffiliateBlock — Smart affiliate partner display component.
 *
 * Replaces the old AffiliateLinks.tsx with a config-driven, geo-aware system.
 * All links route through /api/affiliate/redirect for server-side tracking.
 *
 * Props:
 *   zone       — which placement this is ('result' | 'preview' | 'blog' | 'success')
 *   categories — filter by category (transfer, hotel, tours, esim, car)
 *   partners   — pre-resolved partner list (passed from server component to avoid client-side KV calls)
 *   city       — destination city (for geo-sorting and deep links)
 *   country    — destination country name (for display and deep links)
 *   isoCountry — ISO 3166-1 alpha-2 code (for geo-locking)
 *   tint       — 'teal' (taxi pages) or 'purple' (tipping pages)
 *   heading    — override the default section heading
 *   maxItems   — max partners to show
 */

'use client'

import { ExternalLink } from 'lucide-react'
import { track } from '@vercel/analytics'
import { useLanguage } from '@/context/LanguageContext'
import type { AffiliatePartner, AffiliateZone } from '@/data/affiliate-config'
import type { TranslationKey } from '@/lib/i18n'

const PURPLE_FILTER = 'hue-rotate(98deg) saturate(110%)'

function PartnerIcon({
  name,
  size = 26,
  tint,
}: {
  name: string
  size?: number
  tint: 'teal' | 'purple'
}) {
  return (
    <img
      src={`/icons/SVG/${name}.svg`}
      alt=""
      width={size}
      height={size}
      style={tint === 'purple' ? { filter: PURPLE_FILTER } : undefined}
      aria-hidden="true"
    />
  )
}

interface AffiliateBlockProps {
  /** Pre-resolved partner list from server — avoids client-side KV calls */
  partners: AffiliatePartner[]
  zone: AffiliateZone
  city?: string
  country?: string
  isoCountry?: string
  tint: 'teal' | 'purple'
  /** i18n key for the section heading */
  headingKey?: TranslationKey
  /** Override heading destination interpolation */
  headingDestination?: string
}

export function AffiliateBlock({
  partners,
  zone,
  city,
  country,
  isoCountry,
  tint,
  headingKey = 'affiliate_plan_trip',
  headingDestination,
}: AffiliateBlockProps) {
  const { t } = useLanguage()

  if (partners.length === 0) return null

  const destination = headingDestination ?? city ?? country ?? ''

  function buildHref(partner: AffiliatePartner): string {
    const params = new URLSearchParams({ id: partner.id, zone })
    if (city) params.set('city', city)
    if (country) params.set('country', country)
    if (isoCountry) params.set('iso', isoCountry)
    return `/api/affiliate/redirect?${params.toString()}`
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-3.5 pb-2">
        {t(headingKey, { destination })}
      </p>
      <div className="divide-y divide-zinc-800">
        {partners.map(partner => (
          <a
            key={partner.id}
            href={buildHref(partner)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`${partner.name} — ${t(partner.labelKey as TranslationKey)} (opens in new tab)`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors group"
            onClick={() =>
              track('affiliate_clicked', {
                partner: partner.id,
                partnerName: partner.name,
                zone,
                city: city ?? country ?? '',
              })
            }
          >
            <div className="w-7 flex items-center justify-center shrink-0">
              <PartnerIcon name={partner.icon} size={26} tint={tint} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-200 group-hover:text-white transition-colors">
                {partner.name}
              </p>
              <p className="text-xs text-zinc-500">{t(partner.labelKey as TranslationKey)}</p>
            </div>
            <ExternalLink size={13} className="text-zinc-600 shrink-0" />
          </a>
        ))}
      </div>
      <p className="text-[10px] text-zinc-700 px-4 pb-3 pt-1">{t('affiliate_disclaimer')}</p>
    </div>
  )
}
