'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Banknote, MapPin, Brain, CreditCard, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getUSDPrices } from '@/lib/currency'

type AboutStrings = Record<string, string>

function getEnglishContent(): AboutStrings {
  const { single } = getUSDPrices()
  return {
    header_subtitle: 'Hootling gives travellers the confidence to jump in any taxi, anywhere in the world — without getting ripped off or undertipping.',
    why_heading: 'Why it exists',
    why_para1: "Arriving in a new city after a long flight is stressful enough. Negotiating with a taxi driver when you don't know the local fare, don't speak the language, and can't tell a fair price from a tourist trap is worse. Travellers get ripped off every day in cities all over the world — overcharged fares, rigged meters, unofficial \"taxis\" with no accountability.",
    why_para2: "Hootling was built to fix that. The name combines the wisdom of the owl with the English diminutive \"-ling\" — a baby owl, curious and wide-eyed, exploring the world for the first time, just like every traveller in a new city. Our mascot is Hootling: a baby owl with golden yellow feathers, a teal backpack, and big curious teal eyes. He's been everywhere — and he always knows the fair price.",
    why_para3: `Hootling solves the taxi problem in under five seconds, from ${single}. Real meter rate data sourced from local taxi authorities. AI-powered scam warnings from Anthropic Claude. 120+ cities, 50+ countries. No subscription.`,
    what_heading: 'What it does',
    feature_taxi_title: 'Taxi Fare Check',
    feature_taxi_desc: 'Enter your pickup and destination to get a fair price range, city-specific scam warnings, and the local phrase to confirm the fare before you get in.',
    feature_tipping_title: 'Tipping Guide',
    feature_tipping_desc: "Choose a country to see tipping norms for restaurants, taxis, hotel porters, bars, tour guides, and delivery — with clear 'expected / optional / avoid' ratings.",
    how_heading: 'How it works',
    step1_title: 'Enter your route or country',
    step1_desc: 'Type your pickup and destination for a taxi check, or pick a country for a tipping guide. Autocomplete makes it fast.',
    step2_title: 'See the free preview',
    step2_desc: "Route distance and travel time load instantly — no payment needed to check you've entered the right locations.",
    step3_title: `Unlock from ${single}`,
    step3_desc: 'Pay once with card, Apple Pay, or Google Pay. No account, no subscription. Choose a single query, Country Pass, or 10-query bundle.',
    step4_title: 'Travel with confidence',
    step4_desc: 'Get the fare range, scam alerts, a local phrase for your driver, and full tipping guidance — all in one clear view.',
    powered_heading: 'Powered by',
    google_detail: 'Route distance, duration, and address autocomplete',
    claude_detail: 'AI-generated scam warnings, tipping advice, and driver phrases',
    stripe_detail: 'Secure payment processing — we never see your card details',
    privacy_heading: 'Our privacy promise',
    privacy_1: 'No user accounts or personal profiles',
    privacy_2: 'No payment card details stored by us',
    privacy_3: 'No advertising or tracking cookies',
    privacy_4: 'Query results cached by city name only — no personal data',
    privacy_policy_link: 'Read the full Privacy Policy →',
    cta_taxi: 'Try Taxi Fare Check →',
    cta_tipping: 'Try Tipping Guide →',
    cta_example: 'See an example result first →',
    back: '← Back to Hootling',
  }
}

export function AboutContent() {
  const { locale } = useLanguage()
  const [s, setS] = useState<AboutStrings>(getEnglishContent)

  useEffect(() => {
    if (locale === 'en') { setS(getEnglishContent()); return }
    const cacheKey = `page_translation:about:${locale}`
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) { setS(JSON.parse(cached)); return }
    } catch { /* sessionStorage unavailable */ }

    fetch(`/api/translate/page?slug=about&locale=${locale}`)
      .then(r => r.json())
      .then((data: AboutStrings) => {
        setS(data)
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)) } catch { /* ignore */ }
      })
      .catch(() => { /* keep English */ })
  }, [locale])

  return (
    <div className="space-y-8 pb-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Image src="/images/owl/character/owl-front.svg" alt="Hootling the owl" width={120} height={120} className="drop-shadow-lg" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">About Hootling</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.header_subtitle}</p>
      </div>

      {/* The problem */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white">{s.why_heading}</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.why_para1}</p>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.why_para2}</p>
        <div className="flex justify-center py-2">
          <Image src="/images/owl/stickers/owl-flying.svg" alt="Hootling the owl" width={96} height={96} className="drop-shadow-lg" />
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.why_para3}</p>
      </section>

      {/* Features */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">{s.what_heading}</h2>
        <FeatureRow icon={<Car size={18} />} color="text-purple-400" bg="bg-purple-900/20" title={s.feature_taxi_title} description={s.feature_taxi_desc} />
        <FeatureRow icon={<Banknote size={18} />} color="text-teal-400" bg="bg-teal-900/20" title={s.feature_tipping_title} description={s.feature_tipping_desc} />
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">{s.how_heading}</h2>
        <ol className="space-y-3">
          <Step number="1" title={s.step1_title} description={s.step1_desc} />
          <Step number="2" title={s.step2_title} description={s.step2_desc} />
          <Step number="3" title={s.step3_title} description={s.step3_desc} />
          <Step number="4" title={s.step4_title} description={s.step4_desc} />
        </ol>
      </section>

      {/* Powered by */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">{s.powered_heading}</h2>
        <div className="space-y-2">
          <PoweredByRow icon={<MapPin size={16} />} name="Google Maps Platform" detail={s.google_detail} />
          <PoweredByRow icon={<Brain size={16} />} name="Anthropic Claude" detail={s.claude_detail} />
          <PoweredByRow icon={<CreditCard size={16} />} name="Stripe" detail={s.stripe_detail} />
        </div>
      </section>

      {/* Privacy promise */}
      <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck size={18} className="text-purple-400" />
          <span className="text-sm font-semibold">{s.privacy_heading}</span>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-400">
          {[s.privacy_1, s.privacy_2, s.privacy_3, s.privacy_4].map((item) => (
            <li key={item}>✓ {item}</li>
          ))}
        </ul>
        <p className="text-xs text-zinc-600 pt-1">
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300">{s.privacy_policy_link}</Link>
        </p>
      </section>

      {/* CTA */}
      <div className="space-y-2">
        <Link href="/taxi" className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm">{s.cta_taxi}</Link>
        <Link href="/tipping" className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm">{s.cta_tipping}</Link>
        <Link href="/example" className="block w-full text-center text-zinc-500 hover:text-zinc-300 text-sm py-2 transition-colors">{s.cta_example}</Link>
      </div>

      <div className="pt-2 border-t border-zinc-800">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">{s.back}</Link>
      </div>
    </div>
  )
}

function FeatureRow({ icon, color, bg, title, description }: { icon: React.ReactNode; color: string; bg: string; title: string; description: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
      <div className={`mt-0.5 w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>{icon}</div>
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
      <div className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-800/50 flex items-center justify-center text-xs font-bold text-purple-400 shrink-0 mt-0.5">{number}</div>
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
