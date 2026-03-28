import Stripe from 'stripe'
import type { CurrencyCode } from '@/lib/currency'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export interface CheckoutParams {
  feature: 'taxi' | 'tipping'
  product: 'single' | 'country_pass' | 'query_bundle'
  country?: string        // required when product === 'country_pass'
  currency: CurrencyCode
  amount: number          // in Stripe's smallest unit (cents or whole yen)
  appUrl: string
}

export async function createCheckoutSession(params: CheckoutParams): Promise<string> {
  const { feature, product, country, currency, amount, appUrl } = params

  const productLabels: Record<string, { name: string; description: string }> = {
    single_taxi: {
      name: 'Hootling — Taxi Fare Check',
      description: 'Fair fare range, scam warnings & local phrase — one query',
    },
    single_tipping: {
      name: 'Hootling — Tipping Guide',
      description: 'Full tipping etiquette for all service scenarios — one query',
    },
    country_pass_taxi: {
      name: `Hootling — ${country ? country.charAt(0).toUpperCase() + country.slice(1) : ''} Country Pass`,
      description: 'All taxi fare checks + tipping guide for this country · 24 hours',
    },
    country_pass_tipping: {
      name: `Hootling — ${country ? country.charAt(0).toUpperCase() + country.slice(1) : ''} Country Pass`,
      description: 'All taxi fare checks + tipping guide for this country · 24 hours',
    },
    query_bundle_taxi: {
      name: 'Hootling — 20-Query Bundle',
      description: '20 taxi + tipping queries · stored on your device · 90 days',
    },
    query_bundle_tipping: {
      name: 'Hootling — 20-Query Bundle',
      description: '20 taxi + tipping queries · stored on your device · 90 days',
    },
  }

  const labelKey = `${product}_${feature}`
  const productData = productLabels[labelKey] ?? productLabels[`single_${feature}`]

  // Redirect to whichever feature the user came from
  const redirectFeature = feature

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    // Omitting payment_method_types lets Stripe Checkout auto-show all available methods
    // including Apple Pay, Google Pay, cards — based on customer device and location
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: productData,
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    custom_text: {
      submit: {
        message: 'Your result unlocks instantly. No account or subscription required.',
      },
    },
    // Statement descriptor shown on bank statements — reduces chargebacks.
    // Customers who search "HOOTLING.COM" will find the site immediately.
    payment_intent_data: {
      statement_descriptor_suffix: 'HOOTLING',
    },
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&redirect=/${redirectFeature}`,
    cancel_url: `${appUrl}/${redirectFeature}`,
    metadata: {
      feature,
      product,
      country: country ?? '',
      currency,
    },
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  return session.url
}
