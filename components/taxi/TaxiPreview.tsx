import type { TaxiPreviewResult } from '@/types'
import { MapPin, Route, Lock } from 'lucide-react'

interface Props {
  preview: TaxiPreviewResult
}

function SvgIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <img
      src={`/icons/SVG/${name}.svg`}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  )
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
          <div className="flex justify-center mb-2">
            <SvgIcon name="distance" size={28} />
          </div>
          <p className="text-2xl font-bold text-white">{preview.distance.km}</p>
          <p className="text-xs text-zinc-500 mt-0.5">km · {preview.distance.mi} mi</p>
        </div>
        <div className="bg-zinc-900 ring-1 ring-zinc-800 rounded-2xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <SvgIcon name="time-duration" size={28} />
          </div>
          <p className="text-2xl font-bold text-white">{preview.duration.minutes}</p>
          <p className="text-xs text-zinc-500 mt-0.5">min driving</p>
        </div>
      </div>

      {/* Locked sections teaser */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
        {[
          // Blurred fare placeholder triggers loss-aversion — user sees there IS a number
          { label: 'Estimated fare', sublabel: 'With local currency conversion', blurred: '฿280 – ฿420' },
          { label: 'Scam alerts', sublabel: '3 warnings found' },
          { label: 'Phrase for driver', sublabel: 'In local language' },
        ].map(({ label, sublabel, blurred }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm text-zinc-400">{label}</p>
              <p className="text-xs text-zinc-600">{sublabel}</p>
            </div>
            {blurred ? (
              <span
                className="text-base font-bold text-white blur-sm select-none pointer-events-none"
                aria-hidden="true"
              >
                {blurred}
              </span>
            ) : (
              <Lock size={16} className="text-zinc-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
