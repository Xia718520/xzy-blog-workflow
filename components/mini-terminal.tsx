'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal } from 'lucide-react'

import { T } from '~/lib/i18n'
import { useTheme } from '~/lib/theme'
import { brandConfig } from '~/lib/personal'

type LineKind = 'input' | 'output' | 'error'

interface TermLine {
  id: number
  kind: LineKind
  text: string
}

interface CommandDef {
  name: string
  nameEn: string
  run: () => string | void
}

let lineSeq = 0

export function MiniTerminal(): React.JSX.Element {
  const router = useRouter()
  const { toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [lines, setLines] = useState<TermLine[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bootedRef = useRef(false)

  const push = useCallback((text: string, kind: LineKind = 'output') => {
    lineSeq += 1
    setLines((prev) => [...prev, { id: lineSeq, kind, text }])
  }, [])

  useEffect(() => {
    if (bootedRef.current) return
    bootedRef.current = true
    push(`${brandConfig.enName} terminal · type "help"`, 'output')
  }, [push])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines, open])

  const commands = useCallback((): CommandDef[] => {
    const go = (href: string, label: string) => () => {
      setOpen(false)
      router.push(href)
      return label
    }
    return [
      { name: 'help', nameEn: 'help', run: () => {
        push('help · home · blog · projects · photos · about · theme · clear · whoami', 'output')
      }},
      { name: 'home', nameEn: 'home', run: go('/', '→ /') },
      { name: 'blog', nameEn: 'blog', run: go('/blog', '→ /blog') },
      { name: 'projects', nameEn: 'projects', run: go('/projects', '→ /projects') },
      { name: 'photos', nameEn: 'photos', run: go('/photos', '→ /photos') },
      { name: 'about', nameEn: 'about', run: go('/about', '→ /about') },
      { name: 'theme', nameEn: 'theme', run: () => {
        toggleTheme()
        return 'theme toggled'
      }},
      { name: 'clear', nameEn: 'clear', run: () => {
        setLines([])
      }},
      { name: 'whoami', nameEn: 'whoami', run: () => `${brandConfig.name} (${brandConfig.enName})` },
    ]
  }, [push, router, toggleTheme])

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      if (!trimmed) return
      push(`> ${trimmed}`, 'input')
      setHistory((prev) => [...prev, trimmed])
      setHistoryIndex(-1)

      const lower = trimmed.toLowerCase()
      const cmd = commands().find((c) => c.name === lower || c.nameEn === lower)
      if (!cmd) {
        push(`unknown command: ${trimmed} · try "help"`, 'error')
        return
      }
      const result = cmd.run()
      if (typeof result === 'string' && result.length > 0) {
        push(result, 'output')
      }
    },
    [commands, push],
  )

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        runCommand(value)
        setValue('')
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (history.length === 0) return
        const nextIndex =
          historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(nextIndex)
        setValue(history[nextIndex] ?? '')
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (historyIndex < 0) return
        const nextIndex = historyIndex + 1
        if (nextIndex >= history.length) {
          setHistoryIndex(-1)
          setValue('')
        } else {
          setHistoryIndex(nextIndex)
          setValue(history[nextIndex] ?? '')
        }
      }
    },
    [value, history, historyIndex, runCommand],
  )

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-24 z-40 sm:right-6 sm:bottom-28"
      data-testid="mini-terminal"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        {open && (
          <div
            role="dialog"
            aria-label="mini terminal"
            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-1)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">
                <T zh="迷你终端" en="Terminal" />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="close terminal"
                className="font-mono text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                esc
              </button>
            </div>
            <div
              ref={scrollRef}
              className="h-48 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed"
            >
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={
                    line.kind === 'error'
                      ? 'text-red-600 dark:text-red-400'
                      : line.kind === 'input'
                        ? 'text-[var(--foreground)]'
                        : 'text-[var(--muted-foreground)]'
                  }
                >
                  {line.text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--border)] px-3 py-2">
              <span className="font-mono text-[11px] text-[var(--signal)]">$</span>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="terminal input"
                className="w-full bg-transparent font-mono text-[11px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                placeholder="help"
              />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'close terminal' : 'open terminal'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-1)] text-[var(--foreground)] shadow-lg transition-all hover:border-[var(--foreground)]"
        >
          <Terminal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
