// ─── Taxi ─────────────────────────────────────────────────────────────────────

export interface TaxiPreviewResult {
  pickup: string
  destination: string
  distance: { km: number; mi: number }
  duration: { text: string; minutes: number }
  city: string
  country: string
}

export interface TransportOption {
  mode: 'bus' | 'train' | 'metro' | 'tram' | 'ferry'
  duration: string
  durationMinutes: number
  lines: string[]
}

export interface TaxiFullResult extends TaxiPreviewResult {
  fareRange: {
    min: number
    max: number
    currency: string
    currencySymbol: string
    note?: string
  }
  transitOptions: TransportOption[]
  scamWarnings: string[]
  tipping: {
    isExpected: boolean
    recommendation: string
  }
  driverPhrases: Array<{
    context: string
    localLanguage: string
    transliteration: string | null
    english: string
  }>
  /** Dark-styled Google Static Maps URL showing the driving route. Optional — omitted when polyline is unavailable. */
  routeMapUrl?: string
  /**
   * One sentence about pre-booked transfers when contextually relevant
   * (airport routes, cities with high meter-dispute rates). Omitted when not meaningful.
   */
  transferNote?: string
  /** True when Claude was unavailable and scam warnings / phrases are generic fallback data. */
  aiUnavailable?: true
}

// ─── Tipping ──────────────────────────────────────────────────────────────────

export type TippingScenario =
  | 'restaurant'
  | 'taxi'
  | 'hotel_porter'
  | 'bar'
  | 'tour_guide'
  | 'delivery'

export type TippingRating = 'expected' | 'appreciated' | 'optional' | 'avoid'

export interface ScenarioTip {
  isExpected: boolean
  rating: TippingRating
  percentageMin: number | null
  percentageMax: number | null
  typicalAmount: string | null
  notes: string
}

export interface TippingResult {
  country: string
  currency: string
  currencySymbol: string
  scenarios: Record<TippingScenario, ScenarioTip>
  servicePhrases?: Array<{
    context: string
    localLanguage: string
    transliteration: string | null
    english: string
  }>
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string
}

export interface TaxiPreviewInput {
  pickup: string
  destination: string
  pickupPlaceId?: string
  destPlaceId?: string
}

export interface TippingInput {
  country: string
}
