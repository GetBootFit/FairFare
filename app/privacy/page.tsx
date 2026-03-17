import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Hootling Privacy Policy — how we handle your data when you use our travel fare and tipping service.',
}

const EFFECTIVE = '7 March 2026'
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
          When you pay $0.99 for a query, you are redirected to a Stripe-hosted checkout page.
          Hootling never sees, handles, or stores your card number, CVC, or banking details.
          Stripe&apos;s data practices are governed by the{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
            className="text-purple-400 underline">Stripe Privacy Policy</a>.
        </p>
        <p className="mt-2">
          After successful payment, Stripe notifies us that a session was completed. We store
          a record that the session ID was used (to prevent token replay), but this record
          contains no personal or financial information.
        </p>

        <h3 className="text-zinc-200 font-medium mt-3 mb-1.5">2d. Browser storage</h3>
        <p>
          We store the following data <strong className="text-white">locally in your browser</strong>:
        </p>
        <ul className="mt-1.5 space-y-1.5 list-disc list-inside">
          <li>
            <strong className="text-zinc-300">localStorage:</strong> A JWT access token (valid
            30 minutes) that grants access to query results. Cleared when you start a new search
            or the token expires.
          </li>
          <li>
            <strong className="text-zinc-300">sessionStorage:</strong> Your form inputs (pickup
            and destination) are temporarily saved before a payment redirect so they can be
            restored when you return. This data is cleared after use.
          </li>
          <li>
            <strong className="text-zinc-300">localStorage (language):</strong> Your selected
            display language preference (e.g. &ldquo;es&rdquo; for Spanish). No personal data.
          </li>
        </ul>
        <p className="mt-2">
          None of this browser-stored data is transmitted to Hootling servers.
        </p>
      </Section>

      <Section title="3. Data We Do Not Collect">
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Name, email address, or any contact information</li>
          <li>Device identifiers, IP address, or fingerprinting data</li>
          <li>Browsing history or cross-site tracking</li>
          <li>Precise GPS location (you type addresses manually)</li>
          <li>Analytics or behavioural tracking cookies</li>
        </ul>
      </Section>

      <Section title="4. Cookies &amp; Analytics">
        <p>
          Hootling does <strong className="text-white">not</strong> use advertising cookies or
          tracking pixels. We use no cookies at all — only browser localStorage and sessionStorage
          as described above, which are not cookies and are not transmitted to any server.
        </p>
        <p className="mt-2">
          We use <strong className="text-zinc-300">Vercel Analytics</strong>, a privacy-first tool
          that does <strong className="text-white">not</strong> use cookies, does not track
          individuals across sites, and collects only aggregate, anonymous data (page URL,
          referrer, country, browser type). No personal data is collected or stored by Vercel
          Analytics, and it is designed to be GDPR-compliant.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p>
          AI query results (scam warnings, tipping guides) are cached on our servers for up to
          7 days to improve performance and reduce costs. These cache entries contain only the
          city/country name and the AI-generated response — no personal data.
        </p>
        <p className="mt-2">
          Payment session records (used/not-used status) are retained for 24 hours to prevent
          token replay attacks, then automatically deleted.
        </p>
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
          Stripe, Vercel) operate, which may have different data protection laws than your country.
        </p>
        <p className="mt-2">
          <strong className="text-zinc-300">Australian users:</strong> Your privacy is protected
          under the <em>Privacy Act 1988</em> (Cth) and the{' '}
          <em>Privacy and Data Protection Act 2014</em> (Vic). Since we do not collect personal
          information as defined under the Act (we collect no names, emails, or persistent
          identifiers), the Australian Privacy Principles have minimal practical application to
          our Service.
        </p>
        <p className="mt-2">
          <strong className="text-zinc-300">EEA &amp; UK users:</strong> You have rights under
          GDPR/UK GDPR including the right to access, rectify, or erase personal data. Since we
          collect no personal data directly, most GDPR rights are satisfied by default.
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
