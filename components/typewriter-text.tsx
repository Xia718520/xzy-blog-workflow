'use client'

import React, { useEffect, useRef, useState } from 'react'

interface TypewriterTextProps {
  text: string
  speedMs?: number
  className?: string
  delayMs?: number
}

export function TypewriterText({
  text,
  speedMs = 36,
  className,
  delayMs = 200,
}: TypewriterTextProps): React.JSX.Element {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const reducedRef = useRef(false)

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedRef.current) {
      setDisplayed(text)
      setDone(true)
      return
    }

    let index = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    const start = setTimeout(() => {
      const tick = () => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index < text.length) {
          timer = setTimeout(tick, speedMs)
        } else {
          setDone(true)
        }
      }
      tick()
    }, delayMs)

    return () => {
      clearTimeout(start)
      if (timer) clearTimeout(timer)
    }
  }, [text, speedMs, delayMs])

  return (
    <p className={className} aria-live="polite">
      {displayed}
      {!done && (
        <span className="ml-0.5 inline-block w-[0.55em] animate-pulse text-[var(--signal)]" aria-hidden="true">
          ▍
        </span>
      )}
      {done && <span className="sr-only">{text}</span>}
    </p>
  )
}
