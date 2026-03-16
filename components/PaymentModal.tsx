'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Spinner } from '@/components/ui/Spinner'
import { useLanguage } from '@/context/LanguageContext'
import { track } from '@vercel/analytics'
import {
  CURRENCIES,
  PRICES,
  formatPrice,
  getStoredCurrency,
  storeCurrency,
  type CurrencyCode,
} from '@/lib/currency'

interface Props {
  feature: 'taxi' | 'tipping'
  /** When provided, the Country Pass option is shown for this country. */
  country?: string
  onCancel: () => void
}

type Product = 'single' | 'country_pass' | 'query_bundle'

const FOCUSABLE = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function PaymentModal({ feature, country, onCancel }: Props) {
  const { t } = useLanguage()

  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    country ? 'country_pass' : 'query_bundle'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Suppress price display until localStorage is read to prevent currency flash
  const [mounted, setMounted] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const radioGroupRef = useRef<HTMLDivElement>(null)

  // Hydrate currency from localStorage / browser locale on mount
  useEffect(() => {
    setCurrencyState(getStoredCurrency())
    setMounted(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ff_currency') setCurrencyState(getStoredCurrency())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Focus trap: keep focus inside modal, handle Escape to close, restore focus on unmount
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    const previousFocus = document.activeElement as HTMLElement | null
    modal.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      if (e.key !== 'Tab') return

      const focusables = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', trap)
    return () => {
      document.removeEventListener('keydown', trap)
      previousFocus?.focus()
    }
  }, [onCancel])

  // Radiogroup arrow-key navigation between product options
  const handleRadioKeyDown = useCallback((e: React.KeyboardEvent, product: Product) => {
    const available: Product[] = [
      'single',
      ...(country ? (['country_pass'] as Product[]) : []),
      'query_bundle',
    ]
    const idx = available.indexOf(product)
    let nextIdx: number | null = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIdx = (idx + 1) % available.length
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nextIdx = (idx - 1 + available.length) % available.length

    if (nextIdx !== null) {
      e.preventDefault()
      setSelectedProduct(available[nextIdx])
      radioGroupRef.current
        ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
        [nextIdx]?.focus()
    }
  }, [country])

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrencyState(c)
    storeCurrency(c)
    setShowCurrencyPicker(false)
  }

  const prices = PRICES[currency]
  // Show '—' before mount to avoid a flash from the SSR default (USD) to the stored currency
  const singlePrice = mounted ? formatPrice(currency, prices.single) : '—'
  const passPrice   = mounted ? formatPrice(currency, prices.pass)   : '—'
  const bundlePrice = mounted ? formatPrice(currency, prices.bundle) : '—'

  // Display country with title case
  const countryDisplay = country
    ? country.charAt(0).toUpperCase() + country.slice(1)
    : ''

  const handlePay = async () => {
    setLoading(true)
    setError('')
    try {
      const body: Record<string, string> = {
        feature,
        product: selectedProduct,
        currency,
      }
      if (selectedProduct === 'country_pass' && country) {
        body.country = country
      }

      const res = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment error')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common_error'))
      setLoading(false)
    }
  }

  const activePrice =
    selectedProduct === 'country_pass' ? passPrice :
    selectedProduct === 'query_bundle'  ? bundlePrice :
    singlePrice

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-6 sm:pb-0">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
      >

        {/* Header */}
        <div className="text-center pt-1">
          <Image
            src="/images/brand/hootling-logo-icon.svg"
            alt="Hootling"
            width={64}
            height={64}
            className="mx-auto"
          />
          <p id="payment-modal-title" className="text-white text-lg font-bold mt-2">{t('payment_title')}</p>
        </div>

        {/* Pricing options — radiogroup for accessible keyboard navigation */}
        <div
          ref={radioGroupRef}
          role="radiogroup"
          aria-labelledby="payment-modal-title"
          className="space-y-2"
        >

          {/* Single result */}
          <button
            role="radio"
            aria-checked={selectedProduct === 'single'}
            onClick={() => { setSelectedProduct('single'); track('tier_selected', { tier: 'single', feature }) }}
            onKeyDown={(e) => handleRadioKeyDown(e, 'single')}
            className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
              selectedProduct === 'single'
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">{t('payment_single_result')}</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {feature === 'taxi' ? t('payment_single_desc_taxi') : t('payment_single_desc_tipping')}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-white font-bold text-sm">{singlePrice}</span>
              <div aria-hidden="true" className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedProduct === 'single' ? 'border-purple-400' : 'border-zinc-600'
              }`}>
                {selectedProduct === 'single' && (
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                )}
              </div>
            </div>
          </button>

          {/* Country Pass — only shown when country is provided */}
          {country && (
            <button
              role="radio"
              aria-checked={selectedProduct === 'country_pass'}
              onClick={() => { setSelectedProduct('country_pass'); track('tier_selected', { tier: 'country_pass', feature, country: country ?? '' }) }}
              onKeyDown={(e) => handleRadioKeyDown(e, 'country_pass')}
              className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-colors relative ${
                selectedProduct === 'country_pass'
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
            >
              {/* "For this trip" badge */}
              <span aria-hidden="true" className="absolute -top-2 right-3 bg-zinc-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {t('payment_for_this_trip')}
              </span>
              <div className="pr-2">
                <p className="text-sm font-semibold text-white">
                  {t('payment_country_pass', { country: countryDisplay })}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{t('payment_all_features_24h')}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-white font-bold text-sm">{passPrice}</span>
                <div aria-hidden="true" className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedProduct === 'country_pass' ? 'border-purple-400' : 'border-zinc-600'
                }`}>
                  {selectedProduct === 'country_pass' && (
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                  )}
                </div>
              </div>
            </button>
          )}

          {/* 10-Query Bundle — always shown */}
          <button
            role="radio"
            aria-checked={selectedProduct === 'query_bundle'}
            onClick={() => { setSelectedProduct('query_bundle'); track('tier_selected', { tier: 'bundle', feature }) }}
            onKeyDown={(e) => handleRadioKeyDown(e, 'query_bundle')}
            className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-colors relative ${
              selectedProduct === 'query_bundle'
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
            }`}
          >
            {/* Best value badge */}
            <span aria-hidden="true" className="absolute -top-2 right-3 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {t('payment_best_value')}
            </span>
            <div className="pr-2">
              <p className="text-sm font-semibold text-white">{t('payment_bundle')}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{t('payment_bundle_desc')}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-white font-bold text-sm">{bundlePrice}</span>
              <div aria-hidden="true" className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedProduct === 'query_bundle' ? 'border-purple-400' : 'border-zinc-600'
              }`}>
                {selectedProduct === 'query_bundle' && (
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                )}
              </div>
            </div>
          </button>

        </div>

        {/* Feature description */}
        <p className="text-zinc-500 text-xs text-center px-1">
          {feature === 'taxi' ? t('payment_taxi_desc') : t('payment_tipping_desc')}
        </p>

        {error && <p role="alert" className="text-red-400 text-sm text-center">{error}</p>}

        {/* Currency selector */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <span>{t('payment_currency_label', { currency })}</span>
          <span>·</span>
          {showCurrencyPicker ? (
            <select
              autoFocus
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
              onBlur={() => setShowCurrencyPicker(false)}
              className="bg-zinc-800 border border-zinc-600 text-zinc-200 text-xs rounded px-1 py-0.5"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          ) : (
            <button
              onClick={() => setShowCurrencyPicker(true)}
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
            >
              {t('payment_currency_change')}
            </button>
          )}
        </div>

        {/* Payment note */}
        <p className="text-zinc-600 text-xs text-center">{t('payment_note')}</p>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {loading ? <Spinner className="h-5 w-5 text-white" /> : null}
            {loading
              ? t('payment_redirecting')
              : t('payment_pay_btn', { price: activePrice })}
          </button>
          {/* Trust signals */}
          <p className="text-center text-[11px] text-zinc-600">
            🔒 Stripe-secured · Apple Pay &amp; Google Pay accepted · No account needed
          </p>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full text-zinc-500 text-sm py-2 hover:text-zinc-400 transition-colors"
          >
            {t('payment_cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
