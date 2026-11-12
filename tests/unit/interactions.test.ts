import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  addComment,
  commentInputSchema,
  getLikeCount,
  getVisitorStats,
  incrementLike,
  listComments,
  rateLimit,
  recordVisit,
} from '~/lib/server/interactions'

describe('互动数据层（点赞 / 评论 / 访客）', () => {
  let tmpDir: string
  const prevDataDir = process.env.XH_DATA_DIR

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xh-interactions-'))
    process.env.XH_DATA_DIR = tmpDir
  })

  afterEach(() => {
    if (prevDataDir === undefined) {
      delete process.env.XH_DATA_DIR
    } else {
      process.env.XH_DATA_DIR = prevDataDir
    }
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  describe('点赞', () => {
    it('正向：已发布文章点赞后计数递增', () => {
      expect(getLikeCount('put-internship-first')).toBe(0)
      expect(incrementLike('put-internship-first')).toBe(1)
      expect(incrementLike('put-internship-first')).toBe(2)
      expect(getLikeCount('put-internship-first')).toBe(2)
    })

    it('反向：未发布 slug 点赞直接抛出 404', () => {
      expect(() => incrementLike('no-such-post')).toThrowError(/文章不存在/)
    })

    it('边界：未知文章读取点赞返回 0', () => {
      expect(getLikeCount('never-liked')).toBe(0)
    })
  })

  describe('评论', () => {
    it('正向：合法评论写入后可按 slug 读回', () => {
      const input = commentInputSchema.parse({
        slug: 'put-internship-first',
        name: '访客甲',
        content: '写得很有帮助。',
      })
      const saved = addComment(input)
      expect(saved.name).toBe('访客甲')
      const list = listComments('put-internship-first')
      expect(list).toHaveLength(1)
      expect(list[0]?.content).toBe('写得很有帮助。')
    })

    it('反向：蜜罐字段被填写时拒绝', () => {
      const input = commentInputSchema.parse({
        slug: 'put-internship-first',
        name: 'bot',
        content: 'spam',
        website: 'http://spam.example',
      })
      expect(() => addComment(input)).toThrowError(/提交被拒绝/)
    })

    it('反向：空昵称无法通过 schema', () => {
      const result = commentInputSchema.safeParse({
        slug: 'put-internship-first',
        name: '   ',
        content: 'hi',
      })
      expect(result.success).toBe(false)
    })

    it('反向：不存在的文章评论抛出 404', () => {
      const input = commentInputSchema.parse({
        slug: 'ghost-post',
        name: 'a',
        content: 'b',
      })
      expect(() => addComment(input)).toThrowError(/文章不存在/)
    })

    it('边界：不同 slug 的评论互相隔离', () => {
      addComment(
        commentInputSchema.parse({
          slug: 'put-internship-first',
          name: 'a',
          content: 'only-one',
        }),
      )
      expect(listComments('other-slug')).toHaveLength(0)
      expect(listComments('put-internship-first')).toHaveLength(1)
    })
  })

  describe('访客', () => {
    it('正向：首次访问 pageViews 与 uniqueVisitors 同步 +1', () => {
      const stats = recordVisit('visitor-aaa')
      expect(stats.pageViews).toBe(1)
      expect(stats.uniqueVisitors).toBe(1)
      expect(stats.todayPageViews).toBe(1)
    })

    it('正向：同一访客再次访问只增加 pageViews', () => {
      recordVisit('visitor-aaa')
      const stats = recordVisit('visitor-aaa')
      expect(stats.pageViews).toBe(2)
      expect(stats.uniqueVisitors).toBe(1)
      expect(stats.todayPageViews).toBe(2)
    })

    it('正向：新访客增加 uniqueVisitors', () => {
      recordVisit('visitor-aaa')
      const stats = recordVisit('visitor-bbb')
      expect(stats.pageViews).toBe(2)
      expect(stats.uniqueVisitors).toBe(2)
    })

    it('边界：匿名访问（无 id）只累计 pageViews', () => {
      const stats = recordVisit(null)
      expect(stats.pageViews).toBe(1)
      expect(stats.uniqueVisitors).toBe(0)
    })

    it('读取统计不返回 knownIds', () => {
      recordVisit('x')
      const stats = getVisitorStats()
      expect(stats).not.toHaveProperty('knownIds')
      expect(stats.pageViews).toBe(1)
    })
  })

  describe('限流', () => {
    it('正向：窗口内未超限时放行', () => {
      expect(rateLimit('test-ok', 3, 60_000)).toBe(true)
      expect(rateLimit('test-ok', 3, 60_000)).toBe(true)
      expect(rateLimit('test-ok', 3, 60_000)).toBe(true)
    })

    it('反向：超过上限后拒绝', () => {
      rateLimit('test-max', 2, 60_000)
      rateLimit('test-max', 2, 60_000)
      expect(rateLimit('test-max', 2, 60_000)).toBe(false)
    })

    it('阴性对照：不同 key 互不影响', () => {
      rateLimit('key-a', 1, 60_000)
      expect(rateLimit('key-a', 1, 60_000)).toBe(false)
      expect(rateLimit('key-b', 1, 60_000)).toBe(true)
    })
  })
})
