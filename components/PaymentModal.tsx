'use client'

import { useState, useEffect } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { useLanguage } from '@/context/LanguageContext'
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

export function PaymentModal({ feature, country, onCancel }: Props) {
  const { t } = useLanguage()

  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    country ? 'country_pass' : 'query_bundle'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Hydrate currency from localStorage / browser locale on mount
  useEffect(() => {
    setCurrencyState(getStoredCurrency())
  }, [])

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrencyState(c)
    storeCurrency(c)
    setShowCurrencyPicker(false)
  }

  const prices = PRICES[currency]
  const singlePrice = formatPrice(currency, prices.single)
  const passPrice = formatPrice(currency, prices.pass)
  const bundlePrice = formatPrice(currency, prices.bundle)

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
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">

        {/* Header */}
        <div className="text-center pt-1">
          <span className="text-2xl">🔓</span>
          <p className="text-white text-lg font-bold mt-1">{t('payment_title')}</p>
        </div>

        {/* Pricing options */}
        <div className="space-y-2">

          {/* Single result */}
          <button
            onClick={() => setSelectedProduct('single')}
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
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
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
              onClick={() => setSelectedProduct('country_pass')}
              className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-colors relative ${
                selectedProduct === 'country_pass'
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
            >
              {/* "For this trip" badge */}
              <span className="absolute -top-2 right-3 bg-zinc-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
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
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
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
            onClick={() => setSelectedProduct('query_bundle')}
            className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-colors relative ${
              selectedProduct === 'query_bundle'
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
            }`}
          >
            {/* Best value badge */}
            <span className="absolute -top-2 right-3 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {t('payment_best_value')}
            </span>
            <div className="pr-2">
              <p className="text-sm font-semibold text-white">{t('payment_bundle')}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{t('payment_bundle_desc')}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-white font-bold text-sm">{bundlePrice}</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
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

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

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
