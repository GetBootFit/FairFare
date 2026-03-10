'use client'

import { useState, useEffect, useCallback } from 'react'
import { PlaceInput } from '@/components/ui/PlaceInput'
import { Spinner } from '@/components/ui/Spinner'
import { PaymentModal } from '@/components/PaymentModal'
import { TaxiPreview } from '@/components/taxi/TaxiPreview'
import { TaxiResult } from '@/components/taxi/TaxiResult'
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
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { Clock, Plane } from 'lucide-react'
import type { TaxiPreviewResult, TaxiFullResult } from '@/types'

const AIRPORT_RE = /airport|aéroport|aeropuerto|aeroporto|flughafen|luchthaven|havalimanı|flygplats/i

const STORAGE_KEY = 'ff_taxi_form'

interface TokenEventDetail {
  token: string
  tokens?: string[]   // present for query_bundle
  product?: string
  country?: string
}

interface FormState {
  pickup: string
  destination: string
  pickupPlaceId: string
  destPlaceId: string
}

export function TaxiForm() {
  const { t } = useLanguage()
  const { recent, addSearch } = useRecentSearches()
  const [form, setForm] = useState<FormState>({
    pickup: '', destination: '', pickupPlaceId: '', destPlaceId: '',
  })
  const [status, setStatus] = useState<'idle' | 'previewing' | 'preview_done' | 'paying' | 'loading' | 'done' | 'error'>('idle')
  const [preview, setPreview] = useState<TaxiPreviewResult | null>(null)
  const [result, setResult] = useState<TaxiFullResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const isAirportPickup = AIRPORT_RE.test(form.pickup)

  // Restore form from sessionStorage after payment redirect
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved) as FormState
        setForm(data)
        sessionStorage.removeItem(STORAGE_KEY)
      } catch { /* ignore */ }
    }
  }, [])

  const setField = useCallback(<K extends keyof FormState>(key: K, val: string) => {
    setForm((f) => ({ ...f, [key]: val }))
  }, [])

  const handlePreview = async () => {
    if (!form.pickup.trim() || !form.destination.trim()) return
    setStatus('previewing')
    setErrorMsg('')

    try {
      const res = await fetch('/api/taxi/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup: form.pickup,
          destination: form.destination,
          pickupPlaceId: form.pickupPlaceId || undefined,
          destPlaceId: form.destPlaceId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to get route')
      const previewData = data as TaxiPreviewResult
      setPreview(previewData)

      // Priority: country pass → bundle queue → single token → payment modal
      if (previewData.country && isCountryPassValid(previewData.country)) {
        setStatus('loading')
        const passToken = getCountryPassToken(previewData.country)!
        await fetchFullResult(passToken, form)
      } else {
        const bundleToken = popBundleToken()
        if (bundleToken) {
          setStatus('loading')
          await fetchFullResult(bundleToken, form)
        } else {
          const token = getStoredToken()
          if (token && !isTokenExpired(token)) {
            setStatus('loading')
            await fetchFullResult(token, form)
          } else {
            setStatus('preview_done')
          }
        }
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : t('common_error'))
    }
  }

  const fetchFullResult = async (token: string, currentForm: FormState) => {
    const res = await fetch('/api/taxi/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pickup: currentForm.pickup,
        destination: currentForm.destination,
        pickupPlaceId: currentForm.pickupPlaceId || undefined,
        destPlaceId: currentForm.destPlaceId || undefined,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      if (res.status === 401) clearStoredToken()
      throw new Error(data.error ?? 'Failed to fetch result')
    }
    setResult(data as TaxiFullResult)
    setStatus('done')
    addSearch({
      pickup: currentForm.pickup,
      destination: currentForm.destination,
      pickupPlaceId: currentForm.pickupPlaceId,
      destPlaceId: currentForm.destPlaceId,
    })
  }

  const handleUnlock = () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    setStatus('paying')
  }

  const handlePaymentCancel = () => {
    setStatus('preview_done')
  }

  const handleReset = () => {
    setForm({ pickup: '', destination: '', pickupPlaceId: '', destPlaceId: '' })
    setPreview(null)
    setResult(null)
    setStatus('idle')
    setErrorMsg('')
    // Preserve token in dev so repeated testing doesn't require re-pasting
    if (process.env.NODE_ENV !== 'development') clearStoredToken()
  }

  // Listen for token issued by the success page after Stripe redirect
  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent<TokenEventDetail>).detail

      // Bundle: store all tokens, pop first for immediate use
      if (detail?.product === 'query_bundle' && detail.tokens?.length) {
        storeBundleTokens(detail.tokens)
        const token = popBundleToken()
        if (token && form.pickup && form.destination) {
          setStatus('loading')
          try {
            await fetchFullResult(token, form)
          } catch (err) {
            setStatus('error')
            setErrorMsg(err instanceof Error ? err.message : t('common_error'))
          }
        }
        return
      }

      const token = detail?.token ?? (detail as unknown as string) // backward compat

      if (detail?.product === 'country_pass' && detail.country) {
        storeCountryPass(detail.country, token)
      } else {
        storeToken(token)
      }

      if (form.pickup && form.destination) {
        setStatus('loading')
        try {
          await fetchFullResult(token, form)
        } catch (err) {
          setStatus('error')
          setErrorMsg(err instanceof Error ? err.message : t('common_error'))
        }
      }
    }
    window.addEventListener('ff:token', handler)
    return () => window.removeEventListener('ff:token', handler)
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ─────────────────────────────────────────────────────────────────
  if (status === 'done' && result) {
    return <TaxiResult result={result} onReset={handleReset} />
  }

  return (
    <div className="space-y-4">
      {/* Input form */}
      {(status === 'idle' || status === 'error') && (
        <form
          onSubmit={(e) => { e.preventDefault(); handlePreview() }}
          className="space-y-3"
        >
          <div>
            <label htmlFor="pickup" className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{t('taxi_from')}</label>
            <PlaceInput
              id="pickup"
              placeholder={t('taxi_pickup_placeholder')}
              value={form.pickup}
              onChange={(v) => setField('pickup', v)}
              onSelect={(addr, id) => setForm((f) => ({ ...f, pickup: addr, pickupPlaceId: id }))}
            />
            {/* Airport tip */}
            {isAirportPickup && (
              <div className="flex items-start gap-2 mt-2 px-1">
                <Plane size={12} className="text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-500 leading-snug">
                  Always use the official taxi queue — ignore touts inside the terminal.
                </p>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="destination" className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{t('taxi_to')}</label>
            <PlaceInput
              id="destination"
              placeholder={t('taxi_dest_placeholder')}
              value={form.destination}
              onChange={(v) => setField('destination', v)}
              onSelect={(addr, id) => setForm((f) => ({ ...f, destination: addr, destPlaceId: id }))}
            />
          </div>
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            disabled={!form.pickup.trim() || !form.destination.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {t('taxi_check_route')}
          </button>

          {/* Recent searches */}
          {recent.length > 0 && (
            <div className="pt-1 space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs text-zinc-600 uppercase tracking-wider">
                <Clock size={11} />
                Recent
              </p>
              {recent.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setForm({
                      pickup: r.pickup,
                      destination: r.destination,
                      pickupPlaceId: r.pickupPlaceId,
                      destPlaceId: r.destPlaceId,
                    })
                  }}
                  className="w-full text-left px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
                >
                  <p className="text-xs text-zinc-400 truncate">
                    <span className="text-zinc-300">{r.pickup}</span>
                    <span className="text-zinc-600 mx-1.5">→</span>
                    {r.destination}
                  </p>
                </button>
              ))}
            </div>
          )}
        </form>
      )}

      {/* Previewing */}
      {status === 'previewing' && (
        <div className="flex flex-col items-center gap-3 py-8 text-zinc-400">
          <Spinner className="h-7 w-7 text-purple-400" />
          <span className="text-sm">{t('taxi_calculating')}</span>
        </div>
      )}

      {/* Preview result + unlock */}
      {(status === 'preview_done' || status === 'loading') && preview && (
        <div className="space-y-4">
          <TaxiPreview preview={preview} />
          {status === 'loading' ? (
            <div className="flex flex-col items-center gap-3 py-4 text-zinc-400">
              <Spinner className="h-7 w-7 text-purple-400" />
              <span className="text-sm">{t('taxi_loading_full')}</span>
            </div>
          ) : (
            <button
              onClick={handleUnlock}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {t('taxi_unlock_btn')}
            </button>
          )}
          <button
            onClick={handleReset}
            className="w-full text-zinc-600 text-sm py-1.5 hover:text-zinc-400"
          >
            {t('taxi_change_route')}
          </button>
        </div>
      )}

      {/* Payment modal — pass country from preview for Country Pass offer */}
      {status === 'paying' && (
        <PaymentModal
          feature="taxi"
          country={preview?.country}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  )
}
