'use client'

import { ExternalLink } from 'lucide-react'
import { track } from '@vercel/analytics'
import { useLanguage } from '@/context/LanguageContext'
import type { TranslationKey } from '@/lib/i18n'

// tickets, buildings, mobile are all TEAL-native SVGs (#2dd4bf→#0d9488).
// On the taxi page (tint="teal")  they render as-is — no filter needed.
// On the tipping page (tint="purple") hue-rotate shifts teal(174°)+98°→purple(272°)
// while white stays white (achromatic — zero saturation, unaffected by hue-rotate).
const PURPLE_FILTER = 'hue-rotate(98deg) saturate(110%)'

function SvgIcon({ name, size = 26, tint }: { name: string; size?: number; tint: 'teal' | 'purple' }) {
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

interface Props {
  city?: string
  country: string
  tint: 'teal' | 'purple'
}

// Affiliate IDs — update as each programme is approved.
// GetYourGuide: https://partner.getyourguide.com  → replace PARTNER_ID
// Airalo:       https://partner.airalo.com         → replace REF_CODE

// Booking.com via AWIN (Australia — awinmid 18118, publisher 2817222)
// clickref passes the city name so AWIN reports show per-destination performance.
const BOOKING_AWIN_MID = '18118'
const BOOKING_AWIN_AFF = '2817222'

function bookingHref(dest: string, location: string): string {
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${dest}`
  return (
    `https://www.awin1.com/cread.php` +
    `?awinmid=${BOOKING_AWIN_MID}` +
    `&awinaffid=${BOOKING_AWIN_AFF}` +
    `&clickref=${encodeURIComponent(location)}` +
    `&p=${encodeURIComponent(bookingUrl)}`
  )
}

function buildLinks(city: string | undefined, country: string) {
  const dest = encodeURIComponent(city ?? country)
  const location = city ?? country
  return [
    {
      name: 'GetYourGuide',
      labelKey: 'affiliate_tours' as TranslationKey,
      href: `https://www.getyourguide.com/s/?q=${dest}&partner_id=PARTNER_ID`,
      svgIcon: 'tickets',
      ariaLabel: `Book tours and experiences in ${location} on GetYourGuide (opens in new tab)`,
    },
    {
      name: 'Booking.com',
      labelKey: 'affiliate_hotels' as TranslationKey,
      href: bookingHref(dest, location),
      svgIcon: 'buildings',
      ariaLabel: `Find hotels in ${location} on Booking.com (opens in new tab)`,
    },
    {
      name: 'Airalo',
      labelKey: 'affiliate_esim' as TranslationKey,
      href: 'https://ref.airalo.com/REF_CODE',
      svgIcon: 'mobile',
      ariaLabel: `Get an eSIM for ${location} on Airalo (opens in new tab)`,
    },
  ]
}

export function AffiliateLinks({ city, country, tint }: Props) {
  const { t } = useLanguage()
  const links = buildLinks(city, country)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-3.5 pb-2">
        {t('affiliate_plan_trip', { destination: city ?? country })}
      </p>
      <div className="divide-y divide-zinc-800">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={link.ariaLabel}
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors group"
            onClick={() => track('affiliate_clicked', { partner: link.name, city: city ?? country })}
          >
            <div className="w-7 flex items-center justify-center shrink-0">
              <SvgIcon name={link.svgIcon} size={26} tint={tint} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-200 group-hover:text-white transition-colors">{link.name}</p>
              <p className="text-xs text-zinc-500">{t(link.labelKey)}</p>
            </div>
            <ExternalLink size={13} className="text-zinc-600 shrink-0" />
          </a>
        ))}
      </div>
      <p className="text-[10px] text-zinc-700 px-4 pb-3 pt-1">
        {t('affiliate_disclaimer')}
      </p>
    </div>
  )
}
