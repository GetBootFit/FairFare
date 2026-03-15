'use client'

import { useState, useEffect, useCallback } from 'react'
import { Languages, ChevronDown, ChevronUp, Loader2, Volume2, VolumeX, Copy, Check } from 'lucide-react'
import clsx from 'clsx'
import { getStoredToken, getCountryPassToken, isTokenExpired } from '@/lib/tokens'
import { speakText, stopSpeech } from '@/lib/speech'
import { useLanguage } from '@/context/LanguageContext'

const MAX_TRANSLATIONS = 5

interface TranslationResult {
  localLanguage: string
  transliteration: string | null
  english: string
  remaining: number
  limitReached: boolean
}

interface Props {
  country: string
  langCode: string
  /** Visual accent: matches the parent feature — purple for taxi, teal for tipping */
  accent?: 'purple' | 'teal'
}

function findActiveToken(country: string): string | null {
  const single = getStoredToken()
  if (single && !isTokenExpired(single)) return single
  const pass = getCountryPassToken(country)
  if (pass && !isTokenExpired(pass)) return pass
  return null
}

export function PhraseTranslator({ country, langCode, accent = 'purple' }: Props) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error' | 'limit'>('idle')
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [remaining, setRemaining] = useState(MAX_TRANSLATIONS)
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [audioAvail, setAudioAvail] = useState(false)

  useEffect(() => {
    setAudioAvail('speechSynthesis' in window)
  }, [])

  const accentBtn = accent === 'teal'
    ? 'bg-teal-700 hover:bg-teal-600 disabled:bg-teal-900/50'
    : 'bg-purple-700 hover:bg-purple-600 disabled:bg-purple-900/50'

  const accentHover = accent === 'teal' ? 'hover:text-teal-400' : 'hover:text-purple-400'
  const accentPlaying = accent === 'teal' ? 'bg-teal-600' : 'bg-purple-600'

  const handleTranslate = useCallback(async () => {
    const phrase = input.trim()
    if (!phrase || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    const token = findActiveToken(country)
    if (!token) {
      setStatus('error')
      setErrorMsg(t('phrase_session_expired'))
      return
    }

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: phrase, country }),
      })

      const data = await res.json()

      if (res.status === 429 || data.limitReached) {
        setStatus('limit')
        setRemaining(0)
        return
      }

      if (!res.ok) {
        throw new Error(data.error ?? 'Translation failed')
      }

      const translated = data as TranslationResult
      setResult(translated)
      setRemaining(translated.remaining)
      setStatus(translated.limitReached ? 'limit' : 'done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : t('phrase_translation_failed'))
    }
  }, [input, status, country])

  const handleSpeak = useCallback(() => {
    if (!result) return
    if (playing) { stopSpeech(); setPlaying(false); return }
    setPlaying(true)
    speakText(result.localLanguage, langCode, 0.85,
      () => setPlaying(false),
      () => setPlaying(false),
    )
  }, [result, playing, langCode])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.localLanguage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }, [result])

  const isAtLimit = status === 'limit' || remaining === 0
  const showInput = !isAtLimit

  return (
    <div className="border-t border-zinc-800">
      {/* ── Toggle ── */}
      <button
        onClick={() => setExpanded(e => !e)}
        className={clsx(
          'w-full flex items-center justify-center gap-2 text-xs text-zinc-500 py-3 transition-colors',
          accentHover,
        )}
      >
        <Languages size={13} />
        {t('phrase_translate_own')}
        {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">

          {/* Rate-limit info — always visible when expanded */}
          <p className="text-xs text-zinc-600 text-center leading-snug">
            {remaining === MAX_TRANSLATIONS && status === 'idle'
              ? t('phrase_included', { count: String(MAX_TRANSLATIONS) })
              : isAtLimit
              ? t('phrase_all_used')
              : remaining === 1
              ? t('phrase_remaining_one')
              : t('phrase_remaining_many', { count: String(remaining) })
            }
          </p>

          {/* ── Input + button ── */}
          {showInput && (
            <div className="space-y-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleTranslate() }}
                placeholder={t('phrase_placeholder')}
                maxLength={200}
                disabled={status === 'loading'}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 disabled:opacity-50 transition-colors"
              />
              <button
                onClick={handleTranslate}
                disabled={!input.trim() || status === 'loading'}
                className={clsx(
                  'w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-40',
                  accentBtn,
                )}
              >
                {status === 'loading'
                  ? <><Loader2 size={14} className="animate-spin" /> {t('phrase_translating')}</>
                  : t('phrase_translate_btn')
                }
              </button>
            </div>
          )}

          {/* ── Error message ── */}
          {status === 'error' && (
            <p className="text-xs text-red-400 text-center leading-snug">{errorMsg}</p>
          )}

          {/* ── Limit reached ── */}
          {isAtLimit && (
            <p className="text-xs text-zinc-500 text-center leading-snug">
              {t('phrase_new_search')}
            </p>
          )}

          {/* ── Translation result ── */}
          {(status === 'done' || (status === 'limit' && result)) && result && (
            <div className="bg-zinc-800/60 rounded-xl px-4 py-3 space-y-0.5">
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 mb-1.5">
                <span>💬</span>
                <span className="uppercase tracking-wider">{t('phrase_your_phrase')}</span>
              </p>
              <p className="text-sm text-white font-medium">
                &ldquo;{result.localLanguage}&rdquo;
              </p>
              {result.transliteration && (
                <p className="text-xs text-zinc-400 italic mt-0.5">{result.transliteration}</p>
              )}
              <p className="text-xs text-zinc-600 mt-0.5">{result.english}</p>

              {/* Audio + Copy */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {copied
                    ? <><Check size={12} className="text-green-400" /><span className="text-green-400">{t('phrase_copied')}</span></>
                    : <><Copy size={12} />{t('phrase_copy')}</>
                  }
                </button>

                {audioAvail && (
                  <button
                    onClick={handleSpeak}
                    className={clsx(
                      'flex items-center gap-1.5 text-xs transition-colors',
                      playing
                        ? `${accentPlaying === 'bg-teal-600' ? 'text-teal-400' : 'text-purple-400'}`
                        : 'text-zinc-500 hover:text-zinc-300',
                    )}
                  >
                    {playing
                      ? <><VolumeX size={12} />{t('phrase_stop')}</>
                      : <><Volume2 size={12} />{t('phrase_listen')}</>
                    }
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
