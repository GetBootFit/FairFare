/**
 * generate-blog-posts.ts
 *
 * Generates SEO-optimised blog posts for Hootling using Claude claude-sonnet-4-6.
 * Outputs TypeScript to lib/blog-posts-generated.ts.
 *
 * Usage:
 *   npm run generate-blog-posts             # generate all missing posts
 *   npm run generate-blog-posts -- --dry-run  # list what would be generated
 *   npm run generate-blog-posts -- --force    # regenerate all, even existing
 *
 * Cost: ~$0.04 per article. 40 articles ≈ $1.60 total.
 * Progress is tracked — re-running skips already-generated slugs.
 */

import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'
// Load .env.local first (Next.js convention), then fall back to .env
import * as dotenv from 'dotenv'
// override: true ensures .env.local values beat any existing shell env vars
// (e.g. Claude Code sets its own ANTHROPIC_API_KEY — we need the project key here)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const isDryRun = process.argv.includes('--dry-run')
const isForce  = process.argv.includes('--force')

const OUT_FILE      = path.resolve(__dirname, '../lib/blog-posts-generated.ts')
const PROGRESS_FILE = path.resolve(__dirname, '../.blog-gen-progress.json')
const DELAY_MS      = 2000

// ── Rate data (from taxi-rates.json) ─────────────────────────────────────────

interface RateData {
  country: string
  currency: string
  symbol: string
  base: number
  perKm: number
  min: number
  fare5: number
  fare10: number
  fare15: number
  fare20: number
  note?: string
}

const CITY_RATES: Record<string, RateData> = {
  hong_kong:     { country:'Hong Kong',      currency:'HKD', symbol:'HK$', base:27,    perKm:9.3,  min:27,    fare5:74,    fare10:120,   fare15:167,   fare20:213,   note:'Cross-harbour tunnel charge added to fare. Airport Express train 24 min for HK$115 — strongly recommended.' },
  prague:        { country:'Czech Republic', currency:'CZK', symbol:'Kč',  base:60,    perKm:28,   min:60,    fare5:200,   fare10:340,   fare15:480,   fare20:620,   note:'Use Bolt or Uber — street taxi overcharging of tourists is common. Airport to city centre ~600–700 Kč by app.' },
  vienna:        { country:'Austria',        currency:'EUR', symbol:'€',   base:4.3,   perKm:1.42, min:5.8,   fare5:11,    fare10:19,    fare15:26,    fare20:33,    note:'Night surcharge 23:00–06:00. Airport taxi ~€36–40 flat. City Airport Train (CAT) or S-Bahn ~€4.40.' },
  athens:        { country:'Greece',         currency:'EUR', symbol:'€',   base:1.29,  perKm:0.74, min:3.84,  fare5:5,     fare10:9,     fare15:12,    fare20:16,    note:'Airport fixed rate ~€38 day / €54 night. Always confirm before entering.' },
  seoul:         { country:'South Korea',    currency:'KRW', symbol:'₩',   base:4800,  perKm:1000, min:4800,  fare5:9800,  fare10:14800, fare15:19800, fare20:24800, note:'Midnight surcharge +20%. AREX from ICN airport to Seoul Station excellent (~₩9,500). Kakao T app for cabs.' },
  rio_de_janeiro:{ country:'Brazil',         currency:'BRL', symbol:'R$',  base:5.5,   perKm:2.75, min:5.5,   fare5:19,    fare10:33,    fare15:47,    fare20:61,    note:'Use 99 or Uber for safety — avoid hailing on the street at night. GIG airport to Ipanema ~R$80–120.' },
  taipei:        { country:'Taiwan',         currency:'TWD', symbol:'NT$', base:85,    perKm:15,   min:85,    fare5:160,   fare10:235,   fare15:310,   fare20:385,   note:'Meters mandatory and reliable. Airport MRT to city ~NT$165. Night surcharge 23:00–06:00.' },
  beijing:       { country:'China',          currency:'CNY', symbol:'¥',   base:13,    perKm:2.3,  min:13,    fare5:25,    fare10:36,    fare15:48,    fare20:59,    note:'DiDi easiest for non-Chinese speakers. Airport express trains recommended. Night surcharge after 23:00.' },
  milan:         { country:'Italy',          currency:'EUR', symbol:'€',   base:3.5,   perKm:1.1,  min:5.4,   fare5:9,     fare10:15,    fare15:20,    fare20:26,    note:'Airport supplements: Malpensa €10 (train ~€13 much better), Linate €5.' },
  madrid:        { country:'Spain',          currency:'EUR', symbol:'€',   base:2.4,   perKm:1.17, min:4.05,  fare5:8,     fare10:14,    fare15:20,    fare20:26,    note:'Airport supplement €6.70. Night/weekend rate 21:00–07:00. Metro Line 8 from Barajas cheaper (~€3).' },
  dublin:        { country:'Ireland',        currency:'EUR', symbol:'€',   base:4.1,   perKm:1.14, min:4.1,   fare5:10,    fare10:15,    fare15:21,    fare20:27,    note:'Airport to city ~€20–30. Night rates after 20:00. Taximeter mandatory.' },
  cape_town:     { country:'South Africa',   currency:'ZAR', symbol:'R',   base:20,    perKm:14,   min:40,    fare5:90,    fare10:160,   fare15:230,   fare20:300,   note:'Uber safer option. CPT airport to V&A Waterfront ~R200–350. Metered taxis less common.' },
  los_angeles:   { country:'United States',  currency:'USD', symbol:'$',   base:2.85,  perKm:2.7,  min:3.25,  fare5:16,    fare10:30,    fare15:43,    fare20:57,    note:'LA has minimal public transit — Uber/Lyft ubiquitous. LAX to Hollywood ~$45–70. Flyaway bus to Union Station ~$9.75.' },
  chicago:       { country:'United States',  currency:'USD', symbol:'$',   base:3.25,  perKm:1.87, min:3.25,  fare5:13,    fare10:22,    fare15:31,    fare20:41,    note:'CTA Blue Line from O\'Hare ~$5 — far cheaper than taxi (~$45–60). Uber/Lyft also widely available.' },
  miami:         { country:'United States',  currency:'USD', symbol:'$',   base:2.5,   perKm:1.87, min:3.5,   fare5:12,    fare10:21,    fare15:31,    fare20:40,    note:'Uber/Lyft widely used. MIA airport to South Beach ~$25–40.' },
  san_francisco: { country:'United States',  currency:'USD', symbol:'$',   base:3.5,   perKm:2.8,  min:3.5,   fare5:18,    fare10:32,    fare15:46,    fare20:60,    note:'SFO to city ~$45–60. Bay Bridge toll added. BART from SFO cheaper (~$10.65). Uber/Lyft dominant.' },
  toronto:       { country:'Canada',         currency:'CAD', symbol:'CA$', base:4.25,  perKm:1.75, min:4.25,  fare5:13,    fare10:22,    fare15:31,    fare20:39,    note:'Pearson airport to downtown ~CA$55–65. UP Express train ~CA$12.35 — much cheaper.' },
  venice:        { country:'Italy',          currency:'EUR', symbol:'€',   base:50,    perKm:0,    min:50,    fare5:50,    fare10:50,    fare15:50,    fare20:50,    note:'No road taxis. Water taxis: ~€50 short routes, €80–120 longer. Vaporetto (water bus) €9.50/ride — far cheaper for tourists.' },
  florence:      { country:'Italy',          currency:'EUR', symbol:'€',   base:3.3,   perKm:0.95, min:5,     fare5:8,     fare10:13,    fare15:18,    fare20:22,    note:'Night/Sunday supplements apply. Airport to city ~€25–30. ZTL restricted zone in historic centre.' },
  munich:        { country:'Germany',        currency:'EUR', symbol:'€',   base:4.5,   perKm:2,    min:4.5,   fare5:15,    fare10:25,    fare15:35,    fare20:45,    note:'Night surcharge 21:00–06:00. MUC airport to city ~€65–80. S-Bahn S1/S8 significantly cheaper at €13.60.' },
  berlin:        { country:'Germany',        currency:'EUR', symbol:'€',   base:3.9,   perKm:2,    min:3.9,   fare5:14,    fare10:24,    fare15:34,    fare20:44,    note:'Night surcharge 23:00–06:00. S-Bahn/U-Bahn are faster and cheaper for most routes.' },
  jakarta:       { country:'Indonesia',      currency:'IDR', symbol:'Rp',  base:7500,  perKm:4500, min:15000, fare5:30000, fare10:52500, fare15:75000, fare20:97500, note:'Use Blue Bird or Grab — street taxis may overcharge tourists. Traffic is extreme; allow extra time.' },
  chiang_mai:    { country:'Thailand',       currency:'THB', symbol:'฿',   base:50,    perKm:25,   min:60,    fare5:175,   fare10:300,   fare15:425,   fare20:550,   note:'Red songthaews (shared trucks) ~30฿ per person. Grab available. Airport to old city ~150–200฿. Negotiate for non-app rides.' },
  cancun:        { country:'Mexico',         currency:'MXN', symbol:'$',   base:25,    perKm:15,   min:40,    fare5:100,   fare10:175,   fare15:250,   fare20:325,   note:'Hotel Zone taxis have fixed zone rates — always negotiate before boarding. ADO bus for airport ~MXN 95.' },
  delhi:         { country:'India',          currency:'INR', symbol:'₹',   base:25,    perKm:15,   min:25,    fare5:100,   fare10:175,   fare15:250,   fare20:325,   note:'Airport prepaid taxi counter safest for arrivals. Uber/Ola reliable. Delhi Metro recommended for key routes.' },
}

// ── Tipping country data ──────────────────────────────────────────────────────

interface TippingData {
  displayName: string
  countrySlug: string
  expected: string
  summary: string
  restaurant: string
  taxi: string
  hotel: string
  bar: string
  tourGuide: string
  delivery: string
}

// Load from tipping-seo.json at runtime
function loadTippingData(): Record<string, TippingData> {
  const raw = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/tipping-seo.json'), 'utf8')
  ) as Record<string, Record<string, string>>

  const result: Record<string, TippingData> = {}
  for (const [slug, data] of Object.entries(raw)) {
    result[slug] = {
      displayName: data.displayName ?? slug,
      countrySlug: slug,
      expected: data.expectedLabel ?? data.expected ?? '',
      summary: data.summary ?? '',
      restaurant: data.restaurant ?? '',
      taxi: data.taxi ?? '',
      hotel: data.hotel ?? data.hotelPorter ?? '',
      bar: data.bar ?? '',
      tourGuide: data.tourGuide ?? '',
      delivery: data.delivery ?? '',
    }
  }
  return result
}

// ── Article definitions ───────────────────────────────────────────────────────

interface ArticleDef {
  slug: string
  type: 'city' | 'tipping' | 'travel'
  cityKey?: string
  countrySlug?: string
}

const CITY_ARTICLES: ArticleDef[] = [
  { slug: 'how-much-does-a-taxi-cost-in-hong-kong',      type: 'city', cityKey: 'hong_kong' },
  { slug: 'how-much-does-a-taxi-cost-in-prague',         type: 'city', cityKey: 'prague' },
  { slug: 'how-much-does-a-taxi-cost-in-vienna',         type: 'city', cityKey: 'vienna' },
  { slug: 'how-much-does-a-taxi-cost-in-athens',         type: 'city', cityKey: 'athens' },
  { slug: 'how-much-does-a-taxi-cost-in-seoul',          type: 'city', cityKey: 'seoul' },
  { slug: 'how-much-does-a-taxi-cost-in-rio-de-janeiro', type: 'city', cityKey: 'rio_de_janeiro' },
  { slug: 'how-much-does-a-taxi-cost-in-taipei',         type: 'city', cityKey: 'taipei' },
  { slug: 'how-much-does-a-taxi-cost-in-beijing',        type: 'city', cityKey: 'beijing' },
  { slug: 'how-much-does-a-taxi-cost-in-milan',          type: 'city', cityKey: 'milan' },
  { slug: 'how-much-does-a-taxi-cost-in-madrid',         type: 'city', cityKey: 'madrid' },
  { slug: 'how-much-does-a-taxi-cost-in-dublin',         type: 'city', cityKey: 'dublin' },
  { slug: 'how-much-does-a-taxi-cost-in-cape-town',      type: 'city', cityKey: 'cape_town' },
  { slug: 'how-much-does-a-taxi-cost-in-los-angeles',    type: 'city', cityKey: 'los_angeles' },
  { slug: 'how-much-does-a-taxi-cost-in-chicago',        type: 'city', cityKey: 'chicago' },
  { slug: 'how-much-does-a-taxi-cost-in-miami',          type: 'city', cityKey: 'miami' },
  { slug: 'how-much-does-a-taxi-cost-in-san-francisco',  type: 'city', cityKey: 'san_francisco' },
  { slug: 'how-much-does-a-taxi-cost-in-toronto',        type: 'city', cityKey: 'toronto' },
  { slug: 'how-much-does-a-taxi-cost-in-venice',         type: 'city', cityKey: 'venice' },
  { slug: 'how-much-does-a-taxi-cost-in-florence',       type: 'city', cityKey: 'florence' },
  { slug: 'how-much-does-a-taxi-cost-in-munich',         type: 'city', cityKey: 'munich' },
  { slug: 'how-much-does-a-taxi-cost-in-berlin',         type: 'city', cityKey: 'berlin' },
  { slug: 'how-much-does-a-taxi-cost-in-jakarta',        type: 'city', cityKey: 'jakarta' },
  { slug: 'how-much-does-a-taxi-cost-in-chiang-mai',     type: 'city', cityKey: 'chiang_mai' },
  { slug: 'how-much-does-a-taxi-cost-in-cancun',         type: 'city', cityKey: 'cancun' },
  { slug: 'how-much-does-a-taxi-cost-in-delhi',          type: 'city', cityKey: 'delhi' },
]

const TIPPING_ARTICLES: ArticleDef[] = [
  { slug: 'tipping-in-the-united-states',   type: 'tipping', countrySlug: 'united-states' },
  { slug: 'tipping-in-japan',               type: 'tipping', countrySlug: 'japan' },
  { slug: 'tipping-in-france',              type: 'tipping', countrySlug: 'france' },
  { slug: 'tipping-in-italy',               type: 'tipping', countrySlug: 'italy' },
  { slug: 'tipping-in-spain',               type: 'tipping', countrySlug: 'spain' },
  { slug: 'tipping-in-thailand',            type: 'tipping', countrySlug: 'thailand' },
  { slug: 'tipping-in-australia',           type: 'tipping', countrySlug: 'australia' },
  { slug: 'tipping-in-the-uae',             type: 'tipping', countrySlug: 'uae' },
  { slug: 'tipping-in-the-united-kingdom',  type: 'tipping', countrySlug: 'united-kingdom' },
  { slug: 'tipping-in-india',               type: 'tipping', countrySlug: 'india' },
  { slug: 'tipping-in-south-korea',         type: 'tipping', countrySlug: 'south-korea' },
  { slug: 'tipping-in-greece',              type: 'tipping', countrySlug: 'greece' },
]

const TRAVEL_ARTICLES: ArticleDef[] = [
  { slug: 'airport-taxi-vs-rideshare-which-should-you-choose', type: 'travel' },
  { slug: 'how-to-negotiate-a-taxi-fare',                       type: 'travel' },
  { slug: 'tipping-while-travelling-the-complete-guide',        type: 'travel' },
]

const ALL_ARTICLES = [...CITY_ARTICLES, ...TIPPING_ARTICLES, ...TRAVEL_ARTICLES]

// ── Prompts ───────────────────────────────────────────────────────────────────

function cityPrompt(cityKey: string, rates: RateData): string {
  const cityName = cityKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return `You are a travel writer for Hootling — a taxi fare and tipping app for international travellers. Write a detailed, practical blog post about taxi fares in ${cityName}, ${rates.country}.

Use the EXACT fare data below — do not invent or adjust it:
- Currency: ${rates.currency} (${rates.symbol})
- Base rate: ${rates.symbol}${rates.base}
- Rate per km: ${rates.symbol}${rates.perKm}
- Minimum fare: ${rates.symbol}${rates.min}
- 5 km trip: ${rates.symbol}${rates.fare5}
- 10 km trip: ${rates.symbol}${rates.fare10}
- 15 km trip: ${rates.symbol}${rates.fare15}
- 20 km trip: ${rates.symbol}${rates.fare20}
- Official note: ${rates.note ?? 'None'}

Return a SINGLE valid JSON object (no markdown, no code fences) matching this TypeScript interface exactly:

{
  "slug": "how-much-does-a-taxi-cost-in-${cityKey.replace(/_/g, '-')}",
  "title": string,           // engaging, SEO title ~60 chars
  "description": string,     // 140-160 chars, keyword-rich, includes city + fare range
  "publishedAt": "2026-03-20",
  "readingMinutes": number,  // 5-7
  "category": "taxi",
  "city": "${cityName}",
  "country": "${rates.country}",
  "citySlug": "${cityKey.replace(/_/g, '-')}",
  "content": BlogSection[]
}

BlogSection types available:
- { "type": "intro", "body": string }
- { "type": "h2", "heading": string }
- { "type": "h3", "heading": string }
- { "type": "p", "body": string }
- { "type": "ul", "items": string[] }
- { "type": "table", "rows": [{"label": string, "value": string}] }
- { "type": "tip", "body": string }
- { "type": "warning", "body": string }
- { "type": "faq", "faqs": [{"q": string, "a": string}] }

Required content structure:
1. intro: One punchy paragraph (2-3 sentences) hooking the reader
2. h2 + table: "Taxi Fare Overview" — fare table with these rows: Base fare, Rate per km, Minimum fare, 5 km journey, 10 km journey, 15 km journey, 20 km journey
3. h2 + p: "How Fares Are Calculated" — explain the meter system
4. h2 + p + ul: "Airport Transfer" — airport to city centre fare, alternatives (train/bus) with prices, practical tips
5. h2 + p + ul OR warning: "Scams to Watch Out For" — 3-4 city-specific scam patterns (no flat-rate refusals, rigged meters, unofficial taxis etc) — be specific to ${cityName}
6. h2 + ul: "Ride-Hailing Apps" — which apps work here (Uber, Grab, Bolt, DiDi, local apps), and which is recommended
7. tip: One practical money-saving tip for getting around ${cityName}
8. h2 + p: "Is It Safe to Take Taxis in ${cityName}?" — honest assessment
9. faq: 4 questions covering: cost from airport, tipping norms, payment methods, best time to avoid traffic

Tone: practical, direct, reassuring. Written for a first-time visitor. No fluff. Hootling brand voice — confident and traveller-friendly.
Do NOT include currency conversions to USD. Use local currency throughout.
Return ONLY the JSON object.`
}

function tippingPrompt(tipping: TippingData): string {
  return `You are a travel writer for Hootling — a taxi fare and tipping app for international travellers. Write a detailed, practical blog post about tipping customs in ${tipping.displayName}.

Use this authoritative data for the content:
- Overall tipping culture: ${tipping.expected}
- Summary: ${tipping.summary}
- Restaurants: ${tipping.restaurant}
- Taxis: ${tipping.taxi}
- Hotel porters: ${tipping.hotel}
- Bars: ${tipping.bar}
- Tour guides: ${tipping.tourGuide}
- Delivery: ${tipping.delivery}

Return a SINGLE valid JSON object (no markdown, no code fences) matching this interface:

{
  "slug": "tipping-in-${tipping.countrySlug}",
  "title": string,           // e.g. "Tipping in ${tipping.displayName}: How Much, When & Who"
  "description": string,     // 140-160 chars, practical, includes country
  "publishedAt": "2026-03-20",
  "readingMinutes": number,  // 4-6
  "category": "tipping",
  "country": "${tipping.displayName}",
  "countrySlug": "${tipping.countrySlug}",
  "content": BlogSection[]
}

BlogSection types: intro, h2, h3, p, ul, table, tip, warning, faq (same structure as before)

Required content structure:
1. intro: 2-3 sentence hook — is tipping expected, optional, or avoided here?
2. h2 + table: "Tipping at a Glance" — table with rows: Restaurants, Taxis, Hotel Porters, Bars, Tour Guides, Food Delivery
3. h2 + p + ul: "Restaurants & Cafés" — detailed guidance, when service charge is included, what to do
4. h2 + p: "Taxis & Rideshare" — tipping norms for metered taxis, Uber/local apps
5. h2 + ul: "Hotels, Tours & Other Services" — porters, guides, spa, housekeeping
6. h2 + p: "How to Tip" — cash vs card, rounding up, handing money directly
7. tip: One practical tip about tipping in ${tipping.displayName} that surprises most travellers
8. faq: 4 questions — common tourist confusion about tipping in this country

Tone: practical, non-judgmental, confident. No moralising. Useful for first-time visitors.
Return ONLY the JSON object.`
}

function travelPrompt(slug: string): string {
  const prompts: Record<string, string> = {
    'airport-taxi-vs-rideshare-which-should-you-choose': `Write a practical travel guide blog post for Hootling comparing airport taxis vs rideshare (Uber/Lyft/Grab/Bolt). Cover: when each makes sense, pricing differences, wait times, luggage space, safety, local app recommendations by region. Include a decision-making table. Tone: practical, neutral, experienced traveller advice.`,
    'how-to-negotiate-a-taxi-fare': `Write a practical travel guide for Hootling on how to negotiate taxi fares in cities where meters aren't used. Cover: when to negotiate vs just use the meter, how to research fair prices before departure, body language and tone, how to walk away, the role of apps, and city-specific examples (Bangkok, Marrakech, Cairo, Jakarta). Tone: confident, practical, no condescension.`,
    'tipping-while-travelling-the-complete-guide': `Write a comprehensive guide for Hootling on tipping etiquette across different countries and scenarios. Cover: the tipping spectrum (mandatory to offensive), key regions (North America, Europe, Asia, Middle East, Africa), scenario-by-scenario advice (restaurants, taxis, hotels, tours), practical tips for how to tip (cash/card/apps), and what happens if you don't. Tone: comprehensive but scannable, practical.`,
  }

  const basePrompt = prompts[slug] ?? `Write a practical travel tip blog post for Hootling about: ${slug.replace(/-/g, ' ')}.`

  return `${basePrompt}

Return a SINGLE valid JSON object (no markdown, no code fences) matching this interface:

{
  "slug": "${slug}",
  "title": string,
  "description": string,     // 140-160 chars
  "publishedAt": "2026-03-20",
  "readingMinutes": number,  // 5-8
  "category": "travel",
  "content": BlogSection[]
}

BlogSection types: intro, h2, h3, p, ul, table, tip, warning, faq
Include at least: intro, 4+ h2 sections with content, 1 tip or warning, 1 faq section with 4 questions.
Return ONLY the JSON object.`
}

// ── Progress tracking ─────────────────────────────────────────────────────────

function loadProgress(): Set<string> {
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')) as string[]
    return new Set(data)
  } catch {
    return new Set()
  }
}

function saveProgress(done: Set<string>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done], null, 2))
}

// ── Claude call ───────────────────────────────────────────────────────────────

interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  readingMinutes: number
  category: 'taxi' | 'tipping' | 'travel'
  city?: string
  country?: string
  citySlug?: string
  countrySlug?: string
  content: object[]
}

// Some articles (e.g. comprehensive guides) need more output tokens.
const LARGE_ARTICLE_SLUGS = new Set(['tipping-while-travelling-the-complete-guide'])

/**
 * Normalises a BlogSection returned by Claude to match the TypeScript interface.
 *
 * Claude sometimes uses:
 *   - "text" instead of "body" (for intro/p/tip/warning) or "heading" (for h2/h3)
 *   - Array rows [[col1, col2, col3]] instead of { label, value } objects
 *   - { question, answer } instead of { q, a } in faq sections
 *   - Multi-column tables; we collapse extra columns into the value field
 */
type SectionType = 'intro' | 'h2' | 'h3' | 'p' | 'ul' | 'table' | 'tip' | 'warning' | 'faq'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseSection(s: any) {
  const type = s.type as SectionType
  const out: { type: SectionType; heading?: string; body?: string; items?: string[]; rows?: { label: string; value: string }[]; faqs?: { q: string; a: string }[] } = { type }

  // heading field (h2 / h3)
  if (s.heading !== undefined) out.heading = s.heading
  else if (['h2', 'h3'].includes(type) && s.text !== undefined) out.heading = s.text

  // body field (intro / p / tip / warning)
  if (s.body !== undefined) out.body = s.body
  else if (['intro', 'p', 'tip', 'warning'].includes(type) && s.text !== undefined) out.body = s.text

  // items (ul)
  if (Array.isArray(s.items)) {
    out.items = s.items.map((item: unknown) =>
      typeof item === 'string' ? item : JSON.stringify(item)
    )
  }

  // rows (table) — accept both { label, value } objects and N-element arrays
  if (Array.isArray(s.rows)) {
    out.rows = s.rows.map((row: unknown) => {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        const r = row as Record<string, string>
        // Accept label/value directly, or map first two keys
        const keys = Object.keys(r)
        return { label: r.label ?? r[keys[0]], value: r.value ?? r[keys[1]] ?? '' }
      }
      if (Array.isArray(row)) {
        // Flatten: label = col[0], value = remaining cols joined
        const cols = (row as string[]).map(String)
        const label = cols[0] ?? ''
        const value = cols.slice(1).filter(Boolean).join(' — ')
        return { label, value }
      }
      return { label: String(row), value: '' }
    })
  }

  // faqs — accept { q, a } or { question, answer }
  if (Array.isArray(s.faqs)) {
    out.faqs = s.faqs.map((f: unknown) => {
      if (f && typeof f === 'object') {
        const faq = f as Record<string, string>
        return { q: faq.q ?? faq.question ?? '', a: faq.a ?? faq.answer ?? '' }
      }
      return { q: String(f), a: '' }
    })
  } else if (Array.isArray(s.questions)) {
    out.faqs = s.questions.map((f: unknown) => {
      if (f && typeof f === 'object') {
        const faq = f as Record<string, string>
        return { q: faq.q ?? faq.question ?? '', a: faq.a ?? faq.answer ?? '' }
      }
      return { q: String(f), a: '' }
    })
  }

  return out
}

function normalisePost(post: BlogPost): BlogPost {
  return {
    ...post,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: (post.content as any[]).map(normaliseSection),
  }
}

async function generatePost(prompt: string, slug: string): Promise<BlogPost | null> {
  const maxTokens = LARGE_ARTICLE_SLUGS.has(slug) ? 8192 : 4096
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      })

      const raw = msg.content[0].type === 'text' ? msg.content[0].text : ''
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      const post = normalisePost(JSON.parse(cleaned) as BlogPost)

      // Basic validation
      if (!post.slug || !post.title || !post.content?.length) {
        throw new Error('Invalid post structure returned')
      }
      return post
    } catch (err) {
      console.error(`  Attempt ${attempt}/3 failed for ${slug}:`, err instanceof Error ? err.message : err)
      if (attempt < 3) await sleep(3000)
    }
  }
  return null
}

// ── TypeScript file writer ────────────────────────────────────────────────────

function writeOutputFile(posts: BlogPost[]) {
  const json = JSON.stringify(posts, null, 2)
  const content = `// AUTO-GENERATED — do not edit by hand.
// Re-run: npm run generate-blog-posts
// Generated: ${new Date().toISOString().split('T')[0]}
// Posts: ${posts.length}

import type { BlogPost } from './blog-posts'

export const GENERATED_BLOG_POSTS: BlogPost[] = ${json}
`
  fs.writeFileSync(OUT_FILE, content, 'utf8')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log()
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║         Hootling — Blog Post Generator                   ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log()

  const tippingData = loadTippingData()
  const done = isForce ? new Set<string>() : loadProgress()

  // Load any existing generated posts so we don't lose them on partial runs
  let existingPosts: BlogPost[] = []
  if (fs.existsSync(OUT_FILE) && !isForce) {
    try {
      const src = fs.readFileSync(OUT_FILE, 'utf8')
      const match = src.match(/GENERATED_BLOG_POSTS: BlogPost\[\] = (\[[\s\S]*\])/)
      if (match) existingPosts = JSON.parse(match[1]) as BlogPost[]
    } catch { /* start fresh */ }
  }
  const existingBySlug = new Map(existingPosts.map(p => [p.slug, p]))

  const todo = ALL_ARTICLES.filter(a => !done.has(a.slug))
  const total = ALL_ARTICLES.length

  console.log(`  Mode     : ${isDryRun ? 'DRY RUN' : isForce ? 'FORCE (regenerate all)' : 'INCREMENTAL'}`)
  console.log(`  Total    : ${total} articles`)
  console.log(`  Done     : ${done.size}`)
  console.log(`  To do    : ${todo.length}`)
  console.log(`  Est. cost: ~$${(todo.length * 0.04).toFixed(2)} USD`)
  console.log()

  if (isDryRun) {
    console.log('  Articles that would be generated:')
    todo.forEach((a, i) => console.log(`  ${String(i + 1).padStart(2)}. [${a.type}] ${a.slug}`))
    console.log()
    return
  }

  if (todo.length === 0) {
    console.log('  All articles already generated. Use --force to regenerate.')
    return
  }

  console.log('  Starting in 3 seconds… (Ctrl+C to abort)')
  await sleep(3000)
  console.log()

  const results = { ok: 0, err: 0 }

  for (let i = 0; i < todo.length; i++) {
    const article = todo[i]
    const n = `[${i + 1}/${todo.length}]`
    console.log(`  ${n} Generating: ${article.slug}`)

    let prompt: string

    if (article.type === 'city' && article.cityKey) {
      const rates = CITY_RATES[article.cityKey]
      if (!rates) { console.error(`  ✗ No rate data for ${article.cityKey}`); results.err++; continue }
      prompt = cityPrompt(article.cityKey, rates)
    } else if (article.type === 'tipping' && article.countrySlug) {
      const td = tippingData[article.countrySlug]
      if (!td) { console.error(`  ✗ No tipping data for ${article.countrySlug}`); results.err++; continue }
      prompt = tippingPrompt(td)
    } else {
      prompt = travelPrompt(article.slug)
    }

    const start = Date.now()
    const post = await generatePost(prompt, article.slug)
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)

    if (post) {
      existingBySlug.set(post.slug, post)
      done.add(article.slug)
      saveProgress(done)
      results.ok++
      console.log(`  ✓ Done    (${elapsed}s)`)
    } else {
      results.err++
      console.error(`  ✗ Failed  (${elapsed}s) — skipping`)
    }

    if (i < todo.length - 1) await sleep(DELAY_MS)
  }

  // Write final output file
  const allPosts = [...existingBySlug.values()]
  writeOutputFile(allPosts)

  console.log()
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log(`║  Done  ✓ generated: ${String(results.ok).padEnd(3)}  ✗ errors: ${String(results.err).padEnd(3)}  total: ${String(allPosts.length).padEnd(3)}  ║`)
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log()
  console.log(`  Output: lib/blog-posts-generated.ts`)
  if (results.err > 0) console.log(`  ${results.err} article(s) failed — re-run to retry them.`)
  console.log()

  if (results.err > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
