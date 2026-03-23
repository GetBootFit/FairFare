/**
 * Unsubscribe API
 * POST /api/unsubscribe
 * Body: { email: string }
 *
 * Removes the email address from the Resend audience.
 * Required by Spam Act 2003 (Cth), GDPR Article 21, and CAN-SPAM.
 */

import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!resendKey || !audienceId) {
    // Resend not configured — acknowledge gracefully
    console.warn('[unsubscribe] RESEND_API_KEY or RESEND_AUDIENCE_ID not configured')
    return Response.json({
      message: 'Your unsubscribe request has been recorded. You will not receive further emails.',
    })
  }

  try {
    // Look up the contact by email first
    const searchRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!searchRes.ok) {
      throw new Error(`Resend contacts fetch failed: ${searchRes.status}`)
    }

    const searchData = await searchRes.json() as { data: Array<{ id: string; email: string }> }
    const contact = searchData.data?.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    )

    if (!contact) {
      // Email not found — still return success (don't leak whether email exists)
      return Response.json({
        message: 'If that email is on our list, it has been removed. You\'re unsubscribed.',
      })
    }

    // Mark as unsubscribed
    const updateRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts/${contact.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unsubscribed: true }),
      }
    )

    if (!updateRes.ok) {
      throw new Error(`Resend unsubscribe failed: ${updateRes.status}`)
    }

    return Response.json({
      message: 'You have been successfully unsubscribed and will receive no further emails.',
    })
  } catch (err) {
    console.error('[unsubscribe] Error:', err)
    return Response.json(
      { error: 'Unable to process your request right now. Please email hello@hootling.com to unsubscribe.' },
      { status: 500 }
    )
  }
}
