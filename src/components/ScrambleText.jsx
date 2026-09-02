import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const GLYPHS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const GLYPHS_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const GLYPHS_NUM = '0123456789'

function glyphFor(char) {
  if (char === ' ') return ' '
  if (/[A-Z]/.test(char)) return GLYPHS_UPPER[(Math.random() * GLYPHS_UPPER.length) | 0]
  if (/[a-z]/.test(char)) return GLYPHS_LOWER[(Math.random() * GLYPHS_LOWER.length) | 0]
  if (/[0-9]/.test(char)) return GLYPHS_NUM[(Math.random() * GLYPHS_NUM.length) | 0]
  if (char === '/' || char === '-') return '—'
  return GLYPHS_UPPER[(Math.random() * GLYPHS_UPPER.length) | 0]
}

export function scrambleTo(el, text, dur = 620) {
  if (!el || typeof text !== 'string') return
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = text
    return
  }
  const len = text.length
  if (len === 0) return
  const duration = Math.min(800, Math.max(500, dur))
  const glyphCache = new Array(len)
  for (let i = 0; i < len; i++) glyphCache[i] = glyphFor(text[i])
  let raf = 0
  const start = performance.now()
  const tick = (now) => {
    const elapsed = now - start
    const prog = Math.min(elapsed / duration, 1)
    const reveal = Math.floor(prog * len)
    if (elapsed > 0 && (reveal === len || Math.floor(elapsed / 48) % 1 === 0)) {
      for (let i = reveal; i < len; i++) {
        if (text[i] !== ' ' && Math.random() < 0.34) glyphCache[i] = glyphFor(text[i])
      }
    }
    let out = ''
    for (let i = 0; i < len; i++) out += i < reveal ? text[i] : glyphCache[i]
    el.textContent = out
    if (prog < 1) raf = requestAnimationFrame(tick)
    else el.textContent = text
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

export default function ScrambleText({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px', amount: 0.35 })

  useEffect(() => {
    const el = ref.current
    if (!el || typeof text !== 'string') return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = text
      return
    }
    if (!inView) return
    const len = text.length
    if (len === 0) return
    const duration = 640
    const glyphCache = new Array(len)
    for (let i = 0; i < len; i++) glyphCache[i] = glyphFor(text[i])
    let raf = 0
    let timeoutId = 0
    let cancelled = false

    const startScramble = () => {
      if (cancelled) return
      const t0 = performance.now()
      const tick = (now) => {
        if (cancelled) return
        const elapsed = now - t0
        const prog = Math.min(elapsed / duration, 1)
        const reveal = Math.floor(prog * len)
        if (Math.floor(elapsed / 52) % 1 === 0) {
          for (let i = reveal; i < len; i++) {
            if (text[i] !== ' ' && Math.random() < 0.28) glyphCache[i] = glyphFor(text[i])
          }
        }
        let out = ''
        for (let i = 0; i < len; i++) out += i < reveal ? text[i] : glyphCache[i]
        try {
          el.textContent = out
        } catch {}
        if (prog < 1) raf = requestAnimationFrame(tick)
        else {
          try {
            el.textContent = text
          } catch {}
        }
      }
      raf = requestAnimationFrame(tick)
    }

    timeoutId = setTimeout(startScramble, Math.max(0, delay * 1000))

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      cancelAnimationFrame(raf)
      try {
        if (el) el.textContent = text
      } catch {}
    }
  }, [inView, text, delay])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  )
}
