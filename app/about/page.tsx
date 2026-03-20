import type { Metadata } from 'next'
import { AboutContent } from '@/components/pages/AboutContent'
import { pageAlternates } from '@/lib/seo-helpers'

const PAGE_URL = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/about`

export const metadata: Metadata = {
  title: 'About Hootling | Travel wise.',
  description: 'Learn how Hootling helps international travellers get fair taxi prices and tipping guidance — powered by Google Maps and Anthropic Claude.',
  alternates: { canonical: PAGE_URL, ...pageAlternates(PAGE_URL) },
}

export default function AboutPage() {
  return <AboutContent />
}
