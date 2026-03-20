/**
 * Currency detection, formatting, and hardcoded pricing.
 *
 * Uses navigator.language (NOT geolocation) to detect the user's home
 * currency. An Australian's browser in New York still reports en-AU → AUD.
 * Prices are hardcoded psychological amounts — reviewed quarterly.
 *
 * Last reviewed: March 2026
 */

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'AUD'
  | 'CAD'
  | 'NZD'
  | 'SGD'
  | 'JPY'
  | 'CHF'
  | 'HKD'

export const CURRENCIES: {
  code: CurrencyCode
  symbol: string
  label: string
  zeroDecimal: boolean
}[] = [
  { code: 'USD', symbol: '$',    label: 'USD — US Dollar',            zeroDecimal: false },
  { code: 'EUR', symbol: '€',    label: 'EUR — Euro',                 zeroDecimal: false },
  { code: 'GBP', symbol: '£',    label: 'GBP — British Pound',        zeroDecimal: false },
  { code: 'AUD', symbol: 'A$',   label: 'AUD — Australian Dollar',    zeroDecimal: false },
  { code: 'CAD', symbol: 'C$',   label: 'CAD — Canadian Dollar',      zeroDecimal: false },
  { code: 'NZD', symbol: 'NZ$',  label: 'NZD — New Zealand Dollar',   zeroDecimal: false },
  { code: 'SGD', symbol: 'S$',   label: 'SGD — Singapore Dollar',     zeroDecimal: false },
  { code: 'JPY', symbol: '¥',    label: 'JPY — Japanese Yen',         zeroDecimal: true  },
  { code: 'CHF', symbol: 'Fr ',  label: 'CHF — Swiss Franc',          zeroDecimal: false },
  { code: 'HKD', symbol: 'HK$',  label: 'HKD — Hong Kong Dollar',     zeroDecimal: false },
]

/**
 * Hardcoded prices in Stripe's smallest currency unit:
 *   - cents for most currencies (USD 299 = $2.99)
 *   - whole units for zero-decimal currencies (JPY 449 = ¥449)
 *
 * Tiers:
 *   single  — one taxi or tipping query
 *   pass    — Country Pass: all queries for one country, 24h
 *   bundle  — 10-query bundle, device-stored, 90-day expiry
 *
 * Last reviewed: March 2026
 */
export const PRICES: Record<CurrencyCode, { single: number; pass: number; bundle: number }> = {
  USD: { single: 299,  pass: 799,  bundle: 1999 },
  EUR: { single: 279,  pass: 699,  bundle: 1799 },
  GBP: { single: 249,  pass: 599,  bundle: 1599 },
  AUD: { single: 449,  pass: 1199, bundle: 2999 },
  CAD: { single: 399,  pass: 999,  bundle: 2499 },
  NZD: { single: 499,  pass: 1299, bundle: 3199 },
  SGD: { single: 399,  pass: 999,  bundle: 2499 },
  JPY: { single: 449,  pass: 1199, bundle: 2999 },
  CHF: { single: 279,  pass: 699,  bundle: 1799 },
  HKD: { single: 2399, pass: 5999, bundle: 14999 },
}

// navigator.language → CurrencyCode
const LOCALE_TO_CURRENCY: Record<string, CurrencyCode> = {
  'en-AU': 'AUD',
  'en-NZ': 'NZD',
  'en-GB': 'GBP',
  'en-CA': 'CAD',
  'en-SG': 'SGD',
  'en-HK': 'HKD',
  'de':    'EUR',
  'de-AT': 'EUR',
  'de-CH': 'CHF',
  'fr':    'EUR',
  'fr-BE': 'EUR',
  'fr-CH': 'CHF',
  'fr-CA': 'CAD',
  'it':    'EUR',
  'it-CH': 'CHF',
  'es':    'EUR',
  'nl':    'EUR',
  'pt':    'EUR',
  'sv':    'EUR',   // SEK not in list — default EUR
  'fi':    'EUR',
  'el':    'EUR',
  'ja':    'JPY',
  'zh-HK': 'HKD',
  'zh-TW': 'HKD',  // TWD not in list — HKD close enough
}

/** Detect from browser locale — does NOT use geolocation */
export function detectCurrency(): CurrencyCode {
  if (typeof navigator === 'undefined') return 'USD'
  const lang = navigator.language
  return (
    LOCALE_TO_CURRENCY[lang] ??
    LOCALE_TO_CURRENCY[lang.split('-')[0]] ??
    'USD'
  )
}

const LS_KEY = 'ff_currency'
const LS_MANUAL_KEY = 'ff_currency_manual'

/**
 * Maps Hootling app locale codes → payment currency.
 * Used when the user switches app language so we can auto-update their currency
 * (unless they've already chosen one manually).
 */
const APP_LOCALE_TO_CURRENCY: Partial<Record<string, CurrencyCode>> = {
  ja: 'JPY',
  fr: 'EUR',
  de: 'EUR',
  it: 'EUR',
  es: 'EUR',
  zh: 'HKD',  // Simplified Chinese — HK proxy
  tw: 'HKD',  // Traditional Chinese — HK proxy
}

/**
 * Infer payment currency from an app locale code (e.g. 'ja' → 'JPY').
 * Returns null when no mapping exists (caller should keep current currency).
 */
export function inferPaymentCurrencyFromLocale(locale: string): CurrencyCode | null {
  return APP_LOCALE_TO_CURRENCY[locale] ?? null
}

/** Returns true when the user has explicitly chosen a currency (vs auto-detected). */
export function isManualCurrency(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(LS_MANUAL_KEY) === 'true'
}

/**
 * Store a user-chosen currency and mark it as a manual override.
 * Dispatches a StorageEvent so other hook instances on the same tab update.
 */
export function storeManualCurrency(currency: CurrencyCode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEY, currency)
    localStorage.setItem(LS_MANUAL_KEY, 'true')
    window.dispatchEvent(new StorageEvent('storage', { key: LS_KEY, newValue: currency }))
  }
}

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD'
  const stored = localStorage.getItem(LS_KEY) as CurrencyCode | null
  if (stored && CURRENCIES.some((c) => c.code === stored)) return stored
  return detectCurrency()
}

export function storeCurrency(currency: CurrencyCode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEY, currency)
    window.dispatchEvent(new StorageEvent('storage', { key: LS_KEY, newValue: currency }))
  }
}

/**
 * Returns USD prices as formatted display strings.
 * Used in static pages (FAQ, About, SEO city/country pages) so that
 * all pricing copy updates automatically when PRICES.USD changes.
 * Server-safe — no browser APIs required.
 */
export function getUSDPrices(): { single: string; pass: string; bundle: string } {
  return {
    single: formatPrice('USD', PRICES.USD.single),  // e.g. "$1.99"
    pass:   formatPrice('USD', PRICES.USD.pass),     // e.g. "$4.99"
    bundle: formatPrice('USD', PRICES.USD.bundle),   // e.g. "$9.99"
  }
}

/**
 * Format a price from Stripe's smallest unit to display string.
 * e.g. formatPrice('AUD', 149) → "A$1.49"
 *      formatPrice('JPY', 149) → "¥149"
 */
export function formatPrice(currency: CurrencyCode, amountSmallestUnit: number): string {
  const info = CURRENCIES.find((c) => c.code === currency)
  if (!info) return `$${amountSmallestUnit}`
  if (info.zeroDecimal) {
    return `${info.symbol}${amountSmallestUnit}`
  }
  return `${info.symbol}${(amountSmallestUnit / 100).toFixed(2)}`
}
