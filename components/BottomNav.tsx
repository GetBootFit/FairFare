'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Car, Banknote, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

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
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              {label}
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
