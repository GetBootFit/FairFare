'use client'

/**
 * TipCalculator — inline tip calculator attached to a tipping scenario.
 *
 * User enters their bill amount; service quality toggle (Poor / Standard / Good /
 * Excellent) adjusts the pre-filled tip % up or down from the Claude-recommended
 * baseline. Shows tip + total in local currency and optionally in the user's
 * chosen home currency via live exchange rates.
 */

import { useState, useId } from 'react'
import { HOME_CURRENCIES, type HomeCurrency } from '@/lib/exchange-rates'
import { useHomeCurrency } from '@/hooks/useHomeCurrency'

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceLevel = 'poor' | 'standard' | 'good' | 'excellent'

export interface TipCalculatorProps {
  /** The tipping scenario key — used to pick the right bill placeholder label. */
  scenarioKey: string
  /** Claude-recommended minimum tip % (used as the "Standard" anchor). */
  percentageMin: number
  /** Claude-recommended maximum tip % — used as the "Good" level. Null → +5 above min. */
  percentageMax: number | null
  /** ISO 4217 currency code for the local currency (e.g. "ARS"). */
  localCurrency: string
  /** Currency symbol for display (e.g. "$"). */
  localSymbol: string
  /** Exchange rates FROM localCurrency TO all home currencies, or null if unavailable. */
  rates: Record<HomeCurrency, number> | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<ServiceLevel, string> = {
  poor:      'Poor',
  standard:  'Standard',
  good:      'Good',
  excellent: 'Excellent',
}

/** Human-readable placeholder for the bill input, per scenario. */
const BILL_PLACEHOLDER: Record<string, string> = {
  restaurant: 'Bill amount',
  bar:        'Tab amount',
  taxi:       'Fare amount',
  tour_guide: 'Tour cost',
  delivery:   'Order total',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a local-currency amount — no decimals for large amounts, 2dp for small. */
function fmtLocal(amount: number): string {
  if (amount >= 1000) return Math.round(amount).toLocaleString()
  if (amount >= 10)   return Math.round(amount).toString()
  return amount.toFixed(2)
}

/** Format a home-currency converted amount. */
function fmtHome(amount: number, currency: HomeCurrency): string {
  if (currency === 'JPY' || currency === 'KRW') return Math.round(amount).toLocaleString()
  if (amount >= 1000) return Math.round(amount).toLocaleString()
  if (amount >= 10)   return Math.round(amount).toString()
  return amount.toFixed(2)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TipCalculator({
  scenarioKey,
  percentageMin,
  percentageMax,
  localCurrency,
  localSymbol,
  rates,
}: TipCalculatorProps) {
  const inputId = useId()
  const { currency } = useHomeCurrency()

  const [bill, setBill] = useState('')
  const [level, setLevel] = useState<ServiceLevel>('standard')

  // ── Compute % for each service level ────────────────────────────────────────
  // Standard = Claude's percentageMin (the baseline recommendation).
  // Good     = percentageMax when set, otherwise Standard + 5.
  // Each step is ±5 percentage points from the adjacent level.
  const good      = percentageMax !== null ? percentageMax : percentageMin + 5
  const excellent = percentageMax !== null ? percentageMax + 5 : percentageMin + 10
  const poor      = Math.max(0, percentageMin - 5)

  const pcts: Record<ServiceLevel, number> = { poor, standard: percentageMin, good, excellent }
  const tipPct = pcts[level]

  // ── Bill calculation ─────────────────────────────────────────────────────────
  // Strip commas so users can paste formatted numbers (e.g. "15,000")
  const billNum  = parseFloat(bill.replace(/,/g, '')) || 0
  const tipAmt   = billNum * tipPct / 100
  const totalAmt = billNum + tipAmt

  // ── Home currency conversion ─────────────────────────────────────────────────
  const homeInfo = HOME_CURRENCIES.find((c) => c.code === currency)
  const rate     = rates?.[currency as HomeCurrency]
  const showHome = !!(homeInfo && rate && localCurrency.toUpperCase() !== currency)

  const placeholder = BILL_PLACEHOLDER[scenarioKey] ?? 'Amount'

  return (
    <div className="mt-2.5 space-y-2.5 pl-[38px] rtl:pl-0 rtl:pr-[38px]">

      {/* ── Bill input ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">{placeholder} in {localCurrency}</label>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          className="flex-1 min-w-0 rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 text-sm focus:border-zinc-600 focus:outline-none transition-colors"
        />
        <span className="text-xs text-zinc-500 shrink-0 font-mono">{localCurrency}</span>
      </div>

      {/* ── Service quality toggle ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-1">
        {(['poor', 'standard', 'good', 'excellent'] as ServiceLevel[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLevel(l)}
            aria-pressed={level === l}
            className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-colors border ${
              level === l
                ? 'border-teal-600 bg-teal-900/30 text-teal-200'
                : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
            }`}
          >
            <span className="font-medium leading-tight">{LEVEL_LABELS[l]}</span>
            <span className={`text-[10px] mt-0.5 tabular-nums ${level === l ? 'text-teal-400/80' : 'text-zinc-600'}`}>
              {pcts[l]}%
            </span>
          </button>
        ))}
      </div>

      {/* ── Result ─────────────────────────────────────────────────────────── */}
      {billNum > 0 && (
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 space-y-2">
          {/* Tip line */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-zinc-500 shrink-0">Tip ({tipPct}%)</span>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-sm font-semibold text-white tabular-nums">
                {localSymbol}{fmtLocal(tipAmt)}
              </span>
              {showHome && (
                <span className="text-xs text-zinc-500 tabular-nums whitespace-nowrap">
                  ≈&nbsp;{homeInfo!.symbol}{fmtHome(tipAmt * rate!, currency as HomeCurrency)}&nbsp;{currency}
                </span>
              )}
            </div>
          </div>

          {/* Total line */}
          <div className="flex items-baseline justify-between gap-2 border-t border-zinc-700/40 pt-2">
            <span className="text-xs text-zinc-500 shrink-0">Total</span>
            <span className="text-sm text-zinc-300 tabular-nums font-medium">
              {localSymbol}{fmtLocal(totalAmt)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
