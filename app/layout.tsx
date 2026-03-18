import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { BottomNav } from '@/components/BottomNav'
import { LanguageProvider } from '@/context/LanguageContext'
import { HtmlLangUpdater } from '@/components/HtmlLangUpdater'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Hootling — Travel wise, pay right',
    template: '%s | Hootling',
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
    'hootling',
    'how much does a taxi cost',
    'tipping etiquette',
  ],
  alternates: {
    canonical: APP_URL,
    languages: {
      'en': APP_URL,
      'es': APP_URL,
      'fr': APP_URL,
      'de': APP_URL,
      'pt': APP_URL,
      'zh': APP_URL,
      'ja': APP_URL,
      'ko': APP_URL,
      'hi': APP_URL,
      'it': APP_URL,
      'id': APP_URL,
      'vi': APP_URL,
      'th': APP_URL,
      'zh-TW': APP_URL,
      'x-default': APP_URL,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/brand/hootling-logo-icon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Hootling' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Hootling',
    title: 'Hootling — Travel wise, pay right',
    description: 'Instant taxi fare checks and tipping guides for international travellers.',
    images: [
      {
        url: '/images/og/hootling-og-1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Hootling — Instant taxi fare checks and tipping guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@TheHootling',
    title: 'Hootling — Travel wise, pay right',
    description: 'Instant taxi fare checks and tipping guides for international travellers.',
    images: ['/images/og/hootling-og-1200x630.png'],
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
  // maximumScale and userScalable intentionally omitted — pinch-to-zoom must
  // remain available for accessibility (WCAG 1.4.4 Resize Text, Level AA).
  themeColor: '#18181b',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hootling',
  url: APP_URL,
  description: 'Instant taxi fare checks and tipping guides for international travellers. Know the fair price, avoid scams, and tip correctly — anywhere in the world.',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0.99',
    priceCurrency: 'USD',
    description: 'Single query — no subscription required',
  },
  creator: {
    '@type': 'Organization',
    name: 'Hootling',
    url: APP_URL,
  },
  sameAs: [
    'https://twitter.com/TheHootling',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <head>
        {/* Safari Pinned Tab / mask-icon — must be a single-colour SVG */}
        <link rel="mask-icon" href="/images/brand/hootling-logo-icon-mono.svg" color="#7c3aed" />
        {/* Preconnect to external domains to reduce DNS + TLS handshake latency */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        {GA4_ID && <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />}
      </head>
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        {/* Skip-to-main-content — visually hidden until focused by keyboard users.
            Satisfies WCAG 2.4.1 (Bypass Blocks) Level A. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <HtmlLangUpdater />
          {/* id + tabIndex={-1} allows the skip link to move focus here programmatically. */}
          <main id="main-content" tabIndex={-1} className="max-w-md mx-auto min-h-screen pb-24 px-4 pt-6 focus:outline-none">
            {children}
          </main>
          <BottomNav />
        </LanguageProvider>
        <ServiceWorkerRegistration />
        <Analytics />
        {/* Google Analytics 4 — add NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX to .env.local
            Cookieless mode: client_storage='none' disables _ga/_ga_* cookie writes.
            Page-view events are still sent. No cookie consent banner required under GDPR
            as long as this config remains in place. If you re-enable client_storage,
            a cookie consent mechanism is required before GA initialises. */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', {
                page_path: window.location.pathname,
                client_storage: 'none',
                anonymize_ip: true
              });
            `}</Script>
          </>
        )}
      </body>
    </html>
  )
}
