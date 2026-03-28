/**
 * BlogAffiliateCard — Affiliate CTA for blog posts.
 *
 * Appears at the bottom of blog posts, before the existing "Check your fare" CTA.
 * Shows contextually appropriate partners based on blog post category:
 *   taxi    → transfer partners (Kiwitaxi, Welcome Pickups, GetTransfer)
 *   tipping → tours/experiences (GetYourGuide when live)
 *   travel  → both transfers and hotels
 *
 * Receives pre-resolved partners from the parent server component.
 */

import { ExternalLink } from 'lucide-react'
import type { AffiliatePartner } from '@/data/affiliate-config'

interface BlogAffiliateCardProps {
  partners: AffiliatePartner[]
  /** Blog post category */
  category: 'taxi' | 'tipping' | 'travel'
  city?: string
  country?: string
  isoCountry?: string
}

export function BlogAffiliateCard({
  partners,
  category,
  city,
  country,
}: BlogAffiliateCardProps) {
  if (partners.length === 0) return null

  const destination = city ?? country ?? ''

  const heading =
    category === 'tipping'
      ? `Top experiences in ${destination}`
      : `Book a pre-arranged transfer${destination ? ` in ${destination}` : ''}`

  const subheading =
    category === 'tipping'
      ? 'Curated activities for your visit'
      : 'Fixed price · no meter disputes · book in advance'

  function buildHref(partner: AffiliatePartner): string {
    const params = new URLSearchParams({ id: partner.id, zone: 'blog' })
    if (city) params.set('city', city)
    if (country) params.set('country', country)
    return `/api/affiliate/redirect?${params.toString()}`
  }

  return (
    <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden not-prose">
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm font-semibold text-zinc-200">{heading}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{subheading}</p>
      </div>
      <div className="border-t border-zinc-800 divide-y divide-zinc-800">
        {partners.map(partner => (
          <a
            key={partner.id}
            href={buildHref(partner)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors group"
          >
            <img
              src={`/icons/SVG/${partner.icon}.svg`}
              alt=""
              width={22}
              height={22}
              aria-hidden="true"
              className="shrink-0 opacity-80"
            />
            <span className="flex-1 text-sm text-zinc-300 group-hover:text-white transition-colors">
              {partner.name}
            </span>
            <ExternalLink size={12} className="text-zinc-600 shrink-0" />
          </a>
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 px-4 py-2">
        Affiliate links — we may earn a small commission at no extra cost to you.{' '}
        <a href="/affiliate-disclosure" className="underline hover:text-zinc-400 transition-colors">
          Disclosure
        </a>
      </p>
    </div>
  )
}
