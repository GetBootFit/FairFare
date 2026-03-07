import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/tokens'
import { getTippingGuide } from '@/lib/claude'
import { TIPPING_COUNTRIES } from '@/lib/seo-helpers'

// Normalise country for whitelist comparison
const norm = (s: string) =>
  s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ')

const VALID_COUNTRIES = new Set(TIPPING_COUNTRIES.map(norm))

export async function POST(req: NextRequest) {
  // Auth
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return Response.json({ error: 'Payment required' }, { status: 402 })
  }
  let tokenPayload: Awaited<ReturnType<typeof verifyToken>>
  try {
    tokenPayload = await verifyToken(auth.slice(7))
  } catch {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  try {
    const { country } = await req.json()
    if (!country || typeof country !== 'string') {
      return Response.json({ error: 'Country is required' }, { status: 400 })
    }

    // Whitelist: reject unknown countries to prevent AI cost abuse
    if (!VALID_COUNTRIES.has(norm(country))) {
      return Response.json({ error: 'Country not supported' }, { status: 400 })
    }

    // Country pass: validate token country matches requested country
    if (tokenPayload.tokenType === 'country_pass') {
      if (norm(tokenPayload.country ?? '') !== norm(country)) {
        return Response.json(
          { error: `Country pass is for ${tokenPayload.country}, not ${country}` },
          { status: 403 }
        )
      }
    }

    const result = await getTippingGuide(country)
    return Response.json(result)
  } catch (err) {
    console.error('[tipping]', err)
    return Response.json({ error: 'Failed to fetch tipping guide' }, { status: 500 })
  }
}
