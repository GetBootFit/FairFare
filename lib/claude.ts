import Anthropic from '@anthropic-ai/sdk'
import { kvGet, kvSet } from '@/lib/kv'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-6'
const KV_TTL = 90 * 24 * 60 * 60 // 90 days — taxi scams / tipping customs change over years, not weeks

/** Strip markdown code fences Claude occasionally adds despite being told not to. */
function stripJson(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
}

// ─── In-memory cache (fast, resets on cold start) ─────────────────────────────
const memCache = new Map<string, { data: unknown; cachedAt: number }>()
const MEM_TTL_MS = 90 * 24 * 60 * 60 * 1000

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

// ─── Locale → language name (used in Claude prompts) ─────────────────────────

const LOCALE_LANGUAGE: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  zh: 'Simplified Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  hi: 'Hindi',
  it: 'Italian',
  id: 'Indonesian',
  vi: 'Vietnamese',
  th: 'Thai',
  tw: 'Traditional Chinese',
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaxiAiInfo {
  scamWarnings: string[]
  tipping: { isExpected: boolean; recommendation: string }
  driverPhrases: Array<{
    context: string
    localLanguage: string
    transliteration: string | null
    english: string
  }>
  /** Present when locale is non-English and a fare note was provided for translation. */
  fareNoteTranslated?: string
  /** True when Claude API was unavailable and this is generic fallback data. */
  aiUnavailable?: true
}

/** Generic fallback returned when the Claude API is down — the user still gets their paid fare data. */
const TAXI_AI_FALLBACK: TaxiAiInfo = {
  scamWarnings: [
    'Insist on the meter — do not accept flat rates from drivers.',
    'Use official taxi ranks or verified ride-hailing apps.',
    'Confirm the total price (all passengers, all luggage) before departure.',
  ],
  tipping: { isExpected: false, recommendation: 'Round up to the nearest whole number.' },
  driverPhrases: [],
  aiUnavailable: true,
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
  servicePhrases: Array<{
    context: string
    localLanguage: string
    transliteration: string | null
    english: string
  }>
}

// ─── Taxi AI info (cached per city) ──────────────────────────────────────────

export async function getTaxiAiInfo(
  city: string,
  country: string,
  locale = 'en',
  fareNote?: string,
): Promise<TaxiAiInfo> {
  // English uses the legacy key for backward-compat with existing cache entries.
  // Non-English locales get their own locale-scoped cache entry.
  const cacheKey = locale === 'en'
    ? `taxi_v2:${city.toLowerCase()}:${country.toLowerCase()}`
    : `taxi_v2:${city.toLowerCase()}:${country.toLowerCase()}:${locale}`
  const cached = await cacheGet<TaxiAiInfo>(cacheKey)
  if (cached) return cached

  const lang = LOCALE_LANGUAGE[locale] ?? 'English'
  const isEnglish = locale === 'en'

  // Language instruction injected at the top for non-English locales.
  const langInstruction = isEnglish ? '' : `
LANGUAGE: Respond entirely in ${lang}. Two exceptions that must always stay in their original form:
- "localLanguage" fields in driverPhrases → always the native language of ${country} (never ${lang})
- "transliteration" fields → always romanized script
All other text (scamWarnings, tipping.recommendation, context labels, english fields) must be in ${lang}.
`

  // Fare note translation — only for non-English locales with a note to translate.
  const fareNoteField = !isEnglish && fareNote
    ? `,\n  "fareNoteTranslated": "<translate to ${lang}, keeping all currency symbols and numbers exactly: ${fareNote}>"`
    : ''
  const fareNoteInstruction = !isEnglish && fareNote
    ? `\n- "fareNoteTranslated": translate the following fare note to ${lang}, preserving all numbers and currency symbols exactly: "${fareNote}"`
    : ''

  const prompt = `${langInstruction}You are a friendly travel assistant. Provide taxi safety information and useful driver phrases for ${city}, ${country}.

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
  "driverPhrases": [
    {
      "context": "Greeting",
      "localLanguage": "<a warm, friendly hello appropriate for greeting a taxi driver in ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "Hello"
    },
    {
      "context": "Meter",
      "localLanguage": "<a polite phrase asking the driver to use the meter in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "Please use the meter"
    },
    {
      "context": "Thank you",
      "localLanguage": "<thank you in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "Thank you"
    },
    {
      "context": "Goodbye",
      "localLanguage": "<a friendly goodbye or have a safe trip in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "Goodbye"
    }
  ]${fareNoteField}
}

Rules:
- Scam warnings must be specific to ${city}, not generic travel advice
- Keep each warning under 20 words
- Driver phrases should be warm and natural, not confrontational
- Use the primary local language of the region (e.g. Thai in Bangkok, Arabic in Cairo)
- Include transliteration for any non-Latin script; set to null for Latin-script languages${fareNoteInstruction}`

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 900,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const data = JSON.parse(stripJson(text)) as TaxiAiInfo
    await cacheSet(cacheKey, data)
    return data
  } catch (err) {
    // Claude API unavailable or returned invalid JSON.
    // Log for alerting but return generic fallback so the user still gets their
    // paid fare data rather than a 500. The aiUnavailable flag lets the client
    // surface a "Scam alerts temporarily unavailable" notice.
    console.error('[claude/getTaxiAiInfo] API error — returning fallback:', err)
    return TAXI_AI_FALLBACK
  }
}

// ─── Tipping guide (cached per country) ──────────────────────────────────────

export async function getTippingGuide(country: string, locale = 'en'): Promise<TippingAiResult> {
  // English uses the legacy key for backward-compat with existing cache entries.
  const cacheKey = locale === 'en'
    ? `tipping_v2:${country.toLowerCase()}`
    : `tipping_v2:${country.toLowerCase()}:${locale}`
  const cached = await cacheGet<TippingAiResult>(cacheKey)
  if (cached) return cached

  const lang = LOCALE_LANGUAGE[locale] ?? 'English'
  const isEnglish = locale === 'en'
  const langInstruction = isEnglish ? '' : `
LANGUAGE: Respond entirely in ${lang}. Two exceptions that must always stay in their original form:
- "localLanguage" fields in servicePhrases → always the native language of ${country} (never ${lang})
- "transliteration" fields → always romanized script
All other text (scenario notes, context labels, english fields) must be in ${lang}.
`

  const prompt = `${langInstruction}You are a concise travel etiquette assistant. Provide tipping customs for ${country}.

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

Regional variation: If there is meaningful variation within ${country} (e.g. tourist areas vs local neighbourhoods, specific major cities, urban vs rural), mention it concisely in the relevant scenario's notes field. Keep each notes field under 20 words total.

Also include a "servicePhrases" array with exactly 5 entries — useful phrases for tipping and appreciation moments, in the primary local language of ${country}:

  "servicePhrases": [
    {
      "context": "Thank you",
      "localLanguage": "<thank you in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "Thank you"
    },
    {
      "context": "This was wonderful",
      "localLanguage": "<'this was wonderful / delicious' in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "This was wonderful"
    },
    {
      "context": "Compliments to the chef",
      "localLanguage": "<'please pass my compliments to the chef' in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "Please pass my compliments to the chef"
    },
    {
      "context": "Keep the change",
      "localLanguage": "<'please keep the change' in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "Please keep the change"
    },
    {
      "context": "You were wonderful",
      "localLanguage": "<'you have been wonderful / you took great care of us' in the local language of ${country}>",
      "transliteration": "<romanisation if non-Latin script, otherwise null>",
      "english": "You have been wonderful"
    }
  ]

Phrase rules:
- Use the primary local language of ${country} (e.g. Thai in Thailand, Arabic in Egypt, French in France)
- Keep phrases warm, genuine, and natural — not stiff or formal
- Include transliteration for non-Latin scripts; set to null for Latin-script languages`

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1600,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const data = JSON.parse(stripJson(text)) as TippingAiResult
  await cacheSet(cacheKey, data)
  return data
}
