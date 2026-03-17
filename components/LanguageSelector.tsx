'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LOCALES, type Locale } from '@/lib/i18n'
import { useLanguage } from '@/context/LanguageContext'

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col items-center gap-1 py-3 px-3 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors min-h-[44px] min-w-[44px] justify-center"
        aria-label={`Language: ${current.label}`}
      >
        <Image
          src={`/images/flags/${current.flagCode}.svg`}
          alt={current.label}
          width={24}
          height={18}
          className="rounded-sm"
          unoptimized
        />
        <span className="leading-none uppercase">{current.code}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Dropdown — opens upward from bottom nav */}
          <div className="absolute bottom-full right-0 mb-2 z-50 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl min-w-[160px] max-h-64 overflow-y-auto">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code as Locale)
                  setOpen(false)
                }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition-colors min-h-[44px] ${
                  l.code === locale
                    ? 'text-purple-400 bg-purple-900/20 font-medium'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <Image
                  src={`/images/flags/${l.flagCode}.svg`}
                  alt=""
                  width={20}
                  height={15}
                  className="rounded-sm shrink-0"
                  unoptimized
                />
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
