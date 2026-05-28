/**
 * Admin Metrics API
 * GET /api/admin/metrics
 * Returns: affiliate click counts + Stripe revenue summary + KV cache stats
 *
 * Protected by proxy.ts — requires admin_token cookie.
 */

import { NextResponse } from 'next/server'
import { getClickCounts } from '@/lib/affiliates'
import { kvKeys, kvGet } from '@/lib/kv'
import { createClient } from '@vercel/kv'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface MonthlyRevenue {
  month: string   // YYYY-MM
  total: number
  count: number
}

export interface StripeMetrics {
  grandTotal: number
  currency: string
  chargeCount: number
  byProduct: Record<string, { count: number; total: number; currency: string }>
  byMonth: MonthlyRevenue[]   // last 6 months, newest first
  thisMonth: number
  lastMonth: number
  recent: Array<{ id: string; amount: number; currency: string; product: string; feature: string; date: string }>
}

export interface KvMetrics {
  cacheEntries: { taxi: number; tipping: number }
  cityMisses: Array<{ city: string; count: number }>
}

export interface MetricsResponse {
  affiliateClicks: Record<string, number>
  last7DayClicks: Record<string, number>   // date (YYYY-MM-DD) → total clicks across all partners
  stripe: StripeMetrics | null
  kv: KvMetrics | null
  generatedAt: string
}

// ── Handler ────────────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const [clickCounts, stripeData, kvData] = await Promise.allSettled([
    getClickCounts(),
    fetchStripeRevenue(),
    fetchKvStats(),
  ])

  const allClicks = clickCounts.status === 'fulfilled' ? clickCounts.value : {}
  const last7DayClicks = buildLast7Days(allClicks)

  return NextResponse.json({
    affiliateClicks: allClicks,
    last7DayClicks,
    stripe: stripeData.status === 'fulfilled' ? stripeData.value : null,
    kv: kvData.status === 'fulfilled' ? kvData.value : null,
    generatedAt: new Date().toISOString(),
  } satisfies MetricsResponse)
}

// ── Stripe ─────────────────────────────────────────────────────────────────────

async function fetchStripeRevenue(): Promise<StripeMetrics | null> {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) return null

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })

  // Fetch up to 100 charges (Stripe max per call)
  const charges = await stripe.charges.list({ limit: 100 })
  const successful = charges.data.filter(c => c.paid && !c.refunded)

  const byProduct: Record<string, { count: number; total: number; currency: string }> = {}
  const byMonthMap: Record<string, { total: number; count: number }> = {}
  let grandTotal = 0

  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`

  let thisMonth = 0
  let lastMonth = 0

  for (const charge of successful) {
    const product = (charge.metadata?.product ?? charge.metadata?.tier ?? 'unknown') as string
    const amount = charge.amount / 100
    const currency = charge.currency.toUpperCase()

    // By product
    if (!byProduct[product]) byProduct[product] = { count: 0, total: 0, currency }
    byProduct[product].count++
    byProduct[product].total += amount
    grandTotal += amount

    // By month
    const d = new Date(charge.created * 1000)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byMonthMap[monthKey]) byMonthMap[monthKey] = { total: 0, count: 0 }
    byMonthMap[monthKey].total += amount
    byMonthMap[monthKey].count++

    if (monthKey === thisMonthKey) thisMonth += amount
    if (monthKey === lastMonthKey) lastMonth += amount
  }

  // Build last 6 months array (fill zeros for empty months)
  const byMonth: MonthlyRevenue[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    byMonth.push({
      month: key,
      total: Math.round((byMonthMap[key]?.total ?? 0) * 100) / 100,
      count: byMonthMap[key]?.count ?? 0,
    })
  }

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
    byMonth,
    thisMonth: Math.round(thisMonth * 100) / 100,
    lastMonth: Math.round(lastMonth * 100) / 100,
    recent,
  }
}

// ── KV stats ───────────────────────────────────────────────────────────────────

async function fetchKvStats(): Promise<KvMetrics | null> {
  const kvUrl   = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN
  if (!kvUrl || !kvToken) return null

  try {
    const kv = createClient({ url: kvUrl, token: kvToken })

    // Cache entry counts
    let taxiCount = 0
    const taxiCursor = kv.scanIterator({ match: 'taxi_v2:*', count: 500 })
    for await (const _ of taxiCursor) taxiCount++

    let tippingCount = 0
    const tippingCursor = kv.scanIterator({ match: 'tipping_v3:*', count: 500 })
    for await (const _ of tippingCursor) tippingCount++

    // City misses
    const cityMisses: Array<{ city: string; count: number }> = []
    const missCursor = kv.scanIterator({ match: 'city_miss:*', count: 200 })
    for await (const key of missCursor) {
      const count = await kv.get<number>(key as string)
      const label = (key as string).replace('city_miss:', '').replace(':', ', ')
      cityMisses.push({ city: label, count: count ?? 0 })
    }
    cityMisses.sort((a, b) => b.count - a.count)

    return {
      cacheEntries: { taxi: taxiCount, tipping: tippingCount },
      cityMisses,
    }
  } catch {
    return null
  }
}

// ── 7-day affiliate summary ────────────────────────────────────────────────────

function buildLast7Days(allClicks: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    result[d.toISOString().slice(0, 10)] = 0
  }
  for (const [key, val] of Object.entries(allClicks)) {
    // Keys like: affiliate:clicks:{partner}:{zone}:YYYY-MM-DD
    const parts = key.split(':')
    const maybeDate = parts[parts.length - 1]
    if (maybeDate && /^\d{4}-\d{2}-\d{2}$/.test(maybeDate) && maybeDate in result) {
      result[maybeDate] += val
    }
  }
  return result
}
