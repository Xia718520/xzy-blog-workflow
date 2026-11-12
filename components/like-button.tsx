'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

import { T } from '~/lib/i18n'

interface LikeButtonProps {
  slug: string
}

function storageKey(slug: string): string {
  return `liked:${slug}`
}

export function LikeButton({ slug }: LikeButtonProps): React.JSX.Element {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`)
        if (!res.ok) throw new Error(`likes GET ${res.status}`)
        const data = (await res.json()) as { count: number }
        if (!cancelled) setCount(data.count)
      } catch (err) {
        console.error(err)
      }
      if (!cancelled) {
        setLiked(localStorage.getItem(storageKey(slug)) === '1')
        setReady(true)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const toggle = useCallback(async () => {
    if (busy || !ready) return
    if (liked) return
    setBusy(true)
    const prev = count
    setCount(prev + 1)
    setLiked(true)
    try {
      const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`, { method: 'POST' })
      if (!res.ok) throw new Error(`likes POST ${res.status}`)
      const data = (await res.json()) as { count: number }
      setCount(data.count)
      localStorage.setItem(storageKey(slug), '1')
    } catch (err) {
      console.error(err)
      setCount(prev)
      setLiked(false)
    } finally {
      setBusy(false)
    }
  }, [busy, ready, liked, count, slug])

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={!ready || busy || liked}
      aria-pressed={liked}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-4 py-2 font-mono text-xs tracking-wide text-[var(--foreground)] transition-all hover:border-[var(--foreground)] disabled:cursor-default disabled:opacity-70"
    >
      <Heart
        className={`h-3.5 w-3.5 ${liked ? 'fill-[var(--signal)] text-[var(--signal)]' : 'text-[var(--muted-foreground)]'}`}
        aria-hidden="true"
      />
      <span>
        <T zh="点赞" en="Like" />
      </span>
      <span className="tabular-nums text-[var(--muted-foreground)]">{ready ? count : '—'}</span>
    </button>
  )
}
