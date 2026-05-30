'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Check, Zap, Globe, ArrowRight, ChevronDown } from 'lucide-react'
import {
  CURRENCIES,
  PRICES,
  formatPrice,
  getStoredCurrency,
  storeManualCurrency,
  type CurrencyCode,
} from '@/lib/currency'

export default function PricingPage() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [mounted, setMounted] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    setCurrency(getStoredCurrency())
    setMounted(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ff_currency') setCurrency(getStoredCurrency())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const prices = PRICES[currency]
  const fmt = (n: number) => (mounted ? formatPrice(currency, n) : '—')

  const singlePrice = fmt(prices.single)
  const passPrice   = fmt(prices.pass)

  const handleCurrency = (c: CurrencyCode) => {
    setCurrency(c)
    storeManualCurrency(c)
    setShowPicker(false)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2 text-center pt-2">
        <nav className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-zinc-300">Pricing</span>
        </nav>
        <h1 className="text-2xl font-bold text-white">Simple, honest pricing</h1>
        <p className="text-sm text-zinc-400">Pay only when you need it. No subscription, no account.</p>

        {/* Currency selector */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="text-xs text-zinc-500">Showing prices in</span>
          <div className="relative">
            <button
              onClick={() => setShowPicker((v) => !v)}
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              {currency} <ChevronDown size={11} />
            </button>
            {showPicker && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-1 min-w-[180px]">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleCurrency(c.code)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                      c.code === currency
                        ? 'bg-purple-900/40 text-purple-300'
                        : 'text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="space-y-3">

        {/* Single */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <Zap size={15} className="text-zinc-300" />
              </div>
              <div>
                <p className="font-semibold text-white">Single Query</p>
                <p className="text-xs text-zinc-500">One taxi OR one tipping check</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">{singlePrice}</p>
              <p className="text-xs text-zinc-500">per query</p>
            </div>
          </div>
          <ul className="space-y-1.5">
            {[
              'Fare estimate with ±15% range',
              'City-specific scam alerts for your route',
              'Local driver phrases',
              'Valid for 30 minutes',
              'Works for taxi or tipping',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                <Check size={11} className="text-zinc-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/taxi"
            className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            Check a fare <ArrowRight size={14} />
          </Link>
        </div>

        {/* Trip Pass — highlighted */}
        <div className="bg-purple-950/40 border border-purple-700/60 rounded-2xl p-5 space-y-4 relative">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
            <span className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
              MOST POPULAR
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-700/50 flex items-center justify-center shrink-0">
                <Globe size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Trip Pass</p>
                <p className="text-xs text-purple-300/70">Unlimited checks · one country · 14 days</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">{passPrice}</p>
              <p className="text-xs text-zinc-500">per trip</p>
            </div>
          </div>
          <ul className="space-y-1.5">
            {[
              'Unlimited taxi + tipping checks',
              'One country for up to 14 days',
              'All scam warnings + driver phrases',
              'Perfect for any trip up to 2 weeks',
              'Works across both taxi and tipping',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                <Check size={11} className="text-purple-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/taxi"
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            Start your trip <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'No account', sub: 'ever required' },
          { label: 'Stripe', sub: 'secured payment' },
          { label: 'Apple & Google Pay', sub: 'accepted' },
        ].map(({ label, sub }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5">
            <p className="text-xs font-semibold text-white">{label}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div className="text-center space-y-1">
        <p className="text-xs text-zinc-400">
          Not happy with your result? Email{' '}
          <a href="mailto:hello@hootling.com" className="text-purple-400 hover:text-purple-300 transition-colors">
            hello@hootling.com
          </a>{' '}
          and we&apos;ll sort it out.
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Common questions</h2>
        {[
          {
            q: 'Do queries expire?',
            a: 'Single queries are valid for 8 hours — long enough to check before boarding and use the result. Trip Pass is valid for 14 days from first use, covering any trip up to 2 weeks.',
          },
          {
            q: 'What if my city isn\'t listed?',
            a: 'We cover 160+ cities. For unlisted destinations, you\'ll still get scam alerts and local driver phrases — with a note to verify the fare directly with your driver.',
          },
          {
            q: 'Does the Trip Pass work for both taxi and tipping?',
            a: 'Yes — a Trip Pass for Thailand covers unlimited taxi fare checks and unlimited tipping guides for the full 14 days. Both features, one pass.',
          },
          {
            q: 'Do I need to create an account?',
            a: 'Never. Your entitlement is stored securely in your browser. No sign-up, no email required.',
          },
        ].map(({ q, a }) => (
          <div key={q} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1.5">
            <p className="text-sm font-semibold text-white">{q}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
        <Link href="/faq" className="hover:text-zinc-400 transition-colors">Full FAQ</Link>
        <Link href="/taxi" className="hover:text-zinc-400 transition-colors">Taxi Fare Check</Link>
        <Link href="/tipping" className="hover:text-zinc-400 transition-colors">Tipping Guide</Link>
      </div>
    </div>
  )
}
