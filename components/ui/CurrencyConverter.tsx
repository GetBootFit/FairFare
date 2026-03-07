'use client'

/**
 * Shared currency conversion UI used in TaxiResult and TippingResult.
 *
 * CurrencySelector  — small dropdown pill to pick the home currency
 * FareConversion    — "≈ $8–11" line below a fare range
 * ReferenceRate     — "฿100 ≈ $2.85" reference at tipping header
 */

import { useState } from 'react'
import clsx from 'clsx'
import { HOME_CURRENCIES, type HomeCurrency } from '@/lib/exchange-rates'
import { useHomeCurrency } from '@/hooks/useHomeCurrency'

// ─── Currency selector pill ────────────────────────────────────────────────────

export function CurrencySelector() {
  const { currency, setCurrency } = useHomeCurrency()
  const [open, setOpen] = useState(false)
  const current = HOME_CURRENCIES.find((c) => c.code === currency)!

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-0.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
        aria-label="Select home currency"
      >
        <span>{current.code}</span>
        <span className="text-zinc-700 text-[9px]">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-1 z-50 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl min-w-[160px]">
            {HOME_CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false) }}
                className={clsx(
                  'w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs transition-colors',
                  c.code === currency
                    ? 'text-purple-400 bg-purple-900/20 font-medium'
                    : 'text-zinc-300 hover:bg-zinc-800'
                )}
              >
                <span className="font-mono w-7">{c.code}</span>
                <span className="text-zinc-500">{c.symbol} {c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Fare range conversion (taxi) ─────────────────────────────────────────────

interface FareConversionProps {
  rates: Record<HomeCurrency, number> | null
  min: number
  max: number
  localCurrency: string
}

export function FareConversion({ rates, min, max, localCurrency }: FareConversionProps) {
  const { currency } = useHomeCurrency()

  // Skip if local IS home currency
  if (!rates || localCurrency.toUpperCase() === currency) return null

  const rate = rates[currency]
  if (!rate) return null

  const info = HOME_CURRENCIES.find((c) => c.code === currency)!
  const lo = fmt(min * rate, currency)
  const hi = fmt(max * rate, currency)

  return (
    <p className="text-sm text-zinc-500 mt-1.5">
      ≈ {info.symbol}{lo}–{info.symbol}{hi}{' '}
      <span className="text-zinc-600 text-xs">{currency}</span>
    </p>
  )
}

// ─── Reference rate (tipping header) ──────────────────────────────────────────

interface ReferenceRateProps {
  rates: Record<HomeCurrency, number> | null
  localSymbol: string
  localCurrency: string
}

export function ReferenceRate({ rates, localSymbol, localCurrency }: ReferenceRateProps) {
  const { currency } = useHomeCurrency()

  if (!rates || localCurrency.toUpperCase() === currency) return null

  const rate = rates[currency]
  if (!rate) return null

  const info = HOME_CURRENCIES.find((c) => c.code === currency)!
  const converted = fmt(100 * rate, currency)

  return (
    <p className="text-xs text-zinc-600 mt-0.5">
      {localSymbol}100 ≈ {info.symbol}{converted} {currency}
    </p>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number, currency: HomeCurrency): string {
  if (currency === 'JPY') return Math.round(amount).toLocaleString()
  if (amount >= 1000) return Math.round(amount).toLocaleString()
  if (amount >= 10) return Math.round(amount).toString()
  return amount.toFixed(2)
}
