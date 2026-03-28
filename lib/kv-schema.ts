/**
 * kv-schema.ts — Canonical registry of every KV key pattern used by Hootling.
 *
 * PURPOSE
 * -------
 * Vercel KV (Redis) has no schema enforcement. Without a central reference,
 * key naming drifts silently over time, leading to:
 *   • Collisions between features (two features writing the same key pattern)
 *   • Stale TTLs that cause premature expiry or unbounded growth
 *   • Impossible-to-debug cache misses when a key format changes
 *   • No audit trail for what data is stored and for how long
 *
 * This file is the single source of truth. Every KV read/write in the codebase
 * MUST correspond to an entry here. When adding a new key pattern, add it here
 * first, then implement it.
 *
 * CONVENTIONS
 * -----------
 * Key segments are separated by `:` (colon). Variable segments are shown as
 * `{param}`. All keys are lowercase except where the param is an IATA code or
 * UUID (which preserve their natural case).
 *
 * TTLs are expressed as seconds in the constants and as human-readable comments.
 */

// ─── TTL constants (seconds) ──────────────────────────────────────────────────

export const KV_TTL = {
  /** Claude AI response cache — 90 days. Taxi fares and tipping info change rarely. */
  AI_CACHE:          90  * 86400,
  /** Stripe session replay guard — 90 days (longest token lifespan). */
  STRIPE_SESSION:    90  * 86400,
  /** Single-query JWT entitlement cookie — 8 hours (matches JWT expiry). */
  SINGLE_TOKEN:       8  * 3600,
  /** Country-pass JWT entitlement cookie — 24 hours (matches JWT expiry). */
  COUNTRY_PASS:      24  * 3600,
  /** Bundle token queue in KV — 90 days (matches individual token JWTs, 20-pack). */
  BUNDLE_TOKENS:     90  * 86400,
  /** Bundle email registration — 90 days (matches bundle expiry). */
  BUNDLE_EMAIL:      90  * 86400,
  /** Bundle reminder dedup flag — 90 days (one reminder per bundle session). */
  BUNDLE_REMINDED:   90  * 86400,
  /** Blog staged post (awaiting approval) — 7 days before auto-expire. */
  BLOG_STAGED:        7  * 86400,
  /** Blog published post — 10 years (≈ permanent; manual deletion only). */
  BLOG_PUBLISHED: 3650  * 86400,
  /** Blog rejection log — 30 days for audit trail. */
  BLOG_REJECTED:     30  * 86400,
  /** Blog approval log — 1 year for audit trail. */
  BLOG_APPROVED:    365  * 86400,
  /** Weekly cron idempotency keys — 30 hours (prevents double-run within same week). */
  CRON_IDEMPOTENCY:  30  * 3600,
  /** Affiliate config KV overlay — no TTL (set via kvSetPermanent). */
  AFFILIATE_CONFIG:  0,
  /** Rate limit sliding-window counter — matches the window size (varies by route). */
  RATE_LIMIT:        0, // dynamic — set per-route in rate-limit.ts
} as const

// ─── Key schema ───────────────────────────────────────────────────────────────

/**
 * Every KV key pattern used in the codebase.
 * Each entry documents: pattern, owner module, TTL, and value shape.
 */
export const KV_KEYS = {
  // ── AI cache ──────────────────────────────────────────────────────────────
  /**
   * pattern: `ai:taxi:{city}:{country}`
   * owner:   lib/claude.ts → getTaxiAiInfo()
   * ttl:     90 days
   * value:   TaxiAiInfo JSON object
   */
  AI_TAXI: (city: string, country: string) =>
    `ai:taxi:${city.toLowerCase()}:${country.toLowerCase()}`,

  /**
   * pattern: `ai:tipping:{country}`
   * owner:   lib/claude.ts → getTippingGuide()
   * ttl:     90 days
   * value:   TippingResult JSON object
   */
  AI_TIPPING: (country: string) =>
    `ai:tipping:${country.toLowerCase()}`,

  // ── Stripe replay prevention ───────────────────────────────────────────────
  /**
   * pattern: `ff:session:{stripeSessionId}`
   * owner:   app/api/payment/verify/route.ts
   * ttl:     90 days
   * value:   '1' (existence check only)
   * purpose: Prevents a Stripe session from being verified more than once.
   */
  STRIPE_SESSION: (sessionId: string) => `ff:session:${sessionId}`,

  // ── Bundle token queue ─────────────────────────────────────────────────────
  /**
   * pattern: `bundle:tokens:{bundleSessionId}`
   * owner:   app/api/payment/verify/route.ts (write), lib/server-auth.ts (read/pop)
   * ttl:     90 days
   * value:   string[] — array of JWT strings (consumed one at a time)
   * note:    bundleSessionId is a UUID stored in the hootling_bundle_id httpOnly cookie.
   */
  BUNDLE_TOKENS: (bundleSessionId: string) => `bundle:tokens:${bundleSessionId}`,

  /**
   * pattern: `bundle:email:{bundleSessionId}`
   * owner:   app/api/email/subscribe/route.ts (write), app/api/cron/bundle-reminder/route.ts (read)
   * ttl:     90 days
   * value:   { email: string, purchaseDate: string, bundleSessionId: string }
   */
  BUNDLE_EMAIL: (bundleSessionId: string) => `bundle:email:${bundleSessionId}`,

  /**
   * pattern: `bundle:reminded:{bundleSessionId}`
   * owner:   app/api/cron/bundle-reminder/route.ts
   * ttl:     90 days
   * value:   '1' (existence check — prevents sending duplicate low-query reminders)
   */
  BUNDLE_REMINDED: (bundleSessionId: string) => `bundle:reminded:${bundleSessionId}`,

  // ── Blog content lifecycle ─────────────────────────────────────────────────
  /**
   * pattern: `blog:staged:{slug}`
   * owner:   app/api/cron/weekly-post/route.ts (write), app/api/admin/approve-post/route.ts (read/delete)
   * ttl:     7 days
   * value:   BlogPost JSON object
   */
  BLOG_STAGED: (slug: string) => `blog:staged:${slug}`,

  /**
   * pattern: `blog:published:{slug}`
   * owner:   app/api/admin/approve-post/route.ts (write), app/blog/page.tsx + app/blog/[slug]/page.tsx (read)
   * ttl:     10 years (permanent)
   * value:   BlogPost JSON object
   */
  BLOG_PUBLISHED: (slug: string) => `blog:published:${slug}`,

  /**
   * pattern: `blog:rejected:{slug}`
   * owner:   app/api/admin/approve-post/route.ts
   * ttl:     30 days
   * value:   { rejectedAt: string, title: string }
   */
  BLOG_REJECTED: (slug: string) => `blog:rejected:${slug}`,

  /**
   * pattern: `blog:approved:{slug}`
   * owner:   app/api/admin/approve-post/route.ts
   * ttl:     1 year
   * value:   { approvedAt: string, title: string }
   */
  BLOG_APPROVED: (slug: string) => `blog:approved:${slug}`,

  /**
   * pattern: `blog:generated:week:{year}:{weekNumber}`
   * owner:   app/api/cron/weekly-post/route.ts
   * ttl:     8 days (prevents double-run within same ISO week)
   * value:   '1' (existence check only)
   */
  BLOG_GENERATED_WEEK: (year: number, week: number) =>
    `blog:generated:week:${year}:${week}`,

  // ── Cron idempotency ──────────────────────────────────────────────────────
  /**
   * pattern: `email:weekly:sent:{isoDate}`
   * owner:   app/api/cron/weekly-email/route.ts
   * ttl:     30 hours
   * value:   '1' (existence check only)
   */
  EMAIL_WEEKLY_SENT: (isoDate: string) => `email:weekly:sent:${isoDate}`,

  /**
   * pattern: `email:weekly:log:{isoDate}`
   * owner:   app/api/cron/weekly-email/route.ts
   * ttl:     30 days
   * value:   { sentAt: string, slug: string, subject: string }
   */
  EMAIL_WEEKLY_LOG: (isoDate: string) => `email:weekly:log:${isoDate}`,

  // ── Affiliate config & tracking ───────────────────────────────────────────
  /**
   * pattern: `affiliate:config`
   * owner:   lib/affiliates.ts (read), app/api/admin/config/route.ts (write)
   * ttl:     permanent (no TTL — admin-managed)
   * value:   AffiliatePartner[] JSON array (KV overlay over static default config)
   */
  AFFILIATE_CONFIG: () => 'affiliate:config',

  /**
   * pattern: `affiliate:clicks:{partnerId}:{zone}`
   * owner:   app/api/affiliate/redirect/route.ts
   * ttl:     permanent (counters are never expired)
   * value:   number (INCR counter)
   */
  AFFILIATE_CLICKS: (partnerId: string, zone: string) =>
    `affiliate:clicks:${partnerId}:${zone}`,

  // ── Metrics & counters ────────────────────────────────────────────────────
  /**
   * pattern: `total_queries`
   * owner:   app/api/taxi/result/route.ts, app/api/tipping/route.ts
   * ttl:     permanent
   * value:   number (INCR counter — social proof metric)
   */
  TOTAL_QUERIES: () => 'total_queries',

  /**
   * pattern: `city_miss:{city}_{country}`
   * owner:   app/api/taxi/result/route.ts
   * ttl:     permanent
   * value:   number (INCR — tracks cities not in taxi-rates.json for prioritisation)
   */
  CITY_MISS: (city: string, country: string) =>
    `city_miss:${city.toLowerCase().replace(/\s+/g, '_')}_${country.toLowerCase().replace(/\s+/g, '_')}`,

  // ── Rate limiting ─────────────────────────────────────────────────────────
  /**
   * pattern: `rl:{action}:{identifier}`
   * owner:   lib/rate-limit.ts
   * ttl:     varies by window (set dynamically per route)
   * value:   number (INCR counter within sliding window)
   * actions: 'result' (paid APIs), 'subscribe' (email), 'admin_login'
   */
  RATE_LIMIT: (action: string, identifier: string) =>
    `rl:${action}:${identifier}`,
} as const
