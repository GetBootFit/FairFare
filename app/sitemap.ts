import { MetadataRoute } from 'next'
import { getAllCitySlugs, getAllCountrySlugs } from '@/lib/seo-helpers'

const BASE = 'https://fairfare.app'

// Data updated quarterly
const DATA_LAST_MODIFIED = new Date('2026-01-01')

export default function sitemap(): MetadataRoute.Sitemap {
  const citySlugs = getAllCitySlugs()
  const countrySlugs = getAllCountrySlugs()

  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE}/taxi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/tipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
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

  return [...corePages, ...cityPages, ...countryPages]
}
