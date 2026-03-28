/**
 * AI blog post generator.
 *
 * Calls Claude to write a complete BlogPost object for a city not yet covered
 * in the existing 170 posts. Used by the weekly-post cron.
 *
 * Output is staged in KV under `blog:staged:{slug}` and emailed to the admin
 * for approval before going live.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { BlogPost } from '@/lib/blog-posts'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Cities already covered — Claude must NOT pick these ───────────────────────

const COVERED_CITIES = [
  'Bangkok', 'Dubai', 'London', 'Singapore', 'Tokyo', 'Paris', 'Rome', 'Barcelona',
  'Amsterdam', 'Istanbul', 'Bali', 'Phuket', 'Cairo', 'Marrakech', 'Mumbai',
  'New York', 'Ho Chi Minh City', 'Budapest', 'Lisbon', 'Prague', 'Buenos Aires',
  'Mexico City', 'Sydney', 'Kuala Lumpur', 'Seoul', 'Berlin', 'Hong Kong', 'Doha',
  'Abu Dhabi', 'Hanoi', 'Osaka', 'Bogota', 'Lima', 'Phnom Penh', 'Colombo',
  'Havana', 'Warsaw', 'Stockholm', 'Copenhagen', 'Zurich', 'Tel Aviv', 'Nairobi',
  'Johannesburg', 'Cape Town', 'Rio de Janeiro', 'Jakarta', 'Manila', 'Phuket',
]

// ── Prompt ────────────────────────────────────────────────────────────────────

function buildPrompt(weekNumber: number): string {
  const year = new Date().getFullYear()
  const coveredList = COVERED_CITIES.join(', ')

  return `You are writing a high-quality travel blog post for Hootling — a taxi fare and tipping app.

TASK: Generate a complete blog post about taxi costs in a city that is popular with international tourists and NOT yet covered.

Already covered cities (DO NOT pick these): ${coveredList}

Pick ONE uncovered city that meets all of these criteria:
1. Popular international tourist destination with significant annual visitor numbers
2. Taxis are a primary transport mode (not just ride-hailing)
3. Meaningful variation in fares worth explaining (airport routes, scams, meter vs flat rate)
4. Interesting enough that a traveller would search "taxi cost in [city]"

Good uncovered candidates: Vienna, Milan, Florence, Dublin, Edinburgh, Tbilisi, Kathmandu, Chiang Mai, Cancun, Medellin, Santiago, Oman/Muscat, Amman, Casablanca, Addis Ababa, Reykjavik, Krakow, Taipei, Busan, Chennai, Guadalajara, Panama City

Return ONLY valid JSON — no markdown, no explanation, no code fences. The JSON must exactly match this TypeScript interface:

{
  "slug": "<kebab-case: how-much-does-a-taxi-cost-in-[city-name]>",
  "title": "How Much Does a Taxi Cost in [City]? (${year} Fare Guide)",
  "description": "<One sentence, 20-30 words. Include: city, actual fare range or typical fare, key hook (scam warning / meter info / airport note). Mention ${year}.>",
  "publishedAt": "${new Date().toISOString().slice(0, 10)}",
  "readingMinutes": 7,
  "category": "taxi",
  "city": "<City name, title case>",
  "country": "<Country name, title case>",
  "citySlug": "<lowercase-hyphenated city name>",
  "countrySlug": "<lowercase-hyphenated country name>",
  "content": [
    {
      "type": "intro",
      "body": "<2-3 sentences. Lead with the key fare fact. Set context for why fares vary. Tone: friendly, direct, no fluff.>"
    },
    {
      "type": "h2",
      "heading": "Taxi Meter Rates (${year})"
    },
    {
      "type": "table",
      "rows": [
        { "label": "Flag fall", "value": "<local currency amount>" },
        { "label": "Per km", "value": "<local currency amount>" },
        { "label": "Minimum fare", "value": "<local currency amount>" },
        { "label": "Night surcharge", "value": "<% or fixed amount, or 'None'>" },
        { "label": "Airport surcharge", "value": "<amount or 'None'>" }
      ]
    },
    {
      "type": "h2",
      "heading": "Sample Fares from the Airport"
    },
    {
      "type": "table",
      "rows": [
        { "label": "<Airport code or name> → City centre", "value": "<fare range in local currency>" },
        { "label": "<Airport> → [Major hotel district]", "value": "<fare range>" },
        { "label": "<Airport> → [Another district]", "value": "<fare range>" }
      ]
    },
    {
      "type": "h2",
      "heading": "Ride-Hailing vs Taxi"
    },
    {
      "type": "p",
      "body": "<2-3 sentences comparing Uber/Grab/local apps vs metered taxis. Name the actual apps available in this city. Be specific about price differences.>"
    },
    {
      "type": "tip",
      "body": "<One concrete, actionable tip specific to this city. E.g. 'In [City], taxis from the official rank at Terminal 2 are 20-30% cheaper than touts in arrivals.'>"
    },
    {
      "type": "h2",
      "heading": "Scam Warnings"
    },
    {
      "type": "ul",
      "items": [
        "<Scam warning 1 — specific to this city, under 25 words>",
        "<Scam warning 2 — different type of scam, specific>",
        "<Scam warning 3 — specific>"
      ]
    },
    {
      "type": "warning",
      "body": "<The single most important scam or safety warning for this city. Specific and actionable.>"
    },
    {
      "type": "h2",
      "heading": "How Much Should You Tip?"
    },
    {
      "type": "p",
      "body": "<2 sentences on tipping customs for taxis in this country. Include whether it is expected and the typical amount or percentage.>"
    },
    {
      "type": "faq",
      "faqs": [
        {
          "q": "How much does a taxi from [airport] to [city centre] cost in ${year}?",
          "a": "<Specific answer with fare range and key variables (traffic, time of day, luggage). Under 40 words.>"
        },
        {
          "q": "Is Uber available in [City]?",
          "a": "<Specific answer: yes/no/limited + which apps work + rough price comparison to taxis. Under 40 words.>"
        },
        {
          "q": "How do I avoid getting overcharged in a [City] taxi?",
          "a": "<3 specific, actionable tips. Under 50 words.>"
        }
      ]
    }
  ]
}

Rules:
- All fares must be real, researched, accurate for ${year}. Do not invent numbers.
- Use local currency throughout (not USD conversions — those go stale).
- City and country slugs must be lowercase-hyphenated (e.g. kuala-lumpur, czech-republic).
- Slug must start with "how-much-does-a-taxi-cost-in-".
- Content must be genuinely useful — specific route fares, named apps, real scam patterns.
- Do not mention Hootling in the body content.
- Week seed: ${weekNumber} — use this to vary your city choice across weeks.`
}

// ── Generator ─────────────────────────────────────────────────────────────────

export interface GeneratorResult {
  post: BlogPost
  rawJson: string
}

export async function generateBlogPost(weekNumber: number): Promise<GeneratorResult> {
  const prompt = buildPrompt(weekNumber)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const rawJson = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const post = JSON.parse(rawJson) as BlogPost

  // Basic validation
  if (!post.slug || !post.title || !post.content?.length) {
    throw new Error(`Invalid post structure generated for week ${weekNumber}`)
  }

  return { post, rawJson }
}

// ── Week number helper ────────────────────────────────────────────────────────

/** Returns the ISO week number for a given date. */
export function getIsoWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
