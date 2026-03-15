'use client'

import { useState, useEffect } from 'react'
import { TaxiResult } from '@/components/taxi/TaxiResult'
import { TippingResult } from '@/components/tipping/TippingResult'
import type { TaxiFullResult, TippingResult as TippingResultType } from '@/types'
import type { TaxiAiInfo } from '@/lib/claude'
import { useLanguage } from '@/context/LanguageContext'

function SvgIcon({ name, size = 18, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  return (
    <img
      src={`/icons/SVG/${name}.svg`}
      alt=""
      width={size}
      height={size}
      style={style}
      aria-hidden="true"
    />
  )
}

// ── Sample taxi result — Bangkok Airport → Sukhumvit ──────────────────────────
// Structural / numeric data only — AI text (scamWarnings, tipping, driverPhrases,
// fareRange.note) is replaced at runtime with locale-aware content from the API.

const SAMPLE_TAXI: TaxiFullResult = {
  pickup: 'Suvarnabhumi Airport (BKK)',
  destination: 'Sukhumvit Soi 11, Bangkok',
  distance: { km: 32, mi: 19.9 },
  duration: { text: '45–65 min', minutes: 52 },
  city: 'Bangkok',
  country: 'Thailand',
  fareRange: {
    min: 250,
    max: 380,
    currency: 'THB',
    currencySymbol: '฿',
    note: 'Includes ฿50 airport surcharge. Expressway tolls (฿25–75) are paid by the passenger — keep change ready.',
  },
  transitOptions: [
    { mode: 'train', lines: ['Airport Rail Link → BTS Skytrain'], duration: '35 min', durationMinutes: 35 },
  ],
  scamWarnings: [
    'Unlicensed "taxi mafia" work the arrivals hall and charge 4–5× the metered rate. Walk past them and follow signs to the official public taxi queue on level 1.',
    'Driver claims the meter is broken or suggests a flat rate — this is always a scam. Insist on the meter.',
    'Some drivers will offer to "avoid traffic" via a route that doubles the distance. Google Maps the route before you go.',
  ],
  tipping: {
    isExpected: false,
    recommendation: 'Round up or add ฿20–50 for good service. Not required.',
  },
  driverPhrases: [
    {
      context: 'Greeting',
      localLanguage: 'สวัสดีครับ',
      transliteration: 'Sawadee khráp',
      english: 'Hello',
    },
    {
      context: 'Meter',
      localLanguage: 'เปิดมิเตอร์ด้วยครับ',
      transliteration: 'Pèrt mi-dtêr dûay khráp',
      english: 'Please use the meter',
    },
    {
      context: 'Thank you',
      localLanguage: 'ขอบคุณครับ',
      transliteration: 'Khob khun khráp',
      english: 'Thank you',
    },
    {
      context: 'Goodbye',
      localLanguage: 'ลาก่อนครับ',
      transliteration: 'La gòn khráp',
      english: 'Goodbye',
    },
  ],
}

// ── Sample tipping result — Thailand ─────────────────────────────────────────
// Used as fallback only — replaced at runtime with locale-aware content from the API.

const SAMPLE_TIPPING: TippingResultType = {
  country: 'Thailand',
  currency: 'THB',
  currencySymbol: '฿',
  servicePhrases: [
    {
      context: 'Thank you',
      localLanguage: 'ขอบคุณครับ',
      transliteration: 'Khob khun khráp',
      english: 'Thank you',
    },
    {
      context: 'This was wonderful',
      localLanguage: 'อร่อยมากครับ',
      transliteration: 'Aroi mak khráp',
      english: 'This was delicious',
    },
    {
      context: 'Compliments to the chef',
      localLanguage: 'ขอฝากคำชมให้พ่อครัวด้วยครับ',
      transliteration: 'Kho fak kham chom hai pho khrua duai khráp',
      english: 'Please pass my compliments to the chef',
    },
    {
      context: 'Keep the change',
      localLanguage: 'เก็บเงินทอนไว้ได้เลยครับ',
      transliteration: 'Kep ngoen thon wai dai loei khráp',
      english: 'Please keep the change',
    },
    {
      context: 'You were wonderful',
      localLanguage: 'คุณดูแลเราดีมากครับ',
      transliteration: 'Khun du lae rao di mak khráp',
      english: 'You took wonderful care of us',
    },
  ],
  scenarios: {
    restaurant: {
      isExpected: false,
      rating: 'appreciated',
      percentageMin: null,
      percentageMax: null,
      typicalAmount: '฿20–100',
      notes: 'Not obligatory but genuinely appreciated. Leave cash on the table — upscale restaurants may include a 10% service charge, so check the bill first.',
    },
    taxi: {
      isExpected: false,
      rating: 'optional',
      percentageMin: null,
      percentageMax: null,
      typicalAmount: 'Round up',
      notes: 'Round up the metered fare or add ฿20–50 for help with luggage. Always insist on the meter.',
    },
    hotel_porter: {
      isExpected: true,
      rating: 'appreciated',
      percentageMin: null,
      percentageMax: null,
      typicalAmount: '฿20–50 / bag',
      notes: '฿20–50 per bag at mid-range hotels; ฿50–100 at luxury properties. Have small notes ready.',
    },
    bar: {
      isExpected: false,
      rating: 'optional',
      percentageMin: null,
      percentageMax: null,
      typicalAmount: '฿20–50',
      notes: 'Rounding up or leaving ฿20–50 is a friendly gesture at hotel bars and western-style venues. Not expected at local bars.',
    },
    tour_guide: {
      isExpected: true,
      rating: 'expected',
      percentageMin: null,
      percentageMax: null,
      typicalAmount: '฿200–300 / day',
      notes: '฿200–300 per person per day for a full-day tour is standard and expected. ฿100–150 for half-day. Give directly to the guide at the end.',
    },
    delivery: {
      isExpected: false,
      rating: 'optional',
      percentageMin: null,
      percentageMax: null,
      typicalAmount: '฿20–50',
      notes: 'Not expected but ฿20–50 for food delivery riders is always a welcome gesture.',
    },
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

type Tab = 'taxi' | 'tipping'

interface SampleApiResponse {
  taxiAi: TaxiAiInfo
  tipping: TippingResultType
}

interface ExampleContentProps {
  /** Server-generated Static Maps URL for the sample route (BKK → Sukhumvit). */
  sampleMapUrl?: string
}

export function ExampleContent({ sampleMapUrl }: ExampleContentProps) {
  const { t, locale } = useLanguage()
  const [tab, setTab] = useState<Tab>('taxi')
  const [aiContent, setAiContent] = useState<SampleApiResponse | null>(null)

  // Fetch locale-aware AI content whenever the language changes.
  // For English, the API returns from KV/memory cache (near-instant).
  // An AbortController prevents stale responses from a previous locale overwriting a newer one.
  useEffect(() => {
    const controller = new AbortController()

    async function fetchSample() {
      try {
        const res = await fetch(`/api/taxi/sample?locale=${locale}`, {
          signal: controller.signal,
        })
        if (!res.ok) return
        const data = (await res.json()) as SampleApiResponse
        setAiContent(data)
      } catch {
        // AbortError on cleanup or network failure — fall back to static English content
      }
    }

    fetchSample()
    return () => controller.abort()
  }, [locale])

  // Merge locale-aware AI content over the structural static data.
  // Falls back gracefully to the hardcoded English constants when the fetch is still in flight.
  const taxiResult: TaxiFullResult = {
    ...(sampleMapUrl ? { ...SAMPLE_TAXI, routeMapUrl: sampleMapUrl } : SAMPLE_TAXI),
    ...(aiContent?.taxiAi
      ? {
          scamWarnings: aiContent.taxiAi.scamWarnings,
          tipping: aiContent.taxiAi.tipping,
          driverPhrases: aiContent.taxiAi.driverPhrases,
          fareRange: {
            ...SAMPLE_TAXI.fareRange,
            note: aiContent.taxiAi.fareNoteTranslated ?? SAMPLE_TAXI.fareRange.note,
          },
        }
      : {}),
  }

  const tippingResult: TippingResultType = aiContent?.tipping ?? SAMPLE_TIPPING

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        <button
          onClick={() => setTab('taxi')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            tab === 'taxi'
              ? 'bg-teal-600 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {/* White icon on teal bg; teal+white icon on dark bg (hue-rotate shifts native purple→teal) */}
          <SvgIcon name="taxi-car" size={17} style={tab === 'taxi' ? { filter: 'brightness(0) invert(1)' } : { filter: 'hue-rotate(262deg) saturate(88%)' }} />
          {t('example_tab_taxi')}
        </button>
        <button
          onClick={() => setTab('tipping')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            tab === 'tipping'
              ? 'bg-purple-600 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {/* White icon on purple bg; native purple+white icon on dark bg */}
          <SvgIcon name="money-cash" size={17} style={tab === 'tipping' ? { filter: 'brightness(0) invert(1)' } : undefined} />
          {t('example_tab_tipping')}
        </button>
      </div>

      {/* Route context (taxi only) */}
      {tab === 'taxi' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <p className="text-xs text-zinc-500 mb-0.5">{t('example_route_label')}</p>
          <p className="text-sm text-zinc-200 font-medium">Suvarnabhumi Airport → Sukhumvit, Bangkok</p>
        </div>
      )}

      {/* Results */}
      {tab === 'taxi' ? (
        <TaxiResult result={taxiResult} />
      ) : (
        <TippingResult result={tippingResult} />
      )}
    </div>
  )
}
