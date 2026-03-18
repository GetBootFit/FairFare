'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const LS_KEY = 'ff_install_dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Module-level cache of the beforeinstallprompt event.
 *
 * The browser fires this event once, early in the page lifecycle, and does NOT
 * re-fire it on client-side navigation. Storing it here (outside React state)
 * means any component instance — including those mounted after navigation —
 * can still access the captured prompt even after the original listener
 * component was unmounted.
 */
let _capturedPrompt: BeforeInstallPromptEvent | null = null

function detectIOSSafari(): boolean {
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
  // Exclude Chrome on iOS (CriOS), Firefox (FxiOS), Edge (EdgiOS)
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
  return isIOS && isSafari
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

interface InstallPromptProps {
  /** 'card' = prominent banner (default), 'micro' = quiet footer text */
  variant?: 'card' | 'micro'
}

export function InstallPrompt({ variant = 'card' }: InstallPromptProps) {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(LS_KEY) || isStandalone()) return

    // iOS Safari: no beforeinstallprompt — show manual instruction instead
    if (detectIOSSafari()) {
      setIsIOS(true)
      setVisible(true)
      return
    }

    // If the prompt was already captured on a previous page (module-level cache),
    // surface it immediately without waiting for the event to re-fire.
    if (_capturedPrompt) {
      setDeferredPrompt(_capturedPrompt)
      setVisible(true)
      return
    }

    // Chrome / Edge / Android: capture the one-shot beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      _capturedPrompt = e as BeforeInstallPromptEvent
      setDeferredPrompt(_capturedPrompt)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleAdd = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    _capturedPrompt = null   // consumed — browser won't re-fire the event
    setDeferredPrompt(null)
    if (outcome === 'accepted') setVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem(LS_KEY, '1')
    _capturedPrompt = null   // don't re-surface on next navigation
    setVisible(false)
  }

  if (!visible) return null

  // ── Micro variant — quiet text near footer ──────────────────────────────
  if (variant === 'micro') {
    return (
      <p className="text-center text-xs text-zinc-700 leading-relaxed">
        {isIOS ? (
          <>
            Tap{' '}
            <span className="text-zinc-500">Share ↑</span> then{' '}
            <span className="text-zinc-500">Add to Home Screen</span>
          </>
        ) : (
          <>
            {t('home_install_prompt')} —{' '}
            <button
              onClick={handleAdd}
              className="text-zinc-500 hover:text-zinc-400 transition-colors underline underline-offset-2"
            >
              {t('home_install_btn')}
            </button>
          </>
        )}
        <button
          onClick={handleDismiss}
          className="ml-2 text-zinc-800 hover:text-zinc-600 transition-colors"
          aria-label="Dismiss"
        >
          <X size={11} />
        </button>
      </p>
    )
  }

  // ── Card variant (default) ───────────────────────────────────────────────
  return (
    <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3">
      <span className="text-lg shrink-0">📲</span>
      {isIOS ? (
        <p className="text-zinc-300 flex-1 text-xs leading-snug">
          Tap <span className="font-semibold text-white">Share ↑</span> then{' '}
          <span className="font-semibold text-white">Add to Home Screen</span>
        </p>
      ) : (
        <p className="text-zinc-300 flex-1 text-xs leading-snug">
          {t('home_install_prompt')}
        </p>
      )}
      <div className="flex items-center gap-2 shrink-0">
        {!isIOS && (
          <button
            onClick={handleAdd}
            className="text-purple-400 font-semibold text-xs hover:text-purple-300 transition-colors"
          >
            {t('home_install_btn')}
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="text-zinc-600 hover:text-zinc-400 transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
