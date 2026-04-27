import { MetadataRoute } from 'next'

// Block specific private API paths — more precise than blanket /api/ which
// was overriding the Allow: /api/og/ rule and blocking OG images in GSC.
// /api/og/ is intentionally NOT blocked — OG images must be crawlable for rich results.
const DISALLOW = [
  '/api/affiliate/',
  '/api/payment/',
  '/api/taxi/',
  '/api/tipping/',
  '/api/monitoring',
  '/api/webhook',
  '/api/email/',
  '/api/translate/',
  '/api/maps/',
  '/api/admin/',
  '/admin',
  '/success',
  // Static assets — not pages, keep out of GSC "crawled not indexed" noise
  '/favicon.ico',
  '/manifest.json',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow everything except private routes
      {
        userAgent: '*',
        allow: ['/'],
        disallow: DISALLOW,
      },
      // Explicitly allow major AI / LLM crawlers
      // These are sometimes blocked by blanket rules — we want them indexed
      { userAgent: 'GPTBot',            allow: ['/'], disallow: DISALLOW }, // OpenAI / ChatGPT
      { userAgent: 'ChatGPT-User',      allow: ['/'], disallow: DISALLOW }, // ChatGPT browsing plugin
      { userAgent: 'anthropic-ai',      allow: ['/'], disallow: DISALLOW }, // Claude / Anthropic
      { userAgent: 'ClaudeBot',         allow: ['/'], disallow: DISALLOW }, // Claude crawler
      { userAgent: 'PerplexityBot',     allow: ['/'], disallow: DISALLOW }, // Perplexity AI
      { userAgent: 'Googlebot',         allow: ['/'], disallow: DISALLOW }, // Google Search + Gemini grounding
      { userAgent: 'Bingbot',           allow: ['/'], disallow: DISALLOW }, // Bing + Microsoft Copilot
      { userAgent: 'Applebot',          allow: ['/'], disallow: DISALLOW }, // Apple Intelligence / Spotlight
      { userAgent: 'Applebot-Extended', allow: ['/'], disallow: DISALLOW },
      { userAgent: 'cohere-ai',         allow: ['/'], disallow: DISALLOW }, // Cohere Command
      { userAgent: 'CCBot',             allow: ['/'], disallow: DISALLOW }, // Common Crawl
    ],
    sitemap: 'https://www.hootling.com/sitemap.xml',
    host: 'https://www.hootling.com',
  }
}
