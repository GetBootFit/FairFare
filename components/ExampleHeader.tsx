'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function ExampleHeader() {
  const { t } = useLanguage()
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/"
          className="w-7 h-7 rounded-lg bg-teal-900/40 flex items-center justify-center hover:bg-teal-900/60 transition-colors shrink-0"
        >
          <Sparkles size={14} className="text-teal-400" />
        </Link>
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
          {t('example_badge')}
        </span>
      </div>
      <div className="flex justify-center py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/owl/expressions/owl-excited.svg" alt="" aria-hidden="true" width={72} height={72} className="drop-shadow-lg" />
      </div>
      <h1 className="text-xl font-bold text-white">{t('example_heading')}</h1>
      <p className="text-zinc-500 text-sm leading-relaxed">
        {t('example_description')}
      </p>
    </div>
  )
}
