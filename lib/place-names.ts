/**
 * Localized display names for the hand-curated featured cities and countries.
 *
 * Only entries that differ from English are listed — anything not found here
 * falls back to the English / slug-derived name via getCityDisplayName() /
 * getCountryDisplayName().
 *
 * City keys match the URL slug used in /taxi/[city].
 * Country keys match the canonical English names in TIPPING_COUNTRIES.
 */

import type { Locale } from '@/lib/i18n'

type LocaleMap = Partial<Record<Locale, string>>
type PlaceNames = Record<string, LocaleMap>

// ── City names ────────────────────────────────────────────────────────────────

const CITY_NAMES: PlaceNames = {
  'london': {
    es: 'Londres',
    fr: 'Londres',
    pt: 'Londres',
    // de: 'London' — same as English
  },
  'new-york': {
    es: 'Nueva York',
    pt: 'Nova York',
    // fr: 'New York' — same as English
    // de: 'New York' — same as English
  },
  'singapore': {
    es: 'Singapur',
    fr: 'Singapour',
    de: 'Singapur',
    pt: 'Singapura',
  },
  'tokyo': {
    es: 'Tokio',
    de: 'Tokio',
    pt: 'Tóquio',
    // fr: 'Tokyo' — same as English
  },
  'rome': {
    es: 'Roma',
    fr: 'Rome',
    de: 'Rom',
    pt: 'Roma',
  },
  'paris': {
    // same in all supported languages
  },
  'amsterdam': {
    // same in all supported languages
  },
  'barcelona': {
    // same in all supported languages
  },
  'dubai': {
    // same in all supported languages
  },
  'bangkok': {
    // same in all supported languages
  },
  'istanbul': {
    // same in all supported languages
  },
  'bali': {
    // same in all supported languages
  },
}

// ── Country names ─────────────────────────────────────────────────────────────

const COUNTRY_NAMES: PlaceNames = {
  'United States': {
    es: 'Estados Unidos',
    fr: 'États-Unis',
    de: 'Vereinigte Staaten',
    pt: 'Estados Unidos',
  },
  'United Kingdom': {
    es: 'Reino Unido',
    fr: 'Royaume-Uni',
    de: 'Vereinigtes Königreich',
    pt: 'Reino Unido',
  },
  'France': {
    es: 'Francia',
    de: 'Frankreich',
    pt: 'França',
    // fr: 'France' — same
  },
  'Japan': {
    es: 'Japón',
    fr: 'Japon',
    pt: 'Japão',
    // de: 'Japan' — same
  },
  'Italy': {
    es: 'Italia',
    fr: 'Italie',
    de: 'Italien',
    pt: 'Itália',
  },
  'Thailand': {
    es: 'Tailandia',
    fr: 'Thaïlande',
    pt: 'Tailândia',
    // de: 'Thailand' — same
  },
  'Spain': {
    es: 'España',
    fr: 'Espagne',
    de: 'Spanien',
    pt: 'Espanha',
  },
  'Australia': {
    // same in all supported languages
  },
  'Germany': {
    es: 'Alemania',
    fr: 'Allemagne',
    de: 'Deutschland',
    pt: 'Alemanha',
  },
  'UAE': {
    fr: 'ÉAU',
    de: 'VAE',
    // es/pt: 'EAU' — close enough; keeping English 'UAE' for clarity
  },
  'Mexico': {
    es: 'México',
    fr: 'Mexique',
    de: 'Mexiko',
    pt: 'México',
  },
  'Indonesia': {
    fr: 'Indonésie',
    de: 'Indonesien',
    pt: 'Indonésia',
    // es: 'Indonesia' — same
  },
}

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Returns the localized city name for a given slug and locale.
 *  Falls back to the English `defaultName` (from slugToDisplayName) if not mapped. */
export function getCityDisplayName(
  slug: string,
  locale: Locale,
  defaultName: string
): string {
  return CITY_NAMES[slug]?.[locale] ?? defaultName
}

/** Returns the localized country name for a given English country name and locale.
 *  Falls back to the English name if not mapped. */
export function getCountryDisplayName(country: string, locale: Locale): string {
  return COUNTRY_NAMES[country]?.[locale] ?? country
}
