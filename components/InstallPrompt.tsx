'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const LS_KEY = 'ff_install_dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if previously dismissed
    if (localStorage.getItem(LS_KEY)) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleAdd = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    localStorage.setItem(LS_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm">
      <span className="text-lg shrink-0">📲</span>
      <p className="text-zinc-300 flex-1 text-xs leading-snug">
        {t('home_install_prompt')}
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleAdd}
          className="text-purple-400 font-semibold text-xs hover:text-purple-300"
        >
          {t('home_install_btn')}
        </button>
        <button
          onClick={handleDismiss}
          className="text-zinc-600 hover:text-zinc-400"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
