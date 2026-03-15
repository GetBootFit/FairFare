'use client'

import Link from 'next/link'
import { Car, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function TaxiPageHeader() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-3 pt-2">
      <Link
        href="/"
        className="w-10 h-10 rounded-xl bg-teal-900/40 border border-teal-800/50 flex items-center justify-center hover:bg-teal-900/60 transition-colors"
      >
        <Car size={20} className="text-teal-400" />
      </Link>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-white">{t('home_taxi_title')}</h1>
        <p className="text-xs text-zinc-500">{t('taxi_subtitle')}</p>
      </div>
      <Link
        href="/example"
        className="flex items-center gap-1 text-xs text-zinc-600 hover:text-teal-400 transition-colors shrink-0"
      >
        <Sparkles size={11} />
        {t('nav_demo')}
      </Link>
    </div>
  )
}
