/**
 * Country-specific driving information — static data.
 * side:     which side of the road traffic drives on
 * unit:     the unit shown on road speed signs
 * limits:   posted speed limits in the local unit
 *   urban    — city / built-up area
 *   openRoad — rural single-carriageway
 *   motorway — divided highway / expressway (null = no motorway network)
 *   motorwayNote — optional clarification (e.g. "recommended" for unlimited Autobahn sections)
 */

export interface DrivingInfo {
  side: 'left' | 'right'
  unit: 'km/h' | 'mph'
  limits: {
    urban: number
    openRoad: number
    motorway: number | null
    motorwayNote?: string
  }
}

const DRIVING_INFO: Record<string, DrivingInfo> = {

  // ── Southeast Asia ──────────────────────────────────────────────────────────
  thailand: {
    side: 'left', unit: 'km/h',
    limits: { urban: 60, openRoad: 90, motorway: 120 },
  },
  vietnam: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 120 },
  },
  cambodia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 40, openRoad: 80, motorway: 100 },
  },
  laos: {
    side: 'right', unit: 'km/h',
    limits: { urban: 40, openRoad: 80, motorway: null },
  },
  myanmar: {
    side: 'right', unit: 'mph',
    limits: { urban: 30, openRoad: 55, motorway: 55 },
  },
  indonesia: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 100 },
  },
  malaysia: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 110 },
  },
  singapore: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 70, motorway: 90 },
  },
  philippines: {
    side: 'right', unit: 'km/h',
    limits: { urban: 40, openRoad: 80, motorway: 100 },
  },
  'the philippines': {
    side: 'right', unit: 'km/h',
    limits: { urban: 40, openRoad: 80, motorway: 100 },
  },

  // ── East Asia ───────────────────────────────────────────────────────────────
  japan: {
    side: 'left', unit: 'km/h',
    limits: { urban: 60, openRoad: 60, motorway: 100 },
  },
  china: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  'south korea': {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 110 },
  },
  korea: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 110 },
  },
  taiwan: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 110 },
  },
  'hong kong': {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 70, motorway: 110 },
  },
  mongolia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 80, motorway: 110 },
  },

  // ── South Asia ──────────────────────────────────────────────────────────────
  india: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 120 },
  },
  nepal: {
    side: 'left', unit: 'km/h',
    limits: { urban: 40, openRoad: 70, motorway: null },
  },
  'sri lanka': {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 70, motorway: 100 },
  },
  bangladesh: {
    side: 'left', unit: 'km/h',
    limits: { urban: 40, openRoad: 80, motorway: 100 },
  },
  pakistan: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 120 },
  },
  maldives: {
    side: 'left', unit: 'km/h',
    limits: { urban: 25, openRoad: 50, motorway: null },
  },
  bhutan: {
    side: 'left', unit: 'km/h',
    limits: { urban: 40, openRoad: 60, motorway: null },
  },

  // ── Middle East ─────────────────────────────────────────────────────────────
  'united arab emirates': {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 140 },
  },
  uae: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 140 },
  },
  dubai: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 140 },
  },
  'saudi arabia': {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  turkey: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 120 },
  },
  jordan: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 110 },
  },
  egypt: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 90, motorway: 120 },
  },
  israel: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 110 },
  },
  qatar: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  kuwait: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  bahrain: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  oman: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },

  // ── Europe ──────────────────────────────────────────────────────────────────
  'united kingdom': {
    side: 'left', unit: 'mph',
    limits: { urban: 30, openRoad: 60, motorway: 70 },
  },
  uk: {
    side: 'left', unit: 'mph',
    limits: { urban: 30, openRoad: 60, motorway: 70 },
  },
  england: {
    side: 'left', unit: 'mph',
    limits: { urban: 30, openRoad: 60, motorway: 70 },
  },
  scotland: {
    side: 'left', unit: 'mph',
    limits: { urban: 30, openRoad: 60, motorway: 70 },
  },
  ireland: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 120 },
  },
  france: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 130 },
  },
  germany: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 130, motorwayNote: 'recommended — some sections unrestricted' },
  },
  italy: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  spain: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 120 },
  },
  portugal: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 120 },
  },
  greece: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  netherlands: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 100 },
  },
  belgium: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 120 },
  },
  switzerland: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 120 },
  },
  austria: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 130 },
  },
  poland: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 140 },
  },
  czechia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  'czech republic': {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  hungary: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  romania: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  sweden: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 70, motorway: 120 },
  },
  norway: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 110 },
  },
  denmark: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 130 },
  },
  finland: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 120 },
  },
  croatia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  slovenia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  serbia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 130 },
  },
  bulgaria: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 140 },
  },
  ukraine: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 130 },
  },
  malta: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: null },
  },
  cyprus: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 100 },
  },
  iceland: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: null },
  },

  // ── Americas ────────────────────────────────────────────────────────────────
  'united states': {
    side: 'right', unit: 'mph',
    limits: { urban: 35, openRoad: 55, motorway: 70 },
  },
  usa: {
    side: 'right', unit: 'mph',
    limits: { urban: 35, openRoad: 55, motorway: 70 },
  },
  canada: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 100 },
  },
  mexico: {
    side: 'right', unit: 'km/h',
    limits: { urban: 40, openRoad: 90, motorway: 110 },
  },
  brazil: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  argentina: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 110, motorway: 130 },
  },
  colombia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 90, motorway: 120 },
  },
  peru: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 100 },
  },
  chile: {
    side: 'right', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  cuba: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 90, motorway: 100 },
  },
  'costa rica': {
    side: 'right', unit: 'km/h',
    limits: { urban: 40, openRoad: 80, motorway: 100 },
  },
  jamaica: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: null },
  },

  // ── Africa ──────────────────────────────────────────────────────────────────
  'south africa': {
    side: 'left', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  kenya: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: 110 },
  },
  nigeria: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 100 },
  },
  ghana: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 100 },
  },
  ethiopia: {
    side: 'right', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 120 },
  },
  morocco: {
    side: 'right', unit: 'km/h',
    limits: { urban: 40, openRoad: 100, motorway: 120 },
  },
  tanzania: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: null },
  },
  uganda: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: null },
  },
  zimbabwe: {
    side: 'left', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  zambia: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 120 },
  },
  botswana: {
    side: 'left', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },
  namibia: {
    side: 'left', unit: 'km/h',
    limits: { urban: 60, openRoad: 100, motorway: 120 },
  },

  // ── Oceania ─────────────────────────────────────────────────────────────────
  australia: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 110 },
  },
  'new zealand': {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 100, motorway: 110 },
  },
  fiji: {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: null },
  },
  'papua new guinea': {
    side: 'left', unit: 'km/h',
    limits: { urban: 50, openRoad: 80, motorway: null },
  },
}

/** Convert km/h → mph (rounded to nearest integer) */
export function toMph(kmh: number): number {
  return Math.round(kmh * 0.621371)
}

/** Convert mph → km/h (rounded to nearest integer) */
export function toKmh(mph: number): number {
  return Math.round(mph * 1.60934)
}

/** Normalise a country name for lookup */
function normalise(country: string): string {
  return country.toLowerCase().trim()
}

/**
 * Look up driving info for a country.
 * Returns null if the country is not in the dataset.
 */
export function getDrivingInfo(country: string): DrivingInfo | null {
  return DRIVING_INFO[normalise(country)] ?? null
}
