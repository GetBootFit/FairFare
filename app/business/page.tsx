import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, Rss, Plane, Database, ChevronRight, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Business & API Access | Hootling',
  description:
    'Integrate Hootling taxi fare data and tipping guides into your travel platform, app, or publication. API access, white-label, and data licensing available.',
}

export default function BusinessPage() {
  return (
    <div className="space-y-8 pb-4">

      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/owl/stickers/owl-thumbs-up.svg"
            alt="Hootling"
            width={96}
            height={96}
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Hootling for Business</h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
          Accurate taxi fare data and tipping guidance for travel platforms, publishers,
          and corporate tools — via API, white-label, or data licence.
        </p>
      </div>

      {/* The pitch */}
      <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
        <p className="text-sm font-semibold text-white">Why it matters</p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Every hotel booking, flight check-in, and trip itinerary has the same unanswered
          question: <span className="text-zinc-200">&ldquo;How much will the taxi cost?&rdquo;</span> Hootling
          answers it — 120+ cities, real local meter rates, AI-verified scam warnings, and tipping
          guidance for 50+ countries.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          One mid-size travel platform integration reaches more users in a week than months
          of direct consumer growth.
        </p>
      </section>

      {/* Use cases */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Who we work with</h2>

        <UseCase
          icon={<Plane size={17} />}
          color="text-teal-400"
          bg="bg-teal-900/20"
          title="Travel platforms &amp; booking apps"
          description='Add taxi fare estimates at checkout — "Your hotel is 18 km from the airport. Estimated taxi: $12–15." Reduces post-booking anxiety and increases booking confidence.'
          pricing="API credits from $0.20 per query, or flat monthly access"
        />

        <UseCase
          icon={<Building2 size={17} />}
          color="text-purple-400"
          bg="bg-purple-900/20"
          title="Corporate travel management"
          description="Give finance and travel managers real fare benchmarks to validate employee taxi expense claims. Eliminates out-of-policy disputes before they start."
          pricing="From $299/month per company — white-label available"
        />

        <UseCase
          icon={<Rss size={17} />}
          color="text-amber-400"
          bg="bg-amber-900/20"
          title="Travel bloggers &amp; publishers"
          description="Embed live fare widgets in your city guides or link to branded result pages. Monetise your traffic with accurate, up-to-date data your readers trust."
          pricing="Publisher API from $99/month — co-branded pages available"
        />

        <UseCase
          icon={<Database size={17} />}
          color="text-blue-400"
          bg="bg-blue-900/20"
          title="Data licensing"
          description="The Hootling dataset — 120+ cities of curated taxi rates and 50+ countries of tipping data — is a licensable asset for travel insurance, credit card concierge, and large-scale travel apps."
          pricing="Annual data licence — contact us for pricing"
        />
      </section>

      {/* Why Hootling data */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white">What you get</h2>
        <ul className="space-y-1.5 text-sm text-zinc-400">
          {[
            'Real meter rate data from local taxi authorities — not crowdsourced estimates',
            'City-specific scam warnings and local ride-hailing alternatives (Grab, Bolt, Uber)',
            'Tipping norms for 6 scenarios across 50+ countries',
            'AI-generated driver phrases in 14 languages',
            'Airport transfer data for 20 major airports',
            'Consistent JSON API — easy to integrate in hours, not weeks',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-teal-400 shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sponsored city tips */}
      <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
        <p className="text-sm font-semibold text-white">Sponsored city placements</p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Airport transfer operators (KiwiTaxi, Hoppa, Welcome Pickups) can sponsor the
          &ldquo;getting from the airport&rdquo; section on relevant city pages.
          Clearly labelled as sponsored. Minimal overhead — no code changes required on your side.
        </p>
        <p className="text-xs text-zinc-600">Available on a per-city or per-region basis.</p>
      </section>

      {/* CTA */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Get in touch</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          We respond to all business enquiries within one business day.
          Tell us your platform, your expected query volume, and what you&apos;re trying to solve.
        </p>
        <a
          href="mailto:business@hootling.com"
          className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          <Mail size={15} />
          business@hootling.com
        </a>
        <Link
          href="/taxi"
          className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Try the consumer product first
          <ChevronRight size={14} />
        </Link>
      </section>

      <div className="pt-2 border-t border-zinc-800">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
          ← Back to Hootling
        </Link>
      </div>

    </div>
  )
}

function UseCase({
  icon, color, bg, title, description, pricing,
}: {
  icon: React.ReactNode
  color: string
  bg: string
  title: string
  description: string
  pricing: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
      <div className={`mt-0.5 w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="space-y-1 min-w-0">
        <p className="text-sm font-medium text-white" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
        <p className="text-xs text-zinc-600 pt-0.5">{pricing}</p>
      </div>
    </div>
  )
}
