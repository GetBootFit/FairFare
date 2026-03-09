import Link from 'next/link'
import { Car, Sparkles } from 'lucide-react'
import { TaxiForm } from '@/components/taxi/TaxiForm'

export const metadata = { title: 'Taxi Fare Check — FairFare' }

export default function TaxiPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pt-2">
        <Link href="/" className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-800/50 flex items-center justify-center hover:bg-purple-900/60 transition-colors">
          <Car size={20} className="text-purple-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Taxi Fare Check</h1>
          <p className="text-xs text-zinc-500">Is this driver charging you fairly?</p>
        </div>
        <Link
          href="/example"
          className="flex items-center gap-1 text-xs text-zinc-600 hover:text-purple-400 transition-colors shrink-0"
        >
          <Sparkles size={11} />
          Demo
        </Link>
      </div>
      <TaxiForm />
    </div>
  )
}
