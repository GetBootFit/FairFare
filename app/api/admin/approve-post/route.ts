/**
 * Post approval endpoint.
 *
 * Called from the one-click links in the weekly approval email.
 *
 * GET /api/admin/approve-post?slug={slug}&token={hmac}&action=approve|reject
 *
 * On approve:
 *   - Moves post from `blog:staged:{slug}` → `blog:published:{slug}` in KV
 *   - Post immediately appears on /blog and /blog/{slug} (no redeploy)
 *   - Returns an HTML confirmation page
 *
 * On reject:
 *   - Deletes `blog:staged:{slug}` from KV
 *   - Returns an HTML confirmation page
 *
 * Token security: HMAC-SHA256 of "approve:{slug}" using ADMIN_SECRET.
 * Tokens are one-time-use: after approve, the staged key is gone.
 */

import { NextRequest } from 'next/server'
import { createHmac } from 'crypto'
import { kvGet, kvSet, kvDelete } from '@/lib/kv'
import type { BlogPost } from '@/lib/blog-posts'

// ── Token verification ────────────────────────────────────────────────────────

/**
 * Verifies a time-bound HMAC approval token.
 *
 * @param slug  — the blog post slug the token was issued for
 * @param token — the 40-char hex HMAC from the URL
 * @param exp   — Unix timestamp (seconds) from the URL; must match what was signed
 * @returns true only if the HMAC matches AND the token has not expired
 */
function verifyToken(slug: string, token: string, exp: number): boolean {
  // Check expiry first (fast path — no crypto needed if already expired)
  if (Date.now() / 1000 > exp) return false

  const secret = process.env.ADMIN_SECRET ?? 'hootling-dev-secret'
  const expected = createHmac('sha256', secret)
    .update(`approve:${slug}:${exp}`)
    .digest('hex')
    .slice(0, 40)
  // Constant-time comparison prevents timing attacks
  if (expected.length !== token.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return mismatch === 0
}

// ── Response pages ────────────────────────────────────────────────────────────

function htmlPage(title: string, body: string, colour: string): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Hootling</title>
  <style>
    body { margin:0; padding:40px 16px; background:#09090b; font-family:system-ui,sans-serif; color:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; box-sizing:border-box; }
    .card { background:#18181b; border:1px solid #27272a; border-radius:16px; padding:32px; max-width:480px; width:100%; text-align:center; }
    .icon { font-size:40px; margin-bottom:16px; }
    h1 { margin:0 0 12px; font-size:22px; color:${colour}; }
    p { margin:0 0 8px; font-size:14px; color:#a1a1aa; line-height:1.6; }
    a { color:#7c3aed; text-decoration:none; }
    a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug   = searchParams.get('slug')   ?? ''
  const token  = searchParams.get('token')  ?? ''
  const action = searchParams.get('action') ?? 'approve'
  const expStr = searchParams.get('exp')    ?? ''
  const exp    = parseInt(expStr, 10)
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

  // Validate params
  if (!slug || !token || !expStr || isNaN(exp)) {
    return htmlPage('Invalid link', `
      <div class="icon">⚠️</div>
      <h1>Invalid link</h1>
      <p>This approval link is missing required parameters.</p>
    `, '#f87171')
  }

  // Verify HMAC token (also checks expiry)
  if (!verifyToken(slug, token, exp)) {
    return htmlPage('Invalid token', `
      <div class="icon">🔒</div>
      <h1>Invalid token</h1>
      <p>This approval link is invalid or has expired. Please check the email for a fresh link.</p>
    `, '#f87171')
  }

  // Check staged post exists
  const stagingKey = `blog:staged:${slug}`
  const post = await kvGet<BlogPost>(stagingKey)

  if (!post) {
    return htmlPage('Already actioned', `
      <div class="icon">ℹ️</div>
      <h1>Already actioned</h1>
      <p>This post has already been approved or rejected. It may have expired if no action was taken within 7 days.</p>
      <p style="margin-top:16px;"><a href="${appUrl}/blog">View blog →</a></p>
    `, '#a1a1aa')
  }

  if (action === 'reject') {
    // Remove staging entry
    await kvDelete(stagingKey)

    // Log the rejection
    await kvSet(
      `blog:rejected:${slug}`,
      { rejectedAt: new Date().toISOString(), title: post.title },
      30 * 24 * 60 * 60 // 30 days
    )

    return htmlPage('Post rejected', `
      <div class="icon">✕</div>
      <h1>Post rejected</h1>
      <p><strong style="color:#ffffff;">${post.title}</strong></p>
      <p>The staged post has been discarded. A new post will be generated next Sunday.</p>
    `, '#f87171')
  }

  // action === 'approve' (default)

  // Publish: write to `blog:published:{slug}` with no expiry
  const publishKey = `blog:published:${slug}`
  await kvSet(publishKey, post, 365 * 24 * 60 * 60 * 10) // 10 years ≈ permanent

  // Remove staging entry
  await kvDelete(stagingKey)

  // Log the approval
  await kvSet(
    `blog:approved:${slug}`,
    { approvedAt: new Date().toISOString(), title: post.title },
    365 * 24 * 60 * 60 // 1 year
  )

  const postUrl = `${appUrl}/blog/${slug}`

  return htmlPage('Post published', `
    <div class="icon">✓</div>
    <h1>Published!</h1>
    <p><strong style="color:#ffffff;">${post.title}</strong></p>
    <p>${post.city ? `${post.city}, ${post.country} · ` : ''}Taxi Fares</p>
    <p style="margin-top:20px;">
      <a href="${postUrl}" style="display:inline-block;background:#7c3aed;color:#fff;
                                   padding:10px 24px;border-radius:8px;font-weight:600;
                                   text-decoration:none;">
        View post →
      </a>
    </p>
    <p style="margin-top:12px;font-size:13px;">
      Live immediately — no redeploy needed.
    </p>
  `, '#4ade80')
}
