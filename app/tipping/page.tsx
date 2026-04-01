import Link from 'next/link'
import { Globe } from 'lucide-react'
import { TippingForm } from '@/components/tipping/TippingForm'
import { TippingPageHeader } from '@/components/tipping/TippingPageHeader'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata = { title: 'Tipping Guide — Hootling' }

export default function TippingPage() {
  return (
    <div className="space-y-5">
      <TippingPageHeader />

      <ErrorBoundary>
        <TippingForm />
      </ErrorBoundary>

      {/* Link to all countries */}
      <Link
        href="/tipping/countries"
        className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors group"
      >
        <span className="text-teal-400 shrink-0">🌍</span>
        <span className="flex-1 min-w-0 truncate text-[11px]">Browse all 56 countries — tipping customs by destination</span>
        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 rtl:rotate-180">→</span>
      </Link>

      {/* Link to the global overview guide */}
      <Link
        href="/tipping/guide"
        className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors group"
      >
        <Globe size={12} className="text-purple-400 shrink-0" />
        <span className="flex-1 min-w-0 truncate text-[11px]">Global Tipping Customs 2026 — country-by-country overview</span>
        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 rtl:rotate-180">→</span>
      </Link>
    </div>
  )
}
