'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/Spinner'
import { storeToken, storeCountryPass, storeBundleTokens } from '@/lib/tokens'
import { track } from '@vercel/analytics'
import { Suspense } from 'react'
import { AffiliateBlock } from '@/components/AffiliateBlock'
import { getPartnersForZoneSync } from '@/lib/affiliates'

function SuccessInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'email_capture' | 'error'>('verifying')
  const [redirect, setRedirect] = useState('/')
  const [error, setError] = useState('')
  const [feature, setFeature] = useState('taxi')
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'submitting' | 'done'>('idle')

  useEffect(() => {
    const sessionId = params.get('session_id')
    const dest = params.get('redirect') ?? '/'
    setRedirect(dest)

    if (!sessionId) {
      setStatus('error')
      setError('Missing payment session. Please try again.')
      return
    }

    fetch(`/api/payment/verify?session_id=${sessionId}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Verification failed')

        // Store token appropriately by product type
        if (data.product === 'query_bundle' && Array.isArray(data.tokens)) {
          storeBundleTokens(data.tokens)
        } else if (data.product === 'country_pass' && data.country) {
          storeCountryPass(data.country, data.token)
        } else {
          storeToken(data.token)
        }

        // Vercel Analytics — funnel conversion event with product + revenue context
        track('payment_completed', {
          product: data.product ?? 'single',
          feature: data.feature ?? 'unknown',
          value: data.amountTotal ? (data.amountTotal / 100).toFixed(2) : undefined,
          currency: data.currency ?? 'USD',
        })

        // GA4 e-commerce purchase event — attributes revenue to the acquisition source.
        // gtag is available only when NEXT_PUBLIC_GA4_ID is configured.
        // amount_total from Stripe is in the smallest currency unit (cents) — divide by 100.
        try {
          const g = (window as Window & { gtag?: (...a: unknown[]) => void }).gtag
          if (typeof g === 'function' && data.amountTotal) {
            const value = data.amountTotal / 100
            g('event', 'purchase', {
              transaction_id: params.get('session_id') ?? undefined,
              value,
              currency: data.currency ?? 'USD',
              items: [{
                item_id: data.product ?? 'single',
                item_name:
                  data.product === 'query_bundle'   ? 'Hootling 10-Query Bundle' :
                  data.product === 'country_pass'   ? `Hootling Country Pass — ${data.country ?? ''}` :
                  'Hootling Single Query',
                item_category: data.feature ?? 'taxi',
                price: value,
                quantity: 1,
              }],
            })
          }
        } catch { /* gtag unavailable */ }

        // Fire event so open TaxiForm/TippingForm can auto-submit
        window.dispatchEvent(
          new CustomEvent('ff:token', {
            detail: {
              token: data.token,
              tokens: data.tokens,
              product: data.product,
              country: data.country,
            },
          })
        )

        // Capture feature for personalised welcome email subject + content
        setFeature(data.feature ?? 'taxi')
        setStatus('email_capture')
      })
      .catch((err) => {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Something went wrong')
      })
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || emailStatus !== 'idle') return
    setEmailStatus('submitting')
    try {
      await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, feature }),
      })
    } catch { /* ignore — non-critical */ }
    setEmailStatus('done')
    router.push(redirect)
  }

  const handleSkip = () => {
    router.push(redirect)
  }

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Image
          src="/images/owl/stickers/owl-shrugging.svg"
          alt=""
          aria-hidden="true"
          width={80}
          height={80}
          className="animate-pulse"
        />
        <Spinner className="h-6 w-6 text-purple-400" />
        <p className="text-zinc-400 text-sm">Confirming your payment…</p>
        <p className="text-zinc-600 text-xs">This only takes a moment</p>
      </div>
    )
  }

  if (status === 'email_capture') {
    const successPartners = getPartnersForZoneSync('success', { maxItems: 3 })

    return (
      <div className="flex flex-col items-center gap-6 py-16 px-4 text-center max-w-sm mx-auto">
        <Image
          src="/images/owl/stickers/owl-celebrating.svg"
          alt=""
          aria-hidden="true"
          width={80}
          height={80}
          className="drop-shadow-lg"
        />
        <div>
          <p className="text-white font-semibold text-lg">Payment confirmed</p>
          <p className="text-zinc-500 text-sm mt-1">Your result is ready</p>
        </div>

        {/* Affiliate block — shown while result is loading */}
        {successPartners.length > 0 && (
          <div className="mt-4">
            <AffiliateBlock
              partners={successPartners}
              zone="success"
              tint="teal"
              headingKey="affiliate_while_loading"
            />
          </div>
        )}

        <div className="w-full border border-zinc-800 rounded-2xl p-5 bg-zinc-900/60 text-left space-y-4">
          <div>
            <p className="text-white text-sm font-medium">Get travel tips by email</p>
            <p className="text-zinc-500 text-xs mt-0.5">Scam alerts, tipping guides, and local know-how. No spam.</p>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-500 text-sm focus:border-zinc-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!email.trim() || emailStatus !== 'idle'}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {emailStatus === 'submitting' ? 'Saving…' : 'Get tips'}
            </button>
          </form>
        </div>

        <button
          onClick={handleSkip}
          className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors"
        >
          Skip — take me to my result
        </button>
      </div>
    )
  }

  // Detect a replayed / already-used session so we can show a friendlier message
  const isAlreadyUsed = /already|used|redeemed|replay/i.test(error)

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center px-4">
      <Image
        src="/images/owl/expressions/owl-worried.svg"
        alt=""
        aria-hidden="true"
        width={72}
        height={72}
      />
      <p className="text-white font-semibold">
        {isAlreadyUsed ? 'Link already redeemed' : 'Something went wrong'}
      </p>
      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
        {isAlreadyUsed
          ? 'This payment link has already been used. Your result is ready — go back to the app to see it.'
          : error}
      </p>
      <button
        onClick={() => router.push(isAlreadyUsed ? (redirect || '/') : '/')}
        className="mt-2 text-purple-400 text-sm underline"
      >
        {isAlreadyUsed ? 'Go to my result →' : 'Go home'}
      </button>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center gap-4 py-20">
        <Spinner className="h-8 w-8 text-purple-400" />
      </div>
    }>
      <SuccessInner />
    </Suspense>
  )
}
