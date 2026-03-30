/**
 * warm-blog-translations.ts
 *
 * Pre-populates the KV cache with translated blog content for all posts
 * across all 14 non-English locales.
 *
 * Usage:
 *   npm run warm-blog-translations               # live run against production
 *   BASE_URL=http://localhost:3000 npm run warm-blog-translations   # local dev
 *   npm run warm-blog-translations:dry           # list what would be called, no requests
 *
 * Prerequisites:
 *   - Server must be running (dev or production)
 *   - KV must be configured so translations persist (no-op locally without KV)
 *   - Estimated cost: ~$0.02 per new translation × ~2,932 remaining ≈ $58–62 USD one-time
 *     (skips any already-cached entries — re-running is safe and free)
 *   - Estimated run time: ~76 minutes at 1 req/1.5 s
 *
 * Cost breakdown:
 *   218 posts × 14 locales = 3,052 total combinations
 *   ~120 already cached from previous run (15 priority posts × 8 locales)
 *   ~2,932 new translations × $0.02 ≈ $58.64 USD
 *
 * To warm only a subset, edit ALL_SLUGS or ALL_LOCALES below, or Ctrl+C mid-run
 * (all completed translations are already cached and won't be re-billed on next run).
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// ── All blog post slugs ───────────────────────────────────────────────────────
// Sourced from: blog-posts.ts, blog-posts-generated.ts, blog-posts-batch2.ts,
//               blog-posts-batch3.ts, blog-posts-batch3b.ts, blog-posts-batch3c.ts,
//               blog-posts-batch3d.ts
// Total: 218 posts
const ALL_SLUGS = [
  // ── Core / evergreen (blog-posts.ts) ─────────────────────────────────────
  'meet-hootling-the-travel-app-that-keeps-you-from-getting-ripped-off',
  'why-tipping-is-so-confusing-and-how-to-get-it-right',
  '5-most-common-taxi-scams-and-how-to-avoid-them',
  'what-to-say-to-your-taxi-driver-in-15-languages',

  // ── Taxi cost guides — batch 1 (blog-posts.ts) ───────────────────────────
  'how-much-does-a-taxi-cost-in-bangkok',
  'how-much-does-a-taxi-cost-in-dubai',
  'how-much-does-a-taxi-cost-in-singapore',
  'how-much-does-a-taxi-cost-in-london',
  'how-much-does-a-taxi-cost-in-new-york',
  'how-much-does-a-taxi-cost-in-tokyo',
  'how-much-does-a-taxi-cost-in-paris',
  'how-much-does-a-taxi-cost-in-bali',
  'how-much-does-a-taxi-cost-in-rome',
  'how-much-does-a-taxi-cost-in-istanbul',
  'how-much-does-a-taxi-cost-in-phuket',
  'how-much-does-a-taxi-cost-in-barcelona',
  'how-much-does-a-taxi-cost-in-sydney',
  'how-much-does-a-taxi-cost-in-amsterdam',
  'how-much-does-a-taxi-cost-in-mumbai',
  'how-much-does-a-taxi-cost-in-mexico-city',
  'how-much-does-a-taxi-cost-in-buenos-aires',
  'how-much-does-a-taxi-cost-in-cairo',
  'how-much-does-a-taxi-cost-in-marrakech',
  'how-much-does-a-taxi-cost-in-ho-chi-minh-city',
  'how-much-does-a-taxi-cost-in-kuala-lumpur',
  'how-much-does-a-taxi-cost-in-lisbon',

  // ── Taxi cost guides — generated (blog-posts-generated.ts) ───────────────
  'how-much-does-a-taxi-cost-in-hong-kong',
  'how-much-does-a-taxi-cost-in-prague',
  'how-much-does-a-taxi-cost-in-vienna',
  'how-much-does-a-taxi-cost-in-athens',
  'how-much-does-a-taxi-cost-in-seoul',
  'how-much-does-a-taxi-cost-in-rio-de-janeiro',
  'how-much-does-a-taxi-cost-in-taipei',
  'how-much-does-a-taxi-cost-in-beijing',
  'how-much-does-a-taxi-cost-in-milan',
  'how-much-does-a-taxi-cost-in-madrid',
  'how-much-does-a-taxi-cost-in-dublin',
  'how-much-does-a-taxi-cost-in-cape-town',
  'how-much-does-a-taxi-cost-in-los-angeles',
  'how-much-does-a-taxi-cost-in-chicago',
  'how-much-does-a-taxi-cost-in-miami',
  'how-much-does-a-taxi-cost-in-san-francisco',
  'how-much-does-a-taxi-cost-in-toronto',
  'how-much-does-a-taxi-cost-in-venice',
  'how-much-does-a-taxi-cost-in-florence',
  'how-much-does-a-taxi-cost-in-munich',
  'how-much-does-a-taxi-cost-in-berlin',
  'how-much-does-a-taxi-cost-in-jakarta',
  'how-much-does-a-taxi-cost-in-chiang-mai',
  'how-much-does-a-taxi-cost-in-cancun',
  'how-much-does-a-taxi-cost-in-delhi',

  // ── Tipping guides — generated (blog-posts-generated.ts) ─────────────────
  'tipping-in-united-states',
  'tipping-in-japan',
  'tipping-in-france',
  'tipping-in-italy',
  'tipping-in-spain',
  'tipping-in-thailand',
  'tipping-in-australia',
  'tipping-in-uae',
  'tipping-in-united-kingdom',
  'tipping-in-india',
  'tipping-in-south-korea',
  'tipping-in-greece',
  'tipping-in-germany',
  'tipping-in-mexico',
  'tipping-in-indonesia',
  'tipping-in-singapore',
  'tipping-in-turkey',
  'tipping-in-brazil',
  'tipping-in-canada',
  'tipping-in-portugal',

  // ── Generic travel guides — generated (blog-posts-generated.ts) ──────────
  'airport-taxi-vs-rideshare-which-should-you-choose',
  'how-to-negotiate-a-taxi-fare',
  'tipping-while-travelling-the-complete-guide',

  // ── Tipping guides — batch 2 (blog-posts-batch2.ts) ─────────────────────
  'tipping-in-china',
  'tipping-in-new-zealand',
  'tipping-in-netherlands',
  'tipping-in-switzerland',
  'tipping-in-sweden',
  'tipping-in-norway',
  'tipping-in-denmark',
  'tipping-in-austria',
  'tipping-in-poland',
  'tipping-in-czech-republic',
  'tipping-in-israel',
  'tipping-in-egypt',
  'tipping-in-south-africa',
  'tipping-in-philippines',
  'tipping-in-vietnam',
  'tipping-in-malaysia',
  'tipping-in-sri-lanka',
  'tipping-in-peru',
  'tipping-in-colombia',
  'tipping-in-argentina',

  // ── Airport route guides (blog-posts-batch2.ts) ───────────────────────────
  'taxi-heathrow-to-london',
  'taxi-cdg-to-paris',
  'taxi-changi-to-singapore',
  'taxi-suvarnabhumi-to-bangkok',
  'taxi-incheon-to-seoul',
  'taxi-narita-haneda-to-tokyo',
  'taxi-fiumicino-to-rome',
  'taxi-el-prat-to-barcelona',
  'taxi-schiphol-to-amsterdam',
  'taxi-sydney-airport-to-city',
  'taxi-melbourne-airport-to-city',
  'taxi-mumbai-airport-to-city',
  'taxi-hamad-to-doha',
  'taxi-ben-gurion-to-tel-aviv',

  // ── Taxi scam guides (blog-posts-batch2.ts) ───────────────────────────────
  'taxi-scams-in-bali',
  'taxi-scams-in-cairo',
  'taxi-scams-in-marrakech',
  'taxi-scams-in-istanbul',
  'taxi-scams-in-mexico-city',
  'taxi-scams-in-nairobi',
  'taxi-scams-in-jakarta',
  'taxi-scams-in-manila',
  'taxi-scams-in-phnom-penh',
  'taxi-scams-in-rome',

  // ── Destination guides — batch 3 (blog-posts-batch3.ts) ─────────────────
  'best-time-to-visit-bangkok',
  'daily-budget-guide-bangkok',
  'uber-vs-taxi-bangkok',
  'best-time-to-visit-tokyo',
  'daily-budget-guide-tokyo',
  'getting-around-tokyo',
  'is-bangkok-safe',
  'taxi-costs-osaka',
  'best-time-to-visit-bali',
  'daily-budget-guide-bali',
  'best-time-to-visit-paris',
  'daily-budget-guide-paris',
  'getting-around-london',
  'uber-vs-taxi-london',
  'is-cairo-safe',
  'taxi-costs-budapest',
  'best-time-to-visit-barcelona',
  'daily-budget-guide-barcelona',
  'uber-vs-taxi-singapore',
  'getting-around-bangkok',
  'tipping-at-hotels-worldwide',
  'best-time-to-visit-dubai',
  'taxi-costs-zurich',
  'is-istanbul-safe',
  'daily-budget-guide-dubai',

  // ── Destination guides — batch 3b (blog-posts-batch3b.ts) ───────────────
  'best-time-to-visit-new-york-city',
  'daily-budget-guide-new-york-city',
  'uber-vs-taxi-new-york-city',
  'getting-around-new-york-city',
  'is-mumbai-safe',
  'best-time-to-visit-singapore',
  'daily-budget-guide-singapore',
  'getting-around-singapore',
  'taxi-costs-copenhagen',
  'best-time-to-visit-rome',
  'daily-budget-guide-rome',
  'uber-vs-taxi-istanbul',
  'getting-around-paris',
  'best-time-to-visit-london',
  'daily-budget-guide-london',
  'taxi-costs-stockholm',
  'best-time-to-visit-sydney',
  'daily-budget-guide-amsterdam',
  'is-rio-de-janeiro-safe',
  'how-to-tip-tour-guides',
  'taxi-costs-warsaw',
  'best-time-to-visit-cape-town',
  'getting-around-dubai',
  'is-nairobi-safe',
  'tipping-at-spas-worldwide',

  // ── Destination guides — batch 3c (blog-posts-batch3c.ts) ───────────────
  'best-time-to-visit-marrakech',
  'uber-vs-taxi-rome',
  'getting-around-amsterdam',
  'is-mexico-city-safe',
  'taxi-costs-nairobi',
  'daily-budget-guide-prague',
  'getting-around-barcelona',
  'uber-vs-taxi-dubai',
  'taxi-costs-doha',
  'best-time-to-visit-istanbul',
  'daily-budget-guide-lisbon',
  'getting-around-berlin',
  'is-jakarta-safe',
  'taxi-costs-abu-dhabi',
  'best-time-to-visit-prague',
  'daily-budget-guide-budapest',
  'tipping-airport-porters',
  'best-time-to-visit-lisbon',
  'getting-around-seoul',
  'daily-budget-guide-kuala-lumpur',
  'uber-vs-taxi-amsterdam',
  'is-marrakech-safe',
  'taxi-costs-hanoi',
  'best-time-to-visit-vietnam',
  'tipping-on-cruises',

  // ── Destination guides — batch 3d (blog-posts-batch3d.ts) ───────────────
  'best-time-to-visit-mexico-city',
  'best-time-to-visit-greece',
  'best-time-to-visit-amsterdam',
  'daily-budget-guide-ho-chi-minh-city',
  'daily-budget-guide-cairo',
  'daily-budget-guide-buenos-aires',
  'daily-budget-guide-mexico-city',
  'daily-budget-guide-cape-town',
  'uber-vs-taxi-kuala-lumpur',
  'uber-vs-taxi-beijing',
  'getting-around-sydney',
  'getting-around-mumbai',
  'getting-around-hong-kong',
  'getting-around-kuala-lumpur',
  'is-johannesburg-safe',
  'taxi-costs-phnom-penh',
  'taxi-costs-colombo',
  'taxi-costs-bogota',
  'taxi-costs-lima',
  'taxi-costs-havana',
  'tipping-in-cash-only-countries',
  'tipping-in-muslim-countries',
  'when-not-to-tip',
  'digital-tipping-guide',
  'tipping-guide-for-solo-female-travellers',
] as const

// ── All 14 non-English locales ────────────────────────────────────────────────
const ALL_LOCALES = ['es', 'fr', 'de', 'pt', 'it', 'id', 'vi', 'th', 'zh', 'tw', 'ja', 'ko', 'hi', 'ar'] as const

const LOCALE_NAMES: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese (BR)',
  it: 'Italian',
  id: 'Indonesian',
  vi: 'Vietnamese',
  th: 'Thai',
  zh: 'Simplified Chinese',
  tw: 'Traditional Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  hi: 'Hindi',
  ar: 'Arabic',
}

// ── Resolve base URL ──────────────────────────────────────────────────────────

function resolveBaseUrl(): string {
  const argIdx = process.argv.indexOf('--base-url')
  if (argIdx !== -1 && process.argv[argIdx + 1]) return process.argv[argIdx + 1]
  if (process.env.BASE_URL) return process.env.BASE_URL
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  return 'http://localhost:3000'
}

const isDryRun = process.argv.includes('--dry-run')
const baseUrl  = resolveBaseUrl()
const TOTAL    = ALL_SLUGS.length * ALL_LOCALES.length

// Rate-limit: 1 request per 1.5 s — avoids hammering Claude's API
const DELAY_MS = 1500

async function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

async function warmOne(
  slug: string,
  locale: string,
  index: number,
): Promise<'cached' | 'translated' | 'error'> {
  const url   = `${baseUrl}/api/translate/blog?slug=${slug}&locale=${locale}`
  const label = `[${String(index).padStart(4)}/${TOTAL}] ${locale.padEnd(2)} (${LOCALE_NAMES[locale]?.padEnd(20)})  ${slug}`

  if (isDryRun) {
    console.log(`  DRY RUN  ${label}`)
    return 'cached'
  }

  try {
    const start   = Date.now()
    const res     = await fetch(url)
    const elapsed = Date.now() - start

    if (!res.ok) {
      console.error(`  ✗ FAIL   ${label} — HTTP ${res.status}`)
      return 'error'
    }

    // Heuristic: KV/CDN cache hit is typically < 200 ms; Claude call is ≥ 200 ms
    const wasCached = elapsed < 200
    console.log(`  ${wasCached ? '✓ cached' : '✓ fresh '} ${label}  (${elapsed} ms)`)
    return wasCached ? 'cached' : 'translated'
  } catch (err) {
    console.error(`  ✗ ERROR  ${label} —`, err instanceof Error ? err.message : err)
    return 'error'
  }
}

async function main() {
  const costEstimate = (TOTAL * 0.02).toFixed(2)
  const timeEstimateMins = Math.ceil((TOTAL * DELAY_MS) / 60000)

  console.log()
  console.log('╔══════════════════════════════════════════════════════════════════╗')
  console.log('║        Hootling — Blog Translation Cache Warmer (Full)          ║')
  console.log('╚══════════════════════════════════════════════════════════════════╝')
  console.log()
  console.log(`  Base URL  : ${baseUrl}`)
  console.log(`  Mode      : ${isDryRun ? 'DRY RUN (no requests sent)' : 'LIVE'}`)
  console.log(`  Posts     : ${ALL_SLUGS.length}`)
  console.log(`  Locales   : ${ALL_LOCALES.join(', ')}`)
  console.log(`  Tasks     : ${TOTAL} (${ALL_SLUGS.length} posts × ${ALL_LOCALES.length} locales)`)
  console.log(`  Est. cost : ~$${costEstimate} USD max (cached hits are free — likely ~$58–62)`)
  console.log(`  Est. time : ~${timeEstimateMins} minutes`)
  console.log()
  console.log('  Note: Already-cached entries (from previous warm-up run) are')
  console.log('  skipped automatically — only NEW translations incur cost.')
  console.log('  Safe to Ctrl+C and re-run — progress is saved to KV instantly.')
  console.log()

  if (!isDryRun) {
    console.log('  Starting in 5 seconds… (Ctrl+C to abort)')
    await sleep(5000)
    console.log()
  }

  const results = { cached: 0, translated: 0, error: 0 }
  let index = 0

  for (const slug of ALL_SLUGS) {
    const shortSlug = slug.length > 50 ? slug.slice(0, 49) + '…' : slug
    console.log(`\n  ── ${shortSlug} ${'─'.repeat(Math.max(0, 55 - shortSlug.length))}`)
    for (const locale of ALL_LOCALES) {
      index++
      const outcome = await warmOne(slug, locale, index)
      results[outcome]++
      if (!isDryRun && index < TOTAL) await sleep(DELAY_MS)
    }
  }

  const actualCost = (results.translated * 0.02).toFixed(2)

  console.log()
  console.log('╔══════════════════════════════════════════════════════════════════╗')
  console.log(`║  Done  — ✓ cached: ${String(results.cached).padEnd(4)}  ✓ fresh: ${String(results.translated).padEnd(4)}  ✗ errors: ${String(results.error).padEnd(4)}      ║`)
  console.log(`║  Actual cost: ~$${actualCost.padEnd(8)} (${results.translated} new translations × $0.02)  ║`)
  console.log('╚══════════════════════════════════════════════════════════════════╝')
  console.log()

  if (results.error > 0) {
    console.error(`  ⚠  ${results.error} translation(s) failed — check server logs above.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
