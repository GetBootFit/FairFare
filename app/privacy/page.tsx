import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Hootling Privacy Policy — how we handle your data when you use our travel fare and tipping service.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/privacy` },
}

const EFFECTIVE = '23 March 2026'
const CONTACT = 'privacy@hootling.com'

export default function PrivacyPage() {
  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <Image src="/images/owl/expressions/owl-curious.svg" alt="Hootling" width={40} height={40} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
          <p className="text-xs text-zinc-500 mt-1">Effective {EFFECTIVE}</p>
        </div>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">
        Hootling (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is operated from Victoria, Australia and
        is committed to protecting your privacy. This policy explains what data we collect, why
        we collect it, and how it is handled when you use the Hootling service. This policy is
        governed by the <em>Privacy Act 1988</em> (Cth) and the{' '}
        <em>Privacy and Data Protection Act 2014</em> (Vic).
      </p>

      <Section title="1. Summary">
        <ul className="space-y-1.5 list-disc list-inside">
          <li>We do <strong className="text-white">not</strong> create user accounts or store personal profiles</li>
          <li>We do <strong className="text-white">not</strong> store your payment card details</li>
          <li>We do <strong className="text-white">not</strong> sell or share your data with advertisers</li>
          <li>Query results and access tokens are stored locally in your browser only</li>
          <li>Location inputs you type are sent to Google Maps to calculate routes</li>
          <li>City and country data is sent to Anthropic to generate travel guidance</li>
          <li>If you subscribe to our mailing list, your email address is collected and stored with Resend</li>
          <li>An affiliate tracking script (Travelpayouts) loads on every page — see section 4</li>
        </ul>
      </Section>

      <Section title="2. Data We Collect">
        <h3 className="text-zinc-200 font-medium mb-1.5">2a. Location queries</h3>
        <p>
          When you enter a pickup and destination address, those addresses are transmitted to
          Google Maps Platform APIs (Distance Matrix, Directions, Places) to calculate route
          distance and duration. Google&apos;s use of this data is governed by the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
            className="text-purple-400 underline">Google Privacy Policy</a>.
        </p>

        <h3 className="text-zinc-200 font-medium mt-3 mb-1.5">2b. City and country</h3>
        <p>
          The city and country of your pickup location (e.g. &ldquo;Bangkok, Thailand&rdquo;)
          is sent to Anthropic&apos;s Claude API to generate taxi scam warnings, tipping
          recommendations, and driver phrases. No address-level detail is sent — only the
          city and country name. Anthropic&apos;s use of data is governed by the{' '}
          <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer"
            className="text-purple-400 underline">Anthropic Privacy Policy</a>.
        </p>

        <h3 className="text-zinc-200 font-medium mt-3 mb-1.5">2c. Payment information</h3>
        <p>
          When you make a purchase, you are redirected to a Stripe-hosted checkout page.
          Hootling never sees, handles, or stores your card number, CVC, or banking details.
          Stripe&apos;s data practices are governed by the{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
            className="text-purple-400 underline">Stripe Privacy Policy</a>.
        </p>
        <p className="mt-2">
          After successful payment, Stripe notifies us that a session was completed. We store
          a record that the session ID was used (to prevent token replay). This record contains
          no personal or financial information and is retained for up to 90 days before being
          automatically deleted.
        </p>

        <h3 className="text-zinc-200 font-medium mt-3 mb-1.5">2d. Email address (optional)</h3>
        <p>
          After completing a purchase, you may optionally subscribe to the Hootling mailing list.
          If you subscribe, your email address is collected and stored by{' '}
          <strong className="text-zinc-300">Resend</strong> (our email service provider).
          We use your email to send you travel tips, product updates, and occasional promotional
          content. You can unsubscribe at any time via the link in any email or at{' '}
          <Link href="/unsubscribe" className="text-purple-400 underline">hootling.com/unsubscribe</Link>.
          Resend&apos;s data practices are governed by the{' '}
          <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer"
            className="text-purple-400 underline">Resend Privacy Policy</a>.
        </p>

        <h3 className="text-zinc-200 font-medium mt-3 mb-1.5">2e. Browser storage</h3>
        <p>
          We store the following data <strong className="text-white">locally in your browser</strong>:
        </p>
        <ul className="mt-1.5 space-y-1.5 list-disc list-inside">
          <li>
            <strong className="text-zinc-300">localStorage:</strong> JWT access tokens that
            grant access to query results. Tokens expire automatically (30 minutes for single
            queries, 24 hours for country passes, 90 days for bundle tokens).
          </li>
          <li>
            <strong className="text-zinc-300">sessionStorage:</strong> Your form inputs (pickup
            and destination) are temporarily saved before a payment redirect so they can be
            restored when you return. This data is cleared after use.
          </li>
          <li>
            <strong className="text-zinc-300">localStorage (language/currency):</strong> Your
            selected display language and currency preference. No personal data.
          </li>
        </ul>
        <p className="mt-2">
          None of this browser-stored data is transmitted to Hootling servers.
        </p>
      </Section>

      <Section title="3. Data We Do Not Collect">
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Payment card details, CVC, or banking information</li>
          <li>Device identifiers or fingerprinting data</li>
          <li>Browsing history or cross-site tracking</li>
          <li>Precise GPS location (you type addresses manually)</li>
          <li>Email address (unless you explicitly opt in to our mailing list)</li>
        </ul>
      </Section>

      <Section title="4. Cookies, Analytics &amp; Third-Party Scripts">
        <h3 className="text-zinc-200 font-medium mb-1.5">Vercel Analytics</h3>
        <p>
          We use <strong className="text-zinc-300">Vercel Analytics</strong>, a privacy-first tool
          that does <strong className="text-white">not</strong> use cookies, does not track
          individuals across sites, and collects only aggregate, anonymous data (page URL,
          referrer, country, browser type). No personal data is collected or stored.
        </p>

        <h3 className="text-zinc-200 font-medium mt-3 mb-1.5">Google Analytics (GA4)</h3>
        <p>
          We use Google Analytics 4 in cookieless mode (<code className="text-zinc-500">client_storage=&apos;none&apos;</code>),
          which disables cookies and prevents cross-site tracking. Aggregate usage data (page
          views, session duration, device type) is collected to understand how the Service is used.
        </p>

        <h3 className="text-zinc-200 font-medium mt-3 mb-1.5">Travelpayouts Affiliate Tracking</h3>
        <p>
          We participate in the Travelpayouts affiliate programme. A tracking script from
          Travelpayouts (<code className="text-zinc-500">tpembars.com</code>) loads on every
          page of the Service. This script may set cookies or collect data for the purpose of
          attributing affiliate commissions when you click on partner links (such as airport
          transfer services). This tracking is subject to the{' '}
          <a href="https://www.travelpayouts.com/en/privacy" target="_blank" rel="noopener noreferrer"
            className="text-purple-400 underline">Travelpayouts Privacy Policy</a>.
        </p>
        <p className="mt-2">
          We do not use advertising cookies or sell your data to advertisers.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <ul className="space-y-1.5 list-disc list-inside">
          <li>
            <strong className="text-zinc-300">AI query results</strong> (scam warnings, tipping
            guides) are cached on our servers for up to{' '}
            <strong className="text-white">90 days</strong> to improve performance and reduce
            costs. These entries contain only the city/country name and the AI response — no
            personal data.
          </li>
          <li>
            <strong className="text-zinc-300">Payment session records</strong> (used/not-used
            status for replay prevention) are retained for up to{' '}
            <strong className="text-white">90 days</strong>, then automatically deleted.
          </li>
          <li>
            <strong className="text-zinc-300">Email addresses</strong> are retained for as long
            as you remain subscribed. You may request deletion at any time by unsubscribing or
            contacting us.
          </li>
        </ul>
      </Section>

      <Section title="6. Children's Privacy">
        <p>
          Hootling is not directed to children under the age of 13. We do not knowingly collect
          any information from children. If you believe a child has used the Service and provided
          any personal information, please contact us and we will take steps to remove it.
        </p>
      </Section>

      <Section title="7. International Users &amp; Your Rights">
        <p>
          Hootling is designed for international travellers and is accessible worldwide. By
          using the Service, you acknowledge that data (such as your location query and city
          name) may be processed in countries where our third-party providers (Google, Anthropic,
          Stripe, Vercel, Resend, Travelpayouts) operate, which may have different data protection
          laws than your country.
        </p>
        <p className="mt-2">
          <strong className="text-zinc-300">Australian users:</strong> Your privacy is protected
          under the <em>Privacy Act 1988</em> (Cth) and the{' '}
          <em>Privacy and Data Protection Act 2014</em> (Vic). You have the right to access,
          correct, or request deletion of any personal information we hold about you (which is
          limited to your email address if you have subscribed).
        </p>
        <p className="mt-2">
          <strong className="text-zinc-300">EEA &amp; UK users:</strong> You have rights under
          GDPR/UK GDPR including the right to access, rectify, erase, or port your personal data,
          and to object to processing. To exercise any right, contact us at the address below.
        </p>
        <p className="mt-2">
          <strong className="text-zinc-300">California users:</strong> You have rights under the
          CCPA including the right to know what personal information is collected, to request
          deletion, and to opt out of sale. We do not sell personal information.
        </p>
        <p className="mt-2">
          For any privacy enquiry or data subject request, contact us at{' '}
          <a href={`mailto:${CONTACT}`} className="text-purple-400 underline">{CONTACT}</a>.
          We aim to respond within 30 days.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this policy periodically. The &ldquo;Effective&rdquo; date at the top
          reflects the most recent update. Significant changes will be noted on the Service.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Privacy questions or requests:{' '}
          <a href={`mailto:${CONTACT}`} className="text-purple-400 underline">{CONTACT}</a>
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
