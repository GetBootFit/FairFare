'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PlaceInput } from '@/components/ui/PlaceInput'

const STORAGE_KEY = 'ff_taxi_form'

// Popular tipping destinations — covers the top search markets
const TIPPING_QUICK_LINKS = [
  { flag: '🇺🇸', label: 'USA',       slug: 'united-states' },
  { flag: '🇯🇵', label: 'Japan',     slug: 'japan' },
  { flag: '🇦🇺', label: 'Australia', slug: 'australia' },
  { flag: '🇬🇧', label: 'UK',        slug: 'united-kingdom' },
  { flag: '🇹🇭', label: 'Thailand',  slug: 'thailand' },
  { flag: '🇦🇪', label: 'UAE',       slug: 'united-arab-emirates' },
]

export function HomeTaxiForm() {
  const router = useRouter()
  const [tab, setTab] = useState<'taxi' | 'tipping'>('taxi')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupPlaceId, setPickupPlaceId] = useState('')
  const [destPlaceId, setDestPlaceId] = useState('')
  const [shake, setShake] = useState(false)

  const handlePickupSelect = useCallback((address: string, placeId: string) => {
    setPickup(address)
    setPickupPlaceId(placeId)
  }, [])

  const handleDestSelect = useCallback((address: string, placeId: string) => {
    setDestination(address)
    setDestPlaceId(placeId)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup.trim() || !destination.trim()) {
      setShake(true)
      setTimeout(() => setShake(false), 450)
      return
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        pickup, destination, pickupPlaceId, destPlaceId,
      }))
    } catch { /* ignore */ }
    router.push('/taxi')
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-700 rounded-2xl p-4">
      {/* Tab toggle */}
      <div className="flex gap-1 mb-4 bg-zinc-800/60 rounded-xl p-1">
        <button
          onClick={() => setTab('taxi')}
          className={`flex-1 text-sm py-1.5 px-3 rounded-lg font-medium transition-all duration-150 ${
            tab === 'taxi'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          🚕 Taxi Fare
        </button>
        <button
          onClick={() => setTab('tipping')}
          className={`flex-1 text-sm py-1.5 px-3 rounded-lg font-medium transition-all duration-150 ${
            tab === 'tipping'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          💰 Tipping Guide
        </button>
      </div>

      {tab === 'taxi' && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="home-pickup" className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">
              Pickup
            </label>
            <PlaceInput
              id="home-pickup"
              placeholder="Airport, hotel, address…"
              value={pickup}
              onChange={setPickup}
              onSelect={handlePickupSelect}
            />
          </div>
          <div>
            <label htmlFor="home-dest" className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">
              Drop-off
            </label>
            <PlaceInput
              id="home-dest"
              placeholder="Destination…"
              value={destination}
              onChange={setDestination}
              onSelect={handleDestSelect}
            />
          </div>
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm mt-1 ${shake ? 'animate-shake' : ''}`}
          >
            Check Fare <ArrowRight size={15} />
          </button>
          <p className="text-center text-[10px] text-zinc-600 pt-0.5">
            Free preview · Unlock full result from $2.99
          </p>
        </form>
      )}

      {tab === 'tipping' && (
        <div className="space-y-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Full tipping breakdown for restaurants, taxis, hotels, spas &amp; tour guides — 56 countries.
          </p>
          {/* Popular country quick-links */}
          <div className="grid grid-cols-3 gap-1.5">
            {TIPPING_QUICK_LINKS.map(({ flag, label, slug }) => (
              <Link
                key={slug}
                href={`/tipping/${slug}`}
                className="flex items-center gap-1.5 bg-zinc-800/60 hover:bg-purple-900/40 border border-zinc-700 hover:border-purple-700/60 rounded-xl px-2.5 py-2 transition-all group"
              >
                <span className="text-sm shrink-0">{flag}</span>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors truncate">{label}</span>
              </Link>
            ))}
          </div>
          <Link
            href="/tipping"
            className="flex items-center justify-between gap-3 w-full bg-purple-900/30 hover:bg-purple-900/50 border border-purple-800/40 hover:border-purple-600/60 rounded-xl px-4 py-2.5 transition-all group"
          >
            <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">All 56 countries →</span>
            <ArrowRight size={13} className="text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
          <p className="text-center text-[10px] text-zinc-600">
            Unlock from $2.99 · No account needed
          </p>
        </div>
      )}
    </div>
  )
}
