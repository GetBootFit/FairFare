import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Hootling Refund Policy — our policy on refunds and remedies for digital travel information purchases.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/refund` },
}

const EFFECTIVE = '28 March 2026'
const CONTACT = 'legal@hootling.com'

export default function RefundPage() {
  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <Image src="/images/owl/expressions/owl-curious.svg" alt="Hootling" width={40} height={40} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Refund Policy</h1>
          <p className="text-xs text-zinc-500 mt-1">Effective {EFFECTIVE}</p>
        </div>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">
        This Refund Policy supplements our{' '}
        <Link href="/terms" className="text-purple-400 underline">Terms of Service</Link> and
        explains the circumstances under which Hootling may provide a refund or remedy for
        a purchase made on the Service.
      </p>

      <Section title="1. General Policy — No Refunds for Delivered Results">
        <p>
          Hootling sells digital information products (taxi fare estimates and tipping guides)
          that are delivered instantly upon payment. Because the full result is made available
          immediately after purchase, <strong className="text-white">all sales are final by default</strong>.
        </p>
        <p className="mt-2">
          By proceeding to checkout, you acknowledge that you are purchasing a digital product
          that will be delivered immediately, and you consent to the immediate delivery of that
          digital content. Under the{' '}
          <strong className="text-zinc-300">Australian Consumer Law</strong>, you retain all
          statutory consumer rights that cannot be excluded by contract.
        </p>
      </Section>

      <Section title="2. When We Will Provide a Refund or Remedy">
        <p>We will review refund or remedy requests in the following circumstances:</p>
        <ul className="mt-2 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-zinc-300">Technical failure:</strong> Your payment was
            processed successfully but no result was delivered and no access token was issued
            due to a technical error on our side.
          </li>
          <li>
            <strong className="text-zinc-300">Double charge:</strong> You were charged more
            than once for the same purchase due to a payment processing error.
          </li>
          <li>
            <strong className="text-zinc-300">Incorrect product delivered:</strong> You purchased
            a DayPass for one country but the system issued an entitlement for a different
            country.
          </li>
          <li>
            <strong className="text-zinc-300">Statutory consumer guarantee:</strong> Where
            required by applicable consumer protection law (including the Australian Consumer
            Law and the EU Consumer Rights Directive), you are entitled to a remedy (repair,
            replacement, or refund) where the service does not meet a consumer guarantee.
          </li>
        </ul>
        <p className="mt-2">
          Refunds are <strong className="text-white">not</strong> provided on the basis that:
        </p>
        <ul className="mt-1.5 space-y-1 list-disc list-inside">
          <li>The fare estimate differed from the actual fare charged by the driver</li>
          <li>You changed your travel plans after purchase</li>
          <li>You purchased the wrong product (e.g. DayPass for the wrong country)</li>
          <li>The result was generated for a city not in our database (an estimate is still provided)</li>
        </ul>
      </Section>

      <Section title="3. EU / UK Consumer Rights">
        <p>
          If you are a consumer resident in the European Economic Area (EEA) or the United
          Kingdom, you ordinarily have a statutory{' '}
          <strong className="text-zinc-300">14-day right of withdrawal</strong> from a distance
          contract. However, under the EU Consumer Rights Directive (Article 16(m)) and the
          equivalent UK Consumer Contracts Regulations, the right of withdrawal does not apply
          to digital content where:
        </p>
        <ul className="mt-1.5 space-y-1 list-disc list-inside">
          <li>The content has already been delivered, and</li>
          <li>You gave explicit consent to immediate delivery before the withdrawal period expired, and</li>
          <li>You acknowledged that you would lose your right of withdrawal upon delivery</li>
        </ul>
        <p className="mt-2">
          By completing checkout and requesting immediate delivery of your query result, you
          provide this explicit consent. If, however, a technical failure means you did not
          receive the digital content, your right of withdrawal is unaffected and a full
          refund will be issued.
        </p>
      </Section>

      <Section title="4. Australian Consumer Guarantees">
        <p>
          Nothing in this policy limits any guarantee, right, or remedy available to you under
          the <strong className="text-zinc-300">Australian Consumer Law</strong> (Schedule 2 of
          the Competition and Consumer Act 2010 (Cth)). Under Australian Consumer Law, you are
          entitled to a refund, repair, or replacement where a service fails to meet a consumer
          guarantee, regardless of any terms to the contrary.
        </p>
      </Section>

      <Section title="5. How to Request a Refund">
        <p>
          To request a refund or remedy, email us at{' '}
          <a href={`mailto:${CONTACT}`} className="text-purple-400 underline">{CONTACT}</a>{' '}
          with:
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>The email address used at checkout (if you subscribed)</li>
          <li>The approximate date and time of purchase</li>
          <li>A description of the issue you experienced</li>
          <li>Your Stripe payment confirmation or receipt number (if available)</li>
        </ul>
        <p className="mt-2">
          We aim to respond within <strong className="text-white">5 business days</strong>. If
          a refund is approved, it will be processed via Stripe to your original payment method.
          Stripe typically takes 5–10 business days to return funds to your bank or card.
        </p>
      </Section>

      <Section title="6. Contact">
        <p>
          Refund enquiries:{' '}
          <a href={`mailto:${CONTACT}`} className="text-purple-400 underline">{CONTACT}</a>
        </p>
        <p className="mt-2">
          For disputes not resolved informally, see the Dispute Resolution section of our{' '}
          <Link href="/terms" className="text-purple-400 underline">Terms of Service</Link>.
        </p>
      </Section>

      <div className="pt-2 border-t border-zinc-800">
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
