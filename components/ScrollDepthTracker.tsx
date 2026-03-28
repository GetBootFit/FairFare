'use client'

/**
 * ScrollDepthTracker — fires analytics events at 25 / 50 / 75 / 100% scroll depth.
 *
 * Used on blog post pages to measure how much readers engage with content.
 * Each threshold fires once per page load (deduped with a Set).
 *
 * Events sent to:
 *   • Vercel Analytics — `scroll_depth` with { depth, slug }
 *   • GA4 — `scroll_depth` with { depth, slug, feature }
 *
 * How depth is calculated:
 *   scrolled = window.scrollY + window.innerHeight
 *   total    = document.documentElement.scrollHeight
 *   percent  = Math.floor((scrolled / total) * 100)
 *
 * Why not IntersectionObserver on sentinel divs?
 *   Blog posts are server-rendered; adding sentinel <div>s mid-content requires
 *   client-side rendering or complex ref gymnastics. A passive scroll listener
 *   on window is simpler and equally performant at this traffic level.
 */

import { useEffect } from 'react'
import { track } from '@vercel/analytics'
import { ga4ScrollDepth } from '@/lib/analytics'

const THRESHOLDS = [25, 50, 75, 100] as const

interface ScrollDepthTrackerProps {
  /** Blog post slug — included in events for per-post analysis. */
  slug: string
  /** Post category — helps filter scroll depth by content type in GA4. */
  feature?: 'taxi' | 'tipping' | 'travel'
}

export function ScrollDepthTracker({ slug, feature = 'taxi' }: ScrollDepthTrackerProps) {
  useEffect(() => {
    const fired = new Set<number>()

    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (total <= 0) return
      const percent = Math.floor((scrolled / total) * 100)

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold)
          track('scroll_depth', { depth: threshold, slug })
          ga4ScrollDepth({ depth: threshold, slug, feature })
        }
      }
    }

    // passive: true — scroll listener never calls preventDefault, allows browser to skip
    // the synchronous hit-test and keeps scrolling jank-free.
    window.addEventListener('scroll', onScroll, { passive: true })
    // Fire once on mount — handles cases where content is shorter than viewport (100% immediately)
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [slug, feature])

  return null
}
