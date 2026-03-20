'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center gap-6 py-20 px-4 text-center">
      <Image
        src="/images/owl/expressions/owl-wise.svg"
        alt=""
        aria-hidden="true"
        width={96}
        height={96}
        className="opacity-90"
      />
      <div>
        <p className="text-white font-bold text-xl">{t('not_found_heading')}</p>
        <p className="text-zinc-500 text-sm mt-1">{t('not_found_body')}</p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Link
          href="/taxi"
          className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {t('not_found_check_fares')}
        </Link>
        <Link
          href="/"
          className="w-full text-center text-zinc-500 hover:text-zinc-400 text-sm py-2 transition-colors"
        >
          {t('not_found_back')}
        </Link>
      </div>
    </div>
  )
}
