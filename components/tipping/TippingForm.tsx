'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, MapPin } from 'lucide-react'
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
import { TIPPING_CITIES } from '@/lib/tipping-cities'
import { track } from '@vercel/analytics'
import { ga4ResultLoaded, ga4UnlockClicked } from '@/lib/analytics'
import type { TippingResult as TippingResultType } from '@/types'

const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile',
  'China', 'Colombia', 'Costa Rica', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt',
  'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'India',
  'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Malaysia',
  'Macau', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Norway', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Tunisia', 'Turkey', 'UAE', 'Ukraine', 'United Kingdom',
  'United States', 'Vietnam',
]

// Top 8 destinations shown as quick-tap buttons before the user starts typing
const POPULAR_COUNTRIES = [
  'United States', 'United Kingdom', 'France', 'Japan',
  'Italy', 'Thailand', 'Australia', 'Spain',
]

const STORAGE_KEY = 'ff_tipping_form'

interface StoredFormState {
  country: string
  city?: string
}

interface TokenEventDetail {
  token: string
  tokens?: string[]   // present for query_bundle
  product?: string
  country?: string
}

export function TippingForm() {
  const { t, locale } = useLanguage()
  const [country, setCountry] = useState('')
  const [city, setCity] = useState<string | undefined>(undefined)
  const [query, setQuery] = useState('')
  /** 'country' = first step (pick a country); 'city' = second step (pick a city or national guide) */
  const [step, setStep] = useState<'country' | 'city'>('country')
  const [status, setStatus] = useState<'idle' | 'paying' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<TippingResultType | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  )

  // Restore after Stripe redirect — handles both legacy (string) and new ({country,city}) format
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StoredFormState | string
        if (typeof parsed === 'string') {
          setCountry(parsed)
        } else {
          setCountry(parsed.country)
          setCity(parsed.city)
        }
        sessionStorage.removeItem(STORAGE_KEY)
      } catch { /* ignore */ }
    }
  }, [])

  /** Called when user clicks a country button. Decides whether to show city pills or submit directly. */
  const handleCountrySelect = (selectedCountry: string) => {
    const cities = TIPPING_CITIES[selectedCountry]
    if (cities && cities.length > 0) {
      // Has city data — show city selector step
      setCountry(selectedCountry)
      setStep('city')
      setQuery('')
    } else {
      // City-state or no city data — submit directly with national guide
      handleSubmit(selectedCountry, undefined)
    }
  }

  /** Called when user confirms a city pill (or "National guide"). */
  const handleCitySelect = (selectedCity: string | undefined) => {
    handleSubmit(country, selectedCity)
  }

  const handleSubmit = async (selectedCountry: string, selectedCity: string | undefined) => {
    if (!selectedCountry) return

    track('tipping_country_selected', { country: selectedCountry, city: selectedCity ?? 'national' })

    // Priority: country pass → bundle queue → single token → payment modal
    if (isCountryPassValid(selectedCountry)) {
      const passToken = getCountryPassToken(selectedCountry)!
      setCountry(selectedCountry)
      setCity(selectedCity)
      setStatus('loading')
      await fetchResult(passToken, selectedCountry, selectedCity)
      return
    }

    const bundleToken = popBundleToken()
    if (bundleToken) {
      setCountry(selectedCountry)
      setCity(selectedCity)
      setStatus('loading')
      await fetchResult(bundleToken, selectedCountry, selectedCity)
      return
    }

    // Then check single-query token
    const token = getStoredToken()
    if (!token || isTokenExpired(token)) {
      track('unlock_clicked', { feature: 'tipping', country: selectedCountry })
      ga4UnlockClicked({ feature: 'tipping', country: selectedCountry })
      const stored: StoredFormState = { country: selectedCountry, city: selectedCity }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
      setCountry(selectedCountry)
      setCity(selectedCity)
      setStatus('paying')
      return
    }
    setCountry(selectedCountry)
    setCity(selectedCity)
    setStatus('loading')
    await fetchResult(token, selectedCountry, selectedCity)
  }

  const fetchResult = async (token: string, c: string, selectedCity: string | undefined) => {
    try {
      const res = await fetch('/api/tipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ country: c, city: selectedCity, locale }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) clearStoredToken()
        throw new Error(data.error ?? 'Failed to fetch tipping guide')
      }
      setResult(data as TippingResultType)
      setStatus('done')
      track('result_loaded', { feature: 'tipping', country: c, city: selectedCity ?? 'national' })
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
        let c = country
        let savedCity = city
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as StoredFormState | string
            if (typeof parsed === 'string') { c = parsed } else { c = parsed.country; savedCity = parsed.city }
          } catch { /* ignore */ }
        }
        if (token && c) {
          sessionStorage.removeItem(STORAGE_KEY)
          setCountry(c)
          setCity(savedCity)
          setStatus('loading')
          await fetchResult(token, c, savedCity)
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
      let c = country
      let savedCity = city
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StoredFormState | string
          if (typeof parsed === 'string') { c = parsed } else { c = parsed.country; savedCity = parsed.city }
        } catch { /* ignore */ }
      }
      if (c) {
        sessionStorage.removeItem(STORAGE_KEY)
        setCountry(c)
        setCity(savedCity)
        setStatus('loading')
        await fetchResult(token, c, savedCity)
      }
    }
    window.addEventListener('ff:token', handler)
    return () => window.removeEventListener('ff:token', handler)
  }, [country, city]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setCountry(''); setCity(undefined); setQuery(''); setResult(null)
    setStatus('idle'); setErrorMsg(''); setStep('country')
    clearStoredToken()
  }

  const handleBackToCountries = () => {
    setStep('country')
    setCountry('')
    setErrorMsg('')
  }

  if (status === 'done' && result) {
    return <TippingResult result={result} onReset={handleReset} />
  }

  const loadingLabel = city ? `${city}, ${country}` : country
  const srLoadingAnnouncement = status === 'loading' ? t('tipping_loading', { country: loadingLabel }) : ''

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

      {/* ── Step 1: Country picker ─────────────────────────────────────────── */}
      {step === 'country' && (status === 'idle' || status === 'error') && (
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
                      onClick={() => handleCountrySelect(c)}
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
                Don&apos;t see your destination? Search above for all 54 countries.
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
                    onClick={() => handleCountrySelect(c)}
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

      {/* ── Step 2: City picker ────────────────────────────────────────────── */}
      {step === 'city' && (status === 'idle' || status === 'error') && (
        <div className="space-y-3">
          {/* Back button */}
          <button
            onClick={handleBackToCountries}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft size={14} />
            {country}
          </button>

          <div>
            <p className="text-sm text-zinc-300 font-medium mb-0.5">Select a city</p>
            <p className="text-xs text-zinc-600">City guides include local tipping context specific to that destination.</p>
          </div>

          {errorMsg && (
            <p role="alert" className="text-red-400 text-sm">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {/* National guide always first */}
            <button
              onClick={() => handleCitySelect(undefined)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-purple-900/30 hover:border-purple-700/50 hover:text-purple-300 transition-all"
            >
              <MapPin size={13} className="shrink-0 opacity-60" />
              National guide
            </button>

            {/* City pills */}
            {(TIPPING_CITIES[country] ?? []).map((c) => (
              <button
                key={c}
                onClick={() => handleCitySelect(c)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 hover:bg-purple-900/30 hover:border-purple-700/50 hover:text-purple-300 transition-all"
              >
                {c}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-zinc-600 pt-1">
            National guide covers all regions. City guides highlight local customs and tourist-area specifics.
          </p>
        </div>
      )}

      {status === 'loading' && (
        <div aria-busy="true" className="flex flex-col items-center gap-3 py-12 text-zinc-400">
          <Spinner className="h-7 w-7 text-teal-400" />
          <span className="text-sm" aria-hidden="true">{t('tipping_loading', { country: loadingLabel })}</span>
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
