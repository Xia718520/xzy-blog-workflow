'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { T } from '~/lib/i18n'

interface CommentRecord {
  id: string
  slug: string
  name: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  slug: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export function CommentSection({ slug }: CommentSectionProps): React.JSX.Element {
  const [comments, setComments] = useState<CommentRecord[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/comments/${encodeURIComponent(slug)}`)
        if (!res.ok) throw new Error(`comments GET ${res.status}`)
        const data = (await res.json()) as { comments: CommentRecord[] }
        if (!cancelled) setComments(data.comments)
      } catch (err) {
        console.error(err)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (status === 'sending') return
      setStatus('sending')
      setMessage('')
      try {
        const res = await fetch(`/api/comments/${encodeURIComponent(slug)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, content, website }),
        })
        const data = (await res.json()) as { comment?: CommentRecord; error?: string }
        if (!res.ok || !data.comment) {
          throw new Error(data.error || `comments POST ${res.status}`)
        }
        setComments((prev) => [...prev, data.comment as CommentRecord])
        setName('')
        setContent('')
        setWebsite('')
        setStatus('idle')
        setMessage('ok')
      } catch (err) {
        console.error(err)
        setStatus('error')
        setMessage(err instanceof Error ? err.message : '提交失败')
      }
    },
    [slug, name, content, website, status],
  )

  return (
    <section
      className="hairline-top space-y-6 pt-8"
      aria-labelledby="comment-section-heading"
      data-testid="comment-section"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="comment-section-heading" className="post-related-label">
          <T zh="留言" en="Comments" />
        </h2>
        <span className="font-mono text-xs tabular-nums text-[var(--muted-foreground)]">
          {comments.length}
        </span>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          <T zh="还没有留言，来写第一条吧。" en="No comments yet. Leave the first one." />
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-1)] p-4"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs font-medium text-[var(--foreground)]">
                  {comment.name}
                </span>
                <time
                  dateTime={comment.createdAt}
                  className="font-mono text-[11px] text-[var(--muted-foreground)]"
                >
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={(e) => void submit(e)} className="space-y-3" data-testid="comment-form">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted-foreground)]">
              <T zh="昵称" en="Name" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              required
              autoComplete="nickname"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
            />
          </label>
          {/* 蜜罐字段：对用户隐藏，对机器人可见 */}
          <label className="hidden" aria-hidden="true">
            <T zh="网站" en="Website" />
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted-foreground)]">
            <T zh="留言" en="Message" />
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            required
            rows={4}
            className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-5 py-2 font-mono text-xs tracking-wide text-[var(--foreground)] transition-all hover:border-[var(--foreground)] disabled:opacity-60"
          >
            {status === 'sending' ? (
              <T zh="发送中…" en="Sending…" />
            ) : (
              <T zh="发表留言" en="Post comment" />
            )}
          </button>
          {message === 'ok' && (
            <span className="font-mono text-xs text-[var(--signal)]">
              <T zh="已发表" en="Posted" />
            </span>
          )}
          {status === 'error' && message && (
            <span className="font-mono text-xs text-red-600 dark:text-red-400">{message}</span>
          )}
        </div>
      </form>
    </section>
  )
}
