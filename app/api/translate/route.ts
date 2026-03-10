import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { verifyToken } from '@/lib/tokens'
import { kvGet, kvSet } from '@/lib/kv'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-6'

const MAX_TRANSLATIONS = 5
const RATE_LIMIT_TTL_SECONDS = 2 * 60 * 60 // 2 hours — covers any token lifetime

function rateLimitKey(sessionId: string): string {
  return `translate_count:${sessionId}`
}

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return Response.json({ error: 'Payment required' }, { status: 402 })
  }

  let payload: Awaited<ReturnType<typeof verifyToken>>
  try {
    payload = await verifyToken(auth.slice(7))
  } catch {
    return Response.json({ error: 'Invalid or expired session — please start a new search' }, { status: 401 })
  }

  const sessionId = payload.sessionId ?? 'unknown'

  // ── Rate limit check ────────────────────────────────────────────────────────
  const countKey = rateLimitKey(sessionId)
  const currentCount = (await kvGet<number>(countKey)) ?? 0

  if (currentCount >= MAX_TRANSLATIONS) {
    return Response.json(
      {
        error: `You've used all ${MAX_TRANSLATIONS} custom translations included with this result. Start a new search for more.`,
        remaining: 0,
        limitReached: true,
      },
      { status: 429 },
    )
  }

  // ── Validate input ──────────────────────────────────────────────────────────
  let text: string
  let country: string
  try {
    const body = await req.json()
    text = (body.text ?? '').toString().trim().slice(0, 200) // hard cap at 200 chars
    country = (body.country ?? '').toString().trim()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!text) return Response.json({ error: 'Text is required' }, { status: 400 })
  if (!country) return Response.json({ error: 'Country is required' }, { status: 400 })

  // ── Translate ───────────────────────────────────────────────────────────────
  try {
    const prompt = `Translate this phrase into the primary local language of ${country}: "${text}"

Return ONLY valid JSON with no markdown:
{
  "localLanguage": "<translation in the local language>",
  "transliteration": "<romanisation if non-Latin script, otherwise null>",
  "english": "<the original phrase>"
}

Rules:
- Use the primary spoken language of ${country} (e.g. Thai in Thailand, Arabic in Egypt, French in France)
- Preserve the emotional tone — if the phrase is warm and heartfelt, keep it that way
- Transliteration: include romanisation for non-Latin scripts only; set null for Latin-script languages
- english field should be exactly: ${text}`

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const data = JSON.parse(raw) as {
      localLanguage: string
      transliteration: string | null
      english: string
    }

    // ── Increment rate limit counter ──────────────────────────────────────────
    const newCount = currentCount + 1
    await kvSet(countKey, newCount, RATE_LIMIT_TTL_SECONDS)

    return Response.json({
      localLanguage: data.localLanguage,
      transliteration: data.transliteration ?? null,
      english: data.english ?? text,
      remaining: MAX_TRANSLATIONS - newCount,
      limitReached: newCount >= MAX_TRANSLATIONS,
    })
  } catch (err) {
    console.error('[translate]', err)
    return Response.json({ error: 'Translation failed — please try again' }, { status: 500 })
  }
}
