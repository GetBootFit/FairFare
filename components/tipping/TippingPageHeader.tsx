'use client'

import Link from 'next/link'
import { Banknote, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function TippingPageHeader() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-3 pt-2">
      <Link
        href="/"
        className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-800/50 flex items-center justify-center hover:bg-purple-900/60 transition-colors"
      >
        <Banknote size={20} className="text-purple-400" />
      </Link>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-white">{t('home_tipping_title')}</h1>
        <p className="text-xs text-zinc-500">{t('tipping_subtitle')}</p>
      </div>
      <Link
        href="/example"
        className="flex items-center gap-1 text-xs text-zinc-600 hover:text-purple-400 transition-colors shrink-0"
      >
        <Sparkles size={11} />
        {t('nav_demo')}
      </Link>
    </div>
  )
}
