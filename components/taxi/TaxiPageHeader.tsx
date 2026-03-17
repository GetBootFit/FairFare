'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function TaxiPageHeader() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-3 pt-2">
      <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/owl/stickers/owl-shrugging.svg" alt="" aria-hidden="true" width={40} height={40} />
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
