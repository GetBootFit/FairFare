import { NextRequest } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/server-auth'
import { getTippingGuide } from '@/lib/claude'
import { TIPPING_COUNTRIES } from '@/lib/seo-helpers'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
import { kvIncrement } from '@/lib/kv'

// Normalise country for whitelist comparison
const norm = (s: string) =>
  s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ')

const VALID_COUNTRIES = new Set(TIPPING_COUNTRIES.map(norm))

export async function POST(req: NextRequest) {
  // Rate limiting — protect Claude API from abuse with valid tokens
  const ip = getClientIp(req)
  if (await isRateLimited('result', ip, 20, 3600)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  // Auth (httpOnly cookie — no Bearer header)
  // When NEXT_PUBLIC_PAYWALL_ENABLED=false the paywall is dormant — skip JWT check.
  let tokenPayload: Awaited<ReturnType<typeof verifyTokenFromRequest>> | null = null
  if (process.env.NEXT_PUBLIC_PAYWALL_ENABLED !== 'false') {
    try {
      tokenPayload = await verifyTokenFromRequest(req)
    } catch {
      return Response.json({ error: 'Payment required' }, { status: 402 })
    }
  }

  try {
    const { country, city, locale = 'en' } = await req.json()
    if (!country || typeof country !== 'string') {
      return Response.json({ error: 'Country is required' }, { status: 400 })
    }

    // Whitelist: reject unknown countries to prevent AI cost abuse
    if (!VALID_COUNTRIES.has(norm(country))) {
      return Response.json({ error: 'Country not supported' }, { status: 400 })
    }

    // Country pass: validate token country matches requested country
    if (tokenPayload?.tokenType === 'country_pass') {
      if (norm(tokenPayload.country ?? '') !== norm(country)) {
        return Response.json(
          { error: `Country pass is for ${tokenPayload.country}, not ${country}` },
          { status: 403 }
        )
      }
    }

    // Optional city — validated as non-empty string; reject anything suspicious
    const cityParam = typeof city === 'string' && city.trim().length > 0 && city.trim().length < 80
      ? city.trim()
      : undefined

    const result = await getTippingGuide(country, locale, cityParam)

    // Increment global query counter for social proof (non-fatal)
    void kvIncrement('total_queries')

    // Echo city back in response so the UI can display it in the result header
    return Response.json(cityParam ? { ...result, city: cityParam } : result)
  } catch (err) {
    console.error('[tipping]', err)
    return Response.json({ error: 'Failed to fetch tipping guide' }, { status: 500 })
  }
}
