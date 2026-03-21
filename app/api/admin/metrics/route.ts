/**
 * Admin Metrics API
 * GET /api/admin/metrics
 * Returns: affiliate click counts + Stripe revenue summary
 *
 * Protected by middleware — requires admin_token cookie.
 */

import { NextResponse } from 'next/server'
import { getClickCounts } from '@/lib/affiliates'
import Stripe from 'stripe'

export async function GET(): Promise<NextResponse> {
  const [clickCounts, stripeData] = await Promise.allSettled([
    getClickCounts(),
    fetchStripeRevenue(),
  ])

  return NextResponse.json({
    affiliateClicks: clickCounts.status === 'fulfilled' ? clickCounts.value : {},
    stripe: stripeData.status === 'fulfilled' ? stripeData.value : null,
    generatedAt: new Date().toISOString(),
  })
}

async function fetchStripeRevenue() {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return null

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })

  // Get last 50 successful charges
  const charges = await stripe.charges.list({ limit: 50 })
  const successful = charges.data.filter(c => c.paid && !c.refunded)

  // Group by product (from metadata or description)
  const byProduct: Record<string, { count: number; total: number; currency: string }> = {}
  let grandTotal = 0

  for (const charge of successful) {
    const product = (charge.metadata?.product ?? charge.metadata?.tier ?? 'unknown') as string
    const amount = charge.amount / 100
    const currency = charge.currency.toUpperCase()
    if (!byProduct[product]) byProduct[product] = { count: 0, total: 0, currency }
    byProduct[product].count++
    byProduct[product].total += amount
    grandTotal += amount
  }

  // Recent charges (last 10)
  const recent = successful.slice(0, 10).map(c => ({
    id: c.id,
    amount: c.amount / 100,
    currency: c.currency.toUpperCase(),
    product: c.metadata?.product ?? c.metadata?.tier ?? 'unknown',
    feature: c.metadata?.feature ?? 'unknown',
    date: new Date(c.created * 1000).toISOString(),
  }))

  return {
    grandTotal: Math.round(grandTotal * 100) / 100,
    currency: 'USD',
    chargeCount: successful.length,
    byProduct,
    recent,
  }
}
