import type { Metadata } from 'next'
import { ExampleContent } from '@/components/ExampleContent'
import { ExampleHeader } from '@/components/ExampleHeader'
import { ExampleFooter } from '@/components/ExampleFooter'

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

  return (
    <div className="space-y-5 pb-8">
      <ExampleHeader />
      <ExampleContent sampleMapUrl={sampleMapUrl} />
      <ExampleFooter />
    </div>
  )
}
