/**
 * lib/rideshare.ts
 *
 * City-level (with country fallback) dataset of ride-sharing apps available
 * for each location. Used by TaxiResult to show alternatives to the user.
 *
 * Lyft: replace NEXT_PUBLIC_LYFT_AFFILIATE_URL in .env.local with your
 * Impact/Rakuten affiliate link once approved (see setup guide below).
 */

export interface RideShareApp {
  name:      string
  url:       string
  /** true = affiliate link; shown with disclosure footnote */
  affiliate: boolean
}

// ── App definitions ────────────────────────────────────────────────────────────

// Lyft affiliate URL — set NEXT_PUBLIC_LYFT_AFFILIATE_URL in .env.local
// to your tracked affiliate link. Falls back to standard Lyft homepage.
const LYFT_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_LYFT_AFFILIATE_URL)
    ? process.env.NEXT_PUBLIC_LYFT_AFFILIATE_URL
    : 'https://www.lyft.com'

const UBER:    RideShareApp = { name: 'Uber',       url: 'https://m.uber.com',              affiliate: false }
const GRAB:    RideShareApp = { name: 'Grab',       url: 'https://www.grab.com',             affiliate: false }
const BOLT:    RideShareApp = { name: 'Bolt',       url: 'https://bolt.eu',                  affiliate: false }
const LYFT:    RideShareApp = { name: 'Lyft',       url: LYFT_URL,                           affiliate: true  }
const DIDI:    RideShareApp = { name: 'DiDi',       url: 'https://web.didiglobal.com',       affiliate: false }
const CAREEM:  RideShareApp = { name: 'Careem',     url: 'https://www.careem.com',           affiliate: false }
const OLA:     RideShareApp = { name: 'Ola',        url: 'https://www.olacabs.com',          affiliate: false }
const GOJEK:   RideShareApp = { name: 'Gojek',      url: 'https://www.gojek.com',            affiliate: false }
const INDRIVE: RideShareApp = { name: 'inDrive',    url: 'https://indrive.com',              affiliate: false }
const YANDEX:  RideShareApp = { name: 'Yandex Go',  url: 'https://go.yandex',               affiliate: false }
const CABIFY:  RideShareApp = { name: 'Cabify',     url: 'https://cabify.com',               affiliate: false }
const APP99:   RideShareApp = { name: '99',         url: 'https://99app.com',                affiliate: false }
const KAKAO:   RideShareApp = { name: 'Kakao T',    url: 'https://www.kakaomobility.com',    affiliate: false }

// ── City-level overrides ───────────────────────────────────────────────────────
// Key = city name lowercased (must match what Google Maps / result.city returns)

const CITY: Record<string, RideShareApp[]> = {

  // ── China (Uber exited — DiDi only) ─────────────────────────────────────────
  'beijing':           [DIDI],
  'shanghai':          [DIDI],
  'guangzhou':         [DIDI],
  'shenzhen':          [DIDI],
  'hangzhou':          [DIDI],
  'suzhou':            [DIDI],
  'chengdu':           [DIDI],

  // ── Russia (Uber exited 2022 — Yandex Go + inDrive) ─────────────────────────
  'moscow':            [YANDEX, INDRIVE],
  'saint petersburg':  [YANDEX, INDRIVE],

  // ── United States (Uber + Lyft) ──────────────────────────────────────────────
  'atlanta':           [UBER, LYFT],
  'chicago':           [UBER, LYFT],
  'honolulu':          [UBER, LYFT],
  'houston':           [UBER, LYFT],
  'las vegas':         [UBER, LYFT],
  'los angeles':       [UBER, LYFT],
  'miami':             [UBER, LYFT],
  'new york':          [UBER, LYFT],
  'orlando':           [UBER, LYFT],
  'san francisco':     [UBER, LYFT],
  'seattle':           [UBER, LYFT],
  'washington d.c.':   [UBER, LYFT],

  // ── Southeast Asia ───────────────────────────────────────────────────────────
  'bangkok':           [GRAB, UBER, BOLT],
  'chiang mai':        [GRAB, UBER, BOLT],
  'phuket':            [GRAB, UBER],
  'pattaya':           [GRAB, UBER],
  'krabi':             [GRAB, UBER],
  'kuala lumpur':      [GRAB, UBER],
  'singapore':         [GRAB, UBER, GOJEK],
  'jakarta':           [GOJEK, GRAB, UBER],
  'denpasar':          [GOJEK, GRAB, UBER],   // Bali
  'manila':            [GRAB, UBER],
  'ho chi minh city':  [GRAB, UBER],
  'ha long':           [GRAB, UBER],

  // ── South Korea ──────────────────────────────────────────────────────────────
  'seoul':             [KAKAO, UBER],

  // ── Japan ────────────────────────────────────────────────────────────────────
  'tokyo':             [UBER, DIDI],

  // ── Taiwan ───────────────────────────────────────────────────────────────────
  'taipei':            [UBER],

  // ── Australia ────────────────────────────────────────────────────────────────
  'sydney':            [UBER, OLA],
  'melbourne':         [UBER, OLA],

  // ── New Zealand ──────────────────────────────────────────────────────────────
  'auckland':          [UBER],
  'christchurch':      [UBER],
  'queenstown':        [UBER],

  // ── UK ───────────────────────────────────────────────────────────────────────
  'london':            [UBER, BOLT, OLA],
  'edinburgh':         [UBER, BOLT, OLA],

  // ── Spain (Cabify is major) ───────────────────────────────────────────────────
  'madrid':            [UBER, BOLT, CABIFY],
  'barcelona':         [UBER, BOLT, CABIFY],

  // ── Latin America ────────────────────────────────────────────────────────────
  'buenos aires':      [UBER, DIDI, CABIFY, INDRIVE],
  'sao paulo':         [UBER, APP99, DIDI, CABIFY],   // without diacritic (fallback)
  'são paulo':         [UBER, APP99, DIDI, CABIFY],   // Google Maps canonical form
  'rio de janeiro':    [UBER, APP99, DIDI, CABIFY],
  'mexico city':       [UBER, DIDI, CABIFY, INDRIVE],
  'bogota':            [UBER, DIDI, CABIFY, INDRIVE],
  'lima':              [UBER, CABIFY, INDRIVE],
  'quito':             [UBER, INDRIVE],
  'santo domingo':     [UBER, INDRIVE],
  'punta cana':        [UBER, INDRIVE],
  'caracas':           [INDRIVE],                      // Uber exited 2019

  // ── Middle East ──────────────────────────────────────────────────────────────
  'dubai':             [UBER, CAREEM],
  'abu dhabi':         [UBER, CAREEM],
  'sharjah':           [UBER, CAREEM],
  'riyadh':            [UBER, CAREEM, INDRIVE],
  'mecca':             [UBER, CAREEM],
  'eastern province':  [UBER, CAREEM],
  'amman':             [UBER, CAREEM],

  // ── North Africa ─────────────────────────────────────────────────────────────
  'cairo':             [UBER, CAREEM, BOLT, INDRIVE],
  'hurghada':          [UBER, INDRIVE],
  'sharm el sheikh':   [UBER, INDRIVE],
  'casablanca':        [UBER, CAREEM, BOLT],
  'marrakech':         [UBER, CAREEM, BOLT],
  'tunis':             [UBER, BOLT],
  'algiers':           [UBER],

  // ── Sub-Saharan Africa ───────────────────────────────────────────────────────
  'nairobi':           [UBER, BOLT, INDRIVE],
  'johannesburg':      [UBER, BOLT],
  'cape town':         [UBER, BOLT],

  // ── Eastern Europe + CIS ─────────────────────────────────────────────────────
  'kyiv':              [UBER, BOLT, INDRIVE],
  'minsk':             [UBER, YANDEX, INDRIVE],
  'warsaw':            [UBER, BOLT],
  'prague':            [UBER, BOLT],
  'bucharest':         [UBER, BOLT],
  'budapest':          [UBER, BOLT],
  'varna':             [UBER, BOLT],
  'burgas':            [UBER, BOLT],

  // ── Turkey ───────────────────────────────────────────────────────────────────
  'istanbul':          [UBER, BOLT, INDRIVE],
  'antalya':           [UBER, BOLT],
  'mugla':             [UBER, BOLT],
  'edirne':            [UBER],

  // ── India ────────────────────────────────────────────────────────────────────
  'delhi':             [UBER, OLA],
  'mumbai':            [UBER, OLA],
  'kolkata':           [UBER, OLA],
  'chennai':           [UBER, OLA],
  'jaipur':            [UBER, OLA],
  'agra':              [UBER, OLA],

  // ── Macau / Hong Kong ────────────────────────────────────────────────────────
  'macau':             [UBER],
  'hong kong':         [UBER],

  // ── Iceland ──────────────────────────────────────────────────────────────────
  'reykjavik':         [UBER],

  // ── No major ride-share apps ─────────────────────────────────────────────────
  'aleppo':            [],   // conflict zone
  'damascus':          [],   // conflict zone
  'port vila':         [],   // Vanuatu — no major apps
}

// ── Country-level fallbacks ────────────────────────────────────────────────────
// Used when the city doesn't have a specific entry above.

const COUNTRY: Record<string, RideShareApp[]> = {
  'thailand':              [GRAB, UBER],
  'malaysia':              [GRAB, UBER],
  'indonesia':             [GOJEK, GRAB, UBER],
  'philippines':           [GRAB, UBER],
  'vietnam':               [GRAB, UBER],
  'cambodia':              [GRAB, UBER],
  'singapore':             [GRAB, UBER, GOJEK],
  'china':                 [DIDI],
  'japan':                 [UBER],
  'south korea':           [KAKAO, UBER],
  'taiwan':                [UBER],
  'hong kong':             [UBER],
  'india':                 [UBER, OLA],
  'australia':             [UBER, OLA],
  'new zealand':           [UBER],
  'united kingdom':        [UBER, BOLT, OLA],
  'ireland':               [UBER, BOLT],
  'france':                [UBER, BOLT],
  'germany':               [UBER, BOLT],
  'netherlands':           [UBER, BOLT],
  'belgium':               [UBER, BOLT],
  'austria':               [UBER, BOLT],
  'switzerland':           [UBER, BOLT],
  'italy':                 [UBER, BOLT],
  'spain':                 [UBER, BOLT, CABIFY],
  'portugal':              [UBER, BOLT],
  'denmark':               [UBER, BOLT],
  'sweden':                [UBER, BOLT],
  'norway':                [UBER, BOLT],
  'finland':               [UBER, BOLT],
  'poland':                [UBER, BOLT],
  'czech republic':        [UBER, BOLT],
  'hungary':               [UBER, BOLT],
  'romania':               [UBER, BOLT],
  'bulgaria':              [UBER, BOLT],
  'croatia':               [UBER, BOLT],
  'greece':                [UBER, BOLT],
  'turkey':                [UBER, BOLT, INDRIVE],
  'ukraine':               [UBER, BOLT, INDRIVE],
  'russia':                [YANDEX, INDRIVE],
  'belarus':               [YANDEX, INDRIVE],
  'israel':                [UBER],
  'jordan':                [UBER, CAREEM],
  'united arab emirates':  [UBER, CAREEM],
  'uae':                   [UBER, CAREEM],
  'saudi arabia':          [UBER, CAREEM, INDRIVE],
  'egypt':                 [UBER, CAREEM, BOLT, INDRIVE],
  'morocco':               [UBER, CAREEM, BOLT],
  'tunisia':               [UBER, BOLT],
  'kenya':                 [UBER, BOLT, INDRIVE],
  'south africa':          [UBER, BOLT],
  'united states':         [UBER, LYFT],
  'canada':                [UBER],
  'mexico':                [UBER, DIDI, CABIFY, INDRIVE],
  'brazil':                [UBER, APP99, DIDI, CABIFY],
  'argentina':             [UBER, DIDI, CABIFY, INDRIVE],
  'colombia':              [UBER, DIDI, CABIFY, INDRIVE],
  'peru':                  [UBER, CABIFY, INDRIVE],
  'chile':                 [UBER, CABIFY],
  'ecuador':               [UBER, INDRIVE],
  'venezuela':             [INDRIVE],
  'dominican republic':    [UBER, INDRIVE],
  'costa rica':            [UBER],
}

// ── Lookup function ────────────────────────────────────────────────────────────

function norm(s: string): string {
  return s.toLowerCase().trim()
}

/**
 * Returns the ride-sharing apps available for the given city and country.
 * City-level data takes priority over country-level.
 * Returns an empty array for locations with no known major ride-share apps.
 */
export function getRideShareApps(city: string, country: string): RideShareApp[] {
  const cityKey    = norm(city)
  const countryKey = norm(country)

  // City-level override (most precise)
  if (Object.prototype.hasOwnProperty.call(CITY, cityKey)) {
    return CITY[cityKey]
  }

  // Country-level fallback
  if (COUNTRY[countryKey]) {
    return COUNTRY[countryKey]
  }

  // Final fallback: Uber is the most globally available option
  return [UBER]
}
