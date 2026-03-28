/**
 * Next.js Middleware — Content Security Policy (nonce-based).
 *
 * Generates a fresh cryptographic nonce on every request and injects it into:
 *   1. The `x-nonce` request header (read by app/layout.tsx Server Component)
 *   2. The `Content-Security-Policy` response header
 *
 * Using a per-request nonce instead of `'unsafe-inline'` means an attacker
 * cannot inject and execute arbitrary scripts even if they achieve XSS —
 * they cannot know the nonce for the current request.
 *
 * 'strict-dynamic' is included so that scripts loaded by a nonced script
 * (e.g. Google Maps loaded by our PlaceInput, or Travelpayouts injected by
 * CookieConsent) are automatically trusted without needing their own nonce.
 * Host allowlists are kept as a CSP Level 2 fallback for older browsers.
 *
 * style-src retains 'unsafe-inline': removing it requires hashing every
 * style attribute, which is impractical with Tailwind's runtime utilities.
 * This is an accepted trade-off — the primary XSS vector is script injection.
 */

import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // crypto.randomUUID() is available in the Next.js Edge runtime
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const ContentSecurityPolicy = [
    "default-src 'self'",
    // nonce-{nonce}     — Next.js hydration + our inline scripts
    // 'strict-dynamic'  — scripts loaded by nonced scripts (Maps, GA, Travelpayouts)
    // host list         — CSP2 fallback for browsers that don't support strict-dynamic
    `script-src 'nonce-${nonce}' 'strict-dynamic' https://maps.googleapis.com https://maps.gstatic.com https://va.vercel-scripts.com https://www.googletagmanager.com https://tpembars.com`,
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

  // Forward nonce to server components via request header
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)

  const res = NextResponse.next({ request: { headers: requestHeaders } })
  // Set the CSP on the response so browsers enforce it
  res.headers.set('Content-Security-Policy', ContentSecurityPolicy)
  return res
}

export const config = {
  matcher: [
    /*
     * Apply to all routes EXCEPT:
     * - _next/static  — immutable static assets (no HTML, no CSP needed)
     * - _next/image   — Next.js image optimisation service
     * - favicon.ico and common static file extensions
     *
     * API routes ARE included so they receive a CSP header too — even though
     * API responses are JSON, not HTML, having the header doesn't hurt and
     * ensures any error pages rendered by Next.js for API failures are covered.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)',
  ],
}
