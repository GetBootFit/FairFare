import { type NextRequest } from 'next/server'
import { getTaxiAiInfo } from '@/lib/claude'
import { getTippingGuide } from '@/lib/claude'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'

const VALID_LOCALES = new Set(['en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ko', 'hi'])

/** English fare note — passed to Claude for translation in non-English locales. */
const FARE_NOTE =
  'Includes ฿50 airport surcharge. Expressway tolls (฿25–75) are paid by the passenger — keep change ready.'

/**
 * Public sample endpoint — returns locale-aware AI content for the example page.
 * No auth required. Rate-limited per IP.
 */
export async function GET(req: NextRequest) {
  // Rate limiting — this is public so use a tighter window
  const ip = getClientIp(req)
  if (await isRateLimited('sample', ip, 30, 3600)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const rawLocale = searchParams.get('locale') ?? 'en'
  const locale = VALID_LOCALES.has(rawLocale) ? rawLocale : 'en'

  try {
    // Parallel AI calls — both are KV-cached per locale so cold start only hits Claude once per locale
    const [taxiAi, tipping] = await Promise.all([
      getTaxiAiInfo('Bangkok', 'Thailand', locale, FARE_NOTE),
      getTippingGuide('Thailand', locale),
    ])

    return Response.json(
      { taxiAi, tipping },
      {
        headers: {
          // CDN-cacheable for 1 hour — locale-scoped so each variant is cached independently
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (err) {
    console.error('[taxi/sample]', err)
    return Response.json({ error: 'Failed to fetch sample data' }, { status: 500 })
  }
}
