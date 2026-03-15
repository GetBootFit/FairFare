import { NextRequest } from 'next/server'
import { Resend } from 'resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (apiKey && audienceId) {
      // Resend Audiences — add contact to mailing list
      const resend = new Resend(apiKey)
      const result = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      })
      if (result.error) {
        console.error('[email/subscribe] Resend error:', result.error)
        return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
      }
    } else {
      // Graceful fallback when Resend is not configured (local dev / staging)
      console.log('[email/subscribe] (Resend not configured)', email)
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[email/subscribe]', err)
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
