/**
 * Affiliate Config API (Admin)
 * GET  /api/admin/config — return current config (KV or static)
 * POST /api/admin/config — save updated config to KV
 * DELETE /api/admin/config — reset to static defaults (clear KV)
 *
 * Protected by middleware — requires admin_token cookie.
 */

import { type NextRequest, NextResponse } from 'next/server'
import {
  getAffiliateConfig,
  saveAffiliateConfig,
  resetAffiliateConfig,
} from '@/lib/affiliates'
import { DEFAULT_AFFILIATE_CONFIG } from '@/data/affiliate-config'

export async function GET(): Promise<NextResponse> {
  const config = await getAffiliateConfig()
  return NextResponse.json({ config, isDefault: config === DEFAULT_AFFILIATE_CONFIG })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()
  const { config } = body

  if (!Array.isArray(config) || config.length === 0) {
    return NextResponse.json({ error: 'Invalid config — must be a non-empty array' }, { status: 400 })
  }

  // Basic validation — ensure each item has required fields
  for (const p of config) {
    if (!p.id || !p.name || !p.category || !p.baseUrl) {
      return NextResponse.json(
        { error: `Invalid partner entry: ${JSON.stringify(p)}` },
        { status: 400 }
      )
    }
  }

  await saveAffiliateConfig(config)
  return NextResponse.json({ ok: true, saved: config.length })
}

export async function DELETE(): Promise<NextResponse> {
  await resetAffiliateConfig()
  return NextResponse.json({ ok: true, message: 'Reset to static defaults' })
}
