import type { TaxiPreviewResult } from '@/types'
import { MapPin, Clock, Route, Lock } from 'lucide-react'

interface Props {
  preview: TaxiPreviewResult
}

export function TaxiPreview({ preview }: Props) {
  return (
    <div className="space-y-3">
      {/* Route header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-green-400 mt-0.5 shrink-0" />
          <span className="text-sm text-zinc-200 leading-snug">{preview.pickup}</span>
        </div>
        <div className="ml-2 border-l border-zinc-700 pl-5 py-0.5">
          <Route size={12} className="text-zinc-600 -ml-[18px]" />
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-red-400 mt-0.5 shrink-0" />
          <span className="text-sm text-zinc-200 leading-snug">{preview.destination}</span>
        </div>
      </div>

      {/* Distance / time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{preview.distance.km}</p>
          <p className="text-xs text-zinc-500 mt-0.5">km · {preview.distance.mi} mi</p>
        </div>
        <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4 text-center">
          <Clock size={20} className="mx-auto text-purple-400 mb-1" />
          <p className="text-2xl font-bold text-white">{preview.duration.minutes}</p>
          <p className="text-xs text-zinc-500 mt-0.5">min driving</p>
        </div>
      </div>

      {/* Locked sections teaser */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
        {[
          { label: 'Fair fare range', sublabel: 'With local currency' },
          { label: 'Scam alerts', sublabel: '3 warnings found' },
          { label: 'Phrase for driver', sublabel: 'In local language' },
        ].map(({ label, sublabel }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm text-zinc-400">{label}</p>
              <p className="text-xs text-zinc-600">{sublabel}</p>
            </div>
            <Lock size={16} className="text-zinc-600" />
          </div>
        ))}
      </div>
    </div>
  )
}
