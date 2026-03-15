'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WifiOff, Car, Banknote, Home, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

/** Read the most recently searched city/country pair from sessionStorage. */
function useLastSearch(): { city?: string; country?: string } | null {
  const [last, setLast] = useState<{ city?: string; country?: string } | null>(null)

  useEffect(() => {
    try {
      // TaxiForm saves its state here before redirecting to Stripe
      const raw = sessionStorage.getItem('ff_taxi_form')
      if (raw) {
        const parsed = JSON.parse(raw) as { city?: string; country?: string }
        if (parsed.city || parsed.country) {
          setLast(parsed)
          return
        }
      }
    } catch { /* ignore */ }
    setLast({}) // no data — render without hint
  }, [])

  return last
}

export default function OfflinePage() {
  const lastSearch = useLastSearch()
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <WifiOff size={28} className="text-zinc-500" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-white">{t('offline_heading')}</h1>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
          {t('offline_description')}
        </p>
      </div>

      {/* Last search hint */}
      {lastSearch?.city && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 max-w-xs w-full text-left">
          <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1">{t('offline_last_search')}</p>
          <p className="text-zinc-300 font-medium">
            {lastSearch.city}{lastSearch.country ? `, ${lastSearch.country}` : ''}
          </p>
          <p className="text-xs text-zinc-600 mt-0.5">
            {t('offline_reconnect')}
          </p>
        </div>
      )}

      {/* Cached pages */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 w-full max-w-xs text-left space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{t('offline_cached')}</p>
        <Link
          href="/"
          className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Home size={14} className="text-zinc-400" />
          </div>
          {t('nav_home')}
        </Link>
        <Link
          href="/taxi"
          className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-teal-900/30 flex items-center justify-center">
            <Car size={14} className="text-teal-400" />
          </div>
          {t('home_taxi_title')}
        </Link>
        <Link
          href="/tipping"
          className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-900/30 flex items-center justify-center">
            <Banknote size={14} className="text-purple-400" />
          </div>
          {t('home_tipping_title')}
        </Link>
      </div>

      {/* Retry */}
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-1.5 text-zinc-400 text-sm hover:text-white transition-colors"
      >
        <RotateCcw size={13} />
        {t('offline_try_again')}
      </button>
    </div>
  )
}
