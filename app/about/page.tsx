import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Banknote, MapPin, Brain, CreditCard, ShieldCheck } from 'lucide-react'
import { getUSDPrices } from '@/lib/currency'

export const metadata: Metadata = {
  title: 'About Hootling | Travel wise, pay right',
  description: 'Learn how Hootling helps international travellers get fair taxi prices and tipping guidance — powered by Google Maps and Anthropic Claude.',
}

export default function AboutPage() {
  const { single } = getUSDPrices()
  return (
    <div className="space-y-8 pb-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/owl/character/owl-front.svg"
            alt="Hootling the owl"
            width={120}
            height={120}
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">About Hootling</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Hootling gives travellers the confidence to jump in any taxi, anywhere in the
          world — without getting ripped off or undertipping.
        </p>
      </div>

      {/* The problem */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Why it exists</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Arriving in a new city after a long flight is stressful enough. Negotiating
          with a taxi driver when you don&apos;t know the local fare, don&apos;t speak the
          language, and can&apos;t tell a fair price from a tourist trap is worse. Travellers
          get ripped off every day in cities all over the world — overcharged fares,
          rigged meters, unofficial &ldquo;taxis&rdquo; with no accountability.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Hootling was built to fix that. The name combines the wisdom of the owl with
          the English diminutive &ldquo;-ling&rdquo; — a baby owl, curious and wide-eyed,
          exploring the world for the first time, just like every traveller in a new city.
          Our mascot is Hootling: a baby owl with golden yellow feathers, a teal backpack,
          and big curious teal eyes. He&apos;s been everywhere — and he always knows the
          fair price.
        </p>
        <div className="flex justify-center py-2">
          <Image
            src="/images/owl/stickers/owl-flying.svg"
            alt="Hootling the owl"
            width={96}
            height={96}
            className="drop-shadow-lg"
          />
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Hootling solves the taxi problem in under five seconds, from {single}.
          Real meter rate data sourced from local taxi authorities. AI-powered scam
          warnings from Anthropic Claude. 120+ cities, 50+ countries. No subscription.
        </p>
      </section>

      {/* Features */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">What it does</h2>
        <FeatureRow
          icon={<Car size={18} />}
          color="text-purple-400"
          bg="bg-purple-900/20"
          title="Taxi Fare Check"
          description="Enter your pickup and destination to get a fair price range, city-specific scam warnings, and the local phrase to confirm the fare before you get in."
        />
        <FeatureRow
          icon={<Banknote size={18} />}
          color="text-teal-400"
          bg="bg-teal-900/20"
          title="Tipping Guide"
          description="Choose a country to see tipping norms for restaurants, taxis, hotel porters, bars, tour guides, and delivery — with clear 'expected / optional / avoid' ratings."
        />
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">How it works</h2>
        <ol className="space-y-3">
          <Step
            number="1"
            title="Enter your route or country"
            description="Type your pickup and destination for a taxi check, or pick a country for a tipping guide. Autocomplete makes it fast."
          />
          <Step
            number="2"
            title="See the free preview"
            description="Route distance and travel time load instantly — no payment needed to check you've entered the right locations."
          />
          <Step
            number="3"
            title={`Unlock from ${single}`}
            description="Pay once with card, Apple Pay, or Google Pay. No account, no subscription. Choose a single query, Country Pass, or 10-query bundle."
          />
          <Step
            number="4"
            title="Travel with confidence"
            description="Get the fare range, scam alerts, a local phrase for your driver, and full tipping guidance — all in one clear view."
          />
        </ol>
      </section>

      {/* Powered by */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Powered by</h2>
        <div className="space-y-2">
          <PoweredByRow
            icon={<MapPin size={16} />}
            name="Google Maps Platform"
            detail="Route distance, duration, and address autocomplete"
          />
          <PoweredByRow
            icon={<Brain size={16} />}
            name="Anthropic Claude"
            detail="AI-generated scam warnings, tipping advice, and driver phrases"
          />
          <PoweredByRow
            icon={<CreditCard size={16} />}
            name="Stripe"
            detail="Secure payment processing — we never see your card details"
          />
        </div>
      </section>

      {/* Privacy promise */}
      <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck size={18} className="text-purple-400" />
          <span className="text-sm font-semibold">Our privacy promise</span>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-400">
          <li>✓ No user accounts or personal profiles</li>
          <li>✓ No payment card details stored by us</li>
          <li>✓ No advertising or tracking cookies</li>
          <li>✓ Query results cached by city name only — no personal data</li>
        </ul>
        <p className="text-xs text-zinc-600 pt-1">
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
            Read the full Privacy Policy →
          </Link>
        </p>
      </section>

      {/* CTA */}
      <div className="space-y-2">
        <Link
          href="/taxi"
          className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Try Taxi Fare Check →
        </Link>
        <Link
          href="/tipping"
          className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Try Tipping Guide →
        </Link>
      </div>

      <div className="pt-2 border-t border-zinc-800">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
          ← Back to Hootling
        </Link>
      </div>
    </div>
  )
}

function FeatureRow({
  icon, color, bg, title, description,
}: {
  icon: React.ReactNode
  color: string
  bg: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
      <div className={`mt-0.5 w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white mb-0.5">{title}</p>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <li className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-800/50 flex items-center justify-center text-xs font-bold text-purple-400 shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <p className="text-sm font-medium text-white mb-0.5">{title}</p>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </li>
  )
}

function PoweredByRow({ icon, name, detail }: { icon: React.ReactNode; name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800">
      <span className="text-zinc-400">{icon}</span>
      <div>
        <p className="text-xs font-medium text-zinc-200">{name}</p>
        <p className="text-xs text-zinc-500">{detail}</p>
      </div>
    </div>
  )
}
