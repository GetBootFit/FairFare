'use client'

import type { TippingResult, TippingScenario, ScenarioTip, TippingRating } from '@/types'
import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Volume2, VolumeX, Copy, Check, Maximize2 } from 'lucide-react'

function SvgIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <img
      src={`/icons/SVG/${name}.svg`}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  )
}
import clsx from 'clsx'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { CurrencySelector, ReferenceRate } from '@/components/ui/CurrencyConverter'
import { getLangCode, speakText, stopSpeech } from '@/lib/speech'
import { ShowPhraseModal } from '@/components/ui/ShowPhraseModal'
import { PhraseTranslator } from '@/components/ui/PhraseTranslator'

interface Props {
  result: TippingResult
  onReset?: () => void
}

const SCENARIOS: { key: TippingScenario; label: string; icon: string; svgName?: string }[] = [
  { key: 'restaurant',   label: 'Restaurant', icon: '🍴', svgName: 'restaurant'  },
  { key: 'taxi',         label: 'Taxi',        icon: '🚕', svgName: 'taxi-car'    },
  { key: 'hotel_porter', label: 'Porter',      icon: '🧳', svgName: 'conceirge'  },
  { key: 'bar',          label: 'Bar',         icon: '🍺', svgName: 'beer'        },
  { key: 'tour_guide',   label: 'Tour guide',  icon: '🧭', svgName: 'person'     },
  { key: 'delivery',     label: 'Delivery',    icon: '🛵'                        },
]

const RATING_BADGE: Record<TippingRating, { label: string; className: string }> = {
  expected:    { label: 'Expected',    className: 'bg-amber-900/40 text-amber-400 border border-amber-800/50' },
  appreciated: { label: 'Appreciated', className: 'bg-green-900/40 text-green-400 border border-green-800/50' },
  optional:    { label: 'Optional',    className: 'bg-zinc-800 text-zinc-400' },
  avoid:       { label: 'Avoid',       className: 'bg-red-900/40 text-red-400 border border-red-800/50' },
}

const PHRASE_EMOJI: Record<string, string> = {
  'thank you': '🙏',
  'this was wonderful': '😊',
  'compliments to the chef': '👨‍🍳',
  'keep the change': '🪙',
  'you were wonderful': '⭐',
}

function tipAmount(tip: ScenarioTip): string {
  if (tip.typicalAmount) return tip.typicalAmount
  if (tip.percentageMin !== null && tip.percentageMax !== null) {
    return `${tip.percentageMin}–${tip.percentageMax}%`
  }
  if (tip.percentageMin !== null) return `${tip.percentageMin}%+`
  return '—'
}

export function TippingResult({ result, onReset }: Props) {
  const rates = useExchangeRates(result.currency)
  const langCode = getLangCode(result.country)
  const phrases = result.servicePhrases ?? []

  // ── UI state ──────────────────────────────────────────────────────────────
  const [audioAvail, setAudioAvail] = useState(false)
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [showPhraseIdx, setShowPhraseIdx] = useState<number | null>(null)

  useEffect(() => {
    setAudioAvail('speechSynthesis' in window)
  }, [])

  // ── Audio ─────────────────────────────────────────────────────────────────
  const handleSpeak = useCallback((text: string, idx: number) => {
    if (playingIdx === idx) {
      stopSpeech()
      setPlayingIdx(null)
      return
    }
    setPlayingIdx(idx)
    speakText(text, langCode, 0.85,
      () => setPlayingIdx(null),
      () => setPlayingIdx(null),
    )
  }, [playingIdx, langCode])

  // ── Copy ──────────────────────────────────────────────────────────────────
  const handleCopy = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch { /* clipboard unavailable */ }
  }, [])

  return (
    <>
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
            {SCENARIOS.map(({ key, label, icon, svgName }) => {
              const tip = result.scenarios[key]
              if (!tip) return null
              const badge = RATING_BADGE[tip.rating as TippingRating]
              const amount = tipAmount(tip)
              return (
                <div key={key} className="px-4 py-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {svgName
                        ? <div className="w-7 flex items-center justify-center shrink-0">
                            <SvgIcon name={svgName} size={28} />
                          </div>
                        : <span className="text-xl w-7 text-center shrink-0">{icon}</span>
                      }
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

        {/* Service phrases */}
        {phrases.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-4 pb-2">Say it in the local language</p>
            <div className="divide-y divide-zinc-800">
              {phrases.map((phrase, i) => {
                const emoji = PHRASE_EMOJI[phrase.context.toLowerCase()] ?? '💬'
                const isPlaying = playingIdx === i
                const isCopied = copiedIdx === i
                return (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-500 flex items-center gap-1.5 mb-1">
                          <span>{emoji}</span>
                          <span className="uppercase tracking-wider">{phrase.context}</span>
                        </p>
                        <p className="text-sm text-white font-medium">&ldquo;{phrase.localLanguage}&rdquo;</p>
                        {phrase.transliteration && (
                          <p className="text-xs text-zinc-400 italic mt-0.5">{phrase.transliteration}</p>
                        )}
                        <p className="text-xs text-zinc-600 mt-0.5">{phrase.english}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 mt-1">
                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(phrase.localLanguage, i)}
                          className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                          title="Copy phrase"
                        >
                          {isCopied
                            ? <Check size={14} className="text-green-400" />
                            : <Copy size={14} className="text-zinc-400" />
                          }
                        </button>

                        {/* Speak */}
                        {audioAvail && (
                          <button
                            onClick={() => handleSpeak(phrase.localLanguage, i)}
                            className={clsx(
                              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                              isPlaying
                                ? 'bg-teal-600 animate-pulse'
                                : 'bg-zinc-800 hover:bg-zinc-700'
                            )}
                            title={isPlaying ? 'Stop' : 'Listen'}
                          >
                            {isPlaying
                              ? <VolumeX size={14} className="text-white" />
                              : <Volume2 size={14} className="text-zinc-400" />
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Show to server/guide button */}
            <button
              onClick={() => setShowPhraseIdx(0)}
              className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-teal-400 transition-colors py-3 border-t border-zinc-800"
            >
              <Maximize2 size={13} />
              Show to your server or guide
            </button>

            {/* Custom phrase translator */}
            <PhraseTranslator
              country={result.country}
              langCode={langCode}
              accent="teal"
            />
          </div>
        )}

        {/* Reset */}
        {onReset && (
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 text-zinc-600 text-sm py-2 hover:text-zinc-400 transition-colors"
          >
            <RotateCcw size={14} />
            Check another country
          </button>
        )}
      </div>

      {/* Fullscreen modal */}
      {showPhraseIdx !== null && phrases.length > 0 && (
        <ShowPhraseModal
          phrases={phrases}
          initialIdx={showPhraseIdx}
          langCode={langCode}
          title="Show to your server or guide"
          onClose={() => {
            stopSpeech()
            setShowPhraseIdx(null)
          }}
        />
      )}
    </>
  )
}
