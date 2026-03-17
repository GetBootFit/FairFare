import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { kvSet } from '@/lib/kv'
import Stripe from 'stripe'
import * as Sentry from '@sentry/nextjs'

/**
 * Stripe webhook handler.
 *
 * Verifies the event signature, then handles checkout.session.completed
 * by marking the session as used in KV to prevent replay attacks.
 *
 * Set STRIPE_WEBHOOK_SECRET to the signing secret shown in the
 * Stripe Dashboard → Developers → Webhooks.
 *
 * For local testing: stripe listen --forward-to localhost:3000/api/webhook
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return Response.json({ error: 'Missing webhook signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    // Log to Sentry — repeated failures indicate misconfiguration or an active attack.
    // Filter Sentry by tag webhook=stripe to monitor this.
    Sentry.captureException(err, {
      tags: { webhook: 'stripe', failure: 'signature_verification' },
      extra: { sigHeader: sig?.slice(0, 20) }, // first 20 chars only — no secrets
    })
    console.error('[webhook] signature verification failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.id) {
      // Mark session used with 90-day TTL — matches bundle token lifetime (longest lived token).
      // Must match the TTL set by the verify route so the replay-prevention key never
      // expires before the tokens it protects.
      await kvSet(`ff:session:${session.id}`, '1', 90 * 86400)
    }
  }

  return Response.json({ received: true })
}
