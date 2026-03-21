/**
 * Hootling — Cache Seed Script
 *
 * Pre-warms the Vercel KV cache for all 114 taxi cities + 53 tipping countries
 * by calling the same lib/claude.ts functions the app itself uses — guaranteeing
 * identical cache keys, data format, and TTL (90 days).
 *
 * Safe to re-run: cities already in KV are returned instantly with no Claude call
 * and no charge. Only cold (uncached) entries hit the API.
 *
 * Estimated cost (first full run, all cold):  ~$1.50
 * Estimated time (first full run, all cold):  ~6–8 minutes
 * Estimated cost (re-run, all warm):          ~$0.00
 * Estimated time (re-run, all warm):          ~1–2 minutes
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *
 *   npx tsx scripts/seed-cache.ts                  full run
 *   npx tsx scripts/seed-cache.ts --dry-run         list what would be seeded, no API calls
 *   npx tsx scripts/seed-cache.ts --taxi            taxi cities only
 *   npx tsx scripts/seed-cache.ts --tipping         tipping countries only
 *
 * ─── Prerequisites ───────────────────────────────────────────────────────────
 *
 *   .env.local must contain:
 *     ANTHROPIC_API_KEY=sk-ant-...
 *     KV_REST_API_URL=https://...
 *     KV_REST_API_TOKEN=...
 *
 *   tsx must be available: npm install --legacy-peer-deps
 *   Run from the project root: cd /path/to/hootling
 */

import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ── Resolve project root ───────────────────────────────────────────────────────
const __filename  = fileURLToPath(import.meta.url)
const projectRoot = path.resolve(path.dirname(__filename), '..')

// ── 1. Load .env.local BEFORE importing anything that reads process.env ────────
//    (Anthropic SDK and @vercel/kv both read env vars at instantiation time)
function loadDotEnv(): void {
  const envPath = path.join(projectRoot, '.env.local')
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env.local not found — using existing process.env values.\n')
    return
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  let count = 0
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) { process.env[key] = val; count++ }
  }
  console.log(`📋 Loaded ${count} env vars from .env.local\n`)
}
loadDotEnv()

// ── 2. Validate env vars ───────────────────────────────────────────────────────
const missing: string[] = []
if (!process.env.ANTHROPIC_API_KEY) missing.push('ANTHROPIC_API_KEY')
if (!process.env.KV_REST_API_URL)   missing.push('KV_REST_API_URL')
if (!process.env.KV_REST_API_TOKEN) missing.push('KV_REST_API_TOKEN')
if (missing.length) {
  console.error('❌  Missing required env vars:')
  missing.forEach(v => console.error(`     ${v}`))
  console.error('\n   Add them to .env.local and try again.')
  console.error('   KV vars are in Vercel dashboard → Storage → your KV store → .env.local tab.\n')
  process.exit(1)
}

// ── 3. Parse CLI flags ─────────────────────────────────────────────────────────
const argv       = process.argv.slice(2)
const DRY_RUN    = argv.includes('--dry-run')
const TAXI_ONLY  = argv.includes('--taxi')
const TIP_ONLY   = argv.includes('--tipping')
const runTaxi    = !TIP_ONLY
const runTipping = !TAXI_ONLY

// ── 4. Build city list from taxi-rates.json ────────────────────────────────────
type RateEntry = { country: string }
const taxiRatesRaw = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'data', 'taxi-rates.json'), 'utf8')
) as Record<string, RateEntry>

// Where key → title-case doesn't match the canonical Google Maps city name,
// provide the exact string Google Maps returns so cache keys align with real queries.
const CITY_NAME_OVERRIDES: Record<string, string> = {
  ho_chi_minh:   'Ho Chi Minh City',
  sao_paulo:     'São Paulo',
  cancun:        'Cancún',
  st_petersburg: 'Saint Petersburg',
  washington_dc: 'Washington D.C.',
  tel_aviv:      'Tel Aviv',
  east_province: 'Eastern Province',
  halong:        'Ha Long',
}

function keyToCity(key: string): string {
  return CITY_NAME_OVERRIDES[key] ??
    key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const taxiCities = Object.entries(taxiRatesRaw).map(([key, entry]) => ({
  city:    keyToCity(key),
  country: entry.country,
}))

// ── 5. Tipping countries (must match TippingForm.tsx exactly) ──────────────────
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

// ── 6. Helpers ─────────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

function pad(n: number, total: number): string {
  return String(n).padStart(String(total).length, ' ')
}

// ── 7. Main ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const nTaxi    = runTaxi    ? taxiCities.length        : 0
  const nTipping = runTipping ? TIPPING_COUNTRIES.length : 0
  const nTotal   = nTaxi + nTipping

  // Rough cost estimate: taxi ~$0.007/city, tipping ~$0.013/country (cold only)
  const estCost = (nTaxi * 0.007) + (nTipping * 0.013)
  // ~2.3s per cold call (1.5s API + 0.8s delay)
  const estMins = Math.ceil(nTotal * 2.3 / 60)

  console.log('╔══════════════════════════════════════════╗')
  console.log('║      Hootling — Cache Seed Script        ║')
  console.log('╚══════════════════════════════════════════╝\n')
  console.log(`  Taxi cities:         ${nTaxi}`)
  console.log(`  Tipping countries:   ${nTipping}`)
  console.log(`  Total (max calls):   ${nTotal}`)
  console.log(`  Max cost (all cold): ~$${estCost.toFixed(2)}`)
  console.log(`  Max time (all cold): ~${estMins} min`)
  console.log(`  Already cached:      skipped automatically (zero charge)`)
  console.log(`  KV TTL:              90 days\n`)

  if (DRY_RUN) {
    console.log('🔍  DRY RUN — no API calls will be made.\n')
    if (runTaxi) {
      console.log(`Taxi cities (${taxiCities.length}):`)
      taxiCities.forEach(({ city, country }) => console.log(`   ${city}, ${country}`))
    }
    if (runTipping) {
      console.log(`\nTipping countries (${TIPPING_COUNTRIES.length}):`)
      TIPPING_COUNTRIES.forEach(c => console.log(`   ${c}`))
    }
    console.log('\nRemove --dry-run to seed for real.\n')
    return
  }

  // Dynamic import runs AFTER loadDotEnv() so env vars are in process.env
  // before lib/claude.ts instantiates the Anthropic client and @vercel/kv.
  const { getTaxiAiInfo, getTippingGuide } = await import('../lib/claude.js')

  let ok = 0, fail = 0
  const errors: string[] = []

  // ── Taxi ──────────────────────────────────────────────────────────────────────
  if (runTaxi) {
    console.log(`🚕  Seeding ${taxiCities.length} taxi cities...\n`)
    for (let i = 0; i < taxiCities.length; i++) {
      const { city, country } = taxiCities[i]
      const label = `[${pad(i + 1, taxiCities.length)}/${taxiCities.length}] ${city}, ${country}`
      try {
        process.stdout.write(`  ${label}… `)
        await getTaxiAiInfo(city, country)
        process.stdout.write('✓\n')
        ok++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        process.stdout.write(`✗  ${msg}\n`)
        errors.push(`Taxi › ${city}, ${country} — ${msg}`)
        fail++
      }
      if (i < taxiCities.length - 1) await delay(800)
    }
  }

  // ── Tipping ───────────────────────────────────────────────────────────────────
  if (runTipping) {
    console.log(`\n💰  Seeding ${TIPPING_COUNTRIES.length} tipping countries...\n`)
    for (let i = 0; i < TIPPING_COUNTRIES.length; i++) {
      const country = TIPPING_COUNTRIES[i]
      const label = `[${pad(i + 1, TIPPING_COUNTRIES.length)}/${TIPPING_COUNTRIES.length}] ${country}`
      try {
        process.stdout.write(`  ${label}… `)
        await getTippingGuide(country)
        process.stdout.write('✓\n')
        ok++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        process.stdout.write(`✗  ${msg}\n`)
        errors.push(`Tipping › ${country} — ${msg}`)
        fail++
      }
      if (i < TIPPING_COUNTRIES.length - 1) await delay(800)
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════')
  console.log(`  ✅  Succeeded: ${ok}`)
  console.log(`  ❌  Failed:    ${fail}`)
  console.log('══════════════════════════════════════════════\n')
  if (fail > 0) {
    console.log('Failed entries:')
    errors.forEach(e => console.log(`  ${e}`))
    console.log('\n⚠️  Re-run the script to retry — succeeded entries will be skipped (no charge).\n')
  } else {
    console.log('✅  Cache fully warm. Re-run in 90 days to refresh.\n')
  }
}

main().catch(err => {
  console.error('\n💥  Fatal:', err)
  process.exit(1)
})
