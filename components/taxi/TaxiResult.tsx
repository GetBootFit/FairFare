'use client'

import type { TaxiFullResult, TransportOption } from '@/types'
import { useState, useEffect, useCallback } from 'react'
import {
  AlertTriangle, Navigation, RotateCcw,
  Volume2, VolumeX, Copy, Check, Maximize2, Share2, Moon,
  Map, ChevronDown, ChevronUp, ChevronRight, Phone, ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { CurrencySelector, FareConversion } from '@/components/ui/CurrencyConverter'
import { useHomeCurrency } from '@/hooks/useHomeCurrency'
import { getLangCode, speakText, stopSpeech } from '@/lib/speech'
import { ShowPhraseModal } from '@/components/ui/ShowPhraseModal'
import { PhraseTranslator } from '@/components/ui/PhraseTranslator'
import { getEmergencyNumbers } from '@/lib/emergency-contacts'
import { getDrivingInfo, toMph, toKmh } from '@/lib/driving-info'
import { getRideShareApps } from '@/lib/rideshare'
import { AffiliateLinks } from '@/components/AffiliateLinks'
import { track } from '@vercel/analytics'
import { useLanguage } from '@/context/LanguageContext'
import type { TranslationKey } from '@/lib/i18n'

// ── Custom SVG icon helper ────────────────────────────────────────────────────
// The icon set has two native colour families:
//   • TEAL  (#2dd4bf→#0d9488, hue≈174°) — transport/route icons (distance, train, drive-*, speed, etc.)
//   • PURPLE (#9333ea→#7e22ce, hue≈272°) — money/service icons (taxi-car, money-*, etc.)
//   • AMBER  (#fbbf24)                   — emergency icons (leave as-is for warning semantics)
// On the Taxi Result page all icons should appear teal+white.
// Teal-native icons already are teal — no filter needed.
// Purple-native icons need hue-rotate(262deg) to shift 272°→174° (teal) while white stays white.
// (White is achromatic: zero saturation, so hue-rotate has no effect on it.)
const TEAL_FILTER = 'hue-rotate(262deg) saturate(88%)'
const PURPLE_NATIVE = new Set(['taxi-car', 'money-cash', 'money-notes', 'money-exchange'])

function SvgIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <img
      src={`/icons/SVG/${name}.svg`}
      alt=""
      width={size}
      height={size}
      className={className}
      style={PURPLE_NATIVE.has(name) ? { filter: TEAL_FILTER } : undefined}
      aria-hidden="true"
    />
  )
}

interface Props {
  result: TaxiFullResult
  onReset?: () => void
}

const PHRASE_EMOJI: Record<string, string> = {
  greeting: '👋',
  meter: '🚕',
  'thank you': '🙏',
  thanks: '🙏',
  goodbye: '✌️',
  farewell: '✌️',
}

const transitIcon: Record<TransportOption['mode'], React.ReactNode> = {
  bus:   <SvgIcon name="transport-bus"   size={26} />,
  train: <SvgIcon name="transport-train" size={26} />,
  metro: <SvgIcon name="transport-train" size={26} />,
  tram:  <SvgIcon name="transport-train" size={26} />,
  ferry: <Navigation size={18} className="text-teal-400" />,
}

const transitLabelKey: Record<TransportOption['mode'], TranslationKey> = {
  bus: 'transit_bus', train: 'transit_train', metro: 'transit_metro', tram: 'transit_tram', ferry: 'transit_ferry',
}

export function TaxiResult({ result, onReset }: Props) {
  const { t } = useLanguage()
  const { fareRange, transitOptions, scamWarnings, distance, duration } = result
  const rates = useExchangeRates(fareRange.currency)
  const { currency: homeCurrency } = useHomeCurrency()
  const langCode = getLangCode(result.country)
  const emergency  = getEmergencyNumbers(result.country)
  const driving    = getDrivingInfo(result.country)
  const rideshare  = getRideShareApps(result.city, result.country)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [audioAvail, setAudioAvail] = useState(false)
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [shareCopied, setShareCopied] = useState(false)
  const [showDriverIdx, setShowDriverIdx] = useState<number | null>(null)
  const [isNight, setIsNight] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [showDriving,   setShowDriving]   = useState(false)

  useEffect(() => {
    setAudioAvail('speechSynthesis' in window)
    const h = new Date().getHours()
    setIsNight(h >= 22 || h < 6)
  }, [])

  // ── Audio ─────────────────────────────────────────────────────────────────
  const handleSpeak = useCallback((text: string, idx: number) => {
    if (playingIdx === idx) {
      stopSpeech()
      setPlayingIdx(null)
      return
    }
    setPlayingIdx(idx)
    speakText(
      text, langCode, 0.85,
      () => setPlayingIdx(null),
      () => setPlayingIdx(null),
    )
  }, [playingIdx, langCode])

  // ── Copy phrase ───────────────────────────────────────────────────────────
  const handleCopy = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch { /* clipboard unavailable */ }
  }, [])

  // ── Share result ──────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    // Build fare line — include home currency conversion when available
    let fareLine: string
    if (fareRange.min > 0) {
      fareLine = `💰 Fare estimate: ${fareRange.currencySymbol}${fareRange.min}–${fareRange.max}`
      const isLocalCurrency = fareRange.currency?.toUpperCase() === homeCurrency
      if (!isLocalCurrency && rates) {
        const rate = rates[homeCurrency]
        if (rate) {
          const lo = Math.round(fareRange.min * rate)
          const hi = Math.round(fareRange.max * rate)
          fareLine += ` (≈ ${homeCurrency} ${lo}–${hi})`
        }
      }
    } else {
      fareLine = '💰 Fare: Verify with driver'
    }

    const lines = [
      `Hootling — ${result.city}, ${result.country}`,
      `${result.pickup} → ${result.destination}`,
      '',
      fareLine,
      `⏱️ ${duration.text}  ·  📏 ${distance.km} km`,
      '',
      ...( scamWarnings.length ? [
        '⚠️ Watch out:',
        ...scamWarnings.map(w => `• ${w}`),
        '',
      ] : []),
      'Checked with Hootling — hootling.com',
    ].join('\n')

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Hootling fare result', text: lines })
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(lines)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2500)
      } catch { /* clipboard unavailable */ }
    }
  }, [result, fareRange, duration, distance, scamWarnings, rates, homeCurrency])

  return (
    <>
      <div className="space-y-3">

        {/* Distance + time */}
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t('result_distance')} value={`${distance.km} km`} sub={`${distance.mi} mi`} icon="distance" />
          <Stat label={t('result_drive_time')} value={duration.text} color="text-teal-400" icon="time-duration" />
        </div>

        {/* Night rate warning */}
        {isNight && fareRange.min > 0 && (
          <div className="flex items-start gap-2.5 bg-blue-950/40 border border-blue-900/50 rounded-xl px-3.5 py-2.5">
            <Moon size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300 leading-snug">
              {t('result_night_rates')}
            </p>
          </div>
        )}

        {/* Fare range */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <SvgIcon name="money-cash" size={22} />
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('result_estimated_fare')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Share result"
              >
                {shareCopied ? (
                  <><Check size={13} className="text-green-400" /><span className="text-green-400">{t('result_share_copied')}</span></>
                ) : (
                  <><Share2 size={13} /><span>{t('result_share')}</span></>
                )}
              </button>
              <div className="flex items-center gap-1">
                <SvgIcon name="money-exchange" size={15} className="opacity-60" />
                <CurrencySelector />
              </div>
            </div>
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
            <p className="text-sm text-zinc-400">{fareRange.note ?? t('result_fare_unavailable')}</p>
          )}
        </div>

        {/* Route map */}
        {result.routeMapUrl && (
          <div className="bg-zinc-900 border border-zinc-800 hover:border-teal-800/60 rounded-2xl overflow-hidden transition-colors">
            <button
              onClick={() => {
                const next = !showMap
                setShowMap(next)
                if (next) track('map_viewed', { city: result.city, country: result.country })
              }}
              className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-teal-400 transition-colors py-3"
            >
              <Map size={13} />
              <span>{showMap ? t('result_hide_map') : t('result_view_map')}</span>
              {showMap ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            {showMap && (
              mapError ? (
                <div className="flex items-center justify-center py-8 text-zinc-600 text-xs">
                  Map unavailable — check that Maps Static API is enabled
                </div>
              ) : (
                <img
                  src={result.routeMapUrl}
                  alt={`Route from ${result.pickup} to ${result.destination}`}
                  className="w-full block aspect-[2/1] object-cover"
                  loading="lazy"
                  onError={() => setMapError(true)}
                />
              )
            )}
          </div>
        )}

        {/* Transport alternatives + ride-sharing */}
        {(transitOptions.length > 0 || rideshare.length > 0) && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-4 pb-2">{t('result_alternatives')}</p>

            {/* Google Maps transit options */}
            {transitOptions.length > 0 && (
              <div className="divide-y divide-zinc-800 border-t border-zinc-800">
                {transitOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 flex items-center justify-center shrink-0">
                      {transitIcon[opt.mode]}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-white">{t(transitLabelKey[opt.mode])}</span>
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
            )}

            {/* Ride-sharing apps */}
            {rideshare.length > 0 && (
              <div className="border-t border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <SvgIcon name="car" size={18} />
                  <p className="text-xs text-zinc-600 uppercase tracking-wider">{t('result_ridesharing')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rideshare.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-teal-900/40 border border-zinc-700 hover:border-teal-700/60 text-sm text-zinc-200 hover:text-teal-300 transition-colors"
                    >
                      {app.name}
                      {app.affiliate && (
                        <span className="text-zinc-600 text-[10px] leading-none">*</span>
                      )}
                      <ExternalLink size={11} className="text-zinc-600 shrink-0" />
                    </a>
                  ))}
                </div>
                {rideshare.some(a => a.affiliate) && (
                  <p className="text-[10px] text-zinc-700 mt-2">{t('result_rideshare_affiliate')}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Scam warnings */}
        {scamWarnings.length > 0 && (
          <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-amber-400" />
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{t('result_watch_out')}</p>
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

        {/* Tipping guide CTA — replaces the old inline tipping card */}
        <Link
          href={`/tipping/${result.country.toLowerCase().replace(/\s+/g, '-')}`}
          className="flex items-center gap-3.5 bg-zinc-900 border border-zinc-800 hover:border-teal-800/60 rounded-2xl px-4 py-3.5 transition-colors group"
        >
          <SvgIcon name="money-notes" size={30} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">{t('result_tipping_guide')}</p>
            <p className="text-sm text-white group-hover:text-teal-300 transition-colors">
              {t('result_how_much_tip').replace('{country}', result.country)}
            </p>
          </div>
          <ChevronRight size={14} className="text-zinc-600 group-hover:text-teal-400 transition-colors shrink-0" />
        </Link>

        {/* Driver phrases */}
        {result.driverPhrases?.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-4 pb-2">{t('result_say_to_driver')}</p>
            <div className="divide-y divide-zinc-800">
              {result.driverPhrases.map((phrase, i) => {
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
                          aria-label={isCopied ? 'Copied to clipboard' : `Copy "${phrase.english}" phrase`}
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
                            aria-label={isPlaying ? `Stop speaking "${phrase.english}"` : `Listen to "${phrase.english}"`}
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

            {/* Show Driver button */}
            <button
              onClick={() => setShowDriverIdx(0)}
              className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-purple-400 transition-colors py-3 border-t border-zinc-800"
            >
              <Maximize2 size={13} />
              {t('result_show_to_driver')}
            </button>

            {/* Custom phrase translator */}
            <PhraseTranslator
              country={result.country}
              langCode={langCode}
              accent="purple"
            />
          </div>
        )}

        {/* Emergency numbers — collapsed by default, subtle */}
        {emergency && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowEmergency(e => !e)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2.5">
                <Phone size={13} className="text-zinc-600" />
                <span className="text-xs text-zinc-500">{t('result_emergency')} · {result.country}</span>
              </div>
              {showEmergency
                ? <ChevronUp size={13} className="text-zinc-600" />
                : <ChevronDown size={13} className="text-zinc-600" />
              }
            </button>
            {showEmergency && (
              <div className="grid grid-cols-3 divide-x divide-zinc-800 border-t border-zinc-800">
                <EmergencyItem icon="telephone-emergency" label={t('emergency_ambulance')} number={emergency.ambulance} />
                <EmergencyItem icon="telephone-fire" label={t('emergency_fire')} number={emergency.fire} />
                <EmergencyItem icon="telephone-police" label={t('emergency_police')} number={emergency.police} />
              </div>
            )}
          </div>
        )}

        {/* Driving info */}
        {driving && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowDriving(d => !d)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2.5">
                <SvgIcon name="transport-speed-limit" size={14} />
                <span className="text-xs text-zinc-500">{t('result_driving_info')} · {result.country}</span>
              </div>
              {showDriving
                ? <ChevronUp size={13} className="text-zinc-600" />
                : <ChevronDown size={13} className="text-zinc-600" />
              }
            </button>

            {showDriving && (
              <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-4">

                {/* Drive side + speed unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800/50 rounded-xl p-3 flex items-center gap-3">
                    <SvgIcon name={driving.side === 'left' ? 'drive-left' : 'drive-right'} size={32} />
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">{t('driving_drive_on')}</p>
                      <p className="text-sm font-semibold text-white uppercase tracking-wide">
                        {driving.side}
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-3 flex items-center gap-3">
                    <SvgIcon name={driving.unit === 'km/h' ? 'transport-kmh' : 'transport-mph'} size={32} />
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">{t('driving_speed_in')}</p>
                      <p className="text-sm font-semibold text-white">{driving.unit}</p>
                    </div>
                  </div>
                </div>

                {/* Speed limits table */}
                <div>
                  <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">{t('driving_speed_limits')}</p>
                  <div className="space-y-1.5">
                    <SpeedRow
                      label={t('driving_urban')}
                      value={driving.limits.urban}
                      unit={driving.unit}
                    />
                    <SpeedRow
                      label={t('driving_open_road')}
                      value={driving.limits.openRoad}
                      unit={driving.unit}
                    />
                    {driving.limits.motorway !== null && (
                      <SpeedRow
                        label={driving.unit === 'mph' ? t('driving_motorway') : t('driving_expressway')}
                        value={driving.limits.motorway}
                        unit={driving.unit}
                        note={driving.limits.motorwayNote}
                      />
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Affiliate links */}
        <AffiliateLinks city={result.city} country={result.country} tint="teal" />

        {/* Reset */}
        {onReset && (
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 text-zinc-600 text-sm py-2 hover:text-zinc-400 transition-colors"
          >
            <RotateCcw size={14} />
            {t('result_new_search')}
          </button>
        )}
      </div>

      {/* Show Driver fullscreen modal */}
      {showDriverIdx !== null && result.driverPhrases && (
        <ShowPhraseModal
          phrases={result.driverPhrases}
          initialIdx={showDriverIdx}
          langCode={langCode}
          title={t('result_show_to_driver')}
          onClose={() => {
            stopSpeech()
            setShowDriverIdx(null)
          }}
        />
      )}
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Stat({ label, value, sub, color, icon }: {
  label: string
  value: string
  sub?: string
  color?: string
  icon?: string
}) {
  return (
    <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4 text-center">
      {icon && (
        <div className="flex justify-center mb-2">
          <SvgIcon name={icon} size={28} />
        </div>
      )}
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={clsx('text-2xl font-bold', color ?? 'text-white')}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  )
}

function EmergencyItem({ icon, label, number }: { icon: string; label: string; number: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-3 px-2">
      <SvgIcon name={icon} size={26} />
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-bold text-white tracking-wide">{number}</span>
    </div>
  )
}

function SpeedRow({ label, value, unit, note }: {
  label: string
  value: number
  unit: 'km/h' | 'mph'
  note?: string
}) {
  // Always show both units — local sign value prominent, conversion secondary
  const localStr  = `${value} ${unit}`
  const otherStr  = unit === 'km/h'
    ? `${toMph(value)} mph`
    : `${toKmh(value)} km/h`

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60 last:border-0">
      <span className="text-xs text-zinc-500">{label}</span>
      <div className="flex items-center gap-2 text-right">
        <span className="text-sm font-semibold text-white">{localStr}</span>
        <span className="text-xs text-zinc-600">· {otherStr}</span>
        {note && <span className="text-xs text-zinc-700 italic">({note})</span>}
      </div>
    </div>
  )
}
