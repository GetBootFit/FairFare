import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * Edge proxy — runs on every request before it reaches the page/API.
 *
 * Responsibilities:
 * 1. Content Security Policy (nonce-based) — applied to all HTML responses
 * 2. Block /dev in production (dev payment-bypass page must never be public)
 * 3. Enforce cookie-based auth on /admin/* routes
 * 4. IP-based rate limiting on high-value API endpoints
 */

// ── CSP nonce ─────────────────────────────────────────────────────────────────

/**
 * Static asset extensions that never serve HTML — CSP header not needed.
 * Kept as a set for O(1) lookup in the hot path.
 */
const STATIC_EXT = new Set([
  'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico',
  'woff', 'woff2', 'ttf', 'otf', 'css', 'map',
])

function isStaticAsset(pathname: string): boolean {
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image')) return true
  const ext = pathname.split('.').pop()?.toLowerCase()
  return ext ? STATIC_EXT.has(ext) : false
}

function buildCsp(nonce: string): string {
  // React dev mode requires 'unsafe-eval' for hot-module replacement; omit in production
  const devEval = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
  return [
    "default-src 'self'",
    // nonce-{nonce}    — Next.js hydration + our inline scripts
    // 'strict-dynamic' — scripts loaded by nonced scripts (Maps, GA, Travelpayouts)
    // host list        — CSP2 fallback for browsers without strict-dynamic
    `script-src 'nonce-${nonce}' 'strict-dynamic'${devEval} https://maps.googleapis.com https://maps.gstatic.com https://va.vercel-scripts.com https://www.googletagmanager.com https://tpembars.com`,
    // unsafe-inline retained for Tailwind inline styles; hashing is impractical
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://maps.googleapis.com https://maps.gstatic.com https://www.google-analytics.com",
    "font-src 'self'",
    "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com https://analytics.google.com https://*.sentry.io https://*.ingest.sentry.io https://tpembars.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join('; ')
}

// ── Rate limiting (edge-compatible via Vercel KV REST API) ────────────────────

/**
 * Atomically increment a sliding-window counter using the KV REST pipeline.
 * Returns the new count, or null when KV is not configured (graceful no-op).
 */
async function rlIncrement(ip: string, route: string, windowSecs: number): Promise<number | null> {
  const kvUrl   = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN
  if (!kvUrl || !kvToken) return null // KV not configured — skip rate limiting

  const bucket = Math.floor(Date.now() / (windowSecs * 1000))
  const key    = `rl:${route}:${ip}:${bucket}`

  try {
    const res = await fetch(`${kvUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      // Atomic: increment then set TTL (small buffer so last-second requests decay cleanly)
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, windowSecs + 30],
      ]),
    })
    if (!res.ok) return null
    const data = await res.json() as Array<{ result: number }>
    return data[0]?.result ?? null
  } catch {
    return null // Network error — fail open, never block legitimate traffic
  }
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function rateLimitedResponse(windowSecs: number): NextResponse {
  return new NextResponse('Too Many Requests', {
    status: 429,
    headers: {
      'Retry-After': String(windowSecs),
      'Content-Type': 'text/plain',
    },
  })
}

// ── Rate limit policies ───────────────────────────────────────────────────────
// Intentionally generous — stops bots/scrapers, not real travellers.
const RATE_POLICIES: Record<string, { limit: number; windowSecs: number }> = {
  'payment-create': { limit: 10,  windowSecs: 300  }, // 10 checkout inits / 5 min
  'taxi-result':    { limit: 60,  windowSecs: 3600 }, // 60 results / hour
  'tipping':        { limit: 60,  windowSecs: 3600 }, // 60 guides / hour
  'translate':      { limit: 120, windowSecs: 3600 }, // 120 translates / hour
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── 1. Block /dev in production ───────────────────────────────────────────
  if (pathname === '/dev' || pathname.startsWith('/dev/')) {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // ── 2. Cookie-based auth on /admin/* and /api/admin/* ────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow the login page and its POST handler through without a token
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    const adminSecret = process.env.ADMIN_SECRET
    if (!adminSecret) {
      // ADMIN_SECRET not configured — block all access
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Admin not configured' }, { status: 503 })
      }
      return new NextResponse('Admin not configured', { status: 503 })
    }

    const token = req.cookies.get('admin_token')?.value
    let isAuthed = false
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(adminSecret))
        isAuthed = true
      } catch {
        isAuthed = false
      }
    }
    if (!isAuthed) {
      // API routes → 401 JSON; page routes → redirect to login
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── 3. IP rate limiting on API routes ─────────────────────────────────────
  let policyKey: string | null = null
  if (pathname === '/api/payment/create-session') policyKey = 'payment-create'
  else if (pathname === '/api/taxi/result')        policyKey = 'taxi-result'
  else if (pathname === '/api/tipping')            policyKey = 'tipping'
  else if (pathname === '/api/translate')          policyKey = 'translate'

  if (policyKey) {
    const policy = RATE_POLICIES[policyKey]
    const ip     = getIP(req)
    const count  = await rlIncrement(ip, policyKey, policy.windowSecs)
    if (count !== null && count > policy.limit) {
      return rateLimitedResponse(policy.windowSecs)
    }
  }

  // ── 4. CSP nonce — injected on HTML responses only ────────────────────────
  // Static assets skip nonce generation (no HTML, no script execution context).
  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Forward nonce to Server Components via request header
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)

  const res = NextResponse.next({ request: { headers: requestHeaders } })
  res.headers.set('Content-Security-Policy', buildCsp(nonce))
  return res
}

export const config = {
  matcher: [
    /*
     * Apply to all routes EXCEPT Next.js internals and static file serving.
     * The isStaticAsset() check inside the handler is a belt-and-braces guard
     * for any extensions the regex doesn't catch.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|css|map)).*)',
  ],
}
