import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
import { kvSet } from '@/lib/kv'
import crypto from 'crypto'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Stable KV key for a given email — not personally identifiable in isolation */
function emailKey(email: string): string {
  return `access:tokens:${crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 32)}`
}

function magicEmailHtml(magicUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restore your Hootling access</title>
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

          <!-- Content -->
          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">Your access link 🔑</p>
              <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.6;">
                Click the button below to restore your Hootling access on this device.
                This link expires in 24 hours and can only be used once.
              </p>
              <table width="100%" style="padding-top:8px;">
                <tr><td align="center">
                  <a href="${magicUrl}"
                     style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
                    Restore my access →
                  </a>
                </td></tr>
              </table>
              <p style="margin:24px 0 0;font-size:12px;color:#52525b;text-align:center;line-height:1.5;">
                Didn't request this? Ignore this email — your account is safe.<br />
                Link: <a href="${magicUrl}" style="color:#71717a;word-break:break-all;">${magicUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (await isRateLimited('save_access', ip, 5, 3600)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { email, tokens } = body as { email?: string; tokens?: string[] }

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (!Array.isArray(tokens) || tokens.length === 0 || tokens.some(t => typeof t !== 'string')) {
      return Response.json({ error: 'No valid tokens provided' }, { status: 400 })
    }

    // Cap tokens to prevent abuse
    const safeTokens = tokens.slice(0, 25)

    // Store tokens under email hash (90-day TTL, extended by each save)
    await kvSet(emailKey(email), { tokens: safeTokens, savedAt: new Date().toISOString() }, 90 * 86400)

    // Generate single-use magic token (24h TTL)
    const magicToken = crypto.randomBytes(32).toString('hex')
    await kvSet(`access:magic:${magicToken}`, { email: email.toLowerCase().trim() }, 86400)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'
    const magicUrl = `${appUrl}/access?t=${magicToken}`

    // Send magic link email via Resend (non-fatal if not configured)
    const apiKey    = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@hootling.com'

    if (apiKey) {
      const resend = new Resend(apiKey)
      const result = await resend.emails.send({
        from: `Hootling <${fromEmail}>`,
        to: [email],
        subject: 'Your Hootling access link 🔑',
        html: magicEmailHtml(magicUrl),
      })
      if (result.error) {
        console.error('[save-access] Resend error:', result.error)
        return Response.json({ error: 'Failed to send email' }, { status: 500 })
      }
    } else {
      // Dev / staging fallback — log the link
      console.log('[save-access] Magic link (Resend not configured):', magicUrl)
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[save-access]', err)
    return Response.json({ error: 'Failed to save access' }, { status: 500 })
  }
}
