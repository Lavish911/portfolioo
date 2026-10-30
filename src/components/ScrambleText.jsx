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
  if (!len) return
  const duration = Math.min(800, Math.max(500, dur))
  const glyphCache = Array.from(text, glyphFor)
  let raf = 0
  const start = performance.now()

  const tick = (now) => {
    const prog = Math.min((now - start) / duration, 1)
    const reveal = Math.floor(prog * len)
    for (let i = reveal; i < len; i++) {
      if (text[i] !== ' ' && Math.random() < 0.3) glyphCache[i] = glyphFor(text[i])
    }
    let out = ''
    for (let i = 0; i < len; i++) out += i < reveal ? text[i] : glyphCache[i]
    el.textContent = prog < 1 ? out : text
    if (prog < 1) raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(raf)
    el.textContent = text
  }
}

export default function ScrambleText({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px', amount: 0.35 })

  useEffect(() => {
    if (!inView || !ref.current) return
    let stop
    const timer = setTimeout(() => {
      stop = scrambleTo(ref.current, text, 640)
    }, Math.max(0, delay * 1000))
    return () => {
      clearTimeout(timer)
      stop?.()
    }
  }, [inView, text, delay])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  )
}
