import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Car, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Taxi Scam Warning Signs: A Country-by-Country Guide (2026) | Hootling',
  description:
    'The most common taxi scams by region and country — broken meters, fake taxis, airport touts, and long-routing. Know the warning signs before you travel.',
  alternates: { canonical: 'https://hootling.com/taxi/scams' },
  openGraph: {
    title: 'Taxi Scam Warning Signs: A Country-by-Country Guide',
    description: 'Know the warning signs before you travel. Common taxi scams by region: Southeast Asia, Middle East, Africa, Europe, and Latin America.',
    url: 'https://hootling.com/taxi/scams',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Taxi Scam Warning Signs: A Country-by-Country Guide (2026)',
  description: 'The most common taxi scams by region and country — broken meters, fake taxis, airport touts, and long-routing.',
  url: 'https://hootling.com/taxi/scams',
  author: { '@type': 'Organization', name: 'Hootling', url: 'https://hootling.com' },
  publisher: { '@type': 'Organization', name: 'Hootling', url: 'https://hootling.com' },
  datePublished: '2026-03-15',
  dateModified: '2026-03-15',
}

// ── Scam categories ─────────────────────────────────────────────────────────

interface Scam {
  name: string
  description: string
  howToAvoid: string
}

const UNIVERSAL_SCAMS: Scam[] = [
  {
    name: 'Broken Meter',
    description: 'The driver claims the meter is broken and offers a "special" fixed price — invariably higher than the meter would have shown.',
    howToAvoid: 'Exit and find another taxi. In countries where meters are legally required, a broken meter is often theatre. Use an app (Uber/Grab/Bolt) to bypass this entirely.',
  },
  {
    name: 'Long-Routing (Taking the Scenic Route)',
    description: 'The driver takes a longer route than necessary to inflate the metered fare. Common in cities where tourists are unlikely to know the correct route.',
    howToAvoid: 'Open Google Maps or similar before departure and watch the route. If the driver deviates significantly, politely point out the shorter route or question the detour.',
  },
  {
    name: 'Fake Taxis',
    description: 'Unofficial drivers pose as licensed taxis near airports, stations, and tourist areas. Their cars may look similar to real taxis. Risks range from severe overcharging to personal safety threats.',
    howToAvoid: 'Only use metered taxis from official stands, pre-booked hotel transfers, or recognised ride-hailing apps. Check for official licencing stickers on the dashboard.',
  },
  {
    name: 'Price Switching After Arrival',
    description: 'An upfront price is agreed, but the driver demands significantly more on arrival — citing "luggage fees," "night surcharge," "tolls," or simply changing the story.',
    howToAvoid: 'Agree the fare in writing (photo the quoted price on your phone) or use an app with upfront fixed pricing. If you agreed a price, stand firm on it.',
  },
  {
    name: 'Airport Touts',
    description: 'Unofficial drivers approach you in the arrivals hall before you reach the official taxi zone. They offer "better prices" but are unlicensed and unregulated.',
    howToAvoid: 'Walk past anyone who approaches you in the terminal. Only use pre-paid booths or the official taxi rank outside arrivals — signage is usually clear.',
  },
  {
    name: 'Currency Confusion',
    description: 'Drivers quote prices in a different currency, use the wrong denomination, or make change in a way that costs you more (e.g., quoting 10 when the currency is effectively 10× what you expected).',
    howToAvoid: 'Always clarify which currency is being quoted. Know the approximate local fare for your route in local currency before you travel.',
  },
]

// ── Regional guide ──────────────────────────────────────────────────────────

interface RegionScam {
  city: string
  citySlug?: string
  scam: string
  detail: string
}

const REGIONS = [
  {
    region: 'Southeast Asia',
    intro: 'Southeast Asia has some of the most tourist-friendly cities in the world — and some of the most practised taxi scams. App-based transport (Grab, Gojek, Be) has dramatically reduced risk, but metered taxis in tourist corridors still warrant vigilance.',
    cities: [
      {
        city: 'Bangkok',
        citySlug: 'bangkok',
        scam: 'Meter refusal and flat-rate quotes',
        detail: 'Bangkok taxi drivers legally must use meters, but refusal is common at airports, train stations, and tourist areas. Drivers also offer "flat rate" trips to popular destinations at 2–3× the metered fare. Always insist on the meter or use Grab.',
      },
      {
        city: 'Phuket',
        citySlug: 'phuket',
        scam: 'Airport mafia and fixed-zone pricing',
        detail: 'Phuket has a local taxi cartel that operates without meters. Fares are fixed by zone and are significantly higher than Grab or metered taxis in Bangkok. "Tuk-tuk tours" to gem shops and tailor shops are common commission schemes — the driver earns a kickback for bringing you in.',
      },
      {
        city: 'Ho Chi Minh City',
        citySlug: 'ho_chi_minh',
        scam: 'Fake Vinasun and Mai Linh branding',
        detail: 'Fake taxis mimic the trusted Vinasun and Mai Linh brands with nearly identical liveries, but different phone numbers and rigged meters that clock up 10–20× the legal rate. Check the URL on the door and the driver\'s ID before entering.',
      },
      {
        city: 'Bali',
        citySlug: 'bali',
        scam: 'Bluebird taxi substitutes and Kuta touts',
        detail: 'Only Bluebird taxis have honest meters in Bali. Other taxis use rigged or absent meters. In tourist areas like Kuta, drivers approach on foot quoting flat rates. Use Grab where available, or pre-book a Bluebird through their app.',
      },
      {
        city: 'Kuala Lumpur',
        citySlug: 'kuala_lumpur',
        scam: 'Meter refusal and tourist flat-rates',
        detail: 'KL metered taxis frequently offer flat rates in tourist areas (KLCC, Bukit Bintang). These are almost always more expensive than the meter would show. Grab has made this largely avoidable — it\'s the dominant option for most travellers.',
      },
    ] as RegionScam[],
  },
  {
    region: 'Middle East & Africa',
    intro: 'Many cities across the Middle East and Africa do not use taxi meters at all, or use them only in theory. Pre-negotiation is the norm. Knowing the correct fare range before you go is essential.',
    cities: [
      {
        city: 'Cairo',
        citySlug: 'cairo',
        scam: 'No meter, negotiated overcharging',
        detail: 'Most Cairo taxis do not use meters. Drivers quote tourist prices that can be 3–5× the correct local fare. Uber and Careem are the easiest solution. If taking a metered white taxi, insist the meter runs; for old black-and-white cabs, research the correct fare in EGP before negotiating.',
      },
      {
        city: 'Marrakech',
        citySlug: 'marrakech',
        scam: 'Meter refusal in petit taxis',
        detail: 'Marrakech petit taxis are legally required to use meters, but many refuse — especially for tourists near the Jemaa el-Fnaa. Always insist on the meter ("l-ʿadad, afak" in Darija). If a driver refuses, exit. Night surcharges (+50%) are legitimate but should apply only after 8 pm.',
      },
      {
        city: 'Dubai',
        citySlug: 'dubai',
        scam: 'Fake taxis outside official zones',
        detail: 'Dubai\'s official RTA taxis are well-regulated and honest. The scam risk is from unofficial drivers operating private cars near tourist areas who claim to offer "better prices." Always use official cream-coloured RTA taxis or Careem/Uber.',
      },
      {
        city: 'Istanbul',
        citySlug: 'istanbul',
        scam: 'Rate switching (Tariff 1 vs 2) and long-routing',
        detail: 'Istanbul taxis switch between Tariff 1 (day) and Tariff 2 (night) rates. Unscrupulous drivers use Tariff 2 during the day, inflating fares by 50%. Check the meter display shows "1" before 8 pm. Long-routing between the historic peninsula and Taksim is also common.',
      },
    ] as RegionScam[],
  },
  {
    region: 'Europe',
    intro: 'European taxis are generally well-regulated, but tourist overcharging still occurs in high-traffic areas. The most common tactics are fare manipulation and unofficial airport taxis.',
    cities: [
      {
        city: 'Rome',
        citySlug: 'rome',
        scam: 'Unofficial taxis at Termini and FCO',
        detail: 'Rome has a major problem with unofficial ("abusivo") taxis at Roma Termini station and Fiumicino airport. These drivers are not licensed and charge arbitrary fares. Licensed taxis are white with a "Comune di Roma" sign and a taximeter. FCO → Rome centro is a fixed €50 fare by official law.',
      },
      {
        city: 'Barcelona',
        citySlug: 'barcelona',
        scam: 'Luggage surcharges and "airport supplements"',
        detail: 'Legitimate supplementary charges apply in Barcelona (airport, night, luggage). Some drivers apply all supplements simultaneously regardless of what actually applies. Know the official tariff: El Prat to centre is Tarifa 2 (€20–40 range), with a €3.10 airport supplement — nothing more.',
      },
      {
        city: 'Amsterdam',
        citySlug: 'amsterdam',
        scam: 'Unofficial taxis outside Schiphol',
        detail: 'Schiphol has a strict regulated taxi zone. Unofficial drivers position themselves just outside the official queue and offer "faster" service at higher prices. Always use the Schiphol Taxi rank or Uber/Bolt from the designated zone.',
      },
      {
        city: 'Paris',
        citySlug: 'paris',
        scam: 'Unmarked private hire cars posing as taxis',
        detail: 'Paris taxis are cream-coloured with a roof-mounted light. Private hire vehicles (VTC) cannot legally pick up passengers hailed on the street. Some drivers in tourist areas bypass this rule. Use the G7 or Taxi Bleu apps, or Uber/Bolt for clear licensing.',
      },
    ] as RegionScam[],
  },
  {
    region: 'Latin America',
    intro: 'Latin America has the highest concentration of serious taxi-related safety incidents globally. In several cities, street-hailed taxis carry genuine personal safety risks. App-based transport is strongly recommended.',
    cities: [
      {
        city: 'Mexico City',
        citySlug: 'mexico_city',
        scam: 'Express kidnapping via street taxis',
        detail: 'Mexico City is one of the few cities where street-hailed taxis carry a genuine risk of express kidnapping — a short-term robbery where the driver drives the victim to ATMs. This is not theoretical: it is a well-documented crime. Never hail a taxi on the street in CDMX. Use Uber, Cabify, or registered sitio taxis exclusively.',
      },
      {
        city: 'Buenos Aires',
        citySlug: 'buenos_aires',
        scam: 'Bill switching and fake notes',
        detail: 'A Buenos Aires-specific scam: the driver switches your payment note for a counterfeit or smaller denomination, then claims you paid incorrectly. Pay by card where possible, or use exact change. Have the app show the fare before paying.',
      },
    ] as RegionScam[],
  },
]

const WARNING_SIGNS = [
  'Driver quotes a price before you state your destination',
  'Driver refuses to start the meter or claims it is broken',
  'Driver insists on "helping" with your luggage before fare is agreed',
  'Car has no visible licensing sticker, taximeter, or driver ID card',
  'Driver approaches you inside the terminal (not at the official rank)',
  'Quoted price is in a currency different from local currency',
  'Driver takes a route that diverges significantly from Google Maps',
  'Companion gets into the front seat uninvited',
]

const GREEN_FLAGS = [
  'Official taxi rank or pre-paid booth with posted fare list',
  'Meter starts automatically when the car moves',
  'Driver has a visible ID card and photo on the dashboard',
  'Car has official livery, roof sign, and municipality registration plates',
  'Pricing matches what you researched before travel',
  'Driver accepts the route you suggest without argument',
  'Receipt available on request',
]

export default function TaxiScamsPage() {
  return (
    <div className="space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Link href="/blog" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            Guides
          </Link>
          <span className="text-zinc-700 text-xs">›</span>
          <span className="text-xs text-zinc-500">Taxi Scams</span>
        </div>
        <h1 className="text-2xl font-bold text-white leading-tight">
          Taxi Scam Warning Signs
          <span className="block text-lg font-normal text-zinc-400 mt-1">A Country-by-Country Guide (2026)</span>
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Every year, millions of travellers pay more than they should for taxi rides — and many don&apos;t realise it. This guide covers the most common scam patterns by region, the warning signs to watch for, and how to protect yourself before you travel.
        </p>
      </div>

      {/* Universal red flags */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">The 6 Universal Taxi Scams</h2>
        <p className="text-xs text-zinc-500">These tactics are used worldwide — from Bangkok to Buenos Aires to Rome.</p>
        <div className="space-y-3">
          {UNIVERSAL_SCAMS.map((scam) => (
            <div key={scam.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                <h3 className="text-sm font-semibold text-white">{scam.name}</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{scam.description}</p>
              <div className="pt-1 border-t border-zinc-800">
                <p className="text-xs text-teal-400"><span className="font-medium">How to avoid: </span>{scam.howToAvoid}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Warning signs vs green flags */}
      <section className="grid grid-cols-1 gap-3">
        <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400 shrink-0" />
            <h2 className="text-sm font-semibold text-red-300">Red Flags — Exit the Taxi</h2>
          </div>
          <ul className="space-y-2">
            {WARNING_SIGNS.map((sign) => (
              <li key={sign} className="flex items-start gap-2 text-xs text-zinc-400">
                <span className="text-red-500 mt-0.5 shrink-0">✕</span>
                {sign}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-teal-950/30 border border-teal-900/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-teal-400 shrink-0" />
            <h2 className="text-sm font-semibold text-teal-300">Green Flags — You&apos;re in a Legitimate Taxi</h2>
          </div>
          <ul className="space-y-2">
            {GREEN_FLAGS.map((flag) => (
              <li key={flag} className="flex items-start gap-2 text-xs text-zinc-400">
                <span className="text-teal-500 mt-0.5 shrink-0">✓</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Regional guide */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold text-white">Scams by Region and City</h2>
        {REGIONS.map((region) => (
          <div key={region.region} className="space-y-3">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">{region.region}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{region.intro}</p>
            <div className="space-y-2">
              {region.cities.map((entry) => (
                <div key={entry.city} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Car size={12} className="text-zinc-500 shrink-0" />
                        {entry.citySlug ? (
                          <Link
                            href={`/taxi/${entry.citySlug}`}
                            className="text-sm font-semibold text-white hover:text-teal-400 transition-colors"
                          >
                            {entry.city}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-white">{entry.city}</span>
                        )}
                      </div>
                      <p className="text-xs text-amber-400 font-medium">{entry.scam}</p>
                    </div>
                    {entry.citySlug && (
                      <Link
                        href={`/taxi/${entry.citySlug}`}
                        className="shrink-0 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-0.5"
                      >
                        Fare check <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{entry.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* General protection tips */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">5 Rules That Work in Every Country</h2>
        <div className="space-y-2">
          {[
            { n: '1', tip: 'Research the fare before you arrive', detail: 'Know the approximate fare for your likely airport-to-hotel route in local currency. This is the single biggest scam deterrent — informed travellers are far less likely to be overcharged.' },
            { n: '2', tip: 'Use ride-hailing apps when available', detail: 'Uber, Grab, Bolt, Careem, Cabify, and InDriver offer fixed upfront pricing and GPS-tracked routes. They have effectively eliminated most scam risk in the cities where they operate.' },
            { n: '3', tip: 'Insist on the meter — or walk away', detail: 'In countries where meters are legal (most of them), a driver who refuses to use one is almost certainly overcharging. Exit immediately. There is always another taxi.' },
            { n: '4', tip: 'Sit in the back and stay aware of the route', detail: 'Follow the route on your phone. If the driver significantly deviates, calmly ask why. Knowing you\'re watching reduces the incentive to long-route.' },
            { n: '5', tip: 'Know the correct fare, not just a vague range', detail: 'Vague awareness of "roughly how much" isn\'t enough. Running a Hootling check before your trip gives you a specific, route-calculated fare range — so you know immediately whether a quoted price is legitimate.' },
          ].map(({ n, tip, detail }) => (
            <div key={n} className="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className="text-purple-400 font-bold text-sm shrink-0 w-4">{n}.</span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">{tip}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Car size={18} className="text-teal-400 shrink-0" />
          <h2 className="text-sm font-semibold text-white">Check the Correct Fare Before You Travel</h2>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Hootling calculates the expected taxi fare for your specific route — distance, local rates, and ±15% traffic range — so you know immediately whether a driver&apos;s quote is legitimate. Available for 120+ cities worldwide.
        </p>
        <Link
          href="/taxi"
          className="flex items-center justify-center gap-2 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Check taxi fare for my route <ArrowRight size={16} />
        </Link>
        <Link
          href="/blog/5-most-common-taxi-scams-and-how-to-avoid-them"
          className="block text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Read: The 5 Most Common Taxi Scams (detailed guide) →
        </Link>
      </div>

      {/* Related city links */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-400">City Fare Guides</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Bangkok', slug: 'bangkok' },
            { label: 'Dubai', slug: 'dubai' },
            { label: 'Rome', slug: 'rome' },
            { label: 'Istanbul', slug: 'istanbul' },
            { label: 'Cairo', slug: 'cairo' },
            { label: 'Marrakech', slug: 'marrakech' },
            { label: 'Ho Chi Minh City', slug: 'ho_chi_minh' },
            { label: 'Mexico City', slug: 'mexico_city' },
            { label: 'Paris', slug: 'paris' },
            { label: 'Barcelona', slug: 'barcelona' },
            { label: 'Amsterdam', slug: 'amsterdam' },
            { label: 'Phuket', slug: 'phuket' },
          ].map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/taxi/${slug}`}
              className="text-xs text-zinc-500 hover:text-teal-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
