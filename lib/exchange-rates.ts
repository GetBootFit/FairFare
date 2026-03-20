/**
 * Exchange rate fetching via the free Frankfurter API (ECB-backed, no API key).
 * Results are cached in Vercel KV for 24 h; falls back gracefully if KV unavailable.
 *
 * API docs: https://www.frankfurter.app/docs
 */

import { kvGet, kvSet } from './kv'

// The most common traveller home currencies (covers all supported app languages)
export const HOME_CURRENCIES = [
  { code: 'USD', symbol: '$',    label: 'US Dollar'     },
  { code: 'EUR', symbol: '€',    label: 'Euro'          },
  { code: 'GBP', symbol: '£',    label: 'Pound'         },
  { code: 'AUD', symbol: 'A$',   label: 'Aus Dollar'    },
  { code: 'CAD', symbol: 'C$',   label: 'Can Dollar'    },
  { code: 'JPY', symbol: '¥',    label: 'Yen'           },
  { code: 'SGD', symbol: 'S$',   label: 'Sing Dollar'   },
  { code: 'HKD', symbol: 'HK$',  label: 'HK Dollar'     },
  { code: 'KRW', symbol: '₩',    label: 'Korean Won'    },
  { code: 'INR', symbol: '₹',    label: 'Indian Rupee'  },
  { code: 'THB', symbol: '฿',    label: 'Thai Baht'     },
] as const

export type HomeCurrency = (typeof HOME_CURRENCIES)[number]['code']

const TARGETS = HOME_CURRENCIES.map((c) => c.code).join(',')

// Module-level memory cache (warm layer; survives multiple requests in same server instance)
const memCache = new Map<string, { rates: Record<HomeCurrency, number>; at: number }>()
const MEM_TTL_MS = 60 * 60 * 1000 // 1 h in memory

/**
 * Returns exchange rates FROM `fromCurrency` TO all 6 home currencies.
 * Returns null when the currency is unknown or the upstream API is unreachable.
 */
export async function getExchangeRates(
  fromCurrency: string
): Promise<Record<HomeCurrency, number> | null> {
  const from = fromCurrency.toUpperCase()

  // Memory cache hit
  const mem = memCache.get(from)
  if (mem && Date.now() - mem.at < MEM_TTL_MS) return mem.rates

  // KV cache hit
  const kvKey = `ff:fx:${from}`
  const kvCached = await kvGet<Record<HomeCurrency, number>>(kvKey)
  if (kvCached) {
    memCache.set(from, { rates: kvCached, at: Date.now() })
    return kvCached
  }

  // Fetch from Frankfurter
  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${TARGETS}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null

    const data = await res.json()
    const rates = data.rates as Record<HomeCurrency, number>

    // Persist
    memCache.set(from, { rates, at: Date.now() })
    await kvSet(kvKey, rates, 86400) // 24 h

    return rates
  } catch {
    return null
  }
}
