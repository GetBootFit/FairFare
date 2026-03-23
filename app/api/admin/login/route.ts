/**
 * Admin Login API
 * POST /api/admin/login
 * Body: { password: string }
 * Sets a signed JWT admin_token cookie on success (not the raw secret).
 */

import { type NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

function adminKey(): Uint8Array {
  const s = process.env.ADMIN_SECRET
  if (!s) throw new Error('ADMIN_SECRET not configured')
  return new TextEncoder().encode(s)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { password } = await req.json()
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 503 })
  }

  if (!password || password !== adminSecret) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  // Issue a signed JWT — cookie value is never the raw secret
  const sessionToken = await new SignJWT({ sub: 'admin', iss: 'hootling-admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(adminKey())

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
