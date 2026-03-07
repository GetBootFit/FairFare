'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Car, Banknote, ChevronRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { InstallPrompt } from '@/components/InstallPrompt'
import { getStoredCurrency, formatPrice, PRICES, type CurrencyCode } from '@/lib/currency'

interface FeatureCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  accentColor: string
  bgColor: string
  borderColor: string
}

function FeatureCard({ href, icon, title, description, accentColor, bgColor, borderColor }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 border ${borderColor} hover:bg-zinc-800 transition-colors`}
    >
      <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center ${accentColor} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{description}</p>
      </div>
      <ChevronRight size={18} className="text-zinc-700 group-hover:text-zinc-500 shrink-0 transition-colors" />
    </Link>
  )
}

export function HomeContent() {
  const { t } = useLanguage()
  const [currency, setCurrency] = useState<CurrencyCode>('USD')

  // Hydrate from localStorage and re-sync whenever storeCurrency() is called
  useEffect(() => {
    setCurrency(getStoredCurrency())

    // React to same-tab and cross-tab currency changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ff_currency') setCurrency(getStoredCurrency())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const prices = PRICES[currency]
  const pricingVars = {
    single: formatPrice(currency, prices.single),
    bundle: formatPrice(currency, prices.bundle),
  }

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-6rem)]">
      {/* Logo / hero */}
      <div className="pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-lg font-bold text-white">
            F
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FairFare</h1>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed mt-3 max-w-xs">
          {t('home_tagline')}
        </p>
      </div>

      {/* PWA install prompt */}
      <div className="mb-4">
        <InstallPrompt />
      </div>

      {/* Feature cards */}
      <div className="space-y-3 flex-1">
        <FeatureCard
          href="/taxi"
          icon={<Car size={28} strokeWidth={1.8} />}
          title={t('home_taxi_title')}
          description={t('home_taxi_desc')}
          accentColor="text-purple-400"
          bgColor="bg-purple-900/20"
          borderColor="border-purple-900/40"
        />
        <FeatureCard
          href="/tipping"
          icon={<Banknote size={28} strokeWidth={1.8} />}
          title={t('home_tipping_title')}
          description={t('home_tipping_desc')}
          accentColor="text-teal-400"
          bgColor="bg-teal-900/20"
          borderColor="border-teal-900/40"
        />
      </div>

      {/* Pricing note + example link */}
      <div className="pb-4 pt-6 text-center space-y-2">
        <p className="text-zinc-600 text-xs">{t('home_pricing', pricingVars)}</p>
        <Link
          href="/example"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-purple-400 transition-colors"
        >
          <Sparkles size={11} />
          See a sample result
        </Link>
      </div>
    </div>
  )
}
