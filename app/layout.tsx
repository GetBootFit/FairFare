import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BottomNav } from '@/components/BottomNav'
import { LanguageProvider } from '@/context/LanguageContext'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const APP_URL = 'https://fairfare.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'FairFare — Know before you go',
    template: '%s | FairFare',
  },
  description:
    'Instant taxi fare checks and tipping guides for international travellers. Know the fair price, avoid scams, and tip correctly — anywhere in the world.',
  keywords: [
    'taxi fare',
    'tipping guide',
    'travel',
    'taxi price estimate',
    'international travel',
    'taxi scam warning',
    'tip calculator',
    'travel app',
  ],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'FairFare' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'FairFare',
    title: 'FairFare — Know before you go',
    description: 'Instant taxi fare checks and tipping guides for international travellers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FairFare — Instant taxi fare checks and tipping guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FairFare — Know before you go',
    description: 'Instant taxi fare checks and tipping guides for international travellers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FairFare',
  url: APP_URL,
  description: 'Instant taxi fare checks and tipping guides for international travellers.',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0.99',
    priceCurrency: 'USD',
    description: 'Per query — no subscription required',
  },
  creator: {
    '@type': 'Organization',
    name: 'FairFare',
    url: APP_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <main className="max-w-md mx-auto min-h-screen pb-24 px-4 pt-6">
            {children}
          </main>
          <BottomNav />
        </LanguageProvider>
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  )
}
