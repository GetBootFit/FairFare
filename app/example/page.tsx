import type { Metadata } from 'next'
import { ExampleContent } from '@/components/ExampleContent'
import { ExampleHeader } from '@/components/ExampleHeader'
import { ExampleFooter } from '@/components/ExampleFooter'
import { AffiliateBlock } from '@/components/AffiliateBlock'
import { getPartnersForZoneSync } from '@/lib/affiliates'

export const metadata: Metadata = {
  title: 'See a Sample Result — Hootling',
  description:
    'See exactly what you get with Hootling — a real sample taxi fare result and tipping guide before you pay.',
  alternates: { canonical: 'https://www.hootling.com/example' },
  openGraph: {
    title: 'Sample Result — Hootling',
    description: 'See a real taxi fare result and tipping guide before you pay.',
    url: 'https://www.hootling.com/example',
  },
}

export default function ExamplePage() {
  // The actual Google Static Maps request is proxied server-side by /api/maps/static,
  // so the API key is never sent to the browser and HTTP referrer restrictions don't apply.
  const sampleMapUrl = '/api/maps/static?sample=bkk'

  // Bangkok transfer partners — contextualised to the sample route (BKK → Sukhumvit).
  // Uses sync variant (no KV) since the example page is statically rendered.
  // Capped at 2: shows the top two global transfer options without overwhelming.
  const examplePartners = getPartnersForZoneSync('result', {
    categories: ['transfer'],
    isoCountry: 'TH',
    maxItems: 2,
  })

  return (
    <div className="space-y-5 pb-8">
      <ExampleHeader />
      <ExampleContent sampleMapUrl={sampleMapUrl} />

      {/* Affiliate block — shown pre-payment, contextualised to the Bangkok sample result.
          Visitor is actively evaluating the product, has seen what a real result looks like,
          and hasn't been asked for money yet. A transfer option is the most natural complement
          to a taxi fare result. Zone='result' so it mirrors exactly what paying users see. */}
      {examplePartners.length > 0 && (
        <AffiliateBlock
          partners={examplePartners}
          zone="result"
          city="Bangkok"
          country="Thailand"
          isoCountry="TH"
          tint="teal"
          headingKey="affiliate_plan_trip"
          headingDestination="Bangkok"
        />
      )}

      <ExampleFooter />
    </div>
  )
}
