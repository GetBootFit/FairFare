import { NextRequest } from 'next/server'
import { createClient } from '@vercel/kv'

/**
 * GET /api/health
 * Lightweight health-check endpoint for uptime monitors (e.g. UptimeRobot, Better Uptime).
 * Returns 200 when the app is running. Optionally probes KV connectivity.
 */
export async function GET(_req: NextRequest) {
  const checks: Record<string, 'ok' | 'unavailable' | 'not_configured'> = {}

  // ── KV probe ─────────────────────────────────────────────────────────────
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN
  if (kvUrl && kvToken) {
    try {
      const kv = createClient({ url: kvUrl, token: kvToken })
      await kv.ping()
      checks.kv = 'ok'
    } catch {
      checks.kv = 'unavailable'
    }
  } else {
    checks.kv = 'not_configured'
  }

  // ── Env sanity checks (presence only, never values) ───────────────────────
  checks.anthropic = process.env.ANTHROPIC_API_KEY ? 'ok' : 'unavailable'
  checks.googleMaps = process.env.GOOGLE_MAPS_API_KEY ? 'ok' : 'unavailable'
  checks.stripe = process.env.STRIPE_SECRET_KEY ? 'ok' : 'unavailable'

  const allOk = Object.values(checks).every((v) => v === 'ok' || v === 'not_configured')

  return Response.json(
    {
      status: allOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  )
}
