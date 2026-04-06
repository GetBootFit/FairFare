'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Sparkles, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { InstallPrompt } from '@/components/InstallPrompt'
import { getFeaturedPost, getRecentPosts } from '@/lib/blog-posts'

// Social handles — update URLs when accounts are created
const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/TheHootling',
    icon: <Instagram size={15} />,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@thehootling',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/TheHootling',
    icon: <Facebook size={15} />,
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/TheHootling',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/hootling',
    icon: <Linkedin size={15} />,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@TheHootling',
    icon: <Youtube size={15} />,
  },
]

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
      <ChevronRight size={18} className="text-zinc-400 group-hover:text-white shrink-0 transition-colors duration-200 rtl:rotate-180" />
    </Link>
  )
}

export function HomeContent() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] md:min-h-0">

      {/* ── Desktop 2-column grid ────────────────────────────────────────────── */}
      {/* Mobile: natural single-column flow. Desktop (md+): left content / right sidebar. */}
      <div className="md:grid md:grid-cols-[1fr_288px] md:gap-10 md:items-start">

        {/* ── LEFT COLUMN ────────────────────────────────────────────────────── */}
        <div>
          {/* Logo / hero — hidden on desktop (DesktopNav shows the logo there) */}
          <div className="pt-8 pb-6 md:pt-4">
            <div className="mb-2 md:hidden">
              <Link href="/" className="inline-flex items-end gap-1 hover:opacity-90 transition-opacity">
                <img src="/images/brand/hootling-logo-icon.svg" alt="" aria-hidden="true" className="h-12 w-12 shrink-0" />
                <img src="/images/brand/hootling-logo-wordmark-transparent.svg" alt="Hootling" className="h-9 w-auto" />
              </Link>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mt-3 md:mt-0 md:text-base max-w-xs md:max-w-sm">
              {t('home_tagline')}
            </p>
            {/* Coverage stats — social proof + SEO signal */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
                <span className="text-purple-400 font-semibold">160+</span> {t('home_stat_cities')}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
                <span className="text-teal-400 font-semibold">56</span> {t('home_stat_tipping')}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
                {t('home_no_account')}
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-3">{t('home_data_source')}</p>
          </div>

          {/* Problem statement */}
          <p className="text-[11px] text-zinc-600 mt-5 mb-2">{t('home_problem_statement')}</p>

          {/* Feature cards — stacked on mobile, side-by-side on desktop */}
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3">
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

          {/* Example results — mobile only; shown AFTER feature cards so the user
              understands the service before seeing output. Two cards balance both features. */}
          <div className="md:hidden mt-4 space-y-2">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">{t('home_example_result')}</p>
            <div className="grid grid-cols-2 gap-2">

              {/* Taxi example */}
              <Link
                href="/example"
                className="block bg-teal-950/40 border border-teal-900/50 hover:border-teal-600/60 rounded-2xl p-3 transition-colors group"
              >
                <p className="text-[9px] text-teal-400 uppercase tracking-wider font-semibold mb-1.5">Taxi fare</p>
                <p className="text-[10px] text-zinc-400 leading-snug mb-1">
                  <span className="text-zinc-200">Bangkok Airport</span>
                  <span className="text-zinc-600 mx-1 inline-block rtl:rotate-180">→</span>
                  Sukhumvit
                </p>
                <p className="text-lg font-bold text-white leading-none mb-1.5">฿280–420</p>
                <span className="inline-block bg-amber-900/40 border border-amber-700/40 text-amber-400 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                  ⚠️ {t('home_scam_alert')}
                </span>
                <p className="text-[9px] text-teal-400 mt-2 group-hover:translate-x-0.5 transition-transform">
                  Full example →
                </p>
              </Link>

              {/* Tipping example */}
              <Link
                href="/tipping"
                className="block bg-purple-950/40 border border-purple-900/50 hover:border-purple-600/60 rounded-2xl p-3 transition-colors group"
              >
                <p className="text-[9px] text-purple-400 uppercase tracking-wider font-semibold mb-1.5">Tipping guide</p>
                <p className="text-[10px] text-zinc-200 font-medium mb-0.5">🇯🇵 Japan</p>
                <p className="text-sm font-bold text-white leading-snug mb-1">Not expected</p>
                <p className="text-[10px] text-zinc-500 leading-snug">Tipping can cause offence — exceptional service is already included</p>
                <p className="text-[9px] text-purple-400 mt-2 group-hover:translate-x-0.5 transition-transform">
                  Check your country →
                </p>
              </Link>

            </div>
          </div>

          {/* Blog section */}
          {(() => {
            const featured = getFeaturedPost()
            const recent = getRecentPosts(2, featured?.slug)
            const categoryColour: Record<string, string> = {
              taxi: 'text-purple-400',
              tipping: 'text-teal-400',
              travel: 'text-blue-400',
            }
            return (
              <div className="mt-6 border-t border-zinc-900 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest">{t('home_blog_heading')}</p>
                  <Link href="/blog" className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-0.5">
                    {t('home_blog_view_all')} <span className="inline-block rtl:rotate-180">→</span>
                  </Link>
                </div>
                <div className="space-y-1">
                  {featured && (
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="flex items-start gap-3 px-2.5 py-2 rounded-xl bg-purple-950/30 border border-purple-900/30 group mb-1"
                    >
                      <span className={`text-[9px] uppercase tracking-wider font-semibold shrink-0 mt-0.5 w-10 ${categoryColour[featured.category] ?? 'text-zinc-500'}`}>
                        {featured.category}
                      </span>
                      <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug flex-1 line-clamp-2">
                        {featured.title}
                      </span>
                      <ChevronRight size={12} className="text-purple-700 group-hover:text-purple-400 shrink-0 mt-0.5 transition-colors rtl:rotate-180" />
                    </Link>
                  )}
                  {recent.map(post => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="flex items-start gap-3 py-2 group"
                    >
                      <span className={`text-[9px] uppercase tracking-wider font-semibold shrink-0 mt-0.5 w-10 ${categoryColour[post.category] ?? 'text-zinc-500'}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors leading-snug flex-1 line-clamp-2">
                        {post.title}
                      </span>
                      <ChevronRight size={12} className="text-zinc-700 group-hover:text-zinc-500 shrink-0 mt-0.5 transition-colors rtl:rotate-180" />
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>{/* end left column */}

        {/* ── RIGHT SIDEBAR — desktop only ───────────────────────────────────── */}
        <div className="hidden md:flex md:flex-col md:gap-4 md:sticky md:top-20 md:pt-4">

          {/* Example result — prominent card */}
          <Link
            href="/example"
            className="block bg-zinc-900/60 border border-zinc-700 hover:border-purple-700/60 rounded-2xl p-5 transition-colors group"
          >
            <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-3 font-semibold">{t('home_example_result')}</p>
            {/* Route */}
            <p className="text-xs text-zinc-400 mb-1">
              <span className="text-zinc-200 font-medium">Bangkok Airport</span>
              <span className="text-zinc-500 mx-1">→</span>
              Sukhumvit
            </p>
            {/* Fare range */}
            <p className="text-3xl font-bold text-white mb-1">฿280 <span className="text-zinc-500 font-normal text-xl">–</span> ฿420</p>
            {/* Scam badge */}
            <span className="inline-block bg-amber-900/40 border border-amber-700/40 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3">
              {t('home_scam_alert')}
            </span>
            {/* Driver phrase teaser */}
            <div className="border-t border-zinc-800 pt-3 space-y-0.5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Say to your driver</p>
              <p className="text-sm text-white font-medium">&ldquo;เปิดมิเตอร์ด้วยครับ&rdquo;</p>
              <p className="text-[11px] text-zinc-500 italic">Please use the meter</p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <p className="text-[10px] text-zinc-600">{t('home_example_source')}</p>
              <span className="text-xs text-purple-400 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                <Sparkles size={11} /> See full result →
              </span>
            </div>
          </Link>

          {/* Tipping example — balances the taxi example above */}
          <Link
            href="/tipping"
            className="block bg-purple-950/40 border border-purple-900/40 hover:border-purple-700/60 rounded-2xl p-4 transition-colors group"
          >
            <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-2 font-semibold">Tipping guide</p>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-zinc-300 font-medium mb-0.5">🇯🇵 Japan</p>
                <p className="text-lg font-bold text-white leading-none">Not expected</p>
                <p className="text-[10px] text-zinc-500 mt-1 leading-snug max-w-[140px]">
                  Tipping can cause offence — exceptional service is already included
                </p>
              </div>
              <div className="shrink-0 text-right rtl:text-left">
                <span className="inline-block bg-purple-900/40 border border-purple-700/40 text-purple-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  6 scenarios
                </span>
              </div>
            </div>
            <p className="text-[10px] text-purple-400 mt-3 group-hover:translate-x-0.5 transition-transform">
              Check your country →
            </p>
          </Link>

          {/* Pricing quick-look */}
          <Link
            href="/pricing"
            className="block bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 transition-colors group"
          >
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">Pricing</p>
            <div className="space-y-2">
              {[
                { label: 'Single query', price: 'from $2.99', note: 'One fare check or tipping guide' },
                { label: '20-query bundle', price: '$19.99', note: 'Best value for frequent travellers' },
              ].map(({ label, price, note }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-zinc-300">{label}</p>
                    <p className="text-[10px] text-zinc-600">{note}</p>
                  </div>
                  <p className="text-sm font-bold text-white shrink-0">{price}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-purple-400 mt-3 group-hover:translate-x-0.5 transition-transform">
              View all plans →
            </p>
          </Link>

          {/* Trust strip */}
          <p className="text-center text-[11px] text-zinc-700 leading-relaxed px-2">
            🔒 Stripe-secured · Apple Pay &amp; Google Pay · No account needed
          </p>
        </div>{/* end right sidebar */}

      </div>{/* end desktop grid */}

      {/* Footer — full width, pushed to bottom on mobile */}
      <div className="mt-auto pt-8 pb-2 space-y-3">
        {/* Install prompt as quiet micro copy — sits just above the divider */}
        <InstallPrompt variant="micro" />
        <div className="border-t border-zinc-900 pt-4 space-y-4">

          {/* Social follow row */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest">{t('home_follow_us')}</p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Hootling on ${label}`}
                  className="text-zinc-700 hover:text-zinc-400 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { href: '/pricing', label: 'Pricing' },
              { href: '/taxi/cities', label: 'All Cities' },
              { href: '/tipping/countries', label: 'All Countries' },
              { href: '/about', label: t('footer_about') },
              { href: '/faq', label: t('footer_faq') },
              { href: '/blog', label: t('footer_blog') },
              { href: '/business', label: t('nav_business') },
              { href: '/terms', label: t('footer_terms') },
              { href: '/privacy', label: t('footer_privacy') },
              { href: '/refund', label: 'Refund Policy' },
              { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
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
