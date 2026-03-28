'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Spinner } from '@/components/ui/Spinner'
import { PaymentModal } from '@/components/PaymentModal'
import { TippingResult } from '@/components/tipping/TippingResult'
import {
  getStoredToken,
  isTokenExpired,
  clearStoredToken,
  storeToken,
  getCountryPassToken,
  storeCountryPass,
  isCountryPassValid,
  storeBundleTokens,
  popBundleToken,
} from '@/lib/tokens'
import { useLanguage } from '@/context/LanguageContext'
import { COUNTRY_FLAGS } from '@/lib/flags'
import { track } from '@vercel/analytics'
import { ga4ResultLoaded } from '@/lib/analytics'
import type { TippingResult as TippingResultType } from '@/types'

const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile',
  'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt',
  'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'India',
  'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Malaysia',
  'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Norway', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'UAE', 'Ukraine', 'United Kingdom',
  'United States', 'Vietnam',
]

// Top 8 destinations shown as quick-tap buttons before the user starts typing
const POPULAR_COUNTRIES = [
  'United States', 'United Kingdom', 'France', 'Japan',
  'Italy', 'Thailand', 'Australia', 'Spain',
]

const STORAGE_KEY = 'ff_tipping_form'

interface TokenEventDetail {
  token: string
  tokens?: string[]   // present for query_bundle
  product?: string
  country?: string
}

export function TippingForm() {
  const { t, locale } = useLanguage()
  const [country, setCountry] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'paying' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<TippingResultType | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  )

  // Restore after Stripe redirect
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setCountry(JSON.parse(saved)); sessionStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    }
  }, [])

  const handleSubmit = async (selectedCountry: string) => {
    if (!selectedCountry) return

    track('tipping_country_selected', { country: selectedCountry })

    // Priority: country pass → bundle queue → single token → payment modal
    if (isCountryPassValid(selectedCountry)) {
      const passToken = getCountryPassToken(selectedCountry)!
      setCountry(selectedCountry)
      setStatus('loading')
      await fetchResult(passToken, selectedCountry)
      return
    }

    const bundleToken = popBundleToken()
    if (bundleToken) {
      setCountry(selectedCountry)
      setStatus('loading')
      await fetchResult(bundleToken, selectedCountry)
      return
    }

    // Then check single-query token
    const token = getStoredToken()
    if (!token || isTokenExpired(token)) {
      track('unlock_clicked', { feature: 'tipping', country: selectedCountry })
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCountry))
      setCountry(selectedCountry)
      setStatus('paying')
      return
    }
    setCountry(selectedCountry)
    setStatus('loading')
    await fetchResult(token, selectedCountry)
  }

  const fetchResult = async (token: string, c: string) => {
    try {
      const res = await fetch('/api/tipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ country: c, locale }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) clearStoredToken()
        throw new Error(data.error ?? 'Failed to fetch tipping guide')
      }
      setResult(data as TippingResultType)
      setStatus('done')
      track('result_loaded', { feature: 'tipping', country: c })
      ga4ResultLoaded({ feature: 'tipping', country: c })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : t('common_error'))
    }
  }

  // Listen for token from success page after Stripe redirect
  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent<TokenEventDetail>).detail

      // Bundle: store all tokens, pop first for immediate use
      if (detail?.product === 'query_bundle' && detail.tokens?.length) {
        storeBundleTokens(detail.tokens)
        const token = popBundleToken()
        const saved = sessionStorage.getItem(STORAGE_KEY)
        const c = saved ? JSON.parse(saved) : country
        if (token && c) {
          sessionStorage.removeItem(STORAGE_KEY)
          setCountry(c)
          setStatus('loading')
          await fetchResult(token, c)
        }
        return
      }

      const token = detail?.token ?? (detail as unknown as string) // backward compat

      if (detail?.product === 'country_pass' && detail.country) {
        storeCountryPass(detail.country, token)
      } else {
        storeToken(token)
      }

      const saved = sessionStorage.getItem(STORAGE_KEY)
      const c = saved ? JSON.parse(saved) : country
      if (c) {
        sessionStorage.removeItem(STORAGE_KEY)
        setCountry(c)
        setStatus('loading')
        await fetchResult(token, c)
      }
    }
    window.addEventListener('ff:token', handler)
    return () => window.removeEventListener('ff:token', handler)
  }, [country]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setCountry(''); setQuery(''); setResult(null); setStatus('idle'); setErrorMsg('')
    clearStoredToken()
  }

  if (status === 'done' && result) {
    return <TippingResult result={result} onReset={handleReset} />
  }

  // Screen reader announcements for dynamic state changes
  const srLoadingAnnouncement = status === 'loading' ? t('tipping_loading', { country }) : ''

  return (
    <div className="space-y-4">
      {/* Polite live region — announces loading progress */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {srLoadingAnnouncement}
      </div>
      {/* Assertive live region — announces errors immediately */}
      {status === 'error' && errorMsg && (
        <div role="alert" aria-atomic="true" className="sr-only">
          {errorMsg}
        </div>
      )}
      {(status === 'idle' || status === 'error') && (
        <>
          <p className="text-zinc-400 text-sm">{t('tipping_description')}</p>
          <label htmlFor="tipping-country-search" className="sr-only">
            Search for a country
          </label>
          <input
            id="tipping-country-search"
            type="text"
            placeholder={t('tipping_search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-describedby={errorMsg ? 'tipping-form-error' : undefined}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3.5 text-white placeholder-zinc-500 text-base focus:border-zinc-500 transition-colors"
          />
          {errorMsg && (
            <p id="tipping-form-error" role="alert" className="text-red-400 text-sm">
              {errorMsg}
            </p>
          )}

          {/* Popular quick-taps — shown when search is empty */}
          {query.length === 0 && (
            <div className="space-y-2">
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider">Popular destinations</p>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_COUNTRIES.map((c) => {
                  const iso2 = COUNTRY_FLAGS[c]
                  return (
                    <button
                      key={c}
                      onClick={() => handleSubmit(c)}
                      className="flex items-center gap-2.5 text-left rtl:text-right px-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 hover:bg-zinc-800 hover:border-teal-800/50 hover:text-teal-300 transition-colors min-w-0"
                    >
                      {iso2 && (
                        <Image
                          src={`/images/flags/${iso2}.svg`}
                          alt=""
                          width={20}
                          height={15}
                          className="rounded-sm shrink-0"
                          unoptimized
                        />
                      )}
                      <span className="truncate">{c}</span>
                    </button>
                  )
                })}
              </div>
              <p className="text-[11px] text-zinc-600 pt-1">
                Don't see your destination? Search above for all 54 countries.
              </p>
            </div>
          )}

          {/* Full filtered list — shown when user is searching */}
          {query.length > 0 && (
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1 scrollbar-teal">
              {filtered.length > 0 ? filtered.map((c) => {
                const iso2 = COUNTRY_FLAGS[c]
                return (
                  <button
                    key={c}
                    onClick={() => handleSubmit(c)}
                    className="flex items-center gap-2.5 text-left rtl:text-right px-3.5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 hover:bg-zinc-800 hover:border-teal-800/50 hover:text-teal-300 transition-colors min-w-0"
                  >
                    {iso2 && (
                      <Image
                        src={`/images/flags/${iso2}.svg`}
                        alt=""
                        width={20}
                        height={15}
                        className="rounded-sm shrink-0"
                        unoptimized
                      />
                    )}
                    <span className="truncate">{c}</span>
                  </button>
                )
              }) : (
                <p className="col-span-2 text-sm text-zinc-500 py-4 text-center">
                  No countries found for &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          )}
        </>
      )}

      {status === 'loading' && (
        <div aria-busy="true" className="flex flex-col items-center gap-3 py-12 text-zinc-400">
          <Spinner className="h-7 w-7 text-teal-400" />
          <span className="text-sm" aria-hidden="true">{t('tipping_loading', { country })}</span>
        </div>
      )}

      {/* Payment modal — pass selected country for Country Pass offer */}
      {status === 'paying' && (
        <PaymentModal
          feature="tipping"
          country={country}
          onCancel={() => setStatus('idle')}
        />
      )}
    </div>
  )
}
