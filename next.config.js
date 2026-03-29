/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

// Content-Security-Policy is handled by middleware.ts (nonce-based, per-request).
// The static CSP previously set here has been removed — middleware.ts sets a
// stricter `nonce + strict-dynamic` policy on every response, eliminating
// `unsafe-inline` from script-src. style-src still uses `unsafe-inline`
// because Tailwind utility classes are applied inline and hashing is impractical.

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'

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
          // payment=() is intentional and safe: Hootling uses Stripe Checkout (full-page redirect
          // to checkout.stripe.com), never Stripe Elements iframes. This header only governs
          // Hootling's own origin pages, not the Stripe Checkout domain. Apple Pay / Google Pay
          // operate on Stripe's domain where Stripe's own headers apply. If Stripe Elements is
          // ever added (embedded card fields), remove payment=() from this policy.
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // CSP is set per-request by middleware.ts (nonce-based); not set here.
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

  async redirects() {
    return [
      // /tipping/uae was renamed to /tipping/united-arab-emirates — permanent redirect
      { source: '/tipping/uae', destination: '/tipping/united-arab-emirates', permanent: true },
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
