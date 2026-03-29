import { MetadataRoute } from 'next'

// Block private API routes but allow OG image generation (needed for search previews)
const DISALLOW = ['/api/', '/admin', '/success']
const ALLOW_OG = ['/api/og/']  // OG images must be crawlable for rich results

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow everything except private routes; explicitly allow OG images
      {
        userAgent: '*',
        allow: [...ALLOW_OG, '/'],
        disallow: DISALLOW,
      },
      // Explicitly allow major AI / LLM crawlers
      // These are sometimes blocked by blanket rules — we want them indexed
      { userAgent: 'GPTBot',            allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // OpenAI / ChatGPT
      { userAgent: 'ChatGPT-User',      allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // ChatGPT browsing plugin
      { userAgent: 'anthropic-ai',      allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Claude / Anthropic
      { userAgent: 'ClaudeBot',         allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Claude crawler
      { userAgent: 'PerplexityBot',     allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Perplexity AI
      { userAgent: 'Googlebot',         allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Google Search + Gemini grounding
      { userAgent: 'Bingbot',           allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Bing + Microsoft Copilot
      { userAgent: 'Applebot',          allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Apple Intelligence / Spotlight
      { userAgent: 'Applebot-Extended', allow: [...ALLOW_OG, '/'], disallow: DISALLOW },
      { userAgent: 'cohere-ai',         allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Cohere Command
      { userAgent: 'CCBot',             allow: [...ALLOW_OG, '/'], disallow: DISALLOW }, // Common Crawl
    ],
    sitemap: 'https://www.hootling.com/sitemap.xml',
    host: 'https://www.hootling.com',
  }
}
