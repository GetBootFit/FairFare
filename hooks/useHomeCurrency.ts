'use client'

import { useState, useEffect, useCallback } from 'react'
import { type HomeCurrency, HOME_CURRENCIES } from '@/lib/exchange-rates'

const LS_KEY = 'ff_home_currency'
const LS_MANUAL_KEY = 'ff_home_currency_manual'
const LS_LANG_KEY = 'ff_lang'
const DEFAULT: HomeCurrency = 'USD'

const VALID_CODES = new Set(HOME_CURRENCIES.map((c) => c.code))

function isValidHomeCurrency(code: string | null): code is HomeCurrency {
  return !!code && VALID_CODES.has(code as HomeCurrency)
}

/**
 * Maps both browser locale country codes AND Hootling app locale codes
 * to a home display currency.
 *
 * Browser locale country codes (from navigator.language, e.g. "en-AU" → "AU"):
 *   Used on first visit to auto-detect.
 *
 * App locale codes (from ff_lang, e.g. "ja", "ko", "th"):
 *   Used when the user switches language, to show fares in a relevant currency.
 */
const LOCALE_TO_HOME: Record<string, HomeCurrency> = {
  // Browser country codes
  GB: 'GBP', AU: 'AUD', NZ: 'AUD', CA: 'CAD', JP: 'JPY',
  SG: 'SGD', HK: 'HKD', KR: 'KRW', IN: 'INR', TH: 'THB',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  BE: 'EUR', AT: 'EUR', PT: 'EUR', GR: 'EUR', IE: 'EUR', FI: 'EUR',
  // App locale codes (15 Hootling languages)
  ar: 'USD',   // Arabic spans many countries; USD is the safest universal default
  ja: 'JPY',
  ko: 'KRW',
  th: 'THB',
  zh: 'HKD',   // Simplified Chinese
  tw: 'HKD',   // Traditional Chinese
  id: 'USD',   // IDR not in HOME_CURRENCIES — USD is the closest proxy
  vi: 'USD',   // VND not in HOME_CURRENCIES — USD is the closest proxy
  hi: 'INR',
  fr: 'EUR',
  de: 'EUR',
  it: 'EUR',
  es: 'EUR',
  pt: 'USD',   // BRL not in HOME_CURRENCIES
}

/** Detect home display currency from browser locale (e.g. en-AU → AUD). */
function detectFromBrowserLocale(): HomeCurrency {
  if (typeof window === 'undefined') return DEFAULT
  const country = (navigator.language || '').split('-')[1]?.toUpperCase()
  return (country && isValidHomeCurrency(LOCALE_TO_HOME[country]))
    ? LOCALE_TO_HOME[country] as HomeCurrency
    : DEFAULT
}

/** Infer home currency from app locale code. Returns null when no mapping. */
function inferFromAppLocale(locale: string): HomeCurrency | null {
  const inferred = LOCALE_TO_HOME[locale]
  return (inferred && isValidHomeCurrency(inferred)) ? inferred : null
}

/** Persists the user's chosen home currency to localStorage. Auto-detects on first visit. */
export function useHomeCurrency() {
  const [currency, setCurrencyState] = useState<HomeCurrency>(DEFAULT)

  useEffect(() => {
    // Initial hydration: prefer stored value, fallback to browser locale
    const stored = localStorage.getItem(LS_KEY)
    setCurrencyState(isValidHomeCurrency(stored) ? stored : detectFromBrowserLocale())

    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) {
        // Explicit home currency change (from setCurrency below or cross-tab)
        if (isValidHomeCurrency(e.newValue)) {
          setCurrencyState(e.newValue)
        }
        return
      }

      if (e.key === LS_LANG_KEY && e.newValue) {
        // App language changed — update home currency if not manually overridden
        const isManual = localStorage.getItem(LS_MANUAL_KEY) === 'true'
        if (!isManual) {
          const inferred = inferFromAppLocale(e.newValue)
          if (inferred) {
            setCurrencyState(inferred)
            localStorage.setItem(LS_KEY, inferred)
          }
        }
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /** Set the home display currency and mark it as a manual override. */
  const setCurrency = useCallback((c: HomeCurrency) => {
    setCurrencyState(c)
    localStorage.setItem(LS_KEY, c)
    localStorage.setItem(LS_MANUAL_KEY, 'true')
    // Notify other hook instances on the same tab
    window.dispatchEvent(new StorageEvent('storage', { key: LS_KEY, newValue: c }))
  }, [])

  return { currency, setCurrency }
}
