'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'

interface EmailCaptureProps {
  feature?: 'taxi' | 'tipping'
  /** Visual variant — 'blog' for the blog index inline strip, 'post' for end-of-post placement */
  variant?: 'blog' | 'post'
}

export function EmailCapture({ feature = 'taxi', variant = 'blog' }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), feature }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle size={18} className="text-teal-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-white">You&apos;re on the list</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Check your inbox — we&apos;ve sent you a quick welcome note.
          </p>
        </div>
      </div>
    )
  }

  if (variant === 'post') {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Mail size={15} className="text-purple-400 shrink-0" />
          <p className="text-sm font-semibold text-white">
            Get travel tips in your inbox
          </p>
        </div>
        <p className="text-xs text-zinc-500">
          No spam — just occasional guides on taxi fares, tipping customs, and getting around
          without getting ripped off.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600 disabled:opacity-50 min-w-0"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm shrink-0 flex items-center gap-1.5"
          >
            {status === 'loading' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>Subscribe <ArrowRight size={13} /></>
            )}
          </button>
        </form>
        {status === 'error' && (
          <p className="text-xs text-red-400">{errorMsg}</p>
        )}
      </div>
    )
  }

  // variant === 'blog' — slim horizontal strip for the blog index
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-800/50 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
          <Mail size={15} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Get the weekly travel guide</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Taxi fares, tipping customs and scam warnings for a new city every week.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600 disabled:opacity-50 min-w-0"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shrink-0 flex items-center gap-1.5"
        >
          {status === 'loading' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>Join <ArrowRight size={13} /></>
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
      <p className="text-[10px] text-zinc-700 leading-relaxed">
        No spam. Unsubscribe any time.
      </p>
    </div>
  )
}
