'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

// brightness(0) invert(1) converts any opaque pixel to white — correct for icons on coloured buttons
const WHITE_FILTER = { filter: 'brightness(0) invert(1)' }

function SvgIcon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/SVG/${name}.svg`}
      alt=""
      width={size}
      height={size}
      style={WHITE_FILTER}
      aria-hidden="true"
    />
  )
}

export function ExampleFooter() {
  const { t } = useLanguage()
  return (
    <>
      <div className="space-y-3 pt-2">
        <Link
          href="/taxi"
          className="flex items-center justify-center gap-2 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          <SvgIcon name="taxi-car" size={18} />
          {t('example_cta_taxi')} <ArrowRight size={16} />
        </Link>
        <Link
          href="/tipping"
          className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          <SvgIcon name="money-cash" size={18} />
          {t('example_cta_tipping')} <ArrowRight size={16} />
        </Link>
        <p className="text-center text-xs text-zinc-600">{t('example_pricing')}</p>
      </div>

      <div className="flex items-start gap-2 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/owl/stickers/owl-warning.svg" alt="" aria-hidden="true" width={22} height={22} className="shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-600 leading-relaxed">
          {t('example_ai_disclosure')}
        </p>
      </div>
    </>
  )
}
