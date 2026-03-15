'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Car, Banknote, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { getBundleCount } from '@/lib/tokens'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [bundleCount, setBundleCount] = useState(0)

  useEffect(() => {
    setBundleCount(getBundleCount())
    const onStorage = () => setBundleCount(getBundleCount())
    window.addEventListener('storage', onStorage)
    window.addEventListener('ff:token', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('ff:token', onStorage)
    }
  }, [])

  const links = [
    { href: '/', label: t('nav_home'), Icon: Home },
    { href: '/taxi', label: t('nav_taxi'), Icon: Car },
    { href: '/tipping', label: t('nav_tipping'), Icon: Banknote },
    { href: '/example', label: 'Demo', Icon: Sparkles },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 safe-bottom">
      <div className="max-w-md mx-auto flex">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                active ? 'text-purple-400' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                {bundleCount > 0 && (href === '/taxi' || href === '/tipping') && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {bundleCount}
                  </span>
                )}
              </span>
              {/* Hide label on very narrow screens (< 360px, e.g. iPhone SE 1st gen) — icon only */}
              <span className="hidden min-[360px]:inline">{label}</span>
            </Link>
          )
        })}
        {/* Language selector — separated by a thin border */}
        <div className="border-l border-zinc-800 flex items-center">
          <LanguageSelector />
        </div>
      </div>
    </nav>
  )
}
