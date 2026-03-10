'use client'

import { useState, useEffect } from 'react'
import { Volume2, VolumeX, ChevronLeft, ChevronRight, X } from 'lucide-react'
import clsx from 'clsx'
import { speakText, stopSpeech } from '@/lib/speech'

export interface ServicePhrase {
  context: string
  localLanguage: string
  transliteration: string | null
  english: string
}

interface Props {
  phrases: ServicePhrase[]
  initialIdx: number
  langCode: string
  title?: string
  onClose: () => void
}

export function ShowPhraseModal({
  phrases,
  initialIdx,
  langCode,
  title = 'Show to your driver',
  onClose,
}: Props) {
  const [idx, setIdx] = useState(initialIdx)
  const [playing, setPlaying] = useState(false)
  const [audioAvail, setAudioAvail] = useState(false)
  const phrase = phrases[idx]

  useEffect(() => {
    setAudioAvail('speechSynthesis' in window)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Stop speech when phrase changes
  useEffect(() => {
    stopSpeech()
    setPlaying(false)
  }, [idx])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setIdx(i => Math.min(phrases.length - 1, i + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, phrases.length])

  const handleSpeak = () => {
    if (playing) {
      stopSpeech()
      setPlaying(false)
      return
    }
    setPlaying(true)
    speakText(
      phrase.localLanguage, langCode, 0.75,
      () => setPlaying(false),
      () => setPlaying(false),
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 select-none">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors"
      >
        <X size={20} className="text-white" />
      </button>

      {/* Label */}
      <p className="text-zinc-600 text-xs uppercase tracking-widest mb-10">{title}</p>

      {/* Local language — big */}
      <p className="text-5xl sm:text-6xl font-bold text-white text-center leading-tight mb-5 px-4">
        {phrase.localLanguage}
      </p>

      {/* Transliteration */}
      {phrase.transliteration && (
        <p className="text-xl text-zinc-400 italic text-center mb-2">
          {phrase.transliteration}
        </p>
      )}

      {/* English */}
      <p className="text-sm text-zinc-600 text-center mb-12">{phrase.english}</p>

      {/* Speak button */}
      {audioAvail && (
        <button
          onClick={handleSpeak}
          className={clsx(
            'w-20 h-20 rounded-full flex items-center justify-center mb-10 transition-all',
            playing
              ? 'bg-purple-600 scale-110'
              : 'bg-purple-900/50 hover:bg-purple-900/70 hover:scale-105',
          )}
        >
          {playing
            ? <VolumeX size={32} className="text-white" />
            : <Volume2 size={32} className="text-white" />
          }
        </button>
      )}

      {/* Navigation dots + arrows */}
      {phrases.length > 1 && (
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="w-12 h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center disabled:opacity-25 transition-all"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>

          <div className="flex gap-2">
            {phrases.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={clsx(
                  'rounded-full transition-all',
                  i === idx
                    ? 'w-5 h-2.5 bg-purple-500'
                    : 'w-2.5 h-2.5 bg-zinc-700 hover:bg-zinc-500',
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setIdx(i => Math.min(phrases.length - 1, i + 1))}
            disabled={idx === phrases.length - 1}
            className="w-12 h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center disabled:opacity-25 transition-all"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
