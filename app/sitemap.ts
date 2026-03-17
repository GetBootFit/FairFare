import { MetadataRoute } from 'next'
import { getAllCitySlugs, getAllCountrySlugs } from '@/lib/seo-helpers'
import { getAllAirportCodes } from '@/lib/airport-data'
import { getAllBlogSlugs } from '@/lib/blog-posts'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'

// Data updated quarterly
const DATA_LAST_MODIFIED = new Date('2026-03-11')

export default function sitemap(): MetadataRoute.Sitemap {
  const citySlugs = getAllCitySlugs()
  const countrySlugs = getAllCountrySlugs()
  const airportCodes = getAllAirportCodes()
  const blogSlugs = getAllBlogSlugs()

  const now = new Date()

  const corePages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/taxi`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tipping`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/taxi/airport`, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85 },
    // Standalone guides — high-value linkable reference pages
    { url: `${BASE}/taxi/scams`, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/tipping/guide`, lastModified: DATA_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/example`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const cityPages: MetadataRoute.Sitemap = citySlugs.map((slug) => ({
    url: `${BASE}/taxi/${slug}`,
    lastModified: DATA_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const countryPages: MetadataRoute.Sitemap = countrySlugs.map((slug) => ({
    url: `${BASE}/tipping/${slug}`,
    lastModified: DATA_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Airport pages — high transactional intent (e.g. "jfk taxi fare")
  const airportPages: MetadataRoute.Sitemap = airportCodes.map((code) => ({
    url: `${BASE}/taxi/airport/${code.toLowerCase()}`,
    lastModified: DATA_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: DATA_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...corePages, ...cityPages, ...countryPages, ...airportPages, ...blogPages]
}
