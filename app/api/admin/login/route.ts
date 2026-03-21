/**
 * Admin Login API
 * POST /api/admin/login
 * Body: { password: string }
 * Sets admin_token cookie on success.
 */

import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { password } = await req.json()
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 503 })
  }

  if (!password || password !== adminSecret) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', adminSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
