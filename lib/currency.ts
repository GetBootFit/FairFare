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
 *   - cents for most currencies (USD 199 = $1.99)
 *   - whole units for zero-decimal currencies (JPY 299 = ¥299)
 *
 * Tiers:
 *   single  — one taxi or tipping query
 *   pass    — Country Pass: all queries for one country, 24h
 *   bundle  — 10-query bundle, device-stored, 90-day expiry
 */
export const PRICES: Record<CurrencyCode, { single: number; pass: number; bundle: number }> = {
  USD: { single: 199,  pass: 499,  bundle: 999  },
  EUR: { single: 179,  pass: 449,  bundle: 899  },
  GBP: { single: 149,  pass: 399,  bundle: 799  },
  AUD: { single: 299,  pass: 749,  bundle: 1499 },
  CAD: { single: 249,  pass: 649,  bundle: 1299 },
  NZD: { single: 319,  pass: 799,  bundle: 1599 },
  SGD: { single: 249,  pass: 649,  bundle: 1299 },
  JPY: { single: 299,  pass: 749,  bundle: 1499 },
  CHF: { single: 179,  pass: 449,  bundle: 899  },
  HKD: { single: 1499, pass: 3899, bundle: 7799 },
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

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD'
  const stored = localStorage.getItem(LS_KEY) as CurrencyCode | null
  if (stored && CURRENCIES.some((c) => c.code === stored)) return stored
  return detectCurrency()
}

export function storeCurrency(currency: CurrencyCode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEY, currency)
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
