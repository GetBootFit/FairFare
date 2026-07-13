/**
 * Affiliate Partner Configuration — Source of Truth
 *
 * This file defines all affiliate partners, their categories, zones, and base URLs.
 * URLs are placeholders until real Travelpayouts / Impact tracking links are pasted in.
 *
 * To update a URL without a redeploy: edit via the admin dashboard at /admin.
 * The admin saves the config to Vercel KV, which overrides this static file at runtime.
 *
 * Zones:
 *   'result'  — post-paywall paid result page (taxi + tipping)
 *   'preview' — pre-paywall free preview strip (taxi only, subtle)
 *   'blog'    — blog post affiliate card
 *   'success' — post-payment success/redirect page
 *
 * Priority: lower number = shown first within the same category.
 *
 * Geo rules:
 *   preferredRegions — ISO 3166-1 alpha-2 codes where this partner has strongest coverage
 *   excludedRegions  — codes where partner has no service (never shown)
 *   If both arrays are empty the partner is treated as global.
 */

import type { TranslationKey } from '@/lib/i18n'

export type AffiliateCategory = 'transfer' | 'hotel' | 'tours' | 'esim' | 'car'
export type AffiliateZone = 'result' | 'preview' | 'blog' | 'success' | 'airport'

export interface AffiliatePartner {
  /** Stable identifier — used as KV key and tracking param */
  id: string
  /** Display name */
  name: string
  category: AffiliateCategory
  /** SVG filename (without extension) from /public/icons/SVG/ */
  icon: string
  /** i18n key for the subtitle line shown under the partner name */
  labelKey: TranslationKey
  /** Master on/off switch */
  enabled: boolean
  /** Lower = higher priority within same category */
  priority: number
  /** ISO 3166-1 alpha-2 codes where this partner has strongest coverage (empty = global) */
  preferredRegions?: string[]
  /** ISO codes where partner has NO service — never shown for these destinations */
  excludedRegions?: string[]
  /** Which zones this partner appears in */
  zones: AffiliateZone[]
  /**
   * Full affiliate tracking URL.
   * Use {city} and {country} as interpolation tokens — replaced at render time.
   * Example: "https://www.kiwitaxi.com/en/?affiliate_id=XXX&from={city}"
   *
   * Placeholders (TRAVELPAYOUTS_*_URL) are replaced once real links are generated
   * from the Travelpayouts dashboard → each partner → Tools → Generate link.
   * Paste real URLs into the admin dashboard to update without a redeploy.
   */
  baseUrl: string
}

export const DEFAULT_AFFILIATE_CONFIG: AffiliatePartner[] = [
  // ─────────────────────────────────────────
  // TRANSFERS — highest priority for taxi results & preview strip
  // ─────────────────────────────────────────
  {
    id: 'kiwitaxi',
    name: 'Kiwitaxi',
    category: 'transfer',
    icon: 'taxi-car',
    labelKey: 'affiliate_transfers',
    enabled: true,
    priority: 1,
    // Strong in Eastern Europe, Russia, SE Asia, Middle East
    preferredRegions: ['RU', 'UA', 'PL', 'CZ', 'HU', 'RO', 'TH', 'VN', 'AE', 'TR', 'EG', 'IN'],
    zones: ['result', 'preview', 'blog', 'success', 'airport'],
    baseUrl: 'https://kiwitaxi.tpk.lu/r3buLnXk',
  },
  {
    id: 'welcome_pickups',
    name: 'Welcome Pickups',
    category: 'transfer',
    icon: 'transport-car-rental',
    labelKey: 'affiliate_transfers',
    enabled: true,
    priority: 2,
    // Strong in Mediterranean, Southern Europe, Middle East
    preferredRegions: ['GR', 'ES', 'PT', 'IT', 'FR', 'HR', 'CY', 'MT', 'IL', 'JO', 'MA', 'TN'],
    zones: ['result', 'preview', 'blog', 'success', 'airport'],
    baseUrl: 'https://tpk.lu/uISwgG5I',
  },
  {
    id: 'gettransfer',
    name: 'GetTransfer',
    category: 'transfer',
    icon: 'taxi-car',
    labelKey: 'affiliate_transfers',
    enabled: true,
    priority: 3,
    // Global coverage — shown everywhere as fallback
    zones: ['result', 'preview', 'blog', 'airport'],
    baseUrl: 'https://gettransfer.tpk.lu/AoQRdSfe',
  },
  {
    id: 'intui',
    name: 'intui.travel',
    category: 'transfer',
    icon: 'transport-car-rental',
    labelKey: 'affiliate_transfers',
    enabled: true,
    priority: 4,
    // Global, strong in Eastern Europe and Asia
    zones: ['result'],
    baseUrl: 'https://intui.tpk.lu/hiWdruZ9',
  },

  // ─────────────────────────────────────────
  // HOTELS — post-paywall and blog
  // ─────────────────────────────────────────
  {
    id: 'booking',
    name: 'Booking.com',
    category: 'hotel',
    icon: 'buildings',
    labelKey: 'affiliate_hotels',
    enabled: true,
    priority: 5,
    zones: ['result', 'blog', 'success'],
    baseUrl: 'https://booking.tpk.lu/B57stj4j',
  },
  {
    id: 'agoda',
    name: 'Agoda',
    category: 'hotel',
    icon: 'buildings',
    labelKey: 'affiliate_hotels',
    // Enable once Travelpayouts / direct Agoda programme is approved
    enabled: false,
    priority: 6,
    // Agoda is strongest in Asia-Pacific
    preferredRegions: ['TH', 'SG', 'ID', 'MY', 'VN', 'PH', 'JP', 'KR', 'CN', 'IN', 'AU', 'NZ'],
    zones: ['result', 'blog', 'success'],
    baseUrl: 'TRAVELPAYOUTS_AGODA_URL',
  },

  // ─────────────────────────────────────────
  // TOURS & ACTIVITIES — tipping results and blog
  // ─────────────────────────────────────────
  {
    id: 'getyourguide',
    name: 'GetYourGuide',
    category: 'tours',
    icon: 'tickets',
    labelKey: 'affiliate_tours',
    enabled: true,
    priority: 7,
    zones: ['result', 'blog', 'success'],
    baseUrl: 'https://getyourguide.tpk.lu/8UTYxuSN',
  },
  {
    id: 'viator',
    name: 'Viator',
    category: 'tours',
    icon: 'tickets',
    labelKey: 'affiliate_tours',
    enabled: true,
    priority: 8,
    zones: ['result', 'blog'],
    baseUrl: 'https://viator.tpk.lu/xg21g48s',
  },

  // ─────────────────────────────────────────
  // eSIM — result and success pages
  // ─────────────────────────────────────────
  {
    id: 'yesim',
    name: 'Yesim',
    category: 'esim',
    icon: 'mobile',
    labelKey: 'affiliate_esim',
    enabled: true,
    priority: 9,
    zones: ['result', 'success'],
    baseUrl: 'https://yesim.tpk.lu/ne37lfSe',
  },
  {
    id: 'holafly',
    name: 'Holafly',
    category: 'esim',
    icon: 'mobile',
    labelKey: 'affiliate_esim',
    // Enable once Holafly affiliate programme is approved (apply at holafly.com/en/affiliates)
    enabled: false,
    priority: 10,
    zones: ['result', 'success'],
    baseUrl: 'HOLAFLY_AFFILIATE_URL',
  },
  {
    id: 'airalo',
    name: 'Airalo',
    category: 'esim',
    icon: 'mobile',
    labelKey: 'affiliate_esim',
    enabled: true,
    priority: 11,
    zones: ['result', 'success'],
    baseUrl: 'https://airalo.tpk.lu/J2MC5xC8',
  },

  // ─────────────────────────────────────────
  // CAR HIRE — result pages only (alternative to taxi for longer stays)
  // ─────────────────────────────────────────
  {
    id: 'discovercars',
    name: 'DiscoverCars',
    category: 'car',
    icon: 'transport-car-rental',
    labelKey: 'affiliate_car_hire',
    enabled: true,
    priority: 12,
    zones: ['result', 'blog'],
    baseUrl: 'https://discovercars.tpk.lu/t6WhltJd',
  },

  // ─────────────────────────────────────────
  // TRAINS & BUSES — blog and result pages (alternatives to taxi)
  // ─────────────────────────────────────────
  {
    id: '12go',
    name: '12Go',
    category: 'transfer',
    icon: 'transport-train',
    labelKey: 'affiliate_transfers',
    enabled: true,
    priority: 13,
    // Trains & buses across Asia
    preferredRegions: ['TH', 'JP', 'KR', 'SG', 'VN', 'ID', 'MY', 'IN', 'TW', 'HK', 'PH'],
    zones: ['result', 'blog'],
    baseUrl: 'https://12go.tpk.lu/f87UzcqN',
  },
  {
    id: 'omio',
    name: 'Omio',
    category: 'transfer',
    icon: 'transport-train',
    labelKey: 'affiliate_transfers',
    enabled: true,
    priority: 14,
    // Trains & buses across Europe
    preferredRegions: ['DE', 'FR', 'ES', 'IT', 'NL', 'GB', 'AT', 'CH', 'BE', 'PL', 'PT', 'SE', 'DK', 'CZ'],
    zones: ['result', 'blog'],
    baseUrl: 'https://omio.tpk.lu/iMgI3eHU',
  },
]
