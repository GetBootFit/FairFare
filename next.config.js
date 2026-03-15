/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

// Content-Security-Policy
// 'unsafe-inline' on script-src is required for Next.js App Router hydration scripts.
// For a nonce-based CSP (stricter), you'd need a custom middleware — not done here.
// Google Maps Places Autocomplete loads scripts from maps.googleapis.com.
// Vercel Analytics loads from va.vercel-scripts.com / vitals.vercel-insights.com.
// Sentry reports to *.sentry.io / *.ingest.sentry.io.
// GA4 (gtag) loads from www.googletagmanager.com / www.google-analytics.com.
// No Stripe JS is loaded on FairFare pages — Stripe Checkout is a full redirect.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://va.vercel-scripts.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://maps.googleapis.com https://maps.gstatic.com https://www.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com https://analytics.google.com https://*.sentry.io https://*.ingest.sentry.io",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
].join('; ')

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fairfare.app'

const nextConfig = {
  // Next.js 15+ uses serverExternalPackages (was experimental.serverComponentsExternalPackages)
  serverExternalPackages: ['@googlemaps/google-maps-services-js'],

  async headers() {
    return [
      {
        // Security headers on all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // payment=() is intentional and safe: FairFare uses Stripe Checkout (full-page redirect
          // to checkout.stripe.com), never Stripe Elements iframes. This header only governs
          // FairFare's own origin pages, not the Stripe Checkout domain. Apple Pay / Google Pay
          // operate on Stripe's domain where Stripe's own headers apply. If Stripe Elements is
          // ever added (embedded card fields), remove payment=() from this policy.
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
        ],
      },
      {
        // Service worker: always revalidate, never cache
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        // API routes: no caching, same-origin CORS only
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          // Derived from NEXT_PUBLIC_APP_URL so staging/preview deployments also lock to their own origin
          { key: 'Access-Control-Allow-Origin', value: appUrl },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = withSentryConfig(nextConfig, {
  // Sentry organisation + project (set via env or Sentry wizard)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress verbose Sentry build output
  silent: !process.env.CI,

  // Upload source maps only in production CI builds
  sourcemaps: {
    disable: process.env.NODE_ENV !== 'production',
  },

  // Automatically instrument Next.js data fetching
  autoInstrumentServerFunctions: true,

  // Tunnel Sentry requests through /api/monitoring to avoid ad-blockers
  tunnelRoute: '/api/monitoring',
})
