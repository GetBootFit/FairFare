import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Inline welcome email — dark-themed, mobile-first, no external assets */
function welcomeEmailHtml(feature: string): string {
  const featureLabel = feature === 'tipping' ? 'tipping guides' : 'taxi fare checks'
  const ctaUrl = feature === 'tipping'
    ? 'https://hootling.com/tipping'
    : 'https://hootling.com/taxi'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Hootling</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:520px;">

          <!-- Brand header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <!-- Logo monogram — table-based for universal email client support (incl. Outlook / Gmail) -->
              <table cellpadding="0" cellspacing="0" style="display:inline-table;margin:0 auto;">
                <tr>
                  <td style="background:#7c3aed;border-radius:14px;width:44px;height:44px;text-align:center;vertical-align:middle;">
                    <span style="font-size:24px;line-height:44px;">🦉</span>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Hootling
              </p>
              <p style="margin:4px 0 0;font-size:13px;color:#71717a;">
                Know what's fair before you ride
              </p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">

              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">
                You're in. ✈️
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                Thanks for joining — we'll send you practical travel tips, scam alerts, and updates
                on new cities added to our ${featureLabel} tool.
              </p>

              <!-- What to expect -->
              <table width="100%" style="border-top:1px solid #27272a;padding-top:24px;">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">
                      🚕 &nbsp;Instant fare estimates
                    </p>
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">
                      120+ cities covered. Enter any route and get a fair fare range in seconds.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">
                      ⚠️ &nbsp;Scam alerts by city
                    </p>
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">
                      AI-generated, city-specific warnings for the most common driver scams.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">
                      💰 &nbsp;Tipping customs for 50+ countries
                    </p>
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">
                      Know exactly how much (and whether) to tip in every situation.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" style="padding-top:28px;">
                <tr>
                  <td align="center">
                    <a href="${ctaUrl}"
                       style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;
                              font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
                      Check a fare now →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                You're receiving this because you signed up at hootling.com.<br />
                <a href="https://hootling.com" style="color:#71717a;text-decoration:underline;">hootling.com</a>
                &nbsp;·&nbsp;
                <a href="https://hootling.com/privacy" style="color:#71717a;text-decoration:underline;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="https://hootling.com/unsubscribe" style="color:#71717a;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  // Rate limit: 5 subscription attempts per IP per hour
  const ip = getClientIp(req)
  if (await isRateLimited('email_subscribe', ip, 5, 3600)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { email, feature = 'taxi' } = body as { email?: string; feature?: string }

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const apiKey    = process.env.RESEND_API_KEY
    const audienceId = process.env.RESEND_AUDIENCE_ID
    const fromEmail  = process.env.RESEND_FROM_EMAIL ?? 'hello@hootling.com'

    if (apiKey && audienceId) {
      const resend = new Resend(apiKey)

      // 1. Add contact to Resend Audiences mailing list
      const contactResult = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      })
      if (contactResult.error) {
        console.error('[email/subscribe] Resend contacts error:', contactResult.error)
        return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
      }

      // 2. Send transactional welcome email immediately
      //    Non-fatal: if the send fails we still return success so the UX is unaffected.
      const emailResult = await resend.emails.send({
        from: `Hootling <${fromEmail}>`,
        to: [email],
        subject: 'Welcome to Hootling 🦉 — your travel toolkit',
        html: welcomeEmailHtml(feature),
      })
      if (emailResult.error) {
        // Log but don't fail the request — contact was already added to the audience
        console.warn('[email/subscribe] Welcome email failed:', emailResult.error)
      }
    } else {
      // Graceful fallback when Resend is not configured (local dev / staging)
      console.log('[email/subscribe] (Resend not configured)', email, { feature })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[email/subscribe]', err)
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
