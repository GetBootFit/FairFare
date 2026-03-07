'use client'

import Link from 'next/link'
import { WifiOff, Car, Banknote } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <WifiOff size={28} className="text-zinc-500" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-white">You&apos;re offline</h1>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
          FairFare needs an internet connection to calculate fares and fetch tipping guides.
          Check your connection and try again.
        </p>
      </div>

      {/* What works offline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 w-full max-w-xs text-left space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Cached pages available</p>
        <Link
          href="/"
          className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-900/30 flex items-center justify-center">
            <Car size={14} className="text-purple-400" />
          </div>
          Home
        </Link>
        <Link
          href="/taxi"
          className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-900/30 flex items-center justify-center">
            <Car size={14} className="text-purple-400" />
          </div>
          Taxi Fare Check
        </Link>
        <Link
          href="/tipping"
          className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-teal-900/30 flex items-center justify-center">
            <Banknote size={14} className="text-teal-400" />
          </div>
          Tipping Guide
        </Link>
      </div>

      {/* Retry */}
      <button
        onClick={() => window.location.reload()}
        className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
      >
        Try again ↻
      </button>
    </div>
  )
}
