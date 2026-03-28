/**
 * Weekly email cron — runs every Monday at 08:00 UTC.
 * Configured in vercel.json: { "path": "/api/cron/weekly-email", "schedule": "0 8 * * 1" }
 *
 * 1. Finds today's entry in EMAIL_SCHEDULE
 * 2. Looks up the blog post
 * 3. Sends a rich email to the full Resend audience via broadcast
 * 4. Logs send to KV for the admin dashboard
 */

import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { getScheduledEmail } from '@/data/email-schedule'
import { getBlogPost } from '@/lib/blog-posts'
import { kvSet, kvGet } from '@/lib/kv'
import type { BlogPost, BlogSection } from '@/lib/blog-posts'

// ── Auth ──────────────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return true // allow in local dev without secret
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${cronSecret}`
}

// ── Email HTML helpers ────────────────────────────────────────────────────────

function footer(): string {
  return `
    <tr>
      <td style="padding-top:24px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
          You're receiving this because you subscribed at hootling.com.<br />
          <a href="https://www.hootling.com" style="color:#71717a;text-decoration:underline;">hootling.com</a>
          &nbsp;·&nbsp;
          <a href="https://www.hootling.com/privacy" style="color:#71717a;text-decoration:underline;">Privacy</a>
          &nbsp;·&nbsp;
          <a href="https://www.hootling.com/unsubscribe?email={{unsubscribe_email}}" style="color:#71717a;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td>
    </tr>`
}

function shell(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hootling Weekly Guide</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:560px;">

          <!-- Brand header -->
          <tr>
            <td style="padding-bottom:28px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="display:inline-table;margin:0 auto;">
                <tr>
                  <td style="background:#7c3aed;border-radius:14px;width:44px;height:44px;text-align:center;vertical-align:middle;">
                    <span style="font-size:24px;line-height:44px;">🦉</span>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Hootling</p>
              <p style="margin:4px 0 0;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.08em;">Weekly Travel Guide</p>
            </td>
          </tr>

          ${content}
          ${footer()}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Extract a short readable intro from the blog post content. */
function extractIntro(sections: BlogSection[]): string {
  const intro = sections.find((s) => s.type === 'intro')
  return intro?.body ?? ''
}

/** Extract the first table rows as key facts. */
function extractFirstTable(sections: BlogSection[]): { label: string; value: string }[] {
  const table = sections.find((s) => s.type === 'table' && s.rows?.length)
  return table?.rows?.slice(0, 5) ?? []
}

/** Extract tip or warning body. */
function extractTip(sections: BlogSection[]): string {
  const tip = sections.find((s) => s.type === 'tip' || s.type === 'warning')
  return tip?.body ?? ''
}

/** Build the rich weekly email HTML from a blog post. */
function buildWeeklyEmailHtml(post: BlogPost, postUrl: string): string {
  const intro = extractIntro(post.content)
  const tableRows = extractFirstTable(post.content)
  const tip = extractTip(post.content)

  const categoryColour = post.category === 'tipping' ? '#14b8a6' : '#7c3aed'
  const categoryLabel = post.category === 'tipping' ? 'Tipping Guide' : post.category === 'travel' ? 'Travel Tips' : 'Taxi Fares'

  const tableHtml = tableRows.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:collapse;">
      ${tableRows.map((row, i) => `
        <tr style="border-bottom:1px solid #27272a;">
          <td style="padding:10px 0;font-size:13px;color:#a1a1aa;">${row.label}</td>
          <td style="padding:10px 0;font-size:13px;color:#ffffff;font-weight:600;text-align:right;">${row.value}</td>
        </tr>`).join('')}
    </table>` : ''

  const tipHtml = tip ? `
    <table width="100%" cellpadding="0" cellspacing="0"
           style="background:#1c1917;border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;margin:20px 0;padding:14px 16px;">
      <tr><td style="font-size:13px;color:#d4d4d8;line-height:1.6;">💡 ${tip}</td></tr>
    </table>` : ''

  return shell(`
    <!-- Category badge + title -->
    <tr>
      <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:28px 28px 24px;">

        <p style="margin:0 0 12px;display:inline-block;font-size:11px;font-weight:600;color:${categoryColour};
                  text-transform:uppercase;letter-spacing:0.08em;background:${categoryColour}18;
                  border:1px solid ${categoryColour}40;padding:3px 10px;border-radius:20px;">
          ${categoryLabel}${post.city ? ` · ${post.city}` : ''}
        </p>

        <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
          ${post.title}
        </h1>

        <p style="margin:0 0 20px;font-size:15px;color:#a1a1aa;line-height:1.7;">
          ${intro}
        </p>

        ${tableHtml}
        ${tipHtml}

        <!-- CTA -->
        <table width="100%" style="margin-top:24px;">
          <tr>
            <td>
              <a href="${postUrl}"
                 style="display:inline-block;background:#7c3aed;color:#ffffff;
                        font-size:14px;font-weight:600;padding:13px 28px;
                        border-radius:10px;text-decoration:none;">
                Read the full guide →
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Product nudge -->
    <tr>
      <td style="padding:20px 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:18px 20px;">
          <tr>
            <td>
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#ffffff;">
                Know the exact fare before you get in
              </p>
              <p style="margin:0 0 12px;font-size:13px;color:#71717a;line-height:1.5;">
                Enter any route in Hootling for a personalised estimate with real-time scam warnings
                specific to your pickup point.
              </p>
              <a href="https://www.hootling.com/taxi"
                 style="display:inline-block;background:#27272a;color:#d4d4d8;
                        font-size:13px;font-weight:500;padding:9px 18px;
                        border-radius:8px;text-decoration:none;">
                Check a fare →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `)
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const scheduled = getScheduledEmail(today)

  if (!scheduled) {
    console.log(`[weekly-email] No email scheduled for ${today} — skipping.`)
    return Response.json({ ok: true, skipped: true, reason: 'No entry in EMAIL_SCHEDULE for today' })
  }

  const post = getBlogPost(scheduled.slug)
  if (!post) {
    console.error(`[weekly-email] Slug not found: ${scheduled.slug}`)
    return Response.json({ error: `Post not found: ${scheduled.slug}` }, { status: 500 })
  }

  const apiKey     = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  const fromEmail  = process.env.RESEND_FROM_EMAIL ?? 'hello@hootling.com'
  const appUrl     = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

  if (!apiKey || !audienceId) {
    console.warn('[weekly-email] Resend not configured — skipping send (local dev)')
    return Response.json({ ok: true, skipped: true, reason: 'Resend not configured' })
  }

  // Check for duplicate send (idempotency)
  const idempotencyKey = `email:weekly:sent:${today}`
  const alreadySent = await kvGet<boolean>(idempotencyKey)
  if (alreadySent) {
    console.log(`[weekly-email] Already sent for ${today} — skipping duplicate.`)
    return Response.json({ ok: true, skipped: true, reason: 'Already sent today' })
  }

  const postUrl  = `${appUrl}/blog/${post.slug}`
  const html     = buildWeeklyEmailHtml(post, postUrl)
  const subject  = `This week: ${post.title}`

  try {
    const resend = new Resend(apiKey)

    // Send as a broadcast to the full audience
    const broadcastResult = await resend.broadcasts.create({
      audienceId,
      from: `Hootling <${fromEmail}>`,
      subject,
      html,
      name: `Weekly Guide ${today}: ${post.slug}`,
    })

    if (broadcastResult.error) {
      console.error('[weekly-email] Broadcast create error:', broadcastResult.error)
      return Response.json({ error: 'Failed to create broadcast' }, { status: 500 })
    }

    const broadcastId = broadcastResult.data?.id
    if (!broadcastId) {
      return Response.json({ error: 'No broadcast ID returned' }, { status: 500 })
    }

    const sendResult = await resend.broadcasts.send(broadcastId)
    if (sendResult.error) {
      console.error('[weekly-email] Broadcast send error:', sendResult.error)
      return Response.json({ error: 'Failed to send broadcast' }, { status: 500 })
    }

    // Mark as sent in KV (24h TTL — longer than the weekly interval)
    await kvSet(idempotencyKey, true, 30 * 60 * 60) // 30 hours

    // Log to KV for admin dashboard
    await kvSet(`email:weekly:log:${today}`, {
      sentAt: new Date().toISOString(),
      slug: post.slug,
      subject,
      broadcastId,
    }, 400 * 24 * 60 * 60) // ~13 months

    console.log(`[weekly-email] Sent broadcast ${broadcastId} for ${post.slug}`)
    return Response.json({ ok: true, broadcastId, slug: post.slug, subject })

  } catch (err) {
    console.error('[weekly-email] Unexpected error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
