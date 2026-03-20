'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, Rss, Plane, Database, ChevronRight, Mail } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type BusinessStrings = Record<string, string>

function getEnglishContent(): BusinessStrings {
  return {
    heading: 'Hootling for Business',
    subtitle: 'Accurate taxi fare data and tipping guidance for travel platforms, publishers, and corporate tools — via API, white-label, or data licence.',
    why_heading: 'Why it matters',
    why_para1: 'Every hotel booking, flight check-in, and trip itinerary has the same unanswered question: "How much will the taxi cost?" Hootling answers it — 120+ cities, real local meter rates, AI-verified scam warnings, and tipping guidance for 50+ countries.',
    why_para2: 'One mid-size travel platform integration reaches more users in a week than months of direct consumer growth.',
    who_heading: 'Who we work with',
    uc1_title: 'Travel platforms & booking apps',
    uc1_desc: 'Add taxi fare estimates at checkout — "Your hotel is 18 km from the airport. Estimated taxi: $12–15." Reduces post-booking anxiety and increases booking confidence.',
    uc1_pricing: 'API credits from $0.20 per query, or flat monthly access',
    uc2_title: 'Corporate travel management',
    uc2_desc: 'Give finance and travel managers real fare benchmarks to validate employee taxi expense claims. Eliminates out-of-policy disputes before they start.',
    uc2_pricing: 'From $299/month per company — white-label available',
    uc3_title: 'Travel bloggers & publishers',
    uc3_desc: 'Embed live fare widgets in your city guides or link to branded result pages. Monetise your traffic with accurate, up-to-date data your readers trust.',
    uc3_pricing: 'Publisher API from $99/month — co-branded pages available',
    uc4_title: 'Data licensing',
    uc4_desc: 'The Hootling dataset — 120+ cities of curated taxi rates and 50+ countries of tipping data — is a licensable asset for travel insurance, credit card concierge, and large-scale travel apps.',
    uc4_pricing: 'Annual data licence — contact us for pricing',
    what_heading: 'What you get',
    what_1: 'Real meter rate data from local taxi authorities — not crowdsourced estimates',
    what_2: 'City-specific scam warnings and local ride-hailing alternatives (Grab, Bolt, Uber)',
    what_3: 'Tipping norms for 6 scenarios across 50+ countries',
    what_4: 'AI-generated driver phrases in 14 languages',
    what_5: 'Airport transfer data for 20 major airports',
    what_6: 'Consistent JSON API — easy to integrate in hours, not weeks',
    sponsored_heading: 'Sponsored city placements',
    sponsored_body: 'Airport transfer operators (KiwiTaxi, Hoppa, Welcome Pickups) can sponsor the "getting from the airport" section on relevant city pages. Clearly labelled as sponsored. Minimal overhead — no code changes required on your side.',
    sponsored_note: 'Available on a per-city or per-region basis.',
    contact_heading: 'Get in touch',
    contact_body: "We respond to all business enquiries within one business day. Tell us your platform, your expected query volume, and what you're trying to solve.",
    cta_email: 'business@hootling.com',
    cta_try: 'Try the consumer product first',
    back: '← Back to Hootling',
  }
}

const USE_CASES = [
  { titleKey: 'uc1_title', descKey: 'uc1_desc', pricingKey: 'uc1_pricing', icon: <Plane size={17} />, color: 'text-teal-400', bg: 'bg-teal-900/20' },
  { titleKey: 'uc2_title', descKey: 'uc2_desc', pricingKey: 'uc2_pricing', icon: <Building2 size={17} />, color: 'text-purple-400', bg: 'bg-purple-900/20' },
  { titleKey: 'uc3_title', descKey: 'uc3_desc', pricingKey: 'uc3_pricing', icon: <Rss size={17} />, color: 'text-amber-400', bg: 'bg-amber-900/20' },
  { titleKey: 'uc4_title', descKey: 'uc4_desc', pricingKey: 'uc4_pricing', icon: <Database size={17} />, color: 'text-blue-400', bg: 'bg-blue-900/20' },
] as const

const WHAT_KEYS = ['what_1', 'what_2', 'what_3', 'what_4', 'what_5', 'what_6'] as const

export function BusinessContent() {
  const { locale } = useLanguage()
  const [s, setS] = useState<BusinessStrings>(getEnglishContent)

  useEffect(() => {
    if (locale === 'en') { setS(getEnglishContent()); return }
    const cacheKey = `page_translation:business:${locale}`
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) { setS(JSON.parse(cached)); return }
    } catch { /* sessionStorage unavailable */ }

    fetch(`/api/translate/page?slug=business&locale=${locale}`)
      .then(r => r.json())
      .then((data: BusinessStrings) => {
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
          <Image src="/images/owl/stickers/owl-thumbs-up.svg" alt="Hootling" width={96} height={96} className="drop-shadow-lg" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">{s.heading}</h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">{s.subtitle}</p>
      </div>

      {/* The pitch */}
      <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
        <p className="text-sm font-semibold text-white">{s.why_heading}</p>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.why_para1}</p>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.why_para2}</p>
      </section>

      {/* Use cases */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">{s.who_heading}</h2>
        {USE_CASES.map(({ titleKey, descKey, pricingKey, icon, color, bg }) => (
          <div key={titleKey} className="flex gap-3 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
            <div className={`mt-0.5 w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>{icon}</div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium text-white">{s[titleKey]}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{s[descKey]}</p>
              <p className="text-xs text-zinc-600 pt-0.5">{s[pricingKey]}</p>
            </div>
          </div>
        ))}
      </section>

      {/* What you get */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white">{s.what_heading}</h2>
        <ul className="space-y-1.5 text-sm text-zinc-400">
          {WHAT_KEYS.map((k) => (
            <li key={k} className="flex items-start gap-2">
              <span className="text-teal-400 shrink-0 mt-0.5">✓</span>
              <span>{s[k]}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sponsored city placements */}
      <section className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
        <p className="text-sm font-semibold text-white">{s.sponsored_heading}</p>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.sponsored_body}</p>
        <p className="text-xs text-zinc-600">{s.sponsored_note}</p>
      </section>

      {/* CTA */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">{s.contact_heading}</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{s.contact_body}</p>
        <a
          href="mailto:business@hootling.com"
          className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          <Mail size={15} />
          {s.cta_email}
        </a>
        <Link
          href="/taxi"
          className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          {s.cta_try}
          <ChevronRight size={14} />
        </Link>
      </section>

      <div className="pt-2 border-t border-zinc-800">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">{s.back}</Link>
      </div>
    </div>
  )
}
