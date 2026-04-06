import type { TaxiPreviewResult } from '@/types'
import { MapPin, Route, Lock } from 'lucide-react'
import { AffiliatePreviewStrip } from '@/components/AffiliatePreviewStrip'
import { getPartnersForZoneSync } from '@/lib/affiliates'

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
        <div className="ml-2 rtl:ml-0 rtl:mr-2 border-l rtl:border-l-0 rtl:border-r border-zinc-700 pl-5 rtl:pl-0 rtl:pr-5 py-0.5">
          <Route size={12} className="text-zinc-600 -ml-[18px] rtl:ml-0 rtl:-mr-[18px]" />
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

      {(() => {
        const previewPartners = getPartnersForZoneSync('preview', {
          categories: ['transfer'],
          maxItems: 2,
        })
        if (previewPartners.length === 0) return null
        return (
          <AffiliatePreviewStrip
            partners={previewPartners}
            city={preview.city}
            country={preview.country}
          />
        )
      })()}

      {/* Local knowledge card — free row at top, three locked rows below */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">

        {/* Free: general city taxi context — builds credibility, no route-specific numbers */}
        {preview.cityContext ? (
          <div className="px-4 py-3.5 flex items-start gap-3">
            <span className="text-teal-400 shrink-0 mt-0.5 text-base" aria-hidden="true">💡</span>
            <p className="text-sm text-teal-200 leading-relaxed">{preview.cityContext.note}</p>
          </div>
        ) : (
          <div className="px-4 py-3.5 flex items-start gap-3">
            <span className="text-zinc-600 shrink-0 mt-0.5 text-base" aria-hidden="true">🌍</span>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Fare estimate, scam warnings and driver phrases available — unlock below.
            </p>
          </div>
        )}

        {/* Locked: route-specific fare estimate */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm text-zinc-400">
              Fare estimate
              {preview.cityContext ? ` · ${preview.cityContext.currencySymbol} ${preview.cityContext.currency}` : ''}
            </p>
            <p className="text-xs text-zinc-600">Route-specific · ±15% for traffic &amp; variation</p>
          </div>
          <Lock size={16} className="text-zinc-600" />
        </div>

        {/* Locked: scam warnings — city-specific label maintains urgency */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm text-amber-400/90">⚠️ Scam warnings · {preview.city}</p>
            <p className="text-xs text-zinc-600">Known risks on this route</p>
          </div>
          <Lock size={16} className="text-zinc-600" />
        </div>

        {/* Locked: driver phrase */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-sm text-zinc-400">Phrase for driver</p>
            <p className="text-xs text-zinc-600">In local language</p>
          </div>
          <Lock size={16} className="text-zinc-600" />
        </div>

      </div>
    </div>
  )
}
