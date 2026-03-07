/**
 * SEO helper utilities
 * Slug <-> display name conversion, fare preview, JSON-LD builders
 */

import taxiRatesRaw from '@/data/taxi-rates.json'

// ── Types ───────────────────────────────────────────────────────────────────

export interface CityRateEntry {
  country: string
  currency: string
  currencySymbol: string
  baseRate: number
  ratePerKm: number
  minimumFare: number
  note?: string
}

const taxiRates = taxiRatesRaw as Record<string, CityRateEntry>

// ── Slug utilities ───────────────────────────────────────────────────────────

/** "new_york" → "new-york" */
export function keyToSlug(key: string): string {
  return key.replace(/_/g, '-')
}

/** "new-york" → "new_york" */
export function slugToKey(slug: string): string {
  return slug.replace(/-/g, '_')
}

/** "new-york" or "new_york" → "New York" */
export function slugToDisplayName(slug: string): string {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** "United States" → "united-states" */
export function countryToSlug(country: string): string {
  return country
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// ── Taxi data helpers ────────────────────────────────────────────────────────

export function getAllCitySlugs(): string[] {
  return Object.keys(taxiRates).map(keyToSlug)
}

export function getCityData(slug: string): (CityRateEntry & { cityKey: string }) | null {
  const key = slugToKey(slug)
  const rate = taxiRates[key]
  if (!rate) return null
  return { ...rate, cityKey: key }
}

/** Compute a sample fare range for a given km distance */
export function sampleFare(
  rate: CityRateEntry,
  km: number
): { min: number; max: number } {
  const raw = rate.baseRate + rate.ratePerKm * km
  const fare = Math.max(raw, rate.minimumFare)
  return {
    min: Math.round(fare * 0.85),
    max: Math.round(fare * 1.15),
  }
}

/** Format a fare amount with the city's currency symbol */
export function formatFare(rate: CityRateEntry, amount: number): string {
  // For currencies where symbol comes after, or amounts ≥ 1000 use space formatting
  const sym = rate.currencySymbol
  if (amount >= 1000) {
    return `${sym}${amount.toLocaleString()}`
  }
  return `${sym}${amount}`
}

// ── Tipping data helpers ─────────────────────────────────────────────────────

export const TIPPING_COUNTRIES = [
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

export function getAllCountrySlugs(): string[] {
  return TIPPING_COUNTRIES.map(countryToSlug)
}

// ── JSON-LD builders ─────────────────────────────────────────────────────────

const BASE_URL = 'https://fairfare.app'

export function taxiBreadcrumbJsonLd(citySlug: string, cityName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Taxi Fare Check', item: `${BASE_URL}/taxi` },
      { '@type': 'ListItem', position: 3, name: cityName, item: `${BASE_URL}/taxi/${citySlug}` },
    ],
  }
}

export function tippingBreadcrumbJsonLd(countrySlug: string, countryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tipping Guide', item: `${BASE_URL}/tipping` },
      { '@type': 'ListItem', position: 3, name: countryName, item: `${BASE_URL}/tipping/${countrySlug}` },
    ],
  }
}

export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function taxiServiceJsonLd(cityName: string, country: string, citySlug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Taxi Fare Checker — ${cityName}`,
    description: `Real taxi fare estimates for ${cityName}, ${country}. Check if you're being charged a fair price.`,
    url: `${BASE_URL}/taxi/${citySlug}`,
    provider: {
      '@type': 'WebApplication',
      name: 'FairFare',
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: { '@type': 'Country', name: country },
    },
  }
}

export function tippingServiceJsonLd(countryName: string, countrySlug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Tipping Guide — ${countryName}`,
    description: `Cultural tipping etiquette and expected amounts for restaurants, taxis, hotels and spas in ${countryName}.`,
    url: `${BASE_URL}/tipping/${countrySlug}`,
    provider: {
      '@type': 'WebApplication',
      name: 'FairFare',
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: countryName,
    },
  }
}
