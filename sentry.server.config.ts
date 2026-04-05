import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sample 20% of server transactions (increased from 10% — low traffic site)
  tracesSampleRate: 0.2,

  // Only capture in production
  enabled: process.env.NODE_ENV === 'production',
})
