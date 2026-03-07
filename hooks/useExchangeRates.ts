'use client'

import { useState, useEffect } from 'react'
import { type HomeCurrency } from '@/lib/exchange-rates'

/** Fetches exchange rates from /api/exchange-rates for the given local currency. */
export function useExchangeRates(fromCurrency: string | null | undefined) {
  const [rates, setRates] = useState<Record<HomeCurrency, number> | null>(null)

  useEffect(() => {
    if (!fromCurrency) return
    let cancelled = false

    fetch(`/api/exchange-rates?from=${encodeURIComponent(fromCurrency)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.rates) setRates(data.rates)
      })
      .catch(() => {}) // silent — currency conversion is non-critical

    return () => { cancelled = true }
  }, [fromCurrency])

  return rates
}
