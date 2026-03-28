import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Hootling Affiliate Disclosure — how we earn commissions from partner links on our travel information service.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/affiliate-disclosure` },
}

const EFFECTIVE = '28 March 2026'
const CONTACT = 'legal@hootling.com'

export default function AffiliateDisclosurePage() {
  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <Image src="/images/owl/expressions/owl-curious.svg" alt="Hootling" width={40} height={40} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Affiliate Disclosure</h1>
          <p className="text-xs text-zinc-500 mt-1">Effective {EFFECTIVE}</p>
        </div>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">
        Hootling participates in affiliate marketing programmes. This page discloses our
        affiliate relationships in compliance with the US Federal Trade Commission (FTC){' '}
        guidelines (<em>16 CFR Part 255</em>), the Australian Competition and Consumer
        Commission (ACCC) guidelines on testimonials and endorsements, and the UK Advertising
        Standards Authority (ASA) requirements.
      </p>

      <Section title="1. What Is an Affiliate Link?">
        <p>
          An affiliate link is a specially tracked URL. When you click an affiliate link on
          Hootling and subsequently make a purchase on the linked partner&apos;s website,
          Hootling may receive a commission from that partner — at{' '}
          <strong className="text-white">no additional cost to you</strong>. The price you pay
          for any product or service is the same whether or not you arrive via an affiliate link.
        </p>
      </Section>

      <Section title="2. Our Affiliate Relationships">
        <p>
          Hootling currently participates in the following affiliate programmes:
        </p>
        <ul className="mt-2 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-zinc-300">Travelpayouts</strong> — a travel affiliate
            network through which we promote airport transfer and travel services including
            Kiwitaxi, Welcome Pickups, GetTransfer, and intui.travel. Publisher ID: 509985.
          </li>
        </ul>
        <p className="mt-2">
          We may add further affiliate programmes in the future and will update this page
          accordingly. Programmes pending approval are not yet active and are not currently
          generating commissions.
        </p>
      </Section>

      <Section title="3. How Affiliate Links Are Identified">
        <p>
          Affiliate links on Hootling are:
        </p>
        <ul className="mt-2 space-y-1.5 list-disc list-inside">
          <li>
            Routed through our own tracking endpoint (<code className="text-zinc-500">/api/affiliate/redirect</code>),
            which records the click and then redirects you to the partner&apos;s website
          </li>
          <li>
            Marked with <code className="text-zinc-500">rel=&quot;sponsored&quot;</code> in the
            HTML to signal their commercial nature to search engines and browsers
          </li>
          <li>
            Accompanied by a disclosure note stating &ldquo;Affiliate links — we may earn a
            small commission at no extra cost to you&rdquo; in the same section as the links
          </li>
        </ul>
      </Section>

      <Section title="4. Editorial Independence">
        <p>
          Affiliate relationships do <strong className="text-white">not</strong> influence the
          content of Hootling&apos;s taxi fare estimates, tipping guides, scam warnings, or
          blog articles. Fare estimates are calculated from independently maintained rate data
          and Google Maps routing. AI-generated safety content is produced without reference to
          which affiliate partners are shown. We do not accept payment to feature, rank, or
          positively review any partner.
        </p>
        <p className="mt-2">
          Partner selection is based on relevance to the traveller&apos;s query (e.g. airport
          transfer services are shown in the context of a taxi fare result). Partners may be
          enabled or disabled based on service quality, programme terms, and regional relevance
          — not commission rates.
        </p>
      </Section>

      <Section title="5. Your Rights and Choices">
        <p>
          You are under no obligation to click any affiliate link. Clicking a partner link
          simply means you are visiting that partner&apos;s website; no purchase is required
          and no commitment is made on your behalf.
        </p>
        <p className="mt-2">
          If you have declined cookies via our consent banner, the Travelpayouts tracking
          script is not loaded and no affiliate tracking cookies are set in your browser.
          Clicks through our redirect endpoint are still counted in our own server-side
          analytics (partner ID + zone only — no personal data).
        </p>
      </Section>

      <Section title="6. Contact">
        <p>
          Questions about our affiliate relationships:{' '}
          <a href={`mailto:${CONTACT}`} className="text-purple-400 underline">{CONTACT}</a>
        </p>
      </Section>

      <div className="pt-2 border-t border-zinc-800 flex gap-4">
        <Link href="/terms#affiliate" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
          ← Back to Hootling
        </Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
    </div>
  )
}
