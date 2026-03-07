import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { kvSet } from '@/lib/kv'
import Stripe from 'stripe'

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
    console.error('[webhook] signature verification failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.id) {
      // Mark session used (TTL 1 hour — same as verify route)
      await kvSet(`ff:session:${session.id}`, '1', 3600)
    }
  }

  return Response.json({ received: true })
}
