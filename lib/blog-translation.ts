import Anthropic from '@anthropic-ai/sdk'
import { kvGet, kvSet } from '@/lib/kv'
import type { BlogPost, BlogSection } from '@/lib/blog-posts'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/** TTL: 365 days. KV key includes BLOG_CONTENT_VERSION so stale entries expire naturally. */
const KV_TTL = 365 * 24 * 60 * 60

/**
 * Bump this when English blog source content is updated.
 * Old KV entries are abandoned (they'll expire in 365 days) and fresh
 * translations are generated on the next crawl request per language.
 */
export const BLOG_CONTENT_VERSION = 'v20260328'

/**
 * Slugs that have been fully translated across all 14 non-English locales.
 * Only these slugs are included in the locale sitemap and served as translated pages.
 * Untranslated locale URLs redirect to the English canonical.
 *
 * To expand: run `npm run warm-blog-translations` for the next batch of posts,
 * then add their slugs here. See memory/project_blog_translation_status.md.
 */
export const TRANSLATED_SLUGS = new Set([
  'meet-hootling-the-travel-app-that-keeps-you-from-getting-ripped-off',
  'why-tipping-is-so-confusing-and-how-to-get-it-right',
  '5-most-common-taxi-scams-and-how-to-avoid-them',
  'what-to-say-to-your-taxi-driver-in-15-languages',
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
])

const LOCALE_LANGUAGE: Record<string, string> = {
  ar: 'Arabic',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese (Brazilian)',
  it: 'Italian',
  id: 'Indonesian',
  vi: 'Vietnamese',
  th: 'Thai',
  zh: 'Simplified Chinese',
  tw: 'Traditional Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  hi: 'Hindi',
}

export interface TranslatedBlogContent {
  title: string
  description: string
  sections: BlogSection[]
}

/** Extract all translatable text from a BlogPost into a flat key → value map */
function extractStrings(post: BlogPost): Record<string, string> {
  const out: Record<string, string> = {
    title: post.title,
    description: post.description,
  }
  post.content.forEach((section, i) => {
    const p = `s${i}`
    if (section.heading) out[`${p}_h`] = section.heading
    if (section.body) out[`${p}_b`] = section.body
    section.items?.forEach((item, j) => { out[`${p}_i${j}`] = item })
    section.rows?.forEach((row, j) => { out[`${p}_rl${j}`] = row.label })
    section.faqs?.forEach((faq, j) => {
      out[`${p}_fq${j}`] = faq.q
      out[`${p}_fa${j}`] = faq.a
    })
  })
  return out
}

/** Rebuild BlogSection[] substituting translated strings where available */
function applyTranslations(post: BlogPost, t: Record<string, string>): TranslatedBlogContent {
  const sections: BlogSection[] = post.content.map((section, i) => {
    const p = `s${i}`
    return {
      ...section,
      heading: section.heading ? (t[`${p}_h`] ?? section.heading) : section.heading,
      body: section.body ? (t[`${p}_b`] ?? section.body) : section.body,
      items: section.items?.map((item, j) => t[`${p}_i${j}`] ?? item),
      rows: section.rows?.map((row, j) => ({
        label: t[`${p}_rl${j}`] ?? row.label,
        value: row.value, // Fare amounts and currency values are not translated
      })),
      faqs: section.faqs?.map((faq, j) => ({
        q: t[`${p}_fq${j}`] ?? faq.q,
        a: t[`${p}_fa${j}`] ?? faq.a,
      })),
    }
  })
  return {
    title: t.title ?? post.title,
    description: t.description ?? post.description,
    sections,
  }
}

/**
 * Return translated blog content for a given locale.
 *
 * Flow:
 *   1. English / unknown locale → return original post content unchanged
 *   2. KV cache hit → return cached translation (365-day TTL)
 *   3. Cache miss → call Claude, store in KV, return translation
 *   4. Claude error → fall back silently to English content
 */
export async function getTranslatedBlogContent(
  post: BlogPost,
  locale: string,
): Promise<TranslatedBlogContent> {
  if (locale === 'en' || !LOCALE_LANGUAGE[locale]) {
    return { title: post.title, description: post.description, sections: post.content }
  }

  const cacheKey = `blog_translation:${post.slug}:${locale}:${BLOG_CONTENT_VERSION}`

  const cached = await kvGet<Record<string, string>>(cacheKey)
  if (cached) return applyTranslations(post, cached)

  // Cache miss — translate via Claude
  const language = LOCALE_LANGUAGE[locale]
  const strings = extractStrings(post)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: `Translate the following JSON object from English to ${language}.
Return ONLY valid JSON — identical keys, all string values translated to ${language}.
Do NOT translate: city names, country names, currency symbols, numbers, URLs, brand names (Hootling, Grab, Bolt, Uber, Stripe, Google Maps, Kiwitaxi, Welcome Pickups, GetTransfer, intui.travel).
Preserve all punctuation and formatting.
Return raw JSON only — no markdown, no code fences, no explanation.

${JSON.stringify(strings, null, 2)}`,
        },
      ],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const translated = JSON.parse(cleaned) as Record<string, string>

    await kvSet(cacheKey, translated, KV_TTL)
    return applyTranslations(post, translated)
  } catch (err) {
    console.error('[blog-translation] Claude error:', err)
    // Silent fallback to English — page still renders, just untranslated
    return { title: post.title, description: post.description, sections: post.content }
  }
}
