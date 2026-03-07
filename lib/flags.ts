/**
 * Maps country display names → ISO 3166-1 alpha-2 codes for flag SVGs.
 * Flags live at /public/images/flags/{iso2}.svg
 */

export const COUNTRY_FLAGS: Record<string, string> = {
  'Argentina':       'ar',
  'Australia':       'au',
  'Austria':         'at',
  'Belgium':         'be',
  'Brazil':          'br',
  'Canada':          'ca',
  'Chile':           'cl',
  'China':           'cn',
  'Colombia':        'co',
  'Croatia':         'hr',
  'Czech Republic':  'cz',
  'Denmark':         'dk',
  'Egypt':           'eg',
  'Finland':         'fi',
  'France':          'fr',
  'Germany':         'de',
  'Greece':          'gr',
  'Hong Kong':       'hk',
  'Hungary':         'hu',
  'India':           'in',
  'Indonesia':       'id',
  'Ireland':         'ie',
  'Israel':          'il',
  'Italy':           'it',
  'Japan':           'jp',
  'Jordan':          'jo',
  'Malaysia':        'my',
  'Mexico':          'mx',
  'Morocco':         'ma',
  'Netherlands':     'nl',
  'New Zealand':     'nz',
  'Norway':          'no',
  'Peru':            'pe',
  'Philippines':     'ph',
  'Poland':          'pl',
  'Portugal':        'pt',
  'Romania':         'ro',
  'Russia':          'ru',
  'Saudi Arabia':    'sa',
  'Singapore':       'sg',
  'South Africa':    'za',
  'South Korea':     'kr',
  'Spain':           'es',
  'Sweden':          'se',
  'Switzerland':     'ch',
  'Taiwan':          'tw',
  'Thailand':        'th',
  'Turkey':          'tr',
  'UAE':             'ae',
  'Ukraine':         'ua',
  'United Kingdom':  'gb',
  'United States':   'us',
  'Vietnam':         'vn',
}

/** Returns the path to the flag SVG, or null if no mapping found. */
export function flagSrc(country: string): string | null {
  const iso2 = COUNTRY_FLAGS[country]
  return iso2 ? `/images/flags/${iso2}.svg` : null
}
