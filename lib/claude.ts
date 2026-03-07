import Anthropic from '@anthropic-ai/sdk'
import { kvGet, kvSet } from '@/lib/kv'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-6'
const KV_TTL = 30 * 24 * 60 * 60 // 30 days — city/country data changes rarely

// ─── In-memory cache (fast, resets on cold start) ─────────────────────────────
const memCache = new Map<string, { data: unknown; cachedAt: number }>()
const MEM_TTL_MS = 30 * 24 * 60 * 60 * 1000

function memGet<T>(key: string): T | null {
  const entry = memCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.cachedAt > MEM_TTL_MS) { memCache.delete(key); return null }
  return entry.data as T
}
function memSet(key: string, data: unknown): void {
  memCache.set(key, { data, cachedAt: Date.now() })
}

/** Get from memory first, then KV (Vercel Redis if configured). */
async function cacheGet<T>(key: string): Promise<T | null> {
  const mem = memGet<T>(key)
  if (mem) return mem
  const kv = await kvGet<T>(key)
  if (kv) { memSet(key, kv); return kv }
  return null
}

/** Write to both memory cache and KV. */
async function cacheSet(key: string, data: unknown): Promise<void> {
  memSet(key, data)
  await kvSet(key, data, KV_TTL)
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaxiAiInfo {
  scamWarnings: string[]
  tipping: { isExpected: boolean; recommendation: string }
  confirmationPhrase: {
    localLanguage: string
    transliteration: string | null
    english: string
  }
}

export interface TippingAiResult {
  country: string
  currency: string
  currencySymbol: string
  scenarios: Record<
    string,
    {
      isExpected: boolean
      rating: string
      percentageMin: number | null
      percentageMax: number | null
      typicalAmount: string | null
      notes: string
    }
  >
}

// ─── Taxi AI info (cached per city) ──────────────────────────────────────────

export async function getTaxiAiInfo(city: string, country: string): Promise<TaxiAiInfo> {
  const cacheKey = `taxi:${city.toLowerCase()}:${country.toLowerCase()}`
  const cached = await cacheGet<TaxiAiInfo>(cacheKey)
  if (cached) return cached

  const prompt = `You are a concise travel safety assistant. Provide taxi safety information for ${city}, ${country}.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "scamWarnings": [
    "<scam warning specific to ${city}>",
    "<scam warning specific to ${city}>",
    "<scam warning specific to ${city}>"
  ],
  "tipping": {
    "isExpected": <true|false>,
    "recommendation": "<one short sentence, e.g. 'Round up to nearest euro' or 'Not expected'>"
  },
  "confirmationPhrase": {
    "localLanguage": "<phrase to confirm fare in the local language of ${country}>",
    "transliteration": "<romanisation if non-Latin script, otherwise null>",
    "english": "<English translation of the phrase>"
  }
}

Rules:
- Scam warnings must be specific to ${city}, not generic travel advice
- Keep each warning under 15 words
- Confirmation phrase should ask for the fare before getting in`

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const data = JSON.parse(text) as TaxiAiInfo
  await cacheSet(cacheKey, data)
  return data
}

// ─── Tipping guide (cached per country) ──────────────────────────────────────

export async function getTippingGuide(country: string): Promise<TippingAiResult> {
  const cacheKey = `tipping:${country.toLowerCase()}`
  const cached = await cacheGet<TippingAiResult>(cacheKey)
  if (cached) return cached

  const prompt = `You are a concise travel etiquette assistant. Provide tipping customs for ${country}.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "country": "${country}",
  "currency": "<3-letter ISO code>",
  "currencySymbol": "<symbol>",
  "scenarios": {
    "restaurant": {
      "isExpected": <true|false>,
      "rating": "<expected|appreciated|optional|avoid>",
      "percentageMin": <number or null>,
      "percentageMax": <number or null>,
      "typicalAmount": "<e.g. '1-2€' or null>",
      "notes": "<one sentence under 20 words>"
    },
    "taxi": { "isExpected": <true|false>, "rating": "...", "percentageMin": ..., "percentageMax": ..., "typicalAmount": ..., "notes": "..." },
    "hotel_porter": { "isExpected": <true|false>, "rating": "...", "percentageMin": null, "percentageMax": null, "typicalAmount": "<per bag amount>", "notes": "..." },
    "bar": { "isExpected": <true|false>, "rating": "...", "percentageMin": ..., "percentageMax": ..., "typicalAmount": ..., "notes": "..." },
    "tour_guide": { "isExpected": <true|false>, "rating": "...", "percentageMin": ..., "percentageMax": ..., "typicalAmount": ..., "notes": "..." },
    "delivery": { "isExpected": <true|false>, "rating": "...", "percentageMin": ..., "percentageMax": ..., "typicalAmount": ..., "notes": "..." }
  }
}

Rating guide:
- "expected" = not tipping is considered rude
- "appreciated" = welcomed, common but not required
- "optional" = uncommon, never inappropriate
- "avoid" = tipping can cause offence

Regional variation: If there is meaningful variation within ${country} (e.g. tourist areas vs local neighbourhoods, specific major cities, urban vs rural), mention it concisely in the relevant scenario's notes field. Keep each notes field under 20 words total.`

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const data = JSON.parse(text) as TippingAiResult
  await cacheSet(cacheKey, data)
  return data
}
