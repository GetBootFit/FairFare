/**
 * AffiliatePreviewStrip — Slim pre-paywall affiliate strip.
 *
 * Shown BELOW the free route preview card and ABOVE the "Unlock" paywall CTA.
 * Uses deliberately muted zinc styling — never competes visually with the paid CTA.
 * Shows transfer partners only (max 2) — the most contextually relevant category
 * for a user who has just seen their route distance/time.
 *
 * Receives pre-resolved partners from the parent server component.
 */

'use client'

import { ExternalLink } from 'lucide-react'
import { track } from '@vercel/analytics'
import { useLanguage } from '@/context/LanguageContext'
import type { AffiliatePartner, AffiliateZone } from '@/data/affiliate-config'

interface AffiliatePreviewStripProps {
  partners: AffiliatePartner[]
  city?: string
  country?: string
  isoCountry?: string
  /** Tracking zone — defaults to 'preview'. Pass 'airport' for airport pages. */
  zone?: AffiliateZone
  /** Override the strip label. Defaults to t('affiliate_preview_strip'). */
  label?: string
}

export function AffiliatePreviewStrip({
  partners,
  city,
  country,
  isoCountry,
  zone = 'preview',
  label,
}: AffiliatePreviewStripProps) {
  const { t } = useLanguage()

  if (partners.length === 0) return null

  function buildHref(partner: AffiliatePartner): string {
    const params = new URLSearchParams({ id: partner.id, zone })
    if (city) params.set('city', city)
    if (country) params.set('country', country)
    if (isoCountry) params.set('iso', isoCountry)
    return `/api/affiliate/redirect?${params.toString()}`
  }

  return (
    <div className="mt-3 px-3 py-2.5 rounded-xl border border-zinc-800/60 bg-zinc-900/40">
      <p className="text-[10px] text-zinc-600 mb-2">
        {label ?? t('affiliate_preview_strip')}{' '}
        <span className="text-zinc-700">(affiliate link)</span>
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {partners.map(partner => (
          <a
            key={partner.id}
            href={buildHref(partner)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`${partner.name} — book a transfer (opens in new tab)`}
            className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-400 transition-colors"
            onClick={() =>
              track('affiliate_clicked', {
                partner: partner.id,
                partnerName: partner.name,
                zone,
                city: city ?? country ?? '',
              })
            }
          >
            <img
              src={`/icons/SVG/${partner.icon}.svg`}
              alt=""
              width={13}
              height={13}
              className="opacity-40"
              aria-hidden="true"
            />
            {partner.name}
            <ExternalLink size={9} className="opacity-40" />
          </a>
        ))}
      </div>
    </div>
  )
}
