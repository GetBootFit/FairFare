'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PlaceInput } from '@/components/ui/PlaceInput'

const STORAGE_KEY = 'ff_taxi_form'

export function HomeTaxiForm() {
  const router = useRouter()
  const [tab, setTab] = useState<'taxi' | 'tipping'>('taxi')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupPlaceId, setPickupPlaceId] = useState('')
  const [destPlaceId, setDestPlaceId] = useState('')

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
    if (!pickup.trim() || !destination.trim()) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        pickup, destination, pickupPlaceId, destPlaceId,
      }))
    } catch { /* ignore */ }
    router.push('/taxi')
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
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
            disabled={!pickup.trim() || !destination.trim()}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm mt-1"
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
          <Link
            href="/tipping"
            className="flex items-center justify-between gap-3 w-full bg-purple-900/40 hover:bg-purple-900/60 border border-purple-800/50 hover:border-purple-600/70 rounded-xl px-4 py-3 transition-all group"
          >
            <span className="text-sm font-semibold text-white">Choose your country</span>
            <ArrowRight size={15} className="text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
          <p className="text-center text-[10px] text-zinc-600">
            Unlock from $2.99 · No account needed
          </p>
        </div>
      )}
    </div>
  )
}
