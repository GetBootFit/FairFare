import Anthropic from '@anthropic-ai/sdk'
import { kvGet, kvSet } from '@/lib/kv'
import { getUSDPrices } from '@/lib/currency'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
// 365 days — safe because CONTENT_VERSION in the KV key forces a full refresh
// whenever English source content is edited. No need for a shorter TTL.
const KV_TTL = 365 * 24 * 60 * 60

/**
 * Bump this string any time the English source content changes.
 * The version is embedded in every KV key, so old translations are
 * automatically abandoned (they expire after 90 days) and fresh
 * translations are generated on the next visitor request per language.
 *
 * Format: 'vYYYYMMDD' — e.g. 'v20260320' for 20 March 2026.
 */
const CONTENT_VERSION = 'v20260320'

const LOCALE_LANGUAGE: Record<string, string> = {
  ar: 'Arabic',
  es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese (Brazilian)',
  it: 'Italian', id: 'Indonesian', vi: 'Vietnamese', th: 'Thai',
  zh: 'Simplified Chinese', tw: 'Traditional Chinese', ja: 'Japanese',
  ko: 'Korean', hi: 'Hindi',
}

// ── Page content definitions (English source strings) ─────────────────────────

function getAboutContent() {
  const { single } = getUSDPrices()
  return {
    header_subtitle: 'Hootling gives travellers the confidence to jump in any taxi, anywhere in the world — without getting ripped off or undertipping.',
    why_heading: 'Why it exists',
    why_para1: "Arriving in a new city after a long flight is stressful enough. Negotiating with a taxi driver when you don't know the local fare, don't speak the language, and can't tell a fair price from a tourist trap is worse. Travellers get ripped off every day in cities all over the world — overcharged fares, rigged meters, unofficial \"taxis\" with no accountability.",
    why_para2: "Hootling was built to fix that. The name combines the wisdom of the owl with the English diminutive \"-ling\" — a baby owl, curious and wide-eyed, exploring the world for the first time, just like every traveller in a new city. Our mascot is Hootling: a baby owl with golden yellow feathers, a teal backpack, and big curious teal eyes. He's been everywhere — and he always knows the fair price.",
    why_para3: `Hootling solves the taxi problem in under five seconds, from ${single}. Real meter rate data sourced from local taxi authorities. AI-powered scam warnings from Anthropic Claude. 120+ cities, 50+ countries. No subscription.`,
    what_heading: 'What it does',
    feature_taxi_title: 'Taxi Fare Check',
    feature_taxi_desc: 'Enter your pickup and destination to get a fair price range, city-specific scam warnings, and the local phrase to confirm the fare before you get in.',
    feature_tipping_title: 'Tipping Guide',
    feature_tipping_desc: "Choose a country to see tipping norms for restaurants, taxis, hotel porters, bars, tour guides, and delivery — with clear 'expected / optional / avoid' ratings.",
    how_heading: 'How it works',
    step1_title: 'Enter your route or country',
    step1_desc: 'Type your pickup and destination for a taxi check, or pick a country for a tipping guide. Autocomplete makes it fast.',
    step2_title: 'See the free preview',
    step2_desc: "Route distance and travel time load instantly — no payment needed to check you've entered the right locations.",
    step3_title: `Unlock from ${single}`,
    step3_desc: 'Pay once with card, Apple Pay, or Google Pay. No account, no subscription. Choose a single query, Country Pass, or 10-query bundle.',
    step4_title: 'Travel with confidence',
    step4_desc: 'Get the fare range, scam alerts, a local phrase for your driver, and full tipping guidance — all in one clear view.',
    powered_heading: 'Powered by',
    google_detail: 'Route distance, duration, and address autocomplete',
    claude_detail: 'AI-generated scam warnings, tipping advice, and driver phrases',
    stripe_detail: 'Secure payment processing — we never see your card details',
    privacy_heading: 'Our privacy promise',
    privacy_1: 'No user accounts or personal profiles',
    privacy_2: 'No payment card details stored by us',
    privacy_3: 'No advertising or tracking cookies',
    privacy_4: 'Query results cached by city name only — no personal data',
    privacy_policy_link: 'Read the full Privacy Policy →',
    cta_taxi: 'Try Taxi Fare Check →',
    cta_tipping: 'Try Tipping Guide →',
    cta_example: 'See an example result first →',
    back: '← Back to Hootling',
  }
}

function getFaqContent() {
  const { single, pass, bundle } = getUSDPrices()
  return {
    heading: 'Frequently Asked Questions',
    subheading: 'Everything you need to know about Hootling',
    q1: 'How much does it cost?',
    a1: `From ${single} USD per query — no subscriptions, no monthly fees, no account required:`,
    a1_b1: `Single query — ${single}: one taxi fare check or tipping guide`,
    a1_b2: `Country Pass — ${pass}: unlimited queries for one country, valid 24 hours`,
    a1_b3: `10-query bundle — ${bundle}: stored on your device, valid 90 days across any city or country`,
    a1_b4: 'Prices shown in your local currency at checkout',
    q2: 'What payment methods are accepted?',
    a2: 'Payment is handled by Stripe. You can pay with any major credit or debit card. Apple Pay and Google Pay are supported automatically on compatible devices and browsers.',
    q3: 'How accurate are the fare estimates?',
    a3: 'Fare ranges are calculated from a curated dataset of local taxi rates combined with real route distances from Google Maps. A ±15% range is applied to account for traffic, surcharges, and driver discretion. Always confirm the fare with your driver before the journey — Hootling is a reference tool, not a metered guarantee.',
    q4: 'Which cities are covered for taxi fares?',
    a4: 'Hootling covers 120+ cities across every continent, including major tourist destinations in Asia, Europe, the Americas, Africa, and the Middle East. If your city is not in our dataset, the result will include a note to verify the fare directly with your driver.',
    q5: 'Which countries are covered for tipping?',
    a5: 'Tipping guides are available for 50+ countries including all major travel destinations. The guide covers six scenarios: restaurants, taxis, hotel porters, bars, tour guides, and delivery.',
    q6: 'What are the scam warnings based on?',
    a6: "Scam warnings are AI-generated by Anthropic Claude and reflect well-known issues specific to each city — such as meter tampering, unofficial taxis, or fixed-price scams. They are generated from Claude's training data and cached for up to 90 days. They are a starting point for awareness, not a guarantee of current conditions.",
    q7: 'Can I use my payment for multiple searches?',
    a7: `It depends on the option chosen. A single query (${single}) covers one result. A Country Pass (${pass}) allows unlimited taxi and tipping queries for one country for 24 hours. A 10-query bundle (${bundle}) gives you 10 queries stored on your device, valid for 90 days across any city or country.`,
    q8: 'Do I need to create an account?',
    a8: 'No. Hootling has no accounts, no sign-up, and no login. Your query result and access token are stored temporarily in your browser only.',
    q9: 'Can I get a refund?',
    a9: 'Due to the instant digital nature of the service, all sales are final once a result has been delivered. If you experienced a technical failure that prevented delivery, contact legal@hootling.com within 7 days and we will review your case.',
    q10: 'Is my payment data stored?',
    a10: 'No. Payment is processed entirely by Stripe. Hootling never sees, handles, or stores your card number, CVC, or banking details. We only receive confirmation that a payment session was completed.',
    q11: 'Does Hootling track my location?',
    a11: 'No. Hootling does not use GPS or request location permission. You type addresses manually. Those addresses are sent to Google Maps to calculate the route distance — that is the only data sent.',
    q12: 'What data is sent to Anthropic?',
    a12: 'Only the city and country name of your pickup location (e.g. "Bangkok, Thailand") is sent to the Claude API to generate scam warnings, tipping notes, and driver phrases. No address-level detail is included.',
    q13: 'Is Hootling affiliated with any taxi company?',
    a13: 'No. Hootling is an independent travel reference tool with no affiliation with any taxi company, driver, dispatch service, or transportation authority.',
    q14: 'What languages is the app available in?',
    a14: 'Hootling is fully available in 14 languages: English, Spanish, French, German, Portuguese (Brazilian), Italian, Indonesian, Vietnamese, Thai, Chinese (Simplified), Chinese (Traditional), Japanese, Korean, and Hindi. The entire interface, AI-generated scam warnings, tipping advice, and driver phrases all respond in your selected language. Use the language selector in the bottom navigation bar to switch.',
    contact_heading: 'Still have a question?',
    contact_body: "Reach us at legal@hootling.com and we'll get back to you within 5 business days.",
    back: '← Back to Hootling',
  }
}

function getBusinessContent() {
  return {
    heading: 'Hootling for Business',
    subtitle: 'Accurate taxi fare data and tipping guidance for travel platforms, publishers, and corporate tools — via API, white-label, or data licence.',
    why_heading: 'Why it matters',
    why_para1: 'Every hotel booking, flight check-in, and trip itinerary has the same unanswered question: "How much will the taxi cost?" Hootling answers it — 120+ cities, real local meter rates, AI-verified scam warnings, and tipping guidance for 50+ countries.',
    why_para2: 'One mid-size travel platform integration reaches more users in a week than months of direct consumer growth.',
    who_heading: 'Who we work with',
    uc1_title: 'Travel platforms & booking apps',
    uc1_desc: 'Add taxi fare estimates at checkout — "Your hotel is 18 km from the airport. Estimated taxi: $12–15." Reduces post-booking anxiety and increases booking confidence.',
    uc1_pricing: 'API credits from $0.20 per query, or flat monthly access',
    uc2_title: 'Corporate travel management',
    uc2_desc: 'Give finance and travel managers real fare benchmarks to validate employee taxi expense claims. Eliminates out-of-policy disputes before they start.',
    uc2_pricing: 'From $299/month per company — white-label available',
    uc3_title: 'Travel bloggers & publishers',
    uc3_desc: 'Embed live fare widgets in your city guides or link to branded result pages. Monetise your traffic with accurate, up-to-date data your readers trust.',
    uc3_pricing: 'Publisher API from $99/month — co-branded pages available',
    uc4_title: 'Data licensing',
    uc4_desc: 'The Hootling dataset — 120+ cities of curated taxi rates and 50+ countries of tipping data — is a licensable asset for travel insurance, credit card concierge, and large-scale travel apps.',
    uc4_pricing: 'Annual data licence — contact us for pricing',
    what_heading: 'What you get',
    what_1: 'Real meter rate data from local taxi authorities — not crowdsourced estimates',
    what_2: 'City-specific scam warnings and local ride-hailing alternatives (Grab, Bolt, Uber)',
    what_3: 'Tipping norms for 6 scenarios across 50+ countries',
    what_4: 'AI-generated driver phrases in 14 languages',
    what_5: 'Airport transfer data for 20 major airports',
    what_6: 'Consistent JSON API — easy to integrate in hours, not weeks',
    sponsored_heading: 'Sponsored city placements',
    sponsored_body: 'Airport transfer operators (KiwiTaxi, Hoppa, Welcome Pickups) can sponsor the "getting from the airport" section on relevant city pages. Clearly labelled as sponsored. Minimal overhead — no code changes required on your side.',
    sponsored_note: 'Available on a per-city or per-region basis.',
    contact_heading: 'Get in touch',
    contact_body: "We respond to all business enquiries within one business day. Tell us your platform, your expected query volume, and what you're trying to solve.",
    cta_email: 'business@hootling.com',
    cta_try: 'Try the consumer product first',
    back: '← Back to Hootling',
  }
}

type PageSlug = 'about' | 'faq' | 'business'

function getPageContent(slug: PageSlug) {
  if (slug === 'about') return getAboutContent()
  if (slug === 'faq') return getFaqContent()
  return getBusinessContent()
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') as PageSlug | null
  const locale = searchParams.get('locale')

  if (!slug || !['about', 'faq', 'business'].includes(slug)) {
    return Response.json({ error: 'Invalid slug' }, { status: 400 })
  }
  if (!locale || locale === 'en' || !LOCALE_LANGUAGE[locale]) {
    return Response.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const cacheKey = `page_translation:${slug}:${locale}:${CONTENT_VERSION}`

  // Check KV cache first
  const cached = await kvGet<Record<string, string>>(cacheKey)
  if (cached) {
    return Response.json(cached, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  }

  // Cache miss — call Claude to translate
  const language = LOCALE_LANGUAGE[locale]
  const content = getPageContent(slug)
  const contentJson = JSON.stringify(content, null, 2)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Translate the following JSON object from English to ${language}.
Return ONLY valid JSON with identical keys and all string values translated to ${language}.
Do NOT translate: email addresses, URLs, brand names (Hootling, Stripe, Claude, Google Maps, Anthropic, Apple Pay, Google Pay, Grab, Bolt, Uber, KiwiTaxi, Hoppa, Welcome Pickups), currency symbols ($, ±), numbers, or the arrow symbol (→ and ←).
Preserve all punctuation, formatting, and em-dashes as-is.
Return raw JSON only — no markdown, no code fences, no explanation.

${contentJson}`,
        },
      ],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const translated = JSON.parse(cleaned) as Record<string, string>

    // Cache for 90 days
    await kvSet(cacheKey, translated, KV_TTL)

    return Response.json(translated, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    console.error('[translate/page] Claude error:', err)
    // On failure return English source so the page still renders
    return Response.json(content, { status: 200 })
  }
}
