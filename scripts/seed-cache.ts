/**
 * scripts/seed-cache.ts
 *
 * Pre-generates all Claude AI responses for every known city and country,
 * and writes them directly to Vercel KV. Run once at deploy time (or on demand).
 *
 * Usage:
 *   npx tsx scripts/seed-cache.ts                    # seed everything
 *   npx tsx scripts/seed-cache.ts --tipping-only     # tipping guides only
 *   npx tsx scripts/seed-cache.ts --taxi-only        # taxi AI only
 *   npx tsx scripts/seed-cache.ts --dry-run          # print plan, no API calls
 *
 * Prerequisites:
 *   npm install --legacy-peer-deps
 *   Copy .env.local.example → .env.local and fill ANTHROPIC_API_KEY + KV_* vars.
 *
 * Cost estimate (claude-sonnet-4-5 as of 2025):
 *   ~$1.00–$1.50 one-time for all 53 tipping + 120+ taxi entries.
 *   After seeding, those queries cost $0 (KV reads only).
 *
 * KV TTL: 30 days (matches lib/claude.ts KV_TTL).
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
import Anthropic from '@anthropic-ai/sdk'
import { kv } from '@vercel/kv'
import taxiRatesRaw from '../data/taxi-rates.json'

// ─── Config ──────────────────────────────────────────────────────────────────

const MODEL = 'claude-sonnet-4-6'
const KV_TTL = 30 * 24 * 60 * 60 // 30 days in seconds
const DELAY_MS = 500              // ms between requests to avoid rate-limiting

const TIPPING_COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile',
  'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt',
  'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'Hungary', 'India',
  'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Malaysia',
  'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Norway', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'UAE', 'Ukraine', 'United Kingdom',
  'United States', 'Vietnam',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

type TaxiRateEntry = {
  country: string
  currency: string
  currencySymbol: string
  baseRate: number
  ratePerKm: number
  minimumFare: number
  note: string
}

const taxiRates = taxiRatesRaw as Record<string, TaxiRateEntry>

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function toDisplayName(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

async function kvExists(key: string): Promise<boolean> {
  try {
    const val = await kv.exists(key)
    return val === 1
  } catch {
    return false
  }
}

// ─── Claude calls ─────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function generateTaxiAiInfo(city: string, country: string) {
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
  return JSON.parse(text)
}

async function generateTippingGuide(country: string) {
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
- "avoid" = tipping can cause offence`

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return JSON.parse(text)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const taxiOnly = args.includes('--taxi-only')
  const tippingOnly = args.includes('--tipping-only')

  if (!dryRun) {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌  ANTHROPIC_API_KEY is not set. Copy .env.local.example → .env.local and fill it in.')
      process.exit(1)
    }
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('❌  KV_REST_API_URL / KV_REST_API_TOKEN not set. Add them from your Vercel KV store.')
      process.exit(1)
    }
  }

  // Build taxi seed list from taxi-rates.json (deduplicated city+country pairs)
  const taxiEntries = Object.entries(taxiRates).map(([key, entry]) => ({
    key,
    city: toDisplayName(key),
    country: entry.country,
    cacheKey: `taxi:${key.replace(/_/g, ' ')}:${entry.country.toLowerCase()}`,
  }))

  // Summary
  console.log('\n🌍  FairFare Cache Seeder')
  console.log('─'.repeat(50))
  if (!tippingOnly) console.log(`  Taxi entries  : ${taxiEntries.length}`)
  if (!taxiOnly)    console.log(`  Tipping entries: ${TIPPING_COUNTRIES.length}`)
  console.log(`  KV TTL        : 30 days`)
  console.log(`  Mode          : ${dryRun ? '🔍 DRY RUN (no API calls)' : '🚀 LIVE'}`)
  console.log('─'.repeat(50))

  let seeded = 0
  let skipped = 0
  let errors = 0

  // ── Taxi ──────────────────────────────────────────────────────────────────

  if (!tippingOnly) {
    console.log('\n📍  Seeding taxi AI info…\n')
    for (const entry of taxiEntries) {
      const label = `${entry.city}, ${entry.country}`
      try {
        const exists = dryRun ? false : await kvExists(entry.cacheKey)
        if (exists) {
          console.log(`  ⏭️   ${label} — already cached`)
          skipped++
          continue
        }

        if (dryRun) {
          console.log(`  📋  ${label} — would seed (key: ${entry.cacheKey})`)
          seeded++
          continue
        }

        process.stdout.write(`  ⏳  ${label}…`)
        const data = await generateTaxiAiInfo(entry.city, entry.country)
        await kv.set(entry.cacheKey, JSON.stringify(data), { ex: KV_TTL })
        console.log(' ✅')
        seeded++
        await sleep(DELAY_MS)
      } catch (err) {
        console.log(` ❌  ${err instanceof Error ? err.message : err}`)
        errors++
      }
    }
  }

  // ── Tipping ───────────────────────────────────────────────────────────────

  if (!taxiOnly) {
    console.log('\n💵  Seeding tipping guides…\n')
    for (const country of TIPPING_COUNTRIES) {
      const cacheKey = `tipping:${country.toLowerCase()}`
      try {
        const exists = dryRun ? false : await kvExists(cacheKey)
        if (exists) {
          console.log(`  ⏭️   ${country} — already cached`)
          skipped++
          continue
        }

        if (dryRun) {
          console.log(`  📋  ${country} — would seed (key: ${cacheKey})`)
          seeded++
          continue
        }

        process.stdout.write(`  ⏳  ${country}…`)
        const data = await generateTippingGuide(country)
        await kv.set(cacheKey, JSON.stringify(data), { ex: KV_TTL })
        console.log(' ✅')
        seeded++
        await sleep(DELAY_MS)
      } catch (err) {
        console.log(` ❌  ${err instanceof Error ? err.message : err}`)
        errors++
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log('\n' + '─'.repeat(50))
  console.log(`  ✅  Seeded  : ${seeded}`)
  console.log(`  ⏭️   Skipped : ${skipped} (already in KV)`)
  if (errors > 0) console.log(`  ❌  Errors  : ${errors}`)
  console.log('─'.repeat(50))
  if (errors > 0) {
    console.log('\n⚠️  Some entries failed. Re-run the script to retry failed entries only.')
  } else {
    console.log('\n🎉  Cache seeded successfully. All future requests will be served from KV.')
  }
}

main().catch((err) => {
  console.error('\n❌  Fatal error:', err)
  process.exit(1)
})
