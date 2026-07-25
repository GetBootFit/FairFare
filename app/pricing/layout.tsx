import type { Metadata } from 'next'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Pricing — Hootling',
  description: 'Simple, transparent pricing for taxi fare checks and tipping guides. Single query from $2.99 — no account required.',
  alternates: { canonical: `${APP_URL}/pricing` },
  robots: process.env.NEXT_PUBLIC_PAYWALL_ENABLED === 'false'
    ? { index: false, follow: false }
    : { index: true, follow: true },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
