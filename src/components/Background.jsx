import { useEffect, useRef } from 'react'

export default function Background() {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768

    let W = window.innerWidth
    let H = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const count = reduceMotion ? 0 : isCoarse ? 34 : 68

    const particles = []
    const initParticles = () => {
      particles.length = 0
      for (let i = 0; i < count; i++) {
        const accentRoll = Math.random()
        let accent = null
        if (accentRoll < 0.07) accent = 'amber'
        particles.push({
          bx: Math.random() * Math.max(1, W),
          by: Math.random() * Math.max(1, H),
          x: 0,
          y: 0,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          size: 1.0 + Math.random() * 0.8,
          baseOpacity: 0.12 + Math.random() * 0.08,
          opacity: 0,
          accent,
          phase: Math.random() * Math.PI * 2,
          depth: 0.28 + Math.random() * 0.56,
        })
      }
    }

    const resize = () => {
      const newW = window.innerWidth
      const newH = window.innerHeight
      const newDpr = Math.min(window.devicePixelRatio || 1, 1.5)
      if (!Number.isFinite(newW) || !Number.isFinite(newH) || newW <= 0 || newH <= 0) return
      W = newW
      H = newH
      dpr = newDpr
      try {
        canvas.width = Math.max(1, Math.floor(W * dpr))
        canvas.height = Math.max(1, Math.floor(H * dpr))
        canvas.style.width = `${W}px`
        canvas.style.height = `${H}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      } catch (e) {
        console.error('[Background] resize error:', e)
      }
      if (!reduceMotion) initParticles()
    }

    resize()

    if (reduceMotion) {
      try {
        ctx.clearRect(0, 0, W, H)
      } catch (e) {
        console.error('[Background] clear error:', e)
      }
      const onResizeReduce = () => resize()
      window.addEventListener('resize', onResizeReduce, { passive: true })
      return () => window.removeEventListener('resize', onResizeReduce)
    }

    const positions = count > 0 ? new Float32Array(count * 2) : new Float32Array(0)
    let raf = 0
    let mx = W * 0.5
    let my = H * 0.42
    let tx = mx
    let ty = my
    let cx = mx
    let cy = my
    let scrollY = window.scrollY || 0
    let targetScroll = scrollY
    let curScroll = scrollY
    let hasSpot = false
    let t = 0

    const onMouseMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!hasSpot && !isCoarse) {
        hasSpot = true
        root.classList.add('has-spotlight')
      }
    }
    const onMouseLeave = () => {
      hasSpot = false
      root.classList.remove('has-spotlight')
    }
    const onScroll = () => {
      targetScroll = window.scrollY || 0
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize, { passive: true })

    const onVisibility = () => {
      if (!document.hidden) {
        targetScroll = window.scrollY || 0
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const tick = () => {
      try {
        if (document.hidden) return
        t = (t + 0.016) % 1000

        cx += (tx - cx) * 0.07
        cy += (ty - cy) * 0.07
        curScroll += (targetScroll - curScroll) * 0.08
        if (!Number.isFinite(curScroll)) curScroll = targetScroll

        root.style.setProperty('--spot-x', `${cx}px`)
        root.style.setProperty('--spot-y', `${cy}px`)

        if (!isCoarse) {
          const ax1 = (cx - W * 0.5) * 0.028
          const ay1 = (cy - H * 0.5) * 0.022 + curScroll * 0.04
          const ax2 = (cx - W * 0.5) * 0.019
          const ay2 = (cy - H * 0.5) * 0.016 - curScroll * 0.03
          const ax3 = (cx - W * 0.5) * 0.013
          const ay3 = (cy - H * 0.5) * 0.011 + curScroll * 0.02
          if (Number.isFinite(ax1)) {
            root.style.setProperty('--ax1', `${ax1}px`)
            root.style.setProperty('--ay1', `${ay1}px`)
            root.style.setProperty('--ax2', `${ax2}px`)
            root.style.setProperty('--ay2', `${ay2}px`)
            root.style.setProperty('--ax3', `${ax3}px`)
            root.style.setProperty('--ay3', `${ay3}px`)
          }
        }
        root.style.setProperty('--grid-y', `${curScroll * 0.05}px`)
        root.style.setProperty('--scroll-y', `${curScroll}px`)

        if (canvas.width === 0 || canvas.height === 0 || !Number.isFinite(W) || !Number.isFinite(H) || W <= 0 || H <= 0) {
          resize()
        }

        ctx.clearRect(0, 0, W, H)

        for (let i = 0; i < count; i++) {
          const p = particles[i]
          if (!p) continue
          p.bx += p.vx
          p.by += p.vy
          if (p.bx < -20) p.bx = W + 20
          if (p.bx > W + 20) p.bx = -20
          if (p.by < -20) p.by = H + 20
          if (p.by > H + 20) p.by = -20
          if (!Number.isFinite(p.bx) || !Number.isFinite(p.by)) {
            p.bx = Math.random() * W
            p.by = Math.random() * H
          }

          const floatX = Math.sin(t * 0.32 + p.phase) * 6.5
          const floatY = Math.cos(t * 0.26 + p.phase) * 6.5
          const parallax = curScroll * 0.045 * p.depth

          let x = p.bx + floatX
          let y = p.by + floatY - parallax

          let extraOpacity = 0
          if (!isCoarse) {
            const dx = x - cx
            const dy = y - cy
            const d2 = dx * dx + dy * dy
            const r = 150
            if (d2 < r * r && d2 > 0.1) {
              const d = Math.sqrt(d2)
              if (d > 0.1 && Number.isFinite(d)) {
                const f = (1 - d / r) * 0.85
                x += (dx / d) * f * 9
                y += (dy / d) * f * 9
                extraOpacity = f * 0.38
              }
            }
          }

          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            x = p.bx
            y = p.by
            extraOpacity = 0
          }

          p.x = x
          p.y = y
          p.opacity = Math.min(0.72, p.baseOpacity + extraOpacity)
          positions[i * 2] = x
          positions[i * 2 + 1] = y
        }

        ctx.lineWidth = 0.6
        ctx.strokeStyle = 'rgb(255,255,255)'
        for (let i = 0; i < count; i++) {
          const ax = positions[i * 2]
          const ay = positions[i * 2 + 1]
          if (!Number.isFinite(ax) || !Number.isFinite(ay)) continue
          if (ax < -10 || ax > W + 10 || ay < -10 || ay > H + 10) continue
          for (let j = i + 1; j < count; j++) {
            const bx = positions[j * 2]
            const by = positions[j * 2 + 1]
            if (!Number.isFinite(bx) || !Number.isFinite(by)) continue
            const dx = ax - bx
            const dy = ay - by
            const d2 = dx * dx + dy * dy
            if (d2 < 110 * 110) {
              const d = Math.sqrt(d2)
              if (!Number.isFinite(d) || d === 0) continue
              const a = (1 - d / 110) * 0.08 * Math.min(particles[i].opacity, particles[j].opacity) * 1.8
              if (!Number.isFinite(a) || a < 0.008) continue
              ctx.globalAlpha = a
              ctx.beginPath()
              ctx.moveTo(ax, ay)
              ctx.lineTo(bx, by)
              ctx.stroke()
            }
          }
        }
        ctx.globalAlpha = 1

        for (let i = 0; i < count; i++) {
          const p = particles[i]
          const x = p.x
          const y = p.y
          if (!Number.isFinite(x) || !Number.isFinite(y)) continue
          if (x < -6 || x > W + 6 || y < -6 || y > H + 6) continue
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          if (p.accent === 'amber') {
            ctx.fillStyle = 'rgb(245,166,35)'
            ctx.globalAlpha = Math.min(0.45, p.opacity * 0.95 + 0.08)
          } else {
            ctx.fillStyle = 'rgb(255,255,255)'
            ctx.globalAlpha = p.opacity * 0.42
          }
          ctx.fill()
        }
        ctx.globalAlpha = 1
      } catch (e) {
        console.error('[Background] tick error:', e)
      } finally {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="bg-fixed" ref={rootRef} aria-hidden="true">
      <div className="bg-ambients">
        <div className="ambient ambient-cyan" />
        <div className="ambient ambient-violet" />
        <div className="ambient ambient-pink" />
      </div>
      <canvas ref={canvasRef} className="bg-particles" />
      <div className="bg-grid" />
      <div className="bg-spotlight" />
      <div className="bg-noise" />
    </div>
  )
}
