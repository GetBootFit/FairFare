import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Replay integration for session recording — only in production
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Performance tracing — sample 10% of transactions
  tracesSampleRate: 0.1,

  // Replay 1% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  // Only capture errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter out known non-errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    /^NetworkError/,
    /^TypeError: Load failed/,
    /^TypeError: Failed to fetch/,
  ],
})
