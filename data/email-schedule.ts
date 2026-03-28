/**
 * Weekly email schedule for 2026.
 *
 * Each entry maps a Monday send-date to a blog post slug.
 * The weekly-email cron (runs every Monday 08:00 UTC) looks up today's date,
 * finds the matching entry, and sends that post to the full subscriber list.
 *
 * To change a post: update the slug. No redeploy needed — cron reads this at runtime.
 * To skip a week: remove the entry (cron will log a skip and exit cleanly).
 * To change the featured post mid-year: update featured:true in blog-posts.ts.
 */

export interface ScheduledEmail {
  /** ISO date (Monday) — YYYY-MM-DD */
  sendOn: string
  slug: string
}

export const EMAIL_SCHEDULE: ScheduledEmail[] = [
  // ── April ────────────────────────────────────────────────────────────────────
  { sendOn: '2026-04-06', slug: 'how-much-does-a-taxi-cost-in-bangkok' },
  { sendOn: '2026-04-13', slug: 'tipping-in-egypt' },
  { sendOn: '2026-04-20', slug: 'how-much-does-a-taxi-cost-in-dubai' },
  { sendOn: '2026-04-27', slug: 'getting-around-paris' },

  // ── May ──────────────────────────────────────────────────────────────────────
  { sendOn: '2026-05-04', slug: 'taxi-scams-in-bali' },
  { sendOn: '2026-05-11', slug: 'tipping-in-switzerland' },
  { sendOn: '2026-05-18', slug: 'how-much-does-a-taxi-cost-in-london' },
  { sendOn: '2026-05-25', slug: 'best-time-to-visit-bali' },

  // ── June ─────────────────────────────────────────────────────────────────────
  { sendOn: '2026-06-01', slug: 'uber-vs-taxi-new-york-city' },
  { sendOn: '2026-06-08', slug: 'tipping-in-vietnam' },
  { sendOn: '2026-06-15', slug: 'how-much-does-a-taxi-cost-in-tokyo' },
  { sendOn: '2026-06-22', slug: 'taxi-scams-in-istanbul' },
  { sendOn: '2026-06-29', slug: 'daily-budget-guide-bali' },

  // ── July ─────────────────────────────────────────────────────────────────────
  { sendOn: '2026-07-06', slug: 'tipping-in-south-africa' },
  { sendOn: '2026-07-13', slug: 'how-much-does-a-taxi-cost-in-singapore' },
  { sendOn: '2026-07-20', slug: '5-most-common-taxi-scams-and-how-to-avoid-them' },
  { sendOn: '2026-07-27', slug: 'best-time-to-visit-sydney' },

  // ── August ───────────────────────────────────────────────────────────────────
  { sendOn: '2026-08-03', slug: 'tipping-in-china' },
  { sendOn: '2026-08-10', slug: 'how-much-does-a-taxi-cost-in-marrakech' },
  { sendOn: '2026-08-17', slug: 'taxi-suvarnabhumi-to-bangkok' },
  { sendOn: '2026-08-24', slug: 'tipping-at-hotels-worldwide' },
  { sendOn: '2026-08-31', slug: 'how-much-does-a-taxi-cost-in-barcelona' },

  // ── September ────────────────────────────────────────────────────────────────
  { sendOn: '2026-09-07', slug: 'daily-budget-guide-tokyo' },
  { sendOn: '2026-09-14', slug: 'tipping-in-philippines' },
  { sendOn: '2026-09-21', slug: 'uber-vs-taxi-dubai' },
  { sendOn: '2026-09-28', slug: 'getting-around-tokyo' },

  // ── October ──────────────────────────────────────────────────────────────────
  { sendOn: '2026-10-05', slug: 'tipping-in-israel' },
  { sendOn: '2026-10-12', slug: 'taxi-heathrow-to-london' },
  { sendOn: '2026-10-19', slug: 'how-much-does-a-taxi-cost-in-istanbul' },
  { sendOn: '2026-10-26', slug: 'daily-budget-guide-london' },

  // ── November ─────────────────────────────────────────────────────────────────
  { sendOn: '2026-11-02', slug: 'tipping-in-netherlands' },
  { sendOn: '2026-11-09', slug: 'taxi-scams-in-cairo' },
  { sendOn: '2026-11-16', slug: 'best-time-to-visit-prague' },
  { sendOn: '2026-11-23', slug: 'how-to-tip-tour-guides' },
  { sendOn: '2026-11-30', slug: 'taxi-costs-zurich' },

  // ── December ─────────────────────────────────────────────────────────────────
  { sendOn: '2026-12-07', slug: 'tipping-in-malaysia' },
  { sendOn: '2026-12-14', slug: 'what-to-say-to-your-taxi-driver-in-15-languages' },
  { sendOn: '2026-12-21', slug: 'best-time-to-visit-vietnam' },
  { sendOn: '2026-12-28', slug: 'digital-tipping-guide' },
]

/** Returns the scheduled email for a given ISO date, or undefined if none. */
export function getScheduledEmail(isoDate: string): ScheduledEmail | undefined {
  return EMAIL_SCHEDULE.find((e) => e.sendOn === isoDate)
}

/** Returns the next upcoming scheduled email from today. */
export function getNextScheduledEmail(): ScheduledEmail | undefined {
  const today = new Date().toISOString().slice(0, 10)
  return EMAIL_SCHEDULE.find((e) => e.sendOn >= today)
}
