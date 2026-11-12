import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import {
  addComment,
  clientIp,
  commentInputSchema,
  listComments,
  rateLimit,
} from '~/lib/server/interactions'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, context: RouteContext): Promise<NextResponse> {
  const { slug } = await context.params
  return NextResponse.json({ comments: listComments(slug) })
}

export async function POST(request: Request, context: RouteContext): Promise<NextResponse> {
  const { slug } = await context.params
  const ip = clientIp(request)
  if (!rateLimit(`comment:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: '提交过于频繁，请稍后再试' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  try {
    const input = commentInputSchema.parse({ ...(body as object), slug })
    const record = addComment(input)
    return NextResponse.json({ comment: record }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0]
      return NextResponse.json({ error: first?.message ?? '输入无效' }, { status: 400 })
    }
    if (err instanceof Error && 'status' in err) {
      const status = (err as { status: number }).status
      return NextResponse.json({ error: err.message }, { status })
    }
    throw err
  }
}
