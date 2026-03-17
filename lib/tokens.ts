import { SignJWT, jwtVerify } from 'jose'

function secret(): Uint8Array {
  const s = process.env.ENTITLEMENT_SECRET
  if (!s) throw new Error('ENTITLEMENT_SECRET is not set')
  return new TextEncoder().encode(s)
}

// ─── Token payload types ───────────────────────────────────────────────────────

export interface TokenPayload {
  sessionId: string
  /** 'single' = one taxi OR tipping query (30 min).
   *  'country_pass' = all features for one country (24h).
   *  'bundle' = one query from a 10-pack, device-stored (90 days).
   *  Undefined = legacy single-query token (backward compat). */
  tokenType?: 'single' | 'country_pass' | 'bundle'
  feature?: 'taxi' | 'tipping'  // present for single tokens
  country?: string               // present for country_pass tokens (normalised lowercase)
}

// ─── Server-side: sign / verify ───────────────────────────────────────────────

/** Issue a single-use JWT valid for 30 minutes. */
export async function createToken(payload: {
  sessionId: string
  feature: 'taxi' | 'tipping'
}): Promise<string> {
  return new SignJWT({ ...payload, tokenType: 'single' } as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret())
}

/** Issue a bundle JWT valid for 90 days (one query from a purchased 10-pack). */
export async function createBundleToken(sessionId: string): Promise<string> {
  return new SignJWT({ tokenType: 'bundle', sessionId } as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('90d')
    .sign(secret())
}

/** Issue a country pass JWT valid for 24 hours. country should be normalised lowercase. */
export async function createCountryPassToken(
  sessionId: string,
  country: string
): Promise<string> {
  return new SignJWT({ tokenType: 'country_pass', sessionId, country } as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret())
}

/** Verify a JWT and return its payload. Throws on invalid/expired. */
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secret())
  return payload as unknown as TokenPayload
}

// ─── Client-side helpers: single-query token ─────────────────────────────────

const KEY = 'ff_token'

export function storeToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, token)
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY)
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

// ─── Client-side helpers: country pass token ──────────────────────────────────

function passKey(country: string): string {
  return `ff_pass_${country.toLowerCase().trim().replace(/\s+/g, '_')}`
}

export function storeCountryPass(country: string, token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(passKey(country), token)
}

export function getCountryPassToken(country: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(passKey(country))
}

export function clearCountryPass(country: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(passKey(country))
}

export function isCountryPassValid(country: string): boolean {
  const token = getCountryPassToken(country)
  if (!token) return false
  return !isTokenExpired(token)
}

// ─── Client-side helpers: 10-query bundle queue ───────────────────────────────

const BUNDLE_KEY = 'ff_bundle_queue'

/** Append freshly-issued bundle tokens to the device queue. */
export function storeBundleTokens(tokens: string[]): void {
  if (typeof window === 'undefined') return
  const existing = getBundleTokens()
  localStorage.setItem(BUNDLE_KEY, JSON.stringify([...existing, ...tokens]))
}

/** Return the full queue (may include expired tokens). */
function getBundleTokens(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(BUNDLE_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

/** Number of valid (non-expired) tokens remaining in the bundle queue. */
export function getBundleCount(): number {
  return getBundleTokens().filter((t) => !isTokenExpired(t)).length
}

/** Remove and return the first valid bundle token, or null if queue is empty/exhausted. */
export function popBundleToken(): string | null {
  if (typeof window === 'undefined') return null
  const all = getBundleTokens()
  // Find first non-expired token
  const idx = all.findIndex((t) => !isTokenExpired(t))
  if (idx === -1) {
    // All expired — clear the queue
    localStorage.removeItem(BUNDLE_KEY)
    return null
  }
  const token = all[idx]
  // Remove it from the array and persist
  all.splice(idx, 1)
  localStorage.setItem(BUNDLE_KEY, JSON.stringify(all))
  return token
}

// ─── Shared: decode expiry (no signature check — client only) ─────────────────

/**
 * Decodes the JWT payload client-side (no signature check) to determine expiry.
 *
 * SECURITY NOTE: This function is intentionally UI-only. A sophisticated user
 * could craft a JWT with a far-future `exp` claim and store it in localStorage,
 * making the UI show "token valid" when it isn't. This is acceptable because:
 *   1. Every paid API call verifies the full signature server-side via jose.
 *   2. A forged token will be rejected by the server regardless of what the UI shows.
 *   3. The only consequence of a forged token is a cosmetic UI state — the user
 *      cannot extract any paid data without a genuine signed token.
 * Do NOT use this function for server-side authorization decisions.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [, b64] = token.split('.')
    const payload = JSON.parse(atob(b64))
    return (payload.exp ?? 0) * 1000 < Date.now()
  } catch {
    return true
  }
}
