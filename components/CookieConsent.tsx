'use client'

/**
 * CookieConsent.tsx
 *
 * GDPR / Australian Privacy Act compliant consent banner for third-party
 * tracking scripts: Travelpayouts (affiliate attribution) and Microsoft
 * Clarity (session recordings).
 *
 * Behaviour:
 *  - On first visit: shows a bottom banner with Accept / Decline options.
 *  - On Accept:  saves `hootling_consent=accepted` to localStorage and
 *                dynamically injects both the Travelpayouts embed script
 *                and the Microsoft Clarity snippet.
 *  - On Decline: saves `hootling_consent=declined` to localStorage.
 *                No tracking scripts are loaded.
 *  - On subsequent visits: reads localStorage on mount; if previously
 *    accepted, injects scripts immediately without showing the banner.
 *
 * Note: GA4 is already in cookieless mode (`client_storage: 'none'`) and
 * does not require consent under GDPR, so it is not gated here.
 */

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'hootling_consent'

type ConsentState = 'accepted' | 'declined' | 'pending' | null

interface CookieConsentProps {
  /** Travelpayouts publisher ID — injected into the embed URL on accept. */
  publisherId: string
  /** Microsoft Clarity project ID — optional, only injected if provided. */
  clarityId?: string
}

export function CookieConsent({ publisherId, clarityId }: CookieConsentProps) {
  const [consent, setConsent] = useState<ConsentState>(null)

  // Read stored preference on mount (runs client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null
    if (stored === 'accepted' || stored === 'declined') {
      setConsent(stored)
    } else {
      setConsent('pending')
    }
  }, [])

  // Inject third-party scripts when consent is accepted
  useEffect(() => {
    if (consent !== 'accepted') return

    // Travelpayouts affiliate attribution
    if (!document.getElementById('tp-embed-script')) {
      const script = document.createElement('script')
      script.id = 'tp-embed-script'
      script.src = `https://tpembars.com/${btoa(publisherId)}.js?t=${publisherId}`
      script.async = true
      document.head.appendChild(script)
    }

    // Microsoft Clarity session recordings (only if project ID configured)
    if (clarityId && !document.getElementById('clarity-script')) {
      const script = document.createElement('script')
      script.id = 'clarity-script'
      script.async = true
      // Standard Clarity inline initialisation snippet, inlined to avoid an extra round-trip.
      // Clarity automatically masks all text inputs, passwords, and sensitive fields.
      script.innerHTML = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,"clarity","script","${clarityId}");`
      document.head.appendChild(script)
    }
  }, [consent, publisherId, clarityId])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setConsent('accepted')
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setConsent('declined')
  }

  // Don't render anything until we know consent state (avoids SSR flash)
  // Also don't render banner if user already chose
  if (consent !== 'pending') return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-20 left-0 right-0 z-50 px-4 pb-2 sm:bottom-4"
    >
      <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4">
        <p className="text-xs text-zinc-300 leading-relaxed mb-3">
          We use optional tracking to improve Hootling: affiliate attribution (earns
          commission on partner bookings) and session recordings to fix usability issues.
          All inputs are masked — no payment or personal data is ever recorded.{' '}
          <span className="text-zinc-400">
            Declining has no impact on any features.
          </span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
