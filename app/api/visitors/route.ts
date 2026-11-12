import { NextResponse } from 'next/server'

import {
  clientIp,
  getVisitorStats,
  newVisitorId,
  rateLimit,
  recordVisit,
} from '~/lib/server/interactions'

const COOKIE_NAME = 'xh_visitor_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function parseVisitorId(request: Request): string | null {
  const cookie = request.headers.get('cookie')
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match?.[1] ?? null
}

export async function GET(request: Request): Promise<NextResponse> {
  const stats = getVisitorStats()
  const existing = parseVisitorId(request)
  return NextResponse.json({ ...stats, visitorId: existing })
}

export async function POST(request: Request): Promise<NextResponse> {
  const ip = clientIp(request)
  if (!rateLimit(`visitor:${ip}`, 60, 60_000)) {
    const stats = getVisitorStats()
    return NextResponse.json(stats, { status: 429 })
  }

  let visitorId = parseVisitorId(request)
  const isNew = !visitorId
  if (!visitorId) visitorId = newVisitorId()

  const stats = recordVisit(visitorId)
  const response = NextResponse.json(stats)
  if (isNew) {
    response.cookies.set(COOKIE_NAME, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })
  }
  return response
}
