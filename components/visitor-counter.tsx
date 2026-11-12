'use client'

import React, { useEffect, useState } from 'react'

import { T } from '~/lib/i18n'

interface VisitorStats {
  pageViews: number
  uniqueVisitors: number
  today: string
  todayPageViews: number
}

function pad(n: number, width = 6): string {
  return String(Math.max(0, n)).padStart(width, '0')
}

export function VisitorCounter(): React.JSX.Element | null {
  const [stats, setStats] = useState<VisitorStats | null>(null)

  useEffect(() => {
    let cancelled = false
    async function beat() {
      try {
        const res = await fetch('/api/visitors', { method: 'POST' })
        if (!res.ok) throw new Error(`visitors POST ${res.status}`)
        const data = (await res.json()) as VisitorStats
        if (!cancelled) setStats(data)
      } catch (err) {
        console.error(err)
        try {
          const fallback = await fetch('/api/visitors')
          if (fallback.ok) {
            const data = (await fallback.json()) as VisitorStats
            if (!cancelled) setStats(data)
          }
        } catch (err2) {
          console.error(err2)
        }
      }
    }
    void beat()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-wide text-[var(--muted-foreground)]"
      data-testid="visitor-counter"
      title={stats ? `${stats.today} · +${stats.todayPageViews}` : undefined}
    >
      <span className="uppercase">
        <T zh="访客" en="Visitors" />
      </span>
      <span className="tabular-nums text-[var(--foreground)]" aria-label="unique visitors">
        {stats ? pad(stats.uniqueVisitors) : '——————'}
      </span>
      <span className="opacity-60">/</span>
      <span className="tabular-nums" aria-label="page views">
        {stats ? pad(stats.pageViews) : '——————'}
      </span>
    </div>
  )
}
