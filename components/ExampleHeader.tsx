'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export function ExampleHeader() {
  const { t } = useLanguage()
  return (
    <div className="space-y-1">
      {/* Context banner — tells cold visitors this is a real result, no payment needed */}
      <p className="text-[11px] text-zinc-600 mb-3">
        This is a real Hootling result — no payment needed to view.
      </p>
      <div className="flex items-center gap-2 mb-2">
        <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/owl/expressions/owl-excited.svg" alt="" aria-hidden="true" width={28} height={28} />
        </Link>
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
          {t('example_badge')}
        </span>
      </div>
      <h1 className="text-xl font-bold text-white">{t('example_heading')}</h1>
      <p className="text-zinc-500 text-sm leading-relaxed">
        {t('example_description')}
      </p>
    </div>
  )
}
