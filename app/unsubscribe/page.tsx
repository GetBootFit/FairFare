'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react'

function UnsubscribeForm() {
  const searchParams = useSearchParams()
  const emailFromParam = searchParams.get('email') ?? ''

  const [email, setEmail] = useState(emailFromParam)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Auto-submit if email is in URL params (from email link)
  useEffect(() => {
    if (emailFromParam) {
      handleUnsubscribe(emailFromParam)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleUnsubscribe(emailAddress?: string) {
    const target = emailAddress ?? email
    if (!target) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'You have been unsubscribed.')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-900/30 border border-green-700/40">
          <CheckCircle size={26} className="text-green-400" />
        </div>
        <div>
          <p className="text-white font-semibold">You&apos;re unsubscribed</p>
          <p className="text-sm text-zinc-400 mt-1">{message}</p>
          <p className="text-xs text-zinc-600 mt-2">You won&apos;t receive any more emails from Hootling.</p>
        </div>
        <Link href="/" className="inline-block text-sm text-purple-400 hover:text-purple-300 transition-colors">
          ← Back to Hootling
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {!emailFromParam && (
        <>
          <p className="text-sm text-zinc-400">
            Enter your email address to unsubscribe from Hootling travel tips and updates.
          </p>
          <div>
            <label htmlFor="email" className="block text-xs text-zinc-500 mb-1.5">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={15} />
          <span>{message}</span>
        </div>
      )}

      <button
        onClick={() => handleUnsubscribe()}
        disabled={status === 'loading' || !email}
        className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <><Loader2 size={15} className="animate-spin" /> Unsubscribing…</>
        ) : (
          'Unsubscribe'
        )}
      </button>

      <p className="text-xs text-zinc-600 text-center">
        Changed your mind?{' '}
        <Link href="/" className="text-zinc-500 hover:text-zinc-400 transition-colors underline">
          Keep me subscribed
        </Link>
      </p>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity mb-4">
            <Image src="/images/owl/expressions/owl-curious.svg" alt="Hootling" width={48} height={48} className="mx-auto" />
          </Link>
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 mb-3">
            <Mail size={18} className="text-zinc-400" />
          </div>
          <h1 className="text-lg font-semibold text-white">Unsubscribe</h1>
          <p className="text-sm text-zinc-500 mt-1">Hootling email updates</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <Suspense fallback={<div className="h-24 flex items-center justify-center"><Loader2 size={18} className="animate-spin text-zinc-600" /></div>}>
            <UnsubscribeForm />
          </Suspense>
        </div>

        <p className="text-xs text-zinc-700 text-center mt-4">
          Questions?{' '}
          <a href="mailto:hello@hootling.com" className="text-zinc-600 hover:text-zinc-500 transition-colors underline">
            hello@hootling.com
          </a>
        </p>
      </div>
    </div>
  )
}
