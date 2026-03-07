import taxiRatesData from '@/data/taxi-rates.json'

interface CityRate {
  currency: string
  currencySymbol: string
  baseRate: number
  ratePerKm: number
  minimumFare: number
  note?: string
}

const taxiRates = taxiRatesData as Record<string, CityRate>

/**
 * Normalise a city/country string into a lookup key.
 * Strips diacritics (é→e, ñ→n, ü→u, etc.) so that
 * "São Paulo", "Cancún", "Bogotá" all resolve correctly.
 */
function normaliseKey(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')                   // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')   // strip combining diacritics
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

/**
 * Aliases map alternative spellings/names to canonical dataset keys.
 */
const ALIASES: Record<string, string> = {
  ho_chi_minh_city:      'ho_chi_minh',
  saigon:                'ho_chi_minh',
  ha_long:               'halong',
  halong_bay:            'halong',
  ha_long_city:          'halong',
  new_york_city:         'new_york',
  nyc:                   'new_york',
  los_angeles:           'los_angeles',
  la:                    'los_angeles',
  dc:                    'washington_dc',
  washington:            'washington_dc',
  sf:                    'san_francisco',
  dammam:                'east_province',
  al_khobar:             'east_province',
  khobar:                'east_province',
  makkah:                'mecca',
  makkah_al_mukarramah:  'mecca',
  makka:                 'mecca',
  bali:                  'denpasar',
  bodrum:                'mugla',
  marmaris:              'mugla',
  fethiye:               'mugla',
  kyiv:                  'kyiv',
  kiev:                  'kyiv',
  sao_paulo:             'sao_paulo',
  st_pete:               'st_petersburg',
  saint_petersburg:      'st_petersburg',
  kolkata:               'kolkata',
  calcutta:              'kolkata',
  mumbai:                'mumbai',
  bombay:                'mumbai',
  cape_town:             'cape_town',
  buenos_aires:          'buenos_aires',
}

/**
 * Find rate data by matching a "city country" string against known keys.
 * Returns null if the city is not in the dataset.
 */
export function findCityRate(cityString: string): (CityRate & { city: string }) | null {
  const key = normaliseKey(cityString)

  // 1. Direct match
  if (taxiRates[key]) return { ...taxiRates[key], city: key }

  // 2. Alias match
  if (ALIASES[key] && taxiRates[ALIASES[key]]) {
    const resolved = ALIASES[key]
    return { ...taxiRates[resolved], city: resolved }
  }

  // 3. Partial match: find dataset key that appears inside the input key
  //    e.g. "paris_france" → matches "paris"
  //    Use longest-match first to avoid e.g. "san" matching "san_francisco"
  const tokens = key.split('_').filter(Boolean)
  const sortedKeys = Object.keys(taxiRates).sort((a, b) => b.length - a.length)

  for (const dataKey of sortedKeys) {
    // The full dataset key must appear as a substring (or the first token must match)
    if (key.includes(dataKey)) {
      return { ...taxiRates[dataKey], city: dataKey }
    }
  }

  // 4. First-token match as last resort (e.g. "bangkok" from "bangkok_thailand")
  const firstToken = tokens[0]
  if (firstToken && firstToken.length >= 4) {
    const match = sortedKeys.find((k) => k.startsWith(firstToken) || firstToken.startsWith(k))
    if (match) return { ...taxiRates[match], city: match }
  }

  return null
}

/**
 * Calculate an estimated fare range from static rate data and distance.
 * Applies ±15% to account for traffic, route variation, and waiting time.
 */
export function calculateFareRange(
  rateData: CityRate,
  distanceKm: number
): { min: number; max: number; currency: string; currencySymbol: string; note?: string } {
  const calculated = rateData.baseRate + rateData.ratePerKm * distanceKm
  const baseFare = Math.max(rateData.minimumFare, calculated)

  const min = Math.round(baseFare * 0.85)
  const max = Math.round(baseFare * 1.15)

  return {
    min,
    max,
    currency: rateData.currency,
    currencySymbol: rateData.currencySymbol,
    note: rateData.note,
  }
}
