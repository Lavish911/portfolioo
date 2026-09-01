import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

export function scrambleTo(el, text, dur = 520) {
  const frames = Math.max(8, Math.round(dur / 16))
  let f = 0
  const len = text.length
  const tick = () => {
    f++
    const reveal = Math.floor((f / frames) * len)
    let out = ''
    for (let i = 0; i < len; i++) {
      out += i < reveal ? text[i] : text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (f < frames) requestAnimationFrame(tick)
    else el.textContent = text
  }
  requestAnimationFrame(tick)
}

export default function ScrambleText({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const len = text.length
    let f = 0
    let raf
    const start = setTimeout(() => {
      const tick = () => {
        f++
        const reveal = Math.floor(f / 2)
        let out = ''
        for (let i = 0; i < len; i++) {
          out += i < reveal ? text[i] : text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
        el.textContent = out
        if (reveal <= len) raf = requestAnimationFrame(tick)
        else el.textContent = text
      }
      raf = requestAnimationFrame(tick)
    }, delay * 1000)
    return () => {
      clearTimeout(start)
      cancelAnimationFrame(raf)
    }
  }, [inView, text, delay])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
