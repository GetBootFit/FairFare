import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Car, Plane } from 'lucide-react'
import { AIRPORT_DATA } from '@/lib/airport-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Airport Taxi Fares — Fare Guides for Major International Airports',
  description:
    'Taxi fare guides for the world\'s busiest airports: Bangkok BKK, Dubai DXB, Singapore SIN, London LHR, New York JFK. Know the real cost before you land.',
  alternates: { canonical: 'https://fairfare.app/taxi/airport' },
}

export default function AirportIndexPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/taxi" className="hover:text-zinc-300 transition-colors">Taxi Fare Check</Link>
        <ChevronRight size={12} />
        <span className="text-zinc-400">Airports</span>
      </nav>

      {/* Hero */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-800/50 flex items-center justify-center text-purple-400 shrink-0">
          <Plane size={20} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Airport Taxi Guides</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Fair fares, scam warnings & alternatives</p>
        </div>
      </div>

      {/* Airport cards */}
      <div className="space-y-3">
        {Object.values(AIRPORT_DATA).map((airport) => (
          <Link
            key={airport.code}
            href={`/taxi/airport/${airport.code}`}
            className="block bg-zinc-900 border border-zinc-800 hover:border-purple-800/50 rounded-2xl p-4 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 group-hover:bg-purple-900/30 flex items-center justify-center transition-colors">
                  <Car size={18} className="text-purple-400" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{airport.code}</span>
                    <span className="text-zinc-600 text-xs">{airport.city}, {airport.country}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[220px]">{airport.name}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-purple-400 font-semibold text-sm">{airport.approxCityFare}</p>
                <p className="text-zinc-600 text-xs mt-0.5">to city centre</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="border border-zinc-800 rounded-2xl p-4 text-center space-y-3">
        <p className="text-zinc-400 text-sm">Need a different city?</p>
        <Link
          href="/taxi"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
        >
          Check any route → <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}
