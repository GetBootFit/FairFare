/**
 * warm-blog-translations.ts
 *
 * Pre-populates the KV cache with translated blog content for the top posts
 * across the 8 highest-traffic non-English locales.
 *
 * Usage:
 *   npm run warm-blog-translations               # live run against production
 *   BASE_URL=http://localhost:3000 npm run warm-blog-translations   # local dev
 *   npm run warm-blog-translations:dry           # list what would be called, no requests
 *
 * Prerequisites:
 *   - Server must be running (dev or production)
 *   - KV must be configured so translations persist (no-op locally without KV)
 *   - Estimated cost: ~$0.02 per translation × 120 combos ≈ $2.40 USD one-time
 *     (skips any already-cached entries — re-running is safe and cheap)
 *
 * To add more posts or locales, edit PRIORITY_SLUGS / PRIORITY_LOCALES below.
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// ── Top posts by expected search traffic + transactional intent ───────────────
// Order: featured first, then city taxi-cost (highest volume), then airport routes
const PRIORITY_SLUGS = [
  // Origin / evergreen
  'meet-hootling-the-travel-app-that-keeps-you-from-getting-ripped-off',
  '5-most-common-taxi-scams-and-how-to-avoid-them',
  'what-to-say-to-your-taxi-driver-in-15-languages',

  // City taxi-cost guides (highest search volume cities)
  'how-much-does-a-taxi-cost-in-bangkok',
  'how-much-does-a-taxi-cost-in-dubai',
  'how-much-does-a-taxi-cost-in-tokyo',
  'how-much-does-a-taxi-cost-in-bali',
  'how-much-does-a-taxi-cost-in-rome',
  'how-much-does-a-taxi-cost-in-barcelona',
  'how-much-does-a-taxi-cost-in-paris',
  'how-much-does-a-taxi-cost-in-singapore',
  'how-much-does-a-taxi-cost-in-istanbul',

  // Airport → city routes (high transactional intent)
  'taxi-suvarnabhumi-to-bangkok',
  'taxi-heathrow-to-london',
  'taxi-cdg-to-paris',
] as const

// ── 8 priority locales by international search traffic ────────────────────────
const PRIORITY_LOCALES = ['es', 'fr', 'de', 'pt', 'ja', 'zh', 'ar', 'id'] as const

const LOCALE_NAMES: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese (BR)',
  ja: 'Japanese',
  zh: 'Simplified Chinese',
  ar: 'Arabic',
  id: 'Indonesian',
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
const TOTAL    = PRIORITY_SLUGS.length * PRIORITY_LOCALES.length

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
  const label = `[${String(index).padStart(3)}/${TOTAL}] ${locale.padEnd(2)} (${LOCALE_NAMES[locale]?.padEnd(18)})  ${slug}`

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

  console.log()
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║        Hootling — Blog Translation Cache Warmer             ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  console.log()
  console.log(`  Base URL  : ${baseUrl}`)
  console.log(`  Mode      : ${isDryRun ? 'DRY RUN (no requests sent)' : 'LIVE'}`)
  console.log(`  Posts     : ${PRIORITY_SLUGS.length}`)
  console.log(`  Locales   : ${PRIORITY_LOCALES.join(', ')}`)
  console.log(`  Tasks     : ${TOTAL} (${PRIORITY_SLUGS.length} posts × ${PRIORITY_LOCALES.length} locales)`)
  console.log(`  Est. cost : ~$${costEstimate} USD (new translations only — cached hits are free)`)
  console.log()

  if (!isDryRun) {
    console.log('  Starting in 3 seconds… (Ctrl+C to abort)')
    await sleep(3000)
    console.log()
  }

  const results = { cached: 0, translated: 0, error: 0 }
  let index = 0

  for (const slug of PRIORITY_SLUGS) {
    const shortSlug = slug.length > 45 ? slug.slice(0, 44) + '…' : slug
    console.log(`\n  ── ${shortSlug} ${'─'.repeat(Math.max(0, 50 - shortSlug.length))}`)
    for (const locale of PRIORITY_LOCALES) {
      index++
      const outcome = await warmOne(slug, locale, index)
      results[outcome]++
      if (!isDryRun && index < TOTAL) await sleep(DELAY_MS)
    }
  }

  const actualCost = (results.translated * 0.02).toFixed(2)

  console.log()
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log(`║  Done  — ✓ cached: ${String(results.cached).padEnd(3)}  ✓ fresh: ${String(results.translated).padEnd(3)}  ✗ errors: ${String(results.error).padEnd(3)}        ║`)
  console.log(`║  Actual cost: ~$${actualCost.padEnd(6)} (${results.translated} new translations × $0.02)  ║`)
  console.log('╚══════════════════════════════════════════════════════════════╝')
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
