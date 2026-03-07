'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/Spinner'
import { storeToken, storeCountryPass, storeBundleTokens } from '@/lib/tokens'
import { Suspense } from 'react'

function SuccessInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState('')

  useEffect(() => {
    const sessionId = params.get('session_id')
    const redirect = params.get('redirect') ?? '/'

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
        setStatus('success')

        // Fire event so open TaxiForm/TippingForm can auto-submit
        window.dispatchEvent(
          new CustomEvent('ff:token', {
            detail: {
              token: data.token,
              tokens: data.tokens,    // present for query_bundle
              product: data.product,
              country: data.country,
            },
          })
        )

        // Redirect back after short delay
        setTimeout(() => router.push(redirect), 800)
      })
      .catch((err) => {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Something went wrong')
      })
  }, [params, router])

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Spinner className="h-8 w-8 text-purple-400" />
        <p className="text-zinc-400 text-sm">Verifying payment…</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="text-4xl">✅</div>
        <p className="text-white font-semibold text-lg">Payment confirmed</p>
        <p className="text-zinc-400 text-sm">Taking you back…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="text-4xl">❌</div>
      <p className="text-white font-semibold">Something went wrong</p>
      <p className="text-zinc-400 text-sm">{error}</p>
      <button
        onClick={() => router.push('/')}
        className="mt-2 text-purple-400 text-sm underline"
      >
        Go home
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
