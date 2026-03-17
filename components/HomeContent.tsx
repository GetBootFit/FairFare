'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { InstallPrompt } from '@/components/InstallPrompt'

interface FeatureCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  bgColor: string
  hoverBgColor: string
  cardBg: string
  borderColor: string
  hoverBorderColor: string
  hoverCardBg: string
  glowColor: string
}

function FeatureCard({ href, icon, title, description, bgColor, hoverBgColor, cardBg, borderColor, hoverBorderColor, hoverCardBg, glowColor }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 p-5 rounded-2xl ${cardBg} border ${borderColor} ${hoverBorderColor} ${hoverCardBg} transition-all duration-200 ${glowColor}`}
    >
      <div className={`w-14 h-14 rounded-xl ${bgColor} ${hoverBgColor} flex items-center justify-center shrink-0 transition-colors duration-200`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="text-xs text-zinc-400 group-hover:text-zinc-300 leading-relaxed mt-0.5 transition-colors duration-200">{description}</p>
      </div>
      <ChevronRight size={18} className="text-zinc-400 group-hover:text-white shrink-0 transition-colors duration-200" />
    </Link>
  )
}

export function HomeContent() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]">
      {/* Logo / hero */}
      <div className="pt-8 pb-6">
        <div className="mb-2">
          <Link href="/" className="inline-flex items-end gap-1 hover:opacity-90 transition-opacity">
            <img
              src="/images/brand/hootling-logo-icon.svg"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 shrink-0"
            />
            <img
              src="/images/brand/hootling-logo-wordmark-transparent.svg"
              alt="Hootling"
              className="h-9 w-auto"
            />
          </Link>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed mt-3 max-w-xs">
          {t('home_tagline')}
        </p>
        {/* Coverage stats — social proof + SEO signal */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
            <span className="text-purple-400 font-semibold">120+</span> {t('home_stat_cities')}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
            <span className="text-teal-400 font-semibold">50+</span> {t('home_stat_tipping')}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
            {t('home_no_account')}
          </span>
        </div>
        {/* Star rating trust strip */}
        <p className="text-xs text-zinc-500 mt-3">
          <span className="text-yellow-400 tracking-tight">★★★★★</span>
          <span className="ml-1.5">Trusted by travellers in 120+ cities</span>
        </p>
      </div>

      {/* Feature cards */}
      <div className="space-y-3">
        <FeatureCard
          href="/taxi"
          icon={<img src="/icons/SVG/taxi-car.svg" alt="" width={38} height={38} aria-hidden="true" style={{ filter: 'brightness(0) invert(1)' }} />}
          title={t('home_taxi_title')}
          description={t('home_taxi_desc')}
          bgColor="bg-teal-900/50"
          hoverBgColor="group-hover:bg-teal-700/60"
          cardBg="bg-teal-950/60"
          borderColor="border-teal-900/50"
          hoverBorderColor="hover:border-teal-500/70"
          hoverCardBg="hover:bg-teal-900/70"
          glowColor="hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.35)]"
        />
        <FeatureCard
          href="/tipping"
          icon={<img src="/icons/SVG/money-notes.svg" alt="" width={38} height={38} aria-hidden="true" style={{ filter: 'brightness(0) invert(1)' }} />}
          title={t('home_tipping_title')}
          description={t('home_tipping_desc')}
          bgColor="bg-purple-900/50"
          hoverBgColor="group-hover:bg-purple-700/60"
          cardBg="bg-purple-950/60"
          borderColor="border-purple-900/50"
          hoverBorderColor="hover:border-purple-500/70"
          hoverCardBg="hover:bg-purple-900/70"
          glowColor="hover:shadow-[0_0_24px_-4px_rgba(147,51,234,0.4)]"
        />
      </div>

      {/* Example result teaser — evidences the value proposition for cold visitors */}
      <div className="mt-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2.5 font-medium">Example result</p>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-200 font-medium">Bangkok Airport</span>
              <span className="text-zinc-600 mx-1">→</span>
              Sukhumvit
            </p>
            <p className="text-xl font-bold text-white">฿280 <span className="text-zinc-500 font-normal text-base">–</span> ฿420</p>
          </div>
          <div className="shrink-0 text-right space-y-1">
            <span className="inline-block bg-amber-900/40 border border-amber-700/40 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              ⚠ Scam alert
            </span>
            <p className="text-[10px] text-zinc-600">Meter refusal common</p>
          </div>
        </div>
      </div>

      {/* Sample result CTA — low-friction entry point */}
      <div className="mt-3">
        <Link
          href="/example"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-200"
        >
          <Sparkles size={14} className="text-purple-400" />
          {t('home_sample_btn')}
        </Link>
      </div>

      {/* Footer — pushed to bottom */}
      <div className="mt-auto pt-8 pb-2 space-y-3">
        {/* Install prompt as quiet micro copy — sits just above the divider */}
        <InstallPrompt variant="micro" />
        <div className="border-t border-zinc-900 pt-4 space-y-3">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { href: '/about', label: t('footer_about') },
              { href: '/faq', label: t('footer_faq') },
              { href: '/terms', label: t('footer_terms') },
              { href: '/privacy', label: t('footer_privacy') },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-800">
            {t('footer_copyright', { year: String(new Date().getFullYear()) })}
          </p>
        </div>
      </div>
    </div>
  )
}
