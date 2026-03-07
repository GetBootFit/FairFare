'use client'

import type { TippingResult, TippingScenario, ScenarioTip, TippingRating } from '@/types'
import { RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { CurrencySelector, ReferenceRate } from '@/components/ui/CurrencyConverter'

interface Props {
  result: TippingResult
  onReset: () => void
}

const SCENARIOS: { key: TippingScenario; label: string; icon: string }[] = [
  { key: 'restaurant', label: 'Restaurant', icon: '🍴' },
  { key: 'taxi', label: 'Taxi', icon: '🚕' },
  { key: 'hotel_porter', label: 'Porter', icon: '🧳' },
  { key: 'bar', label: 'Bar', icon: '🍺' },
  { key: 'tour_guide', label: 'Tour guide', icon: '🧭' },
  { key: 'delivery', label: 'Delivery', icon: '🛵' },
]

const RATING_BADGE: Record<TippingRating, { label: string; className: string }> = {
  expected:    { label: 'Expected',    className: 'bg-amber-900/40 text-amber-400 border border-amber-800/50' },
  appreciated: { label: 'Appreciated', className: 'bg-green-900/40 text-green-400 border border-green-800/50' },
  optional:    { label: 'Optional',    className: 'bg-zinc-800 text-zinc-400' },
  avoid:       { label: 'Avoid',       className: 'bg-red-900/40 text-red-400 border border-red-800/50' },
}

function tipAmount(tip: ScenarioTip, symbol: string): string {
  if (tip.typicalAmount) return tip.typicalAmount
  if (tip.percentageMin !== null && tip.percentageMax !== null) {
    return `${tip.percentageMin}–${tip.percentageMax}%`
  }
  if (tip.percentageMin !== null) return `${tip.percentageMin}%+`
  return '—'
}

export function TippingResult({ result, onReset }: Props) {
  const rates = useExchangeRates(result.currency)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{result.country}</h2>
          <p className="text-xs text-zinc-500">
            Currency: {result.currency} ({result.currencySymbol})
          </p>
          <ReferenceRate rates={rates} localSymbol={result.currencySymbol} localCurrency={result.currency} />
        </div>
        <CurrencySelector />
      </div>

      {/* Scenario grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {SCENARIOS.map(({ key, label, icon }) => {
            const tip = result.scenarios[key]
            if (!tip) return null
            const badge = RATING_BADGE[tip.rating as TippingRating]
            const amount = tipAmount(tip, result.currencySymbol)
            return (
              <div key={key} className="px-4 py-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl w-7 text-center">{icon}</span>
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-200">{amount}</span>
                    <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', badge.className)}>
                      {badge.label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed pl-[38px]">{tip.notes}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 text-zinc-600 text-sm py-2 hover:text-zinc-400 transition-colors"
      >
        <RotateCcw size={14} />
        Check another country
      </button>
    </div>
  )
}
