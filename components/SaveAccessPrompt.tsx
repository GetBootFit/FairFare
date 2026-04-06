'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Reads all JWT tokens from localStorage and returns them as a flat array.
 * Filters out expired tokens before sending to the server.
 */
function collectValidTokens(): string[] {
  if (typeof window === 'undefined') return []
  const now = Math.floor(Date.now() / 1000)
  const tokens: string[] = []

  function isValid(tok: string): boolean {
    try {
      const [, b64] = tok.split('.')
      const payload = JSON.parse(atob(b64)) as { exp?: number }
      return (payload.exp ?? 0) > now
    } catch { return false }
  }

  // Single token
  const single = localStorage.getItem('ff_token')
  if (single && isValid(single)) tokens.push(single)

  // Country pass tokens (ff_pass_*)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('ff_pass_')) {
      const tok = localStorage.getItem(key)
      if (tok && isValid(tok)) tokens.push(tok)
    }
  }

  // Bundle queue
  try {
    const queue = JSON.parse(localStorage.getItem('ff_bundle_queue') ?? '[]') as string[]
    queue.filter(isValid).forEach(t => tokens.push(t))
  } catch { /* ignore */ }

  return tokens
}

export function SaveAccessPrompt() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setErrorMsg('Please enter a valid email address.')
      setState('error')
      return
    }

    const tokens = collectValidTokens()
    if (tokens.length === 0) {
      setErrorMsg('No active access found to save.')
      setState('error')
      return
    }

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/email/save-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), tokens }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? 'Failed to send. Please try again.')
        setState('error')
        return
      }
      setState('sent')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
        <div className="w-7 h-7 rounded-full bg-green-900/40 flex items-center justify-center shrink-0">
          <Check size={13} className="text-green-400" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">Check your email</p>
          <p className="text-xs text-zinc-500">Magic link sent to {email}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 space-y-3">
      <div className="flex items-center gap-2.5">
        <Mail size={14} className="text-zinc-500 shrink-0" />
        <p className="text-xs text-zinc-400">Save access to use on another device</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          placeholder="your@email.com"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-600 transition-colors min-w-0"
          disabled={state === 'loading'}
        />
        <button
          type="submit"
          disabled={state === 'loading' || !email}
          className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
        >
          {state === 'loading' ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            'Send link'
          )}
        </button>
      </form>
      {state === 'error' && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  )
}
