'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Banknote, Sparkles, BookOpen, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import { getBundleCount } from '@/lib/tokens'

export function DesktopNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [bundleCount, setBundleCount] = useState(0)

  useEffect(() => {
    setBundleCount(getBundleCount())
    const handler = () => setBundleCount(getBundleCount())
    window.addEventListener('storage', handler)
    window.addEventListener('ff:token', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('ff:token', handler)
    }
  }, [])

  const links = [
    { href: '/taxi',    label: t('nav_taxi'),    Icon: Car      },
    { href: '/tipping', label: t('nav_tipping'), Icon: Banknote },
    { href: '/example', label: t('nav_demo'),    Icon: Sparkles },
    { href: '/blog',    label: 'Blog',           Icon: BookOpen },
    { href: '/pricing', label: 'Pricing',        Icon: Tag      },
  ]

  return (
    <header className="hidden md:block fixed top-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-3xl mx-auto px-8 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-end gap-1 hover:opacity-90 transition-opacity shrink-0 mr-2"
        >
          <img
            src="/images/brand/hootling-logo-icon.svg"
            alt=""
            aria-hidden="true"
            className="h-7 w-7"
          />
          <img
            src="/images/brand/hootling-logo-wordmark-transparent.svg"
            alt="Hootling"
            className="h-[22px] w-auto"
          />
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1">
          {links.map(({ href, label, Icon }) => {
            const active =
              pathname === href ||
              (href !== '/' && pathname.startsWith(href + '/'))
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                )}
              >
                <Icon size={13} strokeWidth={active ? 2.2 : 1.8} />
                {label}
                {bundleCount > 0 && (href === '/taxi' || href === '/tipping') && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {bundleCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Language selector */}
        <div className="shrink-0 ml-auto">
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
}
