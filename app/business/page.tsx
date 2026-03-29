import type { Metadata } from 'next'
import { BusinessContent } from '@/components/pages/BusinessContent'
import { pageAlternates } from '@/lib/seo-helpers'

const PAGE_URL = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com'}/business`

export const metadata: Metadata = {
  title: 'Business & API Access | Hootling',
  description:
    'Integrate Hootling taxi fare data and tipping guides into your travel platform, app, or publication. API access, white-label, and data licensing available.',
  alternates: { canonical: PAGE_URL, ...pageAlternates(PAGE_URL) },
}

export default function BusinessPage() {
  return <BusinessContent />
}
