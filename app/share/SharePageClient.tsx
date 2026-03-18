'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Params {
  city?: string
  country?: string
  from?: string
  to?: string
  min?: string
  max?: string
  sym?: string
  curr?: string
  km?: string
  dur?: string
}

export default function SharePageClient({ params }: { params: Params }) {
  const { city, country, from, to, min, max, sym, curr, km, dur } = params
  const [copied, setCopied] = useState(false)

  const hasFare = !!(min && max && min !== '0')
  const location = [city, country].filter(Boolean).join(', ')
  const taxiUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(taxiUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="space-y-5 max-w-sm mx-auto">
      {/* Result card — mirrors what's in the OG image */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🚕</span>
          {location && (
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{location}</span>
          )}
        </div>

        {(from || to) && (
          <div className="space-y-1">
            {from && <p className="text-sm text-zinc-200 font-medium">{from}</p>}
            <p className="text-xs text-zinc-600">↓</p>
            {to && <p className="text-sm text-zinc-200 font-medium">{to}</p>}
          </div>
        )}

        <div>
          <p className="text-xs text-zinc-600 mb-1 uppercase tracking-wider">Estimated fare</p>
          {hasFare ? (
            <p className="text-3xl font-bold text-white">
              {sym}{min}–{sym}{max}
              {curr && (
                <span className="text-sm font-normal text-zinc-500 ml-2">{curr}</span>
              )}
            </p>
          ) : (
            <p className="text-zinc-500 text-sm">Verify fare with driver</p>
          )}
        </div>

        {(km || dur) && (
          <div className="flex gap-5 pt-2 border-t border-zinc-800">
            {dur && <span className="text-xs text-zinc-500">⏱ {dur}</span>}
            {km && <span className="text-xs text-zinc-500">📏 {km} km</span>}
          </div>
        )}
      </div>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-medium py-3 rounded-xl transition-colors"
      >
        {copied ? (
          <><Check size={14} className="text-green-400" /><span className="text-green-400">Link copied!</span></>
        ) : (
          <><Copy size={14} /><span>Copy share link</span></>
        )}
      </button>

      {/* CTA */}
      <div className="text-center space-y-3">
        <p className="text-zinc-500 text-sm">Check the fare for your own route</p>
        <Link
          href="/taxi"
          className="block w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3.5 rounded-xl transition-colors text-center"
        >
          Check my taxi fare →
        </Link>
        <p className="text-zinc-600 text-xs">120+ cities · No account needed · $0.99 per check</p>
      </div>
    </div>
  )
}
