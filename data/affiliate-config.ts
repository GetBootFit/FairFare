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
export type AffiliateZone = 'result' | 'preview' | 'blog' | 'success'

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
    zones: ['result', 'preview', 'blog', 'success'],
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
    zones: ['result', 'preview', 'blog', 'success'],
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
    zones: ['result', 'preview', 'blog'],
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
    // Enable once Travelpayouts Booking.com programme is approved
    enabled: false,
    priority: 5,
    zones: ['result', 'blog', 'success'],
    baseUrl: 'TRAVELPAYOUTS_BOOKING_URL',
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
    // Enable once Travelpayouts GetYourGuide programme is approved
    enabled: false,
    priority: 7,
    zones: ['result', 'blog', 'success'],
    baseUrl: 'TRAVELPAYOUTS_GYG_URL',
  },
  {
    id: 'viator',
    name: 'Viator',
    category: 'tours',
    icon: 'tickets',
    labelKey: 'affiliate_tours',
    enabled: false,
    priority: 8,
    zones: ['result', 'blog'],
    baseUrl: 'TRAVELPAYOUTS_VIATOR_URL',
  },

  // ─────────────────────────────────────────
  // eSIM — result and success pages
  // ─────────────────────────────────────────
  {
    id: 'airalo',
    name: 'Airalo',
    category: 'esim',
    icon: 'mobile',
    labelKey: 'affiliate_esim',
    // Enable once Impact.com Airalo programme is approved
    enabled: false,
    priority: 9,
    zones: ['result', 'success'],
    baseUrl: 'IMPACT_AIRALO_URL',
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
    // Enable once Travelpayouts DiscoverCars programme is approved
    enabled: false,
    priority: 10,
    zones: ['result'],
    baseUrl: 'TRAVELPAYOUTS_DISCOVERCARS_URL',
  },
]
