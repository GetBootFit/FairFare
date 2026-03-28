/**
 * Bundle reminder cron — runs daily at 08:00 UTC.
 * Configured in vercel.json: { "path": "/api/cron/bundle-reminder", "schedule": "0 8 * * *" }
 *
 * For each bundle session with a registered email:
 * 1. Check remaining token count in KV (bundle:tokens:{bundleSessionId})
 * 2. If exactly 2 tokens remain and no reminder has been sent yet:
 *    → Send a low-query reminder email via Resend
 *    → Set bundle:reminded:{bundleSessionId} to deduplicate future runs
 */

import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { kvGet, kvSet, kvExists, kvKeys } from '@/lib/kv'

// ── Auth ──────────────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return true
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${cronSecret}`
}

// ── Reminder email HTML ───────────────────────────────────────────────────────

function buildReminderEmail(remainingCount: number): string {
  const refillUrl = 'https://www.hootling.com/taxi'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Hootling bundle is almost gone</title>
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

          <!-- Body -->
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">
                ${remainingCount === 1 ? 'Last query remaining 🚨' : `${remainingCount} queries left in your bundle`}
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                ${remainingCount === 1
                  ? "You're down to your last query. Top up before your next trip so you're never caught without one."
                  : `You have ${remainingCount} queries left in your 20-query bundle. Grab another bundle at the same great price before you run out.`
                }
              </p>

              <!-- Why bundle reminder -->
              <table width="100%" style="border-top:1px solid #27272a;padding-top:20px;margin-bottom:24px;">
                <tr><td style="padding-bottom:12px;">
                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">🚕 &nbsp;Still the best value</p>
                  <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">20 queries for $19.99 — under $1 each, vs $2.99 per single query. Works for taxi fares and tipping guides.</p>
                </td></tr>
                <tr><td>
                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#d4d4d8;">📅 &nbsp;90 days per query</p>
                  <p style="margin:0;font-size:13px;color:#71717a;line-height:1.5;">Each token lasts 3 months — no pressure to use them all at once.</p>
                </td></tr>
              </table>

              <!-- CTA -->
              <table width="100%" style="padding-top:8px;">
                <tr><td align="center">
                  <a href="${refillUrl}"
                     style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
                    Top up my bundle →
                  </a>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                You're receiving this because you opted in at hootling.com.<br />
                <a href="https://www.hootling.com" style="color:#71717a;text-decoration:underline;">hootling.com</a>
                &nbsp;·&nbsp;
                <a href="https://www.hootling.com/privacy" style="color:#71717a;text-decoration:underline;">Privacy</a>
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

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey    = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@hootling.com'

  if (!apiKey) {
    return Response.json({ ok: true, skipped: true, reason: 'Resend not configured' })
  }

  const resend = new Resend(apiKey)

  // Find all registered bundle email keys
  const emailKeys = await kvKeys('bundle:email:*')
  console.log(`[bundle-reminder] Checking ${emailKeys.length} bundle registrations`)

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const key of emailKeys) {
    try {
      // Extract bundleSessionId from key pattern `bundle:email:{bundleSessionId}`
      const bundleSessionId = key.replace('bundle:email:', '')

      // Skip if already reminded
      const alreadyReminded = await kvExists(`bundle:reminded:${bundleSessionId}`)
      if (alreadyReminded) {
        skipped++
        continue
      }

      // Check remaining tokens
      const tokens = await kvGet<string[]>(`bundle:tokens:${bundleSessionId}`)
      if (!tokens || !Array.isArray(tokens)) {
        // Tokens key gone — bundle fully consumed or expired; skip
        skipped++
        continue
      }

      const remaining = tokens.length
      // Only send reminder at 2 or fewer remaining
      if (remaining > 2) {
        skipped++
        continue
      }

      // Get email address from registration
      const registration = await kvGet<{ email: string; purchaseDate: string; bundleSessionId: string }>(key)
      if (!registration?.email) {
        skipped++
        continue
      }

      const { email } = registration

      const subject = remaining === 1
        ? '🚨 Last Hootling query remaining — top up before your next trip'
        : `${remaining} Hootling queries left — don't get caught without one`

      const result = await resend.emails.send({
        from: `Hootling <${fromEmail}>`,
        to: [email],
        subject,
        html: buildReminderEmail(remaining),
      })

      if (result.error) {
        console.warn(`[bundle-reminder] Send failed for ${bundleSessionId}:`, result.error)
        errors.push(bundleSessionId)
      } else {
        // Mark as reminded — 90 days TTL (prevents duplicate sends even if tokens replenished)
        await kvSet(`bundle:reminded:${bundleSessionId}`, '1', 90 * 86400)
        console.log(`[bundle-reminder] Reminder sent to ${email} (${remaining} remaining)`)
        sent++
      }
    } catch (err) {
      console.error(`[bundle-reminder] Error processing ${key}:`, err)
      errors.push(key)
    }
  }

  return Response.json({
    ok: true,
    checked: emailKeys.length,
    sent,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  })
}
