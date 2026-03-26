import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** ISO timestamp N days from now */
function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

/** Shared footer injected into all nurture emails */
function footer(email: string): string {
  const encoded = encodeURIComponent(email)
  return `
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                You're receiving this because you signed up at hootling.com.<br />
                <a href="https://www.hootling.com" style="color:#71717a;text-decoration:underline;">hootling.com</a>
                &nbsp;·&nbsp;
                <a href="https://www.hootling.com/privacy" style="color:#71717a;text-decoration:underline;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="https://www.hootling.com/unsubscribe?email=${encoded}" style="color:#71717a;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>`
}

/** Shared HTML shell */
function shell(content: string, footerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hootling</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:520px;">

          <!-- Brand header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="display:inline-table;margin:0 auto;">
                <tr>
                  <td style="background:#7c3aed;border-radius:14px;width:44px;height:44px;text-align:center;vertical-align:middle;">
                    <span style="font-size:24px;line-height:44px;">🦉</span>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Hootling</p>
              <p style="margin:4px 0 0;font-size:13px;color:#71717a;">Know what's fair before you ride</p>
            </td>
          </tr>

          ${content}
          ${footerHtml}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Email 1: Welcome (sent immediately) ──────────────────────────────────────

function email1Html(email: string, feature: string): string {
  const featureLabel = feature === 'tipping' ? 'tipping guides' : 'taxi fare checks'
  const ctaUrl = feature === 'tipping'
    ? 'https://www.hootling.com/tipping'
    : 'https://www.hootling.com/taxi'

  return shell(`
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">You're in. ✈️</p>
              <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                Thanks for joining — we'll send you practical travel tips, scam alerts, and updates
                on new cities added to our ${featureLabel} tool.
              </p>
              <table width="100%" style="border-top:1px solid #27272a;padding-top:24px;">
                <tr><td style="padding-bottom:16px;">
                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">🚕 &nbsp;Instant fare estimates</p>
                  <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">120+ cities covered. Enter any route and get a fair fare range in seconds.</p>
                </td></tr>
                <tr><td style="padding-bottom:16px;">
                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">⚠️ &nbsp;Scam alerts by city</p>
                  <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">AI-generated, city-specific warnings for the most common driver scams.</p>
                </td></tr>
                <tr><td>
                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">💰 &nbsp;Tipping customs for 50+ countries</p>
                  <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">Know exactly how much (and whether) to tip in every situation.</p>
                </td></tr>
              </table>
              <table width="100%" style="padding-top:28px;">
                <tr><td align="center">
                  <a href="${ctaUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
                    Check a fare now →
                  </a>
                </td></tr>
              </table>
            </td>
          </tr>`, footer(email))
}

// ── Email 2: Travel tip (sent 3 days later) ──────────────────────────────────

function email2Html(email: string, feature: string): string {
  const isTipping = feature === 'tipping'

  const tip = isTipping
    ? { headline: '3 tipping mistakes travellers make 💸', body: `
        <p style="margin:0 0 16px;font-size:15px;color:#a1a1aa;line-height:1.6;">
          Quick tips from our tipping research across 50+ countries:
        </p>
        <table width="100%" style="border-top:1px solid #27272a;padding-top:20px;">
          <tr><td style="padding-bottom:14px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">1. Tipping in Japan is considered rude</p>
            <p style="margin:0;font-size:13px;color:#71717a;">Leave cash on the table? Your server will chase you to return it. No tip needed — the price includes service.</p>
          </td></tr>
          <tr><td style="padding-bottom:14px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">2. In the US, 20% is now the baseline</p>
            <p style="margin:0;font-size:13px;color:#71717a;">The 15% standard from 10 years ago is gone. For restaurant service in the US, 18–22% is now the norm.</p>
          </td></tr>
          <tr><td>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">3. Tour guides expect tips even when not listed</p>
            <p style="margin:0;font-size:13px;color:#71717a;">In Southeast Asia, a $5–10 USD tip for a half-day tour guide is expected even when the tour was prepaid online.</p>
          </td></tr>
        </table>`,
      ctaLabel: 'Check tipping for my destination →',
      ctaUrl: 'https://www.hootling.com/tipping' }
    : { headline: '3 taxi scams to watch for 🚨', body: `
        <p style="margin:0 0 16px;font-size:15px;color:#a1a1aa;line-height:1.6;">
          These are the most common taxi tricks our users encounter:
        </p>
        <table width="100%" style="border-top:1px solid #27272a;padding-top:20px;">
          <tr><td style="padding-bottom:14px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">1. The "meter is broken" trick</p>
            <p style="margin:0;font-size:13px;color:#71717a;">Common in Bangkok, Cairo, and Marrakech. Always agree on a price before getting in — or find a different cab.</p>
          </td></tr>
          <tr><td style="padding-bottom:14px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">2. The long-route detour</p>
            <p style="margin:0;font-size:13px;color:#71717a;">Knowing the approximate fare before you ride makes detours obvious. Hootling shows you the expected distance and time alongside the fare.</p>
          </td></tr>
          <tr><td>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">3. Airport "official taxi" touts</p>
            <p style="margin:0;font-size:13px;color:#71717a;">Legitimate airport taxis queue at marked stands. Anyone approaching you in arrivals offering a taxi is almost certainly a tout charging 3–5× the metered rate.</p>
          </td></tr>
        </table>`,
      ctaLabel: 'Check fares for my destination →',
      ctaUrl: 'https://www.hootling.com/taxi' }

  return shell(`
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
              <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#ffffff;">${tip.headline}</p>
              ${tip.body}
              <table width="100%" style="padding-top:28px;">
                <tr><td align="center">
                  <a href="${tip.ctaUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
                    ${tip.ctaLabel}
                  </a>
                </td></tr>
              </table>
            </td>
          </tr>`, footer(email))
}

// ── Email 3: Cross-sell + bundle nudge (sent 7 days later) ───────────────────

function email3Html(email: string, feature: string): string {
  const isTipping = feature === 'tipping'
  const crossProduct = isTipping ? 'taxi fares' : 'tipping customs'
  const crossUrl = isTipping
    ? 'https://www.hootling.com/taxi'
    : 'https://www.hootling.com/tipping'
  const crossDesc = isTipping
    ? 'Check the exact fare before you get in. 120+ cities, ±15% fare range, scam warnings included.'
    : 'Know whether to tip, how much, and what to say. 50+ countries covered across 6 scenarios.'

  return shell(`
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">Travelling again? 🌍</p>
              <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                Here's something you might not have tried yet in Hootling:
              </p>

              <!-- Cross-sell card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#27272a;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr><td>
                  <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#ffffff;">Check ${crossProduct}</p>
                  <p style="margin:0 0 14px;font-size:13px;color:#a1a1aa;line-height:1.5;">${crossDesc}</p>
                  <a href="${crossUrl}" style="display:inline-block;background:#52525b;color:#ffffff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">
                    Try it →
                  </a>
                </td></tr>
              </table>

              <!-- Bundle nudge -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#3b1f6b;border:1px solid #6d28d9;border-radius:12px;padding:20px;">
                <tr><td>
                  <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#ffffff;">Save 33% with the 10-Query Bundle</p>
                  <p style="margin:0 0 14px;font-size:13px;color:#c4b5fd;line-height:1.5;">
                    Use it for taxi fares and tipping — queries work across both tools. No expiry pressure: 90 days per query.
                  </p>
                  <a href="https://www.hootling.com/taxi" style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;">
                    Get the bundle →
                  </a>
                </td></tr>
              </table>

            </td>
          </tr>`, footer(email))
}

// ── Route handler ─────────────────────────────────────────────────────────────

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

    const apiKey     = process.env.RESEND_API_KEY
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

      // 2. Send the 3-email nurture sequence.
      //    Emails 2 & 3 use `scheduledAt` (Resend Pro feature — silently skipped on free tier).
      //    All sends are non-fatal: a failed send never blocks the UX response.
      const sends = [
        {
          subject: 'Welcome to Hootling 🦉 — your travel toolkit',
          html: email1Html(email, feature),
          scheduledAt: undefined,
        },
        {
          subject: feature === 'tipping'
            ? '3 tipping mistakes travellers make 💸'
            : '3 taxi scams to watch for 🚨',
          html: email2Html(email, feature),
          scheduledAt: daysFromNow(3),
        },
        {
          subject: 'Travelling again? One more Hootling feature to try 🌍',
          html: email3Html(email, feature),
          scheduledAt: daysFromNow(7),
        },
      ]

      for (const { subject, html, scheduledAt } of sends) {
        const result = await resend.emails.send({
          from: `Hootling <${fromEmail}>`,
          to: [email],
          subject,
          html,
          ...(scheduledAt ? { scheduledAt } : {}),
        })
        if (result.error) {
          console.warn(`[email/subscribe] Send failed (${subject}):`, result.error)
          // Continue — don't fail the whole sequence for one email
        }
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
