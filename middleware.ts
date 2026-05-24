/**
 * Next.js Middleware — Content Security Policy (static, no nonce).
 *
 * Sets security headers on every response. CSP uses 'unsafe-inline' for
 * script-src rather than a per-request nonce, so the root layout can be a
 * synchronous Server Component and all static pages remain truly static.
 *
 * Trade-off: 'unsafe-inline' allows any inline script to run (vs nonce which
 * only allows scripts that carry the matching attribute). For Hootling this is
 * an acceptable trade-off: the primary defences against XSS are strict input
 * validation on all API routes, no user-generated HTML, and the host allowlist
 * that still blocks scripts from unknown external origins.
 *
 * style-src 'unsafe-inline' is retained: Tailwind inline styles make hashing
 * impractical regardless of the nonce strategy.
 *
 * This middleware still runs on every request so it can set the CSP header on
 * both HTML responses and API responses. It does NOT call headers() or perform
 * any dynamic logic, so it never forces pages into dynamic rendering.
 */

import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const ContentSecurityPolicy = [
    "default-src 'self'",
    // 'unsafe-inline' — Next.js hydration scripts + our inline JSON-LD / GA4 init
    // Host allowlist — blocks scripts from unknown external origins
    "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://va.vercel-scripts.com https://www.googletagmanager.com https://tpembars.com",
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

  const res = NextResponse.next()
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
