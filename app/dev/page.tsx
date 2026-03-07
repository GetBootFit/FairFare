'use client'

/**
 * Dev-only page for bypassing Stripe payment during local development.
 * Automatically hidden in production — redirects to home if NODE_ENV !== development.
 *
 * Visit: http://localhost:3000/dev
 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Banknote, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface TokenState {
  status: Status
  message: string
}

export default function DevPage() {
  const router = useRouter()
  const [taxi, setTaxi] = useState<TokenState>({ status: 'idle', message: '' })
  const [tipping, setTipping] = useState<TokenState>({ status: 'idle', message: '' })

  // Redirect to home in production
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      router.replace('/')
    }
  }, [router])

  async function getToken(feature: 'taxi' | 'tipping') {
    const setter = feature === 'taxi' ? setTaxi : setTipping
    setter({ status: 'loading', message: '' })

    try {
      const res = await fetch(`/api/dev/token?feature=${feature}`)
      const data = await res.json()

      if (!res.ok || !data.token) {
        setter({ status: 'error', message: data.error ?? 'Unknown error' })
        return
      }

      // Store token exactly the same way the payment flow does
      localStorage.setItem('ff_token', data.token)

      setter({
        status: 'success',
        message: `✓ Token stored (valid 24h). Redirecting to /${feature}…`,
      })

      setTimeout(() => router.push(`/${feature}`), 1000)
    } catch (err) {
      setter({ status: 'error', message: String(err) })
    }
  }

  async function getBothTokens() {
    // Get taxi token first, store it. Then get tipping — the last one written wins.
    // User can still switch by clicking the individual buttons afterwards.
    await Promise.all([
      fetch('/api/dev/token?feature=taxi').then(r => r.json()),
      fetch('/api/dev/token?feature=tipping').then(r => r.json()),
    ]).then(([taxiData, tippingData]) => {
      if (taxiData.token) localStorage.setItem('ff_token', taxiData.token)
      // Store tipping as a "country pass" wildcard for convenience
      if (tippingData.token) localStorage.setItem('ff_token_tipping_dev', tippingData.token)
      setTaxi({ status: 'success', message: '✓ Taxi token stored' })
      setTipping({ status: 'success', message: '✓ Tipping token stored as ff_token_tipping_dev' })
    }).catch(err => {
      setTaxi({ status: 'error', message: String(err) })
    })
  }

  function clearTokens() {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_token_tipping_dev')
    // Also clear any country pass tokens
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('ff_pass_')) localStorage.removeItem(key)
    }
    setTaxi({ status: 'idle', message: '' })
    setTipping({ status: 'idle', message: '' })
    alert('All FairFare tokens cleared from localStorage.')
  }

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-700/50 flex items-center justify-center">
          <Sparkles size={20} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Dev Mode</h1>
          <p className="text-xs text-amber-500">Local development only — never in production</p>
        </div>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">
        Bypass Stripe payment and get a <strong className="text-white">24-hour token</strong> for
        testing. Click a button below to issue a token and be redirected to the feature.
      </p>

      {/* Token buttons */}
      <div className="space-y-3">
        <TokenButton
          label="Unlock Taxi Fare Check"
          sublabel="Issues a 24h taxi token → redirects to /taxi"
          icon={<Car size={20} className="text-purple-400" />}
          bgColor="bg-purple-900/20"
          borderColor="border-purple-800/50"
          accentColor="text-purple-400"
          state={taxi}
          onClick={() => getToken('taxi')}
        />

        <TokenButton
          label="Unlock Tipping Guide"
          sublabel="Issues a 24h tipping token → redirects to /tipping"
          icon={<Banknote size={20} className="text-teal-400" />}
          bgColor="bg-teal-900/20"
          borderColor="border-teal-800/50"
          accentColor="text-teal-400"
          state={tipping}
          onClick={() => getToken('tipping')}
        />
      </div>

      {/* Clear tokens */}
      <div className="pt-2 border-t border-zinc-800">
        <button
          onClick={clearTokens}
          className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
        >
          Clear all tokens from localStorage
        </button>
      </div>

      {/* Info panel */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
        <p className="text-xs font-semibold text-zinc-400">How this works</p>
        <ul className="text-xs text-zinc-600 space-y-1 list-disc list-inside">
          <li>Calls <code className="text-zinc-500">/api/dev/token?feature=…</code> (dev only)</li>
          <li>Issues a JWT signed with your <code className="text-zinc-500">ENTITLEMENT_SECRET</code></li>
          <li>Stores token as <code className="text-zinc-500">ff_token</code> in localStorage</li>
          <li>Valid for 24 hours (vs 30 min in production)</li>
          <li>The API route returns 403 in production — safe to leave in code</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Sub-component ─────────────────────────────────────────────────────────────

interface TokenButtonProps {
  label: string
  sublabel: string
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  accentColor: string
  state: TokenState
  onClick: () => void
}

function TokenButton({
  label, sublabel, icon, bgColor, borderColor, state, onClick,
}: TokenButtonProps) {
  const isLoading = state.status === 'loading'
  const isSuccess = state.status === 'success'
  const isError = state.status === 'error'

  return (
    <button
      onClick={onClick}
      disabled={isLoading || isSuccess}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border ${borderColor}
        hover:bg-zinc-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-left`}
    >
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
        {isLoading ? (
          <Loader2 size={20} className="animate-spin text-zinc-400" />
        ) : isSuccess ? (
          <CheckCircle size={20} className="text-green-400" />
        ) : isError ? (
          <AlertCircle size={20} className="text-red-400" />
        ) : (
          icon
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {state.message ? (
          <p className={`text-xs mt-0.5 ${isError ? 'text-red-400' : 'text-green-400'}`}>
            {state.message}
          </p>
        ) : (
          <p className="text-xs text-zinc-500 mt-0.5">{sublabel}</p>
        )}
      </div>
    </button>
  )
}
