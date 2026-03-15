import { NextRequest } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { CURRENCIES, PRICES, type CurrencyCode } from '@/lib/currency'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const limited = await isRateLimited('create-session', ip, 10, 3600)
    if (limited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = (await req.json()) as {
      feature: string
      product?: string
      country?: string
      currency?: string
    }

    const { feature, product = 'single', country, currency: rawCurrency } = body

    if (feature !== 'taxi' && feature !== 'tipping') {
      return Response.json({ error: 'Invalid feature' }, { status: 400 })
    }

    if (product !== 'single' && product !== 'country_pass' && product !== 'query_bundle') {
      return Response.json({ error: 'Invalid product' }, { status: 400 })
    }

    if (product === 'country_pass' && !country) {
      return Response.json({ error: 'Country required for country pass' }, { status: 400 })
    }

    // Validate currency — default to USD
    const currency: CurrencyCode =
      rawCurrency && CURRENCIES.some((c) => c.code === rawCurrency)
        ? (rawCurrency as CurrencyCode)
        : 'USD'

    const prices = PRICES[currency]
    const amount =
      product === 'country_pass' ? prices.pass :
      product === 'query_bundle'  ? prices.bundle :
      prices.single

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      `https://${req.headers.get('host')}`

    const url = await createCheckoutSession({
      feature: feature as 'taxi' | 'tipping',
      product: product as 'single' | 'country_pass' | 'query_bundle',
      country: country ? country.toLowerCase().trim() : undefined,
      currency,
      amount,
      appUrl,
    })

    return Response.json({ url })
  } catch (err) {
    console.error('[create-session]', err)
    return Response.json({ error: 'Failed to create payment session' }, { status: 500 })
  }
}
