import { useEffect, useRef, useState } from 'react'

const HUES = [187, 262, 320]

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const canvasRef = useRef(null)
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = window.innerWidth
    let H = window.innerHeight

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    document.documentElement.classList.add('has-cursor')

    const mouse = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let hover = false
    let lastSpawn = { x: -100, y: -100 }
    const parts = []

    const spawn = (x, y, burst = false) => {
      const n = burst ? 12 : 1
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = burst ? 1.4 + Math.random() * 2.6 : (Math.random() - 0.5) * 0.7
        parts.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - (burst ? 0.6 : 0.15),
          life: 1,
          decay: burst ? 0.03 : 0.02,
          r: burst ? 1.5 + Math.random() * 1.8 : 1 + Math.random() * 1.4,
          hue: HUES[(Math.random() * HUES.length) | 0],
        })
      }
      if (parts.length > 140) parts.splice(0, parts.length - 140)
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      const dx = mouse.x - lastSpawn.x
      const dy = mouse.y - lastSpawn.y
      if (dx * dx + dy * dy > 90) {
        lastSpawn.x = mouse.x
        lastSpawn.y = mouse.y
        spawn(mouse.x, mouse.y)
      }
    }

    const onOver = (e) => {
      hover = !!e.target.closest('a, button, [data-hover]')
      ring.classList.toggle('hot', hover)
    }

    const onDown = () => spawn(mouse.x, mouse.y, true)

    let raf
    const loop = () => {
      try {
        ringPos.x += (mouse.x - ringPos.x) * 0.16
        ringPos.y += (mouse.y - ringPos.y) * 0.16
        const s = hover ? 2 : 1
        if (dot && ring) {
          dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%) scale(${hover ? 0.45 : 1})`
          ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${s})`
        }
        if (ctx && W > 0 && H > 0) {
          ctx.clearRect(0, 0, W, H)
          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i]
            if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
              parts.splice(i, 1)
              continue
            }
            p.x += p.vx
            p.y += p.vy
            p.vy += 0.012
            p.life -= p.decay
            if (p.life <= 0 || !Number.isFinite(p.life)) {
              parts.splice(i, 1)
              continue
            }
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
            ctx.fillStyle = `hsla(${p.hue}, 92%, 66%, ${p.life * 0.55})`
            ctx.fill()
          }
        }
      } catch (e) {
        console.error('[Cursor] loop error:', e)
      } finally {
        raf = requestAnimationFrame(loop)
      }
    }
    loop()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
