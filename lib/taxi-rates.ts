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
 * Keys are city-only (no country suffix) — the lookup tries progressively
 * shorter keys so country tokens are automatically stripped.
 *
 * Airport → city mappings are critical: many airports are located in a
 * suburb or neighbouring municipality that Google Maps returns instead of
 * the major city (e.g. Suvarnabhumi → Samut Prakan, not Bangkok).
 */
const ALIASES: Record<string, string> = {
  // ── Name variants ─────────────────────────────────────────────────────────
  ho_chi_minh_city:        'ho_chi_minh',
  saigon:                  'ho_chi_minh',
  ha_long:                 'halong',
  halong_bay:              'halong',
  ha_long_city:            'halong',
  new_york_city:           'new_york',
  nyc:                     'new_york',
  los_angeles:             'los_angeles',
  la:                      'los_angeles',
  dc:                      'washington_dc',
  washington:              'washington_dc',
  sf:                      'san_francisco',
  dammam:                  'east_province',
  al_khobar:               'east_province',
  khobar:                  'east_province',
  makkah:                  'mecca',
  makkah_al_mukarramah:    'mecca',
  makka:                   'mecca',
  bali:                    'denpasar',
  bodrum:                  'mugla',
  marmaris:                'mugla',
  fethiye:                 'mugla',
  kyiv:                    'kyiv',
  kiev:                    'kyiv',
  sao_paulo:               'sao_paulo',
  st_pete:                 'st_petersburg',
  saint_petersburg:        'st_petersburg',
  kolkata:                 'kolkata',
  calcutta:                'kolkata',
  mumbai:                  'mumbai',
  bombay:                  'mumbai',
  cape_town:               'cape_town',
  buenos_aires:            'buenos_aires',

  // ── Airport → city mappings ───────────────────────────────────────────────
  // Bangkok — Suvarnabhumi is in Samut Prakan Province; Don Mueang is its own district
  samut_prakan:            'bangkok',
  bang_phli:               'bangkok',
  racha_thewa:             'bangkok',
  don_mueang:              'bangkok',

  // London — Heathrow → Hillingdon; Gatwick → Crawley; Stansted → Uttlesford
  hillingdon:              'london',
  crawley:                 'london',
  gatwick:                 'london',
  uttlesford:              'london',
  stansted_mountfitchet:   'london',
  spelthorne:              'london',  // Heathrow area borough

  // Paris — CDG is in Roissy-en-France / Val-d'Oise
  roissy_en_france:        'paris',
  roissy:                  'paris',
  gonesse:                 'paris',
  tremblay_en_france:      'paris',

  // Amsterdam — Schiphol is in Haarlemmermeer municipality
  haarlemmermeer:          'amsterdam',
  schiphol:                'amsterdam',

  // New York — JFK / LaGuardia are in Queens
  queens:                  'new_york',
  jamaica:                 'new_york',
  east_elmhurst:           'new_york',
  newark:                  'new_york',  // EWR serves NYC

  // Tokyo — Narita is in Chiba Prefecture; Haneda is in Ota (Tokyo ward, handled by partial)
  narita:                  'tokyo',
  chiba:                   'tokyo',   // Narita area
  ota:                     'tokyo',   // Haneda ward

  // Rome — Fiumicino airport in Fiumicino municipality
  fiumicino:               'rome',
  ciampino:                'rome',

  // Barcelona — El Prat de Llobregat
  el_prat_de_llobregat:    'barcelona',
  prat_de_llobregat:       'barcelona',
  hospitalet_de_llobregat: 'barcelona',

  // Istanbul — New airport in Arnavutköy; Sabiha Gökçen in Pendik
  arnavutkoy:              'istanbul',
  pendik:                  'istanbul',
  tuzla:                   'istanbul',

  // Sydney — Kingsford Smith is in Mascot / Botany Bay
  mascot:                  'sydney',
  botany_bay:              'sydney',
  wolli_creek:             'sydney',

  // Melbourne — Tullamarine in Hume City
  tullamarine:             'melbourne',
  hume:                    'melbourne',

  // Toronto — Pearson is in Mississauga
  mississauga:             'toronto',
  brampton:                'toronto',

  // Vancouver — YVR is in Richmond
  richmond:                'vancouver',
  sea_island:              'vancouver',

  // Moscow — Sheremetyevo in Khimki; Domodedovo south of city
  khimki:                  'moscow',
  domodedovo:              'moscow',
  zhukovsky:               'moscow',
  lobnya:                  'moscow',  // Sheremetyevo area

  // Milan — Malpensa in Cardano al Campo / Somma Lombardo
  cardano_al_campo:        'milan',
  somma_lombardo:          'milan',
  samarate:                'milan',
  sesto_calende:           'milan',

  // Kuala Lumpur — KLIA is in Sepang
  sepang:                  'kuala_lumpur',

  // Seoul — Incheon International is a separate city from Seoul
  incheon:                 'seoul',
  jung_gu:                 'seoul',

  // Beijing — Capital Airport in Shunyi District
  shunyi:                  'beijing',

  // San Francisco — SFO is in San Mateo County
  san_mateo:               'san_francisco',
  millbrae:                'san_francisco',
  burlingame:              'san_francisco',
  brisbane:                'san_francisco',  // Brisbane, CA (not Australia)

  // Seattle — SeaTac city is a separate municipality
  seatac:                  'seattle',
  sea_tac:                 'seattle',
  tukwila:                 'seattle',

  // Washington DC — Reagan in Arlington; Dulles in Loudoun County
  arlington:               'washington_dc',
  sterling:                'washington_dc',
  chantilly:               'washington_dc',
  dulles:                  'washington_dc',

  // Las Vegas — Harry Reid airport is in Paradise NV (unincorporated)
  paradise:                'las_vegas',
  enterprise:              'las_vegas',

  // Atlanta — Hartsfield-Jackson spans Atlanta / College Park / Hapeville
  college_park:            'atlanta',
  hapeville:               'atlanta',
  east_point:              'atlanta',

  // Brussels — Brussels Airport in Zaventem
  zaventem:                'brussels',

  // Dublin — Dublin Airport in Fingal
  fingal:                  'dublin',
  swords:                  'dublin',

  // Vienna — Vienna Airport in Schwechat (Lower Austria)
  schwechat:               'vienna',
  fischamend:              'vienna',

  // Zurich — Airport in Kloten
  kloten:                  'zurich',
  opfikon:                 'zurich',

  // Munich — MUC in Freising / Erding / Oberding
  freising:                'munich',
  erding:                  'munich',
  oberding:                'munich',
  hallbergmoos:            'munich',

  // Athens — Athens International in Spata / Markopoulo
  spata:                   'athens',
  markopoulo:              'athens',
  koropi:                  'athens',

  // Manila — NAIA terminals in Pasay and Parañaque
  pasay:                   'manila',
  paranaque:               'manila',

  // Jakarta — Soetta (CGK) in Tangerang
  tangerang:               'jakarta',
  kosambi:                 'jakarta',

  // Budapest — BUD (Ferenc Liszt) is within the city; no alias needed

  // Colombo — BIA (Bandaranaike) is in Katunayake, Gampaha District
  katunayake:              'colombo',
  gampaha:                 'colombo',

  // Copenhagen — CPH is in Taarnby municipality
  taarnby:                 'copenhagen',
  kastrup:                 'copenhagen',

  // Hanoi — Noi Bai airport is in Soc Son District, Hanoi
  soc_son:                 'hanoi',
  noi_bai:                 'hanoi',

  // Havana — José Martí airport is in Boyeros municipality
  boyeros:                 'havana',

  // Osaka — KIX (Kansai) is in Izumisano; ITM (Itami) is in Itami city
  izumisano:               'osaka',
  itami:                   'osaka',
  sennan:                  'osaka',    // KIX straddles Sennan/Izumisano
  rinku:                   'osaka',    // Rinku Town near KIX

  // Stockholm — Arlanda (ARN) is in Sigtuna municipality
  sigtuna:                 'stockholm',
  marsta:                  'stockholm',  // Märsta — the town at Arlanda

  // Buenos Aires — Ezeiza International south of city
  ezeiza:                  'buenos_aires',

  // São Paulo — Guarulhos airport in Guarulhos city
  guarulhos:               'sao_paulo',
  cumbica:                 'sao_paulo',

  // Rio de Janeiro — Galeão on Ilha do Governador
  ilha_do_governador:      'rio_de_janeiro',
  galeao:                  'rio_de_janeiro',
}

/**
 * Find rate data by matching a "city country" string against known keys.
 * Returns null if the city is not in the dataset.
 */
export function findCityRate(cityString: string): (CityRate & { city: string }) | null {
  const key = normaliseKey(cityString)

  // 1. Direct match
  if (taxiRates[key]) return { ...taxiRates[key], city: key }

  // 2. Alias match (exact key)
  if (ALIASES[key] && taxiRates[ALIASES[key]]) {
    const resolved = ALIASES[key]
    return { ...taxiRates[resolved], city: resolved }
  }

  // 2b. Alias match stripping trailing country tokens (1–3 words).
  //     e.g. "samut_prakan_thailand" → try "samut_prakan" → ALIASES → "bangkok"
  //     e.g. "el_prat_de_llobregat_spain" → try shorter prefixes until match
  const parts = key.split('_')
  for (let drop = 1; drop <= Math.min(3, parts.length - 1); drop++) {
    const shorter = parts.slice(0, parts.length - drop).join('_')
    if (shorter.length >= 3 && ALIASES[shorter] && taxiRates[ALIASES[shorter]]) {
      const resolved = ALIASES[shorter]
      return { ...taxiRates[resolved], city: resolved }
    }
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
