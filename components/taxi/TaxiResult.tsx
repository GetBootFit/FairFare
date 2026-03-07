'use client'

import type { TaxiFullResult, TransportOption } from '@/types'
import { AlertTriangle, Bus, Train, Navigation, RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { CurrencySelector, FareConversion } from '@/components/ui/CurrencyConverter'

interface Props {
  result: TaxiFullResult
  onReset: () => void
}

const transitIcon: Record<TransportOption['mode'], React.ReactNode> = {
  bus: <Bus size={18} className="text-teal-400" />,
  train: <Train size={18} className="text-teal-400" />,
  metro: <Train size={18} className="text-teal-400" />,
  tram: <Train size={18} className="text-teal-400" />,
  ferry: <Navigation size={18} className="text-teal-400" />,
}

const transitLabel: Record<TransportOption['mode'], string> = {
  bus: 'Bus',
  train: 'Train',
  metro: 'Metro',
  tram: 'Tram',
  ferry: 'Ferry',
}

export function TaxiResult({ result, onReset }: Props) {
  const { fareRange, transitOptions, scamWarnings, tipping, confirmationPhrase, distance, duration } = result
  const rates = useExchangeRates(fareRange.currency)

  return (
    <div className="space-y-3">
      {/* Distance + time */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Distance" value={`${distance.km} km`} sub={`${distance.mi} mi`} />
        <Stat label="Drive time" value={duration.text} color="text-purple-400" />
      </div>

      {/* Fare range */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Fair fare range</p>
          <CurrencySelector />
        </div>
        {fareRange.min > 0 ? (
          <>
            <p className="text-3xl font-bold text-white">
              {fareRange.currencySymbol}{fareRange.min}
              <span className="text-zinc-500 text-2xl"> – </span>
              {fareRange.currencySymbol}{fareRange.max}
            </p>
            <FareConversion rates={rates} min={fareRange.min} max={fareRange.max} localCurrency={fareRange.currency} />
            {fareRange.note && (
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{fareRange.note}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-zinc-400">{fareRange.note ?? 'Fare data not available for this city'}</p>
        )}
      </div>

      {/* Transport alternatives */}
      {transitOptions.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-4 pb-2">Alternatives</p>
          <div className="divide-y divide-zinc-800">
            {transitOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                {transitIcon[opt.mode]}
                <div className="flex-1">
                  <span className="text-sm text-white">{transitLabel[opt.mode]}</span>
                  {opt.lines.length > 0 && (
                    <span className="text-xs text-zinc-500 ml-1.5">
                      {opt.lines.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
                <span className="text-sm text-zinc-300">{opt.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scam warnings */}
      {scamWarnings.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-amber-400" />
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Watch out</p>
          </div>
          <ul className="space-y-2">
            {scamWarnings.map((w, i) => (
              <li key={i} className="text-sm text-amber-100/80 leading-snug flex gap-2">
                <span className="text-amber-600 shrink-0 mt-0.5">›</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tipping */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Tipping</p>
          <p className="text-sm text-white">{tipping.recommendation}</p>
        </div>
        <span className={clsx(
          'text-xs font-medium px-2.5 py-1 rounded-full shrink-0',
          tipping.isExpected
            ? 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
            : 'bg-zinc-800 text-zinc-400'
        )}>
          {tipping.isExpected ? 'Expected' : 'Optional'}
        </span>
      </div>

      {/* Confirmation phrase */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Say to your driver</p>
        <p className="text-base text-white font-medium leading-snug">
          &ldquo;{confirmationPhrase.localLanguage}&rdquo;
        </p>
        {confirmationPhrase.transliteration && (
          <p className="text-sm text-zinc-500 italic">{confirmationPhrase.transliteration}</p>
        )}
        <p className="text-xs text-zinc-600">{confirmationPhrase.english}</p>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 text-zinc-600 text-sm py-2 hover:text-zinc-400 transition-colors"
      >
        <RotateCcw size={14} />
        New search
      </button>
    </div>
  )
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={clsx('text-2xl font-bold', color ?? 'text-white')}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  )
}
