import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

function trunc(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

/**
 * Personalized fare-result OG card.
 * Used by /share?... pages so social previews show the actual route + fare.
 *
 * Query params:
 *   city, country, from, to, min, max, sym (currency symbol), curr (currency code), km, dur
 */
export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const city    = p.get('city')    ?? ''
  const country = p.get('country') ?? ''
  const from    = p.get('from')    ?? ''
  const to      = p.get('to')      ?? ''
  const min     = p.get('min')     ?? ''
  const max     = p.get('max')     ?? ''
  const sym     = p.get('sym')     ?? ''
  const curr    = p.get('curr')    ?? ''
  const km      = p.get('km')      ?? ''
  const dur     = p.get('dur')     ?? ''

  const hasFare  = !!(min && max && min !== '0')
  const fareText = hasFare ? `${sym}${min} – ${sym}${max}` : 'Verify with driver'
  const location = [city, country].filter(Boolean).join(', ')

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #1a0533 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* ── Brand + location ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🚕
          </div>
          <span style={{ color: '#a1a1aa', fontSize: '20px', fontWeight: 500 }}>Hootling</span>
          {location && (
            <span style={{ color: '#52525b', fontSize: '20px' }}>· {location}</span>
          )}
        </div>

        {/* ── Route + fare ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Route line */}
          {(from || to) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'nowrap' }}>
              <span style={{ color: '#d4d4d8', fontSize: '34px', fontWeight: 600, maxWidth: '460px' }}>
                {trunc(from, 28)}
              </span>
              <span style={{ color: '#52525b', fontSize: '32px' }}>→</span>
              <span style={{ color: '#d4d4d8', fontSize: '34px', fontWeight: 600, maxWidth: '460px' }}>
                {trunc(to, 28)}
              </span>
            </div>
          )}

          {/* Fare badge + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div
              style={{
                background: hasFare ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.04)',
                border: hasFare
                  ? '1px solid rgba(168, 85, 247, 0.35)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '22px 44px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ color: '#a1a1aa', fontSize: '18px' }}>Estimated fare</span>
              <span
                style={{
                  color: hasFare ? '#c084fc' : '#71717a',
                  fontSize: '52px',
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                {fareText}
              </span>
              {curr && hasFare && (
                <span style={{ color: '#71717a', fontSize: '18px' }}>{curr}</span>
              )}
            </div>

            {(km || dur) && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '22px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {dur && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>⏱</span>
                    <span style={{ color: '#a1a1aa', fontSize: '24px', fontWeight: 600 }}>{dur}</span>
                  </div>
                )}
                {km && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>📏</span>
                    <span style={{ color: '#a1a1aa', fontSize: '24px', fontWeight: 600 }}>{km} km</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#52525b', fontSize: '20px' }}>Know what's fair before you ride</span>
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.9)',
              borderRadius: '12px',
              padding: '14px 28px',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            hootling.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Share cards are deterministic for a given set of params.
        // Cache at CDN for 24 hours — short enough to be safe, long enough to stop repeated renders.
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        'X-Robots-Tag': 'noindex',
      },
    }
  )
}
