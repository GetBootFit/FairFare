import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * Edge proxy — runs on every request before it reaches the page/API.
 *
 * Responsibilities:
 * 1. Block /dev in production (dev payment-bypass page must never be public)
 * 2. Enforce HTTP Basic Auth on /admin/* routes
 * 3. IP-based rate limiting on high-value API endpoints
 */

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dev', '/dev/:path*',
    '/admin', '/admin/:path*',
    '/api/admin', '/api/admin/:path*',
    '/api/payment/create-session',
    '/api/taxi/result',
    '/api/tipping',
    '/api/translate',
  ],
}
