import { MetadataRoute } from 'next'
import { getAllCitySlugs, getAllCountrySlugs, HREFLANG_LOCALES } from '@/lib/seo-helpers'
import { getAllAirportCodes } from '@/lib/airport-data'
import { getAllBlogSlugs } from '@/lib/blog-posts'
import { TRANSLATED_SLUGS } from '@/lib/blog-translation'
import { LOCALES } from '@/lib/i18n'

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

/** App locale codes for the 14 non-English locales (matches app/[locale]/ routes) */
const NON_EN_LOCALES = LOCALES.filter((l) => l.code !== 'en').map((l) => l.code)

/** Map app locale codes to BCP 47 for hreflang */
function toBcp47(locale: string): string {
  return locale === 'tw' ? 'zh-TW' : locale
}

/** Build hreflang alternates for a given URL (all locales → same URL). */
function hreflang(url: string): MetadataRoute.Sitemap[number]['alternates'] {
  return {
    languages: Object.fromEntries([
      ...HREFLANG_LOCALES.map((l) => [l, url]),
      ['x-default', url],
    ]),
  }
}

/**
 * Build hreflang alternates for blog pages with locale-specific URLs.
 * English canonical stays at /blog/..., each locale gets /{locale}/blog/...
 */
function blogHreflang(slug: string): MetadataRoute.Sitemap[number]['alternates'] {
  const enUrl = `${BASE}/blog/${slug}`
  const languages: Record<string, string> = { en: enUrl, 'x-default': enUrl }
  NON_EN_LOCALES.forEach((l) => {
    languages[toBcp47(l)] = `${BASE}/${l}/blog/${slug}`
  })
  return { languages }
}

/** Hreflang for the blog index — locale variants at /{locale}/blog */
function blogIndexHreflang(): MetadataRoute.Sitemap[number]['alternates'] {
  const enUrl = `${BASE}/blog`
  const languages: Record<string, string> = { en: enUrl, 'x-default': enUrl }
  NON_EN_LOCALES.forEach((l) => {
    languages[toBcp47(l)] = `${BASE}/${l}/blog`
  })
  return { languages }
}

// Data updated quarterly
const DATA_LAST_MODIFIED = new Date('2026-03-27')

export default function sitemap(): MetadataRoute.Sitemap {
  const citySlugs = getAllCitySlugs()
  const countrySlugs = getAllCountrySlugs()
  const airportCodes = getAllAirportCodes()
  const blogSlugs = getAllBlogSlugs()

  const now = new Date()

  const corePages: MetadataRoute.Sitemap = [
    { url: BASE,                        lastModified: now,               changeFrequency: 'monthly', priority: 1,    alternates: hreflang(BASE) },
    { url: `${BASE}/taxi`,              lastModified: now,               changeFrequency: 'monthly', priority: 0.9,  alternates: hreflang(`${BASE}/taxi`) },
    { url: `${BASE}/tipping`,           lastModified: now,               changeFrequency: 'monthly', priority: 0.9,  alternates: hreflang(`${BASE}/tipping`) },
    { url: `${BASE}/blog`,              lastModified: DATA_LAST_MODIFIED, changeFrequency: 'weekly',  priority: 0.8,  alternates: blogIndexHreflang() },
    { url: `${BASE}/taxi/airport`,      lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85, alternates: hreflang(`${BASE}/taxi/airport`) },
    { url: `${BASE}/taxi/scams`,        lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85, alternates: hreflang(`${BASE}/taxi/scams`) },
    { url: `${BASE}/tipping/guide`,     lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85, alternates: hreflang(`${BASE}/tipping/guide`) },
    { url: `${BASE}/example`,           lastModified: now,               changeFrequency: 'monthly', priority: 0.75, alternates: hreflang(`${BASE}/example`) },
    { url: `${BASE}/faq`,               lastModified: now,               changeFrequency: 'monthly', priority: 0.6,  alternates: hreflang(`${BASE}/faq`) },
    { url: `${BASE}/about`,             lastModified: now,               changeFrequency: 'yearly',  priority: 0.5,  alternates: hreflang(`${BASE}/about`) },
    { url: `${BASE}/business`,          lastModified: now,               changeFrequency: 'monthly', priority: 0.5,  alternates: hreflang(`${BASE}/business`) },
    { url: `${BASE}/terms`,             lastModified: now,               changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy`,           lastModified: now,               changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // City/country/airport pages: hreflang included — these pages have multilingual
  // AI-generated content (scam warnings, tipping guides) that responds in the user's language.
  const cityPages: MetadataRoute.Sitemap = citySlugs.map((slug) => {
    const url = `${BASE}/taxi/${slug}`
    return { url, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8, alternates: hreflang(url) }
  })

  const countryPages: MetadataRoute.Sitemap = countrySlugs.map((slug) => {
    const url = `${BASE}/tipping/${slug}`
    return { url, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8, alternates: hreflang(url) }
  })

  // Airport pages — high transactional intent (e.g. "jfk taxi fare")
  const airportPages: MetadataRoute.Sitemap = airportCodes.map((code) => {
    const url = `${BASE}/taxi/airport/${code.toLowerCase()}`
    return { url, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85, alternates: hreflang(url) }
  })

  // Blog pages — English canonical with locale-specific hreflang alternates
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => {
    return {
      url: `${BASE}/blog/${slug}`,
      lastModified: DATA_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: blogHreflang(slug),
    }
  })

  // Locale blog index pages — one entry per non-English locale
  const localeBlogIndexPages: MetadataRoute.Sitemap = NON_EN_LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/blog`,
    lastModified: DATA_LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: 0.65,
    alternates: blogIndexHreflang(),
  }))

  // Locale blog article pages — only slugs with confirmed translations in KV.
  // Untranslated locale URLs redirect to English canonical (see app/[locale]/blog/[slug]/page.tsx).
  // Add slugs to TRANSLATED_SLUGS in lib/blog-translation.ts as more are warmed up.
  const translatedSlugs = blogSlugs.filter((slug) => TRANSLATED_SLUGS.has(slug))
  const localeBlogArticlePages: MetadataRoute.Sitemap = NON_EN_LOCALES.flatMap((locale) =>
    translatedSlugs.map((slug) => ({
      url: `${BASE}/${locale}/blog/${slug}`,
      lastModified: DATA_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: blogHreflang(slug),
    })),
  )

  return [
    ...corePages,
    ...cityPages,
    ...countryPages,
    ...airportPages,
    ...blogPages,
    ...localeBlogIndexPages,
    ...localeBlogArticlePages,
  ]
}
