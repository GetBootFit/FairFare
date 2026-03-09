import Link from 'next/link'
import { Banknote, Sparkles } from 'lucide-react'
import { TippingForm } from '@/components/tipping/TippingForm'

export const metadata = { title: 'Tipping Guide — FairFare' }

export default function TippingPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="w-10 h-10 rounded-xl bg-teal-900/40 border border-teal-800/50 flex items-center justify-center hover:bg-teal-900/60 transition-colors">
          <Banknote size={20} className="text-teal-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Tipping Guide</h1>
          <p className="text-xs text-zinc-500">How much is expected here?</p>
        </div>
        <Link
          href="/example"
          className="flex items-center gap-1 text-xs text-zinc-600 hover:text-teal-400 transition-colors shrink-0"
        >
          <Sparkles size={11} />
          Demo
        </Link>
      </div>
      <TippingForm />
    </div>
  )
}
