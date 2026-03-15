import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { getCityData, slugToDisplayName, sampleFare } from '@/lib/seo-helpers'

export const runtime = 'edge'

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const citySlug = searchParams.get('city') ?? ''
  const data = citySlug ? getCityData(citySlug) : null
  const cityName = citySlug ? slugToDisplayName(citySlug) : 'Unknown City'

  // Fare range for 5 km trip
  const fare = data ? sampleFare(data, 5) : null
  const fareText = fare && data
    ? `${data.currencySymbol}${fare.min} – ${data.currencySymbol}${fare.max}`
    : 'Rates unavailable'

  const country = data?.country ?? ''
  const currency = data ? `${data.currency} · ${data.currencySymbol}${data.ratePerKm}/km` : ''

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
        {/* Top: Brand */}
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
          <span style={{ color: '#a1a1aa', fontSize: '20px', fontWeight: 500 }}>
            Hootling
          </span>
        </div>

        {/* Middle: City + fare */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: '#71717a', fontSize: '22px', fontWeight: 400 }}>
              Taxi fares in
            </span>
            <h1
              style={{
                color: '#ffffff',
                fontSize: '72px',
                fontWeight: 800,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {cityName}
            </h1>
            {country && (
              <span style={{ color: '#a1a1aa', fontSize: '28px' }}>{country}</span>
            )}
          </div>

          {/* Fare badge */}
          {fare && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  borderRadius: '16px',
                  padding: '20px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ color: '#d4d4d8', fontSize: '18px' }}>5 km trip</span>
                <span style={{ color: '#c084fc', fontSize: '40px', fontWeight: 700 }}>
                  {fareText}
                </span>
              </div>

              {currency && (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '20px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span style={{ color: '#71717a', fontSize: '16px' }}>Meter rate</span>
                  <span style={{ color: '#a1a1aa', fontSize: '22px', fontWeight: 600 }}>
                    {currency}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom: CTA tagline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#52525b', fontSize: '20px' }}>
            Know what's fair before you ride
          </span>
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
    { width: 1200, height: 630 }
  )
}
