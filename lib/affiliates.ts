/**
 * Affiliate Runtime Config Manager
 *
 * Loads affiliate partner config from:
 *   1. Vercel KV  — live edits made via /admin (no redeploy needed)
 *   2. Static file — data/affiliate-config.ts (fallback / source of truth)
 *
 * All affiliate links route through /api/affiliate/redirect for:
 *   - Server-side click tracking (KV counters)
 *   - Easy URL swaps without code changes
 */

import { kvGet, kvSetPermanent, kvDelete, kvIncrement, kvKeys } from '@/lib/kv'
import {
  DEFAULT_AFFILIATE_CONFIG,
  type AffiliatePartner,
  type AffiliateCategory,
  type AffiliateZone,
} from '@/data/affiliate-config'

const KV_CONFIG_KEY = 'affiliate:config'
const KV_CLICKS_PREFIX = 'affiliate:clicks'

// In-memory cache to avoid repeated KV reads within the same function invocation
let _configCache: AffiliatePartner[] | null = null
let _configCacheAt = 0
const CONFIG_CACHE_TTL_MS = 60_000 // 1 minute

// ─── Config management ─────────────────────────────────────────────

/** Load affiliate config: KV overlay → static default */
export async function getAffiliateConfig(): Promise<AffiliatePartner[]> {
  const now = Date.now()
  if (_configCache && now - _configCacheAt < CONFIG_CACHE_TTL_MS) {
    return _configCache
  }
  const kvConfig = await kvGet<AffiliatePartner[]>(KV_CONFIG_KEY)
  if (kvConfig && Array.isArray(kvConfig) && kvConfig.length > 0) {
    _configCache = kvConfig
    _configCacheAt = now
    return kvConfig
  }
  _configCache = DEFAULT_AFFILIATE_CONFIG
  _configCacheAt = now
  return DEFAULT_AFFILIATE_CONFIG
}

/** Save affiliate config to KV (admin use only). No TTL — config is permanent until updated. */
export async function saveAffiliateConfig(config: AffiliatePartner[]): Promise<void> {
  await kvSetPermanent(KV_CONFIG_KEY, config)
  _configCache = config
  _configCacheAt = Date.now()
}

/** Reset to static defaults (clears KV override) */
export async function resetAffiliateConfig(): Promise<void> {
  await kvDelete(KV_CONFIG_KEY)
  _configCache = DEFAULT_AFFILIATE_CONFIG
  _configCacheAt = Date.now()
}

// ─── Partner selection ─────────────────────────────────────────────

export interface GetPartnersOptions {
  categories?: AffiliateCategory[]
  /** ISO 3166-1 alpha-2 country code of the destination */
  isoCountry?: string
  city?: string
  maxItems?: number
}

/**
 * Core filter + sort logic (used by both sync and async variants).
 *
 * Geo-locking:
 *   1. Partners with excludedRegions containing isoCountry → dropped
 *   2. Partners with preferredRegions containing isoCountry → priority boost (–0.5)
 *   3. Global partners (empty preferredRegions) → shown everywhere
 *   4. Partners with placeholder URLs (TRAVELPAYOUTS_* / IMPACT_*) → always dropped
 */
function filterAndSort(
  config: AffiliatePartner[],
  zone: AffiliateZone,
  options: GetPartnersOptions
): AffiliatePartner[] {
  const { categories, isoCountry, maxItems } = options
  const iso = isoCountry?.toUpperCase()

  type WithSort = AffiliatePartner & { _sortPriority: number }

  let partners: WithSort[] = config
    .filter(p => {
      if (!p.enabled) return false
      if (!p.zones.includes(zone)) return false
      if (p.baseUrl.startsWith('TRAVELPAYOUTS_') || p.baseUrl.startsWith('IMPACT_')) return false
      if (categories && !categories.includes(p.category)) return false
      if (iso && p.excludedRegions?.includes(iso)) return false
      return true
    })
    .map(p => {
      const isPreferred = iso ? (p.preferredRegions?.includes(iso) ?? false) : false
      return { ...p, _sortPriority: p.priority - (isPreferred ? 0.5 : 0) }
    })

  partners.sort((a, b) =>
    a._sortPriority !== b._sortPriority
      ? a._sortPriority - b._sortPriority
      : a.name.localeCompare(b.name)
  )
  if (maxItems) partners = partners.slice(0, maxItems)
  return partners
}

/**
 * Async: uses KV config override when available (server components, API routes).
 */
export async function getPartnersForZone(
  zone: AffiliateZone,
  options: GetPartnersOptions = {}
): Promise<AffiliatePartner[]> {
  const config = await getAffiliateConfig()
  return filterAndSort(config, zone, options)
}

/**
 * Sync: uses DEFAULT_AFFILIATE_CONFIG only (no KV).
 * Use this in CLIENT components that cannot call async server functions.
 * Admin KV overrides take effect on next server render/page load.
 */
export function getPartnersForZoneSync(
  zone: AffiliateZone,
  options: GetPartnersOptions = {}
): AffiliatePartner[] {
  return filterAndSort(DEFAULT_AFFILIATE_CONFIG, zone, options)
}

// ─── URL building ──────────────────────────────────────────────────

/**
 * Build the internal redirect URL for an affiliate partner.
 * All affiliate clicks go through /api/affiliate/redirect for tracking.
 */
export function buildRedirectUrl(
  partnerId: string,
  zone: AffiliateZone,
  city?: string,
  country?: string,
  isoCountry?: string
): string {
  const params = new URLSearchParams({ id: partnerId, zone })
  if (city) params.set('city', city)
  if (country) params.set('country', country)
  if (isoCountry) params.set('iso', isoCountry)
  return `/api/affiliate/redirect?${params.toString()}`
}

// ─── Click tracking ────────────────────────────────────────────────

/** Increment the click counter for a partner + zone in KV */
export async function incrementClickCount(
  partnerId: string,
  zone: AffiliateZone
): Promise<void> {
  const daily = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  await Promise.allSettled([
    kvIncrement(`${KV_CLICKS_PREFIX}:${partnerId}:${zone}`),
    kvIncrement(`${KV_CLICKS_PREFIX}:${partnerId}:${zone}:${daily}`),
    kvIncrement(`${KV_CLICKS_PREFIX}:total`),
  ])
}

/** Get all click counts keyed by KV key (for admin dashboard) */
export async function getClickCounts(): Promise<Record<string, number>> {
  const keys = await kvKeys(`${KV_CLICKS_PREFIX}:*`)
  if (!keys || keys.length === 0) return {}
  const values = await Promise.all(keys.map(k => kvGet<number>(k)))
  return Object.fromEntries(keys.map((k, i) => [k, values[i] ?? 0]))
}
