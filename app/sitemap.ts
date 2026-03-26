import { MetadataRoute } from 'next'
import { getAllCitySlugs, getAllCountrySlugs, HREFLANG_LOCALES } from '@/lib/seo-helpers'
import { getAllAirportCodes } from '@/lib/airport-data'
import { getAllBlogSlugs } from '@/lib/blog-posts'

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

/** Build hreflang alternates for a given URL (all locales → same URL). */
function hreflang(url: string): MetadataRoute.Sitemap[number]['alternates'] {
  return {
    languages: Object.fromEntries([
      ...HREFLANG_LOCALES.map((l) => [l, url]),
      ['x-default', url],
    ]),
  }
}

// Data updated quarterly
const DATA_LAST_MODIFIED = new Date('2026-03-11')

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
    { url: `${BASE}/blog`,              lastModified: DATA_LAST_MODIFIED, changeFrequency: 'weekly',  priority: 0.8,  alternates: hreflang(`${BASE}/blog`) },
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

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => {
    const url = `${BASE}/blog/${slug}`
    return { url, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7, alternates: hreflang(url) }
  })

  return [...corePages, ...cityPages, ...countryPages, ...airportPages, ...blogPages]
}
