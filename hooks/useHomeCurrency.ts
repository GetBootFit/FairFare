'use client'

import { useState, useEffect, useCallback } from 'react'
import { type HomeCurrency } from '@/lib/exchange-rates'

const LS_KEY = 'ff_home_currency'
const DEFAULT: HomeCurrency = 'USD'

/** Attempt to infer home currency from browser locale (e.g. en-AU → AUD). */
function detectCurrency(): HomeCurrency {
  if (typeof window === 'undefined') return DEFAULT
  const country = (navigator.language || '').split('-')[1]?.toUpperCase()
  const map: Record<string, HomeCurrency> = {
    GB: 'GBP', AU: 'AUD', NZ: 'AUD', CA: 'CAD', JP: 'JPY',
    DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
    BE: 'EUR', AT: 'EUR', PT: 'EUR', GR: 'EUR', IE: 'EUR', FI: 'EUR',
  }
  return map[country] ?? DEFAULT
}

/** Persists the user's chosen home currency to localStorage. Auto-detects on first visit. */
export function useHomeCurrency() {
  const [currency, setCurrencyState] = useState<HomeCurrency>(DEFAULT)

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) as HomeCurrency | null
    setCurrencyState(stored ?? detectCurrency())

    // Sync across hook instances on the same tab (via synthetic StorageEvent) and cross-tab
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY && e.newValue) {
        setCurrencyState(e.newValue as HomeCurrency)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setCurrency = useCallback((c: HomeCurrency) => {
    setCurrencyState(c)
    localStorage.setItem(LS_KEY, c)
    // Notify other hook instances on the same tab
    window.dispatchEvent(new StorageEvent('storage', { key: LS_KEY, newValue: c }))
  }, [])

  return { currency, setCurrency }
}
