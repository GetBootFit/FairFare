'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function AccessRestorer() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = searchParams.get('t')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [count, setCount] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!t) {
      setErrorMsg('No access token found in this link.')
      setStatus('error')
      return
    }

    async function restore() {
      try {
        const res = await fetch(`/api/email/restore-access?t=${encodeURIComponent(t!)}`)
        const data = await res.json() as { tokens?: string[]; count?: number; error?: string }

        if (!res.ok || !data.tokens) {
          setErrorMsg(data.error ?? 'This link has expired or already been used.')
          setStatus('error')
          return
        }

        // Store valid tokens in localStorage using the same key patterns as tokens.ts
        for (const token of data.tokens) {
          try {
            const [, b64] = token.split('.')
            const payload = JSON.parse(atob(b64)) as {
              tokenType?: string
              country?: string
              feature?: string
            }

            if (payload.tokenType === 'bundle') {
              // Merge into bundle queue
              const existing = JSON.parse(localStorage.getItem('ff_bundle_queue') ?? '[]') as string[]
              if (!existing.includes(token)) {
                existing.push(token)
                localStorage.setItem('ff_bundle_queue', JSON.stringify(existing))
              }
            } else if (payload.tokenType === 'country_pass' && payload.country) {
              const passKey = `ff_pass_${payload.country.toLowerCase().trim().replace(/\s+/g, '_')}`
              localStorage.setItem(passKey, token)
            } else {
              // Single token — only store if it's the most recent (replace older one)
              const existing = localStorage.getItem('ff_token')
              if (!existing) {
                localStorage.setItem('ff_token', token)
              } else {
                // Keep whichever expires later
                try {
                  const [, eb64] = existing.split('.')
                  const existingPayload = JSON.parse(atob(eb64)) as { exp?: number }
                  const [, nb64] = token.split('.')
                  const newPayload = JSON.parse(atob(nb64)) as { exp?: number }
                  if ((newPayload.exp ?? 0) > (existingPayload.exp ?? 0)) {
                    localStorage.setItem('ff_token', token)
                  }
                } catch {
                  localStorage.setItem('ff_token', token)
                }
              }
            }
          } catch {
            // Skip malformed token
          }
        }

        setCount(data.count ?? data.tokens.length)
        setStatus('success')

        // Fire the token event so TaxiForm picks up the restored tokens automatically
        window.dispatchEvent(new CustomEvent('ff:token', { detail: { restored: true } }))

        // Redirect to /taxi after a short delay to let user read the success message
        setTimeout(() => router.push('/taxi'), 2500)
      } catch {
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('error')
      }
    }

    restore()
  }, [t, router])

  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-sm text-center space-y-6">

        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl">
            🦉
          </div>
          <p className="text-white font-bold text-xl tracking-tight">Hootling</p>
        </div>

        {status === 'loading' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-zinc-400 text-sm">Restoring your access…</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="text-3xl">✅</div>
            <p className="text-white font-semibold">Access restored!</p>
            <p className="text-zinc-400 text-sm">
              {count === 1
                ? '1 query token'
                : `${count} tokens`}{' '}
              loaded on this device. Redirecting you to the app…
            </p>
            <Link
              href="/taxi"
              className="inline-block mt-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Go to Taxi Fare Check →
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="text-3xl">⚠️</div>
            <p className="text-white font-semibold">Link not valid</p>
            <p className="text-zinc-400 text-sm">{errorMsg}</p>
            <p className="text-zinc-500 text-xs">
              Magic links expire after 24 hours and can only be used once.
              If your access has expired, you can purchase a new query at{' '}
              <Link href="/taxi" className="text-purple-400 hover:text-purple-300 underline">
                hootling.com/taxi
              </Link>
              .
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default function AccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AccessRestorer />
    </Suspense>
  )
}
