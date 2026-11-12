import { NextResponse } from 'next/server'

import {
  clientIp,
  getLikeCount,
  incrementLike,
  rateLimit,
} from '~/lib/server/interactions'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, context: RouteContext): Promise<NextResponse> {
  const { slug } = await context.params
  try {
    const count = getLikeCount(slug)
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}

export async function POST(request: Request, context: RouteContext): Promise<NextResponse> {
  const { slug } = await context.params
  const ip = clientIp(request)
  if (!rateLimit(`like:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: '请求过于频繁' }, { status: 429 })
  }
  try {
    const count = incrementLike(slug)
    return NextResponse.json({ count })
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      const status = (err as { status: number }).status
      return NextResponse.json({ error: err.message }, { status })
    }
    throw err
  }
}
