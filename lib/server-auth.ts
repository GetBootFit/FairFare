/**
 * server-auth.ts — SERVER ONLY. Do not import from client components.
 *
 * Verifies entitlement tokens from httpOnly cookies set by /api/payment/verify.
 * Replaces the previous Authorization: Bearer header pattern, which was vulnerable
 * to XSS token theft (localStorage is readable by injected scripts).
 *
 * Cookie scheme:
 *   hootling_token      — single-query or country-pass JWT (30 min / 24 h TTL)
 *   hootling_bundle_id  — bundle session ID; actual tokens are stored in KV
 *                         under bundle:tokens:{sessionId} (90-day TTL)
 *
 * Security properties:
 *   • httpOnly  — JS cannot read the cookie, so XSS cannot steal it
 *   • SameSite=Strict — cookie is never sent in cross-origin requests (CSRF defence)
 *   • Secure    — HTTPS only in production
 *   • The bearer-header path is removed from all paid API routes; stolen
 *     localStorage tokens are useless without the accompanying cookie.
 */

import type { NextRequest } from 'next/server'
import { verifyToken, type TokenPayload } from '@/lib/tokens'
import { kvGet, kvSet } from '@/lib/kv'

/** KV TTL for bundle token queue — matches the 90-day JWT expiry. */
const BUNDLE_KV_TTL = 90 * 24 * 60 * 60

/**
 * Extracts and verifies a paid entitlement from the request cookies.
 *
 * Check order: hootling_token (single / country-pass) → hootling_bundle_id (bundle).
 * Bundle tokens are popped from KV on each successful verification so they
 * cannot be replayed.
 *
 * Throws with a descriptive message on failure — caller should return 402.
 */
export async function verifyTokenFromRequest(req: NextRequest): Promise<TokenPayload> {
  // ── 1. Single-query / country-pass cookie ─────────────────────────────────
  const tokenCookie = req.cookies.get('hootling_token')?.value
  if (tokenCookie) {
    // verifyToken (jose) throws on invalid signature or expiry
    return verifyToken(tokenCookie)
  }

  // ── 2. Bundle token — session ID in cookie, token queue in KV ─────────────
  const bundleId = req.cookies.get('hootling_bundle_id')?.value
  if (bundleId) {
    const tokens = await kvGet<string[]>(`bundle:tokens:${bundleId}`)
    if (tokens && tokens.length > 0) {
      for (let i = 0; i < tokens.length; i++) {
        try {
          const payload = await verifyToken(tokens[i])
          // Consume this token — remove from queue and persist remainder
          const remaining = [...tokens.slice(0, i), ...tokens.slice(i + 1)]
          await kvSet(`bundle:tokens:${bundleId}`, remaining, BUNDLE_KV_TTL)
          return { ...payload, tokenType: 'bundle' }
        } catch {
          // Token expired — skip, try next in queue
        }
      }
    }
    throw new Error('Bundle exhausted or all tokens expired')
  }

  throw new Error('No entitlement cookie present')
}

/** Cookie options shared across all entitlement cookies. */
export const ENTITLEMENT_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
} as const
