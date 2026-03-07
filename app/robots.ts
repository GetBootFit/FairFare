import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow everything except private API routes
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      // Explicitly allow major AI / LLM crawlers
      // These are sometimes blocked by blanket rules — we want them indexed
      {
        userAgent: 'GPTBot',           // OpenAI / ChatGPT
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'ChatGPT-User',     // ChatGPT browsing plugin
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'anthropic-ai',     // Claude / Anthropic
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'ClaudeBot',        // Claude crawler
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'PerplexityBot',    // Perplexity AI
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'Googlebot',        // Google Search + Gemini grounding
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'Bingbot',          // Bing + Microsoft Copilot
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'Applebot',         // Apple Intelligence / Spotlight
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'cohere-ai',        // Cohere Command
        allow: '/',
        disallow: ['/api/', '/success'],
      },
      {
        userAgent: 'CCBot',            // Common Crawl (used by many AI training sets)
        allow: '/',
        disallow: ['/api/', '/success'],
      },
    ],
    sitemap: 'https://fairfare.app/sitemap.xml',
    host: 'https://fairfare.app',
  }
}
