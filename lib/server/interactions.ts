import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { publishedPostSlugs } from '~/lib/content'
import { readJson, writeJson } from '~/lib/server/store'

// —— 点赞 ——

export interface LikeState {
  counts: Record<string, number>
}

export function getLikeCount(slug: string): number {
  const state = readJson<LikeState>('likes', { counts: {} })
  return state.counts[slug] ?? 0
}

export function incrementLike(slug: string): number {
  assertPublishedSlug(slug)
  const state = readJson<LikeState>('likes', { counts: {} })
  const next = (state.counts[slug] ?? 0) + 1
  state.counts[slug] = next
  writeJson('likes', state)
  return next
}

// —— 评论 ——

export interface CommentRecord {
  id: string
  slug: string
  name: string
  content: string
  createdAt: string
}

export interface CommentState {
  items: CommentRecord[]
}

export const commentInputSchema = z.object({
  slug: z.string().min(1).max(200),
  name: z.string().trim().min(1, '请填写昵称').max(40, '昵称过长'),
  content: z.string().trim().min(1, '请填写内容').max(1000, '内容过长'),
  // 蜜罐：正常用户不会填写，填了在 addComment 里直接拒绝
  website: z.string().optional(),
})

export type CommentInput = z.infer<typeof commentInputSchema>

export function listComments(slug: string): CommentRecord[] {
  const state = readJson<CommentState>('comments', { items: [] })
  return state.items.filter((item) => item.slug === slug)
}

export function addComment(input: CommentInput): CommentRecord {
  assertPublishedSlug(input.slug)
  if (input.website) {
    throw new CommentError('提交被拒绝', 400)
  }
  const state = readJson<CommentState>('comments', { items: [] })
  const record: CommentRecord = {
    id: randomUUID(),
    slug: input.slug,
    name: input.name,
    content: input.content,
    createdAt: new Date().toISOString(),
  }
  state.items.push(record)
  writeJson('comments', state)
  return record
}

export class CommentError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// —— 访客 ——

export interface VisitorState {
  pageViews: number
  uniqueVisitors: number
  today: string
  todayPageViews: number
  knownIds: string[]
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyVisitorState(): VisitorState {
  return {
    pageViews: 0,
    uniqueVisitors: 0,
    today: todayKey(),
    todayPageViews: 0,
    knownIds: [],
  }
}

function rollDay(state: VisitorState): VisitorState {
  const today = todayKey()
  if (state.today !== today) {
    return { ...state, today, todayPageViews: 0 }
  }
  return state
}

export function getVisitorStats(): Omit<VisitorState, 'knownIds'> {
  const state = rollDay(readJson<VisitorState>('visitors', emptyVisitorState()))
  const { knownIds: _known, ...rest } = state
  return rest
}

export function recordVisit(visitorId: string | null): Omit<VisitorState, 'knownIds'> {
  let state = rollDay(readJson<VisitorState>('visitors', emptyVisitorState()))
  state.pageViews += 1
  state.todayPageViews += 1
  if (visitorId && !state.knownIds.includes(visitorId)) {
    state.knownIds.push(visitorId)
    state.uniqueVisitors += 1
    // 防止文件无限膨胀：只保留最近 5 万个 id
    if (state.knownIds.length > 50000) {
      state.knownIds = state.knownIds.slice(-50000)
    }
  }
  writeJson('visitors', state)
  const { knownIds: _known, ...rest } = state
  return rest
}

export function newVisitorId(): string {
  return randomUUID()
}

// —— 校验 ——

function assertPublishedSlug(slug: string): void {
  if (!publishedPostSlugs.includes(slug)) {
    throw new CommentError('文章不存在', 404)
  }
}

// —— 简易内存限流 ——

const rateBuckets = new Map<string, number[]>()

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const list = (rateBuckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (list.length >= max) {
    rateBuckets.set(key, list)
    return false
  }
  list.push(now)
  rateBuckets.set(key, list)
  return true
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}
