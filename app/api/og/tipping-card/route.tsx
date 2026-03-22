/**
 * Tipping Card OG Image Generator
 * GET /api/og/tipping-card?country=Japan&iso2=jp&restaurant=rude&taxi=rude&hotel=rude&highlight=...&slug=japan
 *
 * Returns a 1080×1080 PNG shareable card.
 * Add &download=1 to trigger file download with Content-Disposition header.
 */
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

type Level = 'expected' | 'optional' | 'not-expected' | 'rude'

const LEVEL = {
  expected:     { label: 'Expected',      color: '#4ade80', bg: 'rgba(74,222,128,0.15)',   border: 'rgba(74,222,128,0.35)' },
  optional:     { label: 'Optional',      color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',   border: 'rgba(251,191,36,0.35)' },
  'not-expected':{ label: 'Not expected', color: '#a1a1aa', bg: 'rgba(161,161,170,0.12)',  border: 'rgba(161,161,170,0.25)' },
  rude:         { label: 'Do not tip',    color: '#f87171', bg: 'rgba(248,113,113,0.15)',  border: 'rgba(248,113,113,0.35)' },
}

function lvl(v: string): Level {
  return (['expected', 'optional', 'not-expected', 'rude'].includes(v) ? v : 'optional') as Level
}

function trunc(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

export async function GET(req: NextRequest) {
  const p          = req.nextUrl.searchParams
  const country    = p.get('country')    ?? 'Unknown'
  const iso2       = (p.get('iso2')      ?? 'us').toLowerCase()
  const restaurant = lvl(p.get('restaurant') ?? '')
  const taxi       = lvl(p.get('taxi')       ?? '')
  const hotel      = lvl(p.get('hotel')      ?? '')
  const highlight  = trunc(p.get('highlight') ?? '', 120)
  const isDownload = p.get('download') === '1'

  const rCfg = LEVEL[restaurant]
  const tCfg = LEVEL[taxi]
  const hCfg = LEVEL[hotel]

  // Accent colour driven by restaurant level
  const accent = rCfg.color

  // Flag PNG from flagcdn (free CDN, server-side fetch — no CORS issue)
  const flagUrl = `https://flagcdn.com/w160/${iso2}.png`

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          background: 'linear-gradient(145deg, #09090b 0%, #18181b 55%, #110a1f 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* ── Top bar: brand ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '52px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(168,85,247,0.25)',
                border: '1px solid rgba(168,85,247,0.45)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              🌍
            </div>
            <span style={{ color: '#a1a1aa', fontSize: '26px', fontWeight: 600, letterSpacing: '-0.3px' }}>
              Hootling
            </span>
          </div>
          <span style={{ color: '#52525b', fontSize: '22px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Tipping Guide
          </span>
        </div>

        {/* ── Flag + Country name ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px', marginBottom: '44px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flagUrl}
            width={140}
            height={105}
            style={{ borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#ffffff', fontSize: '70px', fontWeight: 800, lineHeight: 1, letterSpacing: '-1px' }}>
              {country}
            </span>
            <span style={{ color: accent, fontSize: '26px', fontWeight: 600 }}>
              {rCfg.label} tipping
            </span>
          </div>
        </div>

        {/* ── Highlight tip ── */}
        <div
          style={{
            background: rCfg.bg,
            border: `1px solid ${rCfg.border}`,
            borderRadius: '20px',
            padding: '36px 44px',
            marginBottom: '36px',
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <span style={{ color: '#e4e4e7', fontSize: '30px', lineHeight: 1.55 }}>
            {highlight}
          </span>
        </div>

        {/* ── 3 scenario badges ── */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '44px' }}>
          {[
            { label: 'Restaurant', cfg: rCfg, icon: '🍽' },
            { label: 'Taxi',       cfg: tCfg, icon: '🚕' },
            { label: 'Hotel',      cfg: hCfg, icon: '🏨' },
          ].map(({ label, cfg, icon }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: '16px',
                padding: '22px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '28px' }}>{icon}</span>
              <span style={{ color: '#71717a', fontSize: '17px' }}>{label}</span>
              <span style={{ color: cfg.color, fontSize: '19px', fontWeight: 700, textAlign: 'center' }}>
                {cfg.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#71717a', fontSize: '22px' }}>hootling.com/tipping</span>
            <div
              style={{
                background: 'rgba(168,85,247,0.85)',
                borderRadius: '10px',
                padding: '12px 28px',
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              Get your guide →
            </div>
          </div>
          <span style={{ color: '#3f3f46', fontSize: '15px' }}>
            © 2026 Hootling · Tipping customs vary — always verify locally · Not professional advice
          </span>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  )

  if (isDownload) {
    const headers = new Headers(image.headers)
    headers.set('Content-Disposition', `attachment; filename="hootling-tipping-${iso2}.png"`)
    return new Response(image.body, { status: 200, headers })
  }

  return image
}
