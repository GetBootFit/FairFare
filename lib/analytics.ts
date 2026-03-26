/**
 * GA4 event helpers — thin wrappers around gtag() for funnel tracking.
 * Vercel Analytics (track()) runs in parallel for its own dashboards.
 * All calls are no-ops if NEXT_PUBLIC_GA4_ID is not configured.
 */

type Gtag = (...args: unknown[]) => void

function getGtag(): Gtag | null {
  if (typeof window === 'undefined') return null
  const g = (window as Window & { gtag?: Gtag }).gtag
  return typeof g === 'function' ? g : null
}

/** Free preview loaded — top of funnel. */
export function ga4PreviewLoaded(params: { feature: 'taxi' | 'tipping'; city?: string; country?: string }) {
  getGtag()?.('event', 'preview_loaded', params)
}

/** User opened the payment modal — intent confirmed. */
export function ga4BeginCheckout(params: { feature: 'taxi' | 'tipping'; country?: string }) {
  getGtag()?.('event', 'begin_checkout', {
    currency: 'USD',
    ...params,
  })
}

/** User selected a pricing tier inside the modal. */
export function ga4TierSelected(params: { tier: string; feature: 'taxi' | 'tipping'; country?: string }) {
  getGtag()?.('event', 'select_item', {
    items: [{ item_id: params.tier, item_name: `Hootling ${params.tier}`, item_category: params.feature }],
    ...params,
  })
}

/** User clicked Pay — redirecting to Stripe. */
export function ga4PaymentStarted(params: {
  feature: 'taxi' | 'tipping'
  product: string
  currency: string
  value: number
}) {
  getGtag()?.('event', 'payment_started', params)
}

/** Paid result loaded successfully. */
export function ga4ResultLoaded(params: { feature: 'taxi' | 'tipping'; city?: string; country?: string }) {
  getGtag()?.('event', 'result_loaded', params)
}

/** Cross-sell link clicked. */
export function ga4CrosssellClicked(params: { from: 'taxi' | 'tipping'; country: string }) {
  getGtag()?.('event', 'crosssell_clicked', params)
}
