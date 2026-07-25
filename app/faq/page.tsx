import type { Metadata } from 'next'
import { FaqContent } from '@/components/pages/FaqContent'
import { getUSDPrices } from '@/lib/currency'
import { pageAlternates } from '@/lib/seo-helpers'

const PAGE_URL = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/faq`

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Hootling — free taxi fare checks, accuracy, city coverage, tipping guides, and privacy.',
  alternates: { canonical: PAGE_URL, ...pageAlternates(PAGE_URL) },
}

// JSON-LD schema stays server-side for SEO — uses English source strings
function buildJsonLd() {
  const { single, pass, bundle } = getUSDPrices()
  const p = { single, pass, bundle }
  const faqs = [
    { q: 'Is Hootling free to use?', a: 'Yes — Hootling is currently free. No payment, account, or sign-up required.' },
    { q: 'How does Hootling make money?', a: 'Hootling earns small commissions from optional affiliate links — partner services like airport transfers, hotels, and eSIMs shown after your result. Clicking is entirely optional.' },
    { q: 'How accurate are the fare estimates?', a: 'Calculated from local taxi rates + Google Maps distance. ±15% range applied.' },
    { q: 'Which cities are covered for taxi fares?', a: '160+ cities across every continent.' },
    { q: 'Which countries are covered for tipping?', a: '50+ countries, 6 scenarios each.' },
    { q: 'What are the scam warnings based on?', a: 'Researched and tailored to each city, covering destination-specific patterns. Updated every 90 days.' },
    { q: 'Is there a limit to how many searches I can do?', a: 'No — searches are unlimited and free.' },
    { q: 'Do I need to create an account?', a: 'No accounts, no sign-up, no login.' },
    { q: 'Is my data private?', a: 'No accounts or personal profiles. No GPS tracking. Only the city and country name are sent to our AI provider for scam warnings and tipping advice.' },
    { q: 'Does Hootling track my location?', a: 'No GPS used. Addresses typed manually.' },
    { q: 'What languages is the app available in?', a: '14 languages: English, Spanish, French, German, Portuguese, Italian, Indonesian, Vietnamese, Thai, Simplified Chinese, Traditional Chinese, Japanese, Korean, Hindi.' },
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }} suppressHydrationWarning />
      <FaqContent />
    </>
  )
}
