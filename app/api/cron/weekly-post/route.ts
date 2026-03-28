/**
 * Weekly post generator cron — runs every Sunday at 21:00 UTC.
 * Configured in vercel.json: { "path": "/api/cron/weekly-post", "schedule": "0 21 * * 0" }
 *
 * 1. Generates a new blog post via Claude for an uncovered city
 * 2. Stages it in KV under `blog:staged:{slug}`
 * 3. Emails you a preview with an approve/reject link
 *
 * On approval (/api/admin/approve-post?slug=...&token=...):
 * → Post moves from `blog:staged:{slug}` to `blog:published:{slug}`
 * → Blog index and slug pages immediately serve it (no redeploy needed)
 */

import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { generateBlogPost, getIsoWeekNumber } from '@/lib/blog-generator'
import { kvSet, kvGet } from '@/lib/kv'
import { createHmac } from 'crypto'

// ── Auth ──────────────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return true
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${cronSecret}`
}

// ── Approval token ────────────────────────────────────────────────────────────

/**
 * Creates a time-bound HMAC approval token.
 *
 * The expiry timestamp is embedded in the HMAC payload so the token cannot
 * be replayed after it expires — changing `exp` invalidates the signature.
 * Token lifetime matches the staged-post KV TTL (7 days).
 *
 * @returns { token, exp } — both must be included in the approval URL
 */
export function createApprovalToken(slug: string): { token: string; exp: number } {
  const secret = process.env.ADMIN_SECRET ?? 'hootling-dev-secret'
  // Expire 7 days from now (matches blog:staged KV TTL)
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
  const token = createHmac('sha256', secret)
    .update(`approve:${slug}:${exp}`)
    .digest('hex')
    .slice(0, 40)
  return { token, exp }
}

// ── Approval email HTML ───────────────────────────────────────────────────────

/**
 * Builds a ready-to-paste Reddit post draft for the newly generated blog post.
 *
 * Every Sunday when you approve the blog post, this draft is already in your email.
 * Copy → paste into Reddit (from your personal travel account) → 3-minute distribution.
 *
 * Strategy:
 *  - Title is curiosity-led + year-stamped (performs better than "I built X" framing)
 *  - Body answers the underlying question first, links second (avoids spam filters)
 *  - Subreddits are ranked: city-specific first (highest relevance), then broad travel
 *  - Use personal account, not brand account — authentic community member > promoter
 */
function buildRedditDraft(opts: {
  slug: string
  title: string
  city: string
  country: string
  intro: string
  appUrl: string
}): string {
  const { slug, city, country, intro, appUrl } = opts
  const year = new Date().getFullYear()

  // Build subreddit list: city slug first, then country, then evergreen travel subs
  const citySlug = city.toLowerCase().replace(/\s+/g, '')
  const countrySlug = country.toLowerCase().replace(/\s+/g, '')
  const subreddits = [
    `r/${citySlug}`,
    `r/${countrySlug}travel`,
    `r/travel`,
    `r/solotravel`,
    `r/backpacking`,
  ]

  // Truncate intro to ~300 chars for the Reddit body teaser
  const teaser = intro.length > 280 ? intro.slice(0, 277).trimEnd() + '…' : intro

  const postUrl = `${appUrl}/blog/${slug}?utm_source=reddit&utm_medium=community&utm_campaign=${citySlug}_${year}`

  return `
**REDDIT DRAFT — paste from your personal travel account**
═══════════════════════════════════════════════════════════

TITLE:
Taxi fares in ${city} in ${year} — what I found out (and the scams to watch for)

BODY:
${teaser}

I put together a breakdown of the actual metered rates, the most common airport scams, and what to say to your driver: ${postUrl}

Might save someone an argument at the rank.

───────────────────────────────────────────────────────────
SUGGESTED SUBREDDITS (try in this order — highest relevance first):
${subreddits.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

POSTING TIPS:
• Post as text (not link) — link posts get less engagement on travel subs
• Add the URL as the last line of the body text
• Comment with 1–2 follow-up tips after posting to boost sort ranking
• Avoid posting the same text to multiple subs same day — space 24–48 h apart
═══════════════════════════════════════════════════════════
`.trim()
}

function buildApprovalEmail(opts: {
  slug: string
  title: string
  description: string
  city: string
  country: string
  intro: string
  approveUrl: string
  rejectUrl: string
  redditDraft: string
}): string {
  const { slug, title, description, city, country, intro, approveUrl, rejectUrl, redditDraft } = opts

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New post ready for review</title></head>
<body style="margin:0;padding:0;background:#09090b;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:560px;">

          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:11px;font-weight:600;color:#7c3aed;
                        text-transform:uppercase;letter-spacing:0.08em;">
                🦉 Hootling · New Post Ready for Review
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:28px;">

              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;line-height:1.3;">
                ${title}
              </h1>
              <p style="margin:0 0 4px;font-size:13px;color:#71717a;">
                ${city}, ${country} · Taxi Fares
              </p>
              <p style="margin:16px 0 0;font-size:13px;color:#a1a1aa;line-height:1.6;
                        font-style:italic;border-left:3px solid #3f3f46;padding-left:12px;">
                ${description}
              </p>

              <!-- Intro preview -->
              <p style="margin:20px 0 6px;font-size:11px;font-weight:600;color:#52525b;
                        text-transform:uppercase;letter-spacing:0.06em;">
                Intro preview
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#d4d4d8;line-height:1.7;
                        background:#09090b;border-radius:8px;padding:14px;">
                ${intro}
              </p>

              <!-- Slug -->
              <p style="margin:0 0 20px;font-size:12px;color:#52525b;">
                Slug: <code style="color:#a1a1aa;background:#27272a;padding:2px 6px;border-radius:4px;">${slug}</code>
              </p>

              <!-- Approve / Reject buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;">
                    <a href="${approveUrl}"
                       style="display:block;background:#16a34a;color:#ffffff;text-align:center;
                              font-size:14px;font-weight:600;padding:12px 20px;
                              border-radius:10px;text-decoration:none;">
                      ✓ Approve &amp; Publish
                    </a>
                  </td>
                  <td style="padding-left:8px;">
                    <a href="${rejectUrl}"
                       style="display:block;background:#27272a;color:#a1a1aa;text-align:center;
                              font-size:14px;font-weight:600;padding:12px 20px;
                              border-radius:10px;text-decoration:none;">
                      ✕ Reject
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;font-size:12px;color:#52525b;text-align:center;">
                Approving publishes immediately — no redeploy needed.
              </p>
            </td>
          </tr>

          <!-- Reddit draft -->
          <tr>
            <td style="padding-top:24px;">
              <div style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:24px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:600;color:#f97316;
                          text-transform:uppercase;letter-spacing:0.08em;">
                  🟠 Reddit Draft — copy &amp; paste from your travel account
                </p>
                <pre style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.7;
                            white-space:pre-wrap;word-break:break-word;
                            background:#09090b;border-radius:8px;padding:14px;
                            font-family:ui-monospace,monospace;">${redditDraft}</pre>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding-top:20px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#3f3f46;">
                Hootling automated post generator · Weekly Sunday run
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

  const weekNumber  = getIsoWeekNumber()
  const apiKey      = process.env.RESEND_API_KEY
  const fromEmail   = process.env.RESEND_FROM_EMAIL ?? 'hello@hootling.com'
  const adminEmail  = process.env.ADMIN_EMAIL
  const appUrl      = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

  // Idempotency — don't generate twice in the same week
  const idempotencyKey = `blog:generated:week:${new Date().getFullYear()}:${weekNumber}`
  const alreadyGenerated = await kvGet<string>(idempotencyKey)
  if (alreadyGenerated) {
    return Response.json({ ok: true, skipped: true, reason: `Already generated for week ${weekNumber}: ${alreadyGenerated}` })
  }

  try {
    console.log(`[weekly-post] Generating post for week ${weekNumber}…`)
    const { post } = await generateBlogPost(weekNumber)

    // Stage in KV (7 days TTL — if not approved within a week, it's gone)
    const stagingKey = `blog:staged:${post.slug}`
    await kvSet(stagingKey, post, 7 * 24 * 60 * 60)

    // Mark this week as generated
    await kvSet(idempotencyKey, post.slug, 8 * 24 * 60 * 60) // 8 days

    console.log(`[weekly-post] Staged: ${post.slug}`)

    // Send approval email if admin email + Resend are configured
    if (apiKey && adminEmail) {
      const { token, exp } = createApprovalToken(post.slug)
      const approveUrl = `${appUrl}/api/admin/approve-post?slug=${encodeURIComponent(post.slug)}&token=${token}&exp=${exp}&action=approve`
      const rejectUrl  = `${appUrl}/api/admin/approve-post?slug=${encodeURIComponent(post.slug)}&token=${token}&exp=${exp}&action=reject`

      const intro = post.content.find((s) => s.type === 'intro')?.body ?? post.description

      const redditDraft = buildRedditDraft({
        slug: post.slug,
        title: post.title,
        city: post.city ?? '',
        country: post.country ?? '',
        intro,
        appUrl,
      })

      const html = buildApprovalEmail({
        slug: post.slug,
        title: post.title,
        description: post.description,
        city: post.city ?? '',
        country: post.country ?? '',
        intro,
        approveUrl,
        rejectUrl,
        redditDraft,
      })

      const resend = new Resend(apiKey)
      const result = await resend.emails.send({
        from: `Hootling <${fromEmail}>`,
        to: [adminEmail],
        subject: `New post ready: ${post.title}`,
        html,
      })

      if (result.error) {
        console.warn('[weekly-post] Failed to send approval email:', result.error)
      } else {
        console.log(`[weekly-post] Approval email sent to ${adminEmail}`)
      }
    } else {
      console.log('[weekly-post] ADMIN_EMAIL or Resend not configured — skipping approval email')
    }

    return Response.json({
      ok: true,
      slug: post.slug,
      title: post.title,
      city: post.city,
      country: post.country,
      weekNumber,
    })

  } catch (err) {
    console.error('[weekly-post] Generation error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
