/**
 * warm-translations.ts
 *
 * Pre-populates the KV cache with translations for all 3 content pages
 * across all 14 non-English locales (42 combinations total).
 *
 * Usage:
 *   npm run warm-translations               # hits production (NEXT_PUBLIC_BASE_URL or auto-detect)
 *   BASE_URL=http://localhost:3000 npm run warm-translations   # local dev server
 *   npm run warm-translations -- --dry-run  # list what would be called, no network requests
 *
 * Prerequisites:
 *   - Server must be running (dev or production)
 *   - KV must be configured for the results to persist
 *   - About $0.63 USD in Claude API credits (42 × ~$0.015 per translation)
 *     — cost is a one-time hit; translations cache for 365 days
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const SLUGS = ['about', 'faq', 'business'] as const
const LOCALES = ['ar', 'es', 'fr', 'de', 'pt', 'it', 'id', 'vi', 'th', 'zh', 'tw', 'ja', 'ko', 'hi'] as const

const LOCALE_NAMES: Record<string, string> = {
  ar: 'Arabic',
  es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese (BR)',
  it: 'Italian', id: 'Indonesian', vi: 'Vietnamese', th: 'Thai',
  zh: 'Simplified Chinese', tw: 'Traditional Chinese', ja: 'Japanese',
  ko: 'Korean', hi: 'Hindi',
}

// Resolve base URL: CLI arg > env var > localhost
function resolveBaseUrl(): string {
  const argIdx = process.argv.indexOf('--base-url')
  if (argIdx !== -1 && process.argv[argIdx + 1]) return process.argv[argIdx + 1]
  if (process.env.BASE_URL) return process.env.BASE_URL
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  return 'http://localhost:3000'
}

const isDryRun = process.argv.includes('--dry-run')
const baseUrl  = resolveBaseUrl()
const TOTAL    = SLUGS.length * LOCALES.length

// Rate-limit: one request every 1.5 s to avoid hammering Claude's API
const DELAY_MS = 1500

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function warmOne(slug: string, locale: string, index: number): Promise<'cached' | 'translated' | 'error'> {
  const url = `${baseUrl}/api/translate/page?slug=${slug}&locale=${locale}`
  const label = `[${index}/${TOTAL}] ${slug}/${locale} (${LOCALE_NAMES[locale]})`

  if (isDryRun) {
    console.log(`  DRY RUN  ${label}`)
    return 'cached'
  }

  try {
    const start = Date.now()
    const res = await fetch(url)
    const elapsed = Date.now() - start

    if (!res.ok) {
      console.error(`  ✗ FAIL   ${label} — HTTP ${res.status}`)
      return 'error'
    }

    // The route returns a Cache-Control header only on KV-cached responses within
    // the CDN layer. We use response time as a proxy:
    //   < 200 ms  → likely cache hit (KV or CDN)
    //   ≥ 200 ms  → Claude was called
    const wasCached = elapsed < 200
    const icon = wasCached ? '✓ cached' : '✓ fresh '
    console.log(`  ${icon}  ${label}  (${elapsed} ms)`)
    return wasCached ? 'cached' : 'translated'
  } catch (err) {
    console.error(`  ✗ ERROR  ${label} —`, err instanceof Error ? err.message : err)
    return 'error'
  }
}

async function main() {
  console.log()
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║          Hootling — Translation Cache Warmer             ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log()
  console.log(`  Base URL : ${baseUrl}`)
  console.log(`  Mode     : ${isDryRun ? 'DRY RUN (no requests)' : 'LIVE'}`)
  console.log(`  Tasks    : ${TOTAL} (${SLUGS.length} pages × ${LOCALES.length} languages)`)
  console.log(`  Est. cost: ~$${(TOTAL * 0.015).toFixed(2)} USD (new translations only)`)
  console.log()

  if (!isDryRun) {
    console.log('  Starting in 3 seconds… (Ctrl+C to abort)')
    await sleep(3000)
    console.log()
  }

  const results = { cached: 0, translated: 0, error: 0 }
  let index = 0

  for (const slug of SLUGS) {
    console.log(`\n  ── ${slug.toUpperCase()} ─────────────────────────────────────────`)
    for (const locale of LOCALES) {
      index++
      const outcome = await warmOne(slug, locale, index)
      results[outcome]++
      if (!isDryRun && index < TOTAL) await sleep(DELAY_MS)
    }
  }

  console.log()
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log(`║  Done  ✓ cached: ${String(results.cached).padEnd(3)}  ✓ fresh: ${String(results.translated).padEnd(3)}  ✗ errors: ${String(results.error).padEnd(3)}  ║`)
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log()

  if (results.error > 0) {
    console.error(`  ${results.error} translation(s) failed. Check the server logs above.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
