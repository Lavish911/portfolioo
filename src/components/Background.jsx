import { useEffect, useRef } from 'react'

export default function Background() {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!root || !canvas || !ctx) return

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
          accent: Math.random() < 0.07 ? 'amber' : null,
          phase: Math.random() * Math.PI * 2,
          depth: 0.28 + Math.random() * 0.56,
        })
      }
    }

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      if (W <= 0 || H <= 0) return
      canvas.width = Math.max(1, Math.floor(W * dpr))
      canvas.height = Math.max(1, Math.floor(H * dpr))
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!reduceMotion) initParticles()
    }

    resize()

    if (reduceMotion) {
      ctx.clearRect(0, 0, W, H)
      window.addEventListener('resize', resize, { passive: true })
      return () => window.removeEventListener('resize', resize)
    }

    const positions = new Float32Array(count * 2)
    let raf = 0
    let tx = W * 0.5
    let ty = H * 0.42
    let cx = tx
    let cy = ty
    let targetScroll = window.scrollY || 0
    let curScroll = targetScroll
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
    const onVisibility = () => {
      if (!document.hidden) targetScroll = window.scrollY || 0
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    const tick = () => {
      if (!document.hidden) {
        t = (t + 0.016) % 1000
        cx += (tx - cx) * 0.07
        cy += (ty - cy) * 0.07
        curScroll += (targetScroll - curScroll) * 0.08

        root.style.setProperty('--spot-x', `${cx}px`)
        root.style.setProperty('--spot-y', `${cy}px`)

        if (!isCoarse) {
          root.style.setProperty('--ax1', `${(cx - W * 0.5) * 0.028}px`)
          root.style.setProperty('--ay1', `${(cy - H * 0.5) * 0.022 + curScroll * 0.04}px`)
          root.style.setProperty('--ax2', `${(cx - W * 0.5) * 0.019}px`)
          root.style.setProperty('--ay2', `${(cy - H * 0.5) * 0.016 - curScroll * 0.03}px`)
        }
        root.style.setProperty('--grid-y', `${curScroll * 0.05}px`)
        root.style.setProperty('--scroll-y', `${curScroll}px`)

        ctx.clearRect(0, 0, W, H)

        for (let i = 0; i < count; i++) {
          const p = particles[i]
          p.bx += p.vx
          p.by += p.vy
          if (p.bx < -20) p.bx = W + 20
          else if (p.bx > W + 20) p.bx = -20
          if (p.by < -20) p.by = H + 20
          else if (p.by > H + 20) p.by = -20

          let x = p.bx + Math.sin(t * 0.32 + p.phase) * 6.5
          let y = p.by + Math.cos(t * 0.26 + p.phase) * 6.5 - curScroll * 0.045 * p.depth
          let extraOpacity = 0

          if (!isCoarse) {
            const dx = x - cx
            const dy = y - cy
            const d2 = dx * dx + dy * dy
            if (d2 < 22500 && d2 > 0.1) {
              const d = Math.sqrt(d2)
              const f = (1 - d / 150) * 0.85
              x += (dx / d) * f * 9
              y += (dy / d) * f * 9
              extraOpacity = f * 0.38
            }
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
          if (ax < -10 || ax > W + 10 || ay < -10 || ay > H + 10) continue
          for (let j = i + 1; j < count; j++) {
            const bx = positions[j * 2]
            const by = positions[j * 2 + 1]
            const dx = ax - bx
            const dy = ay - by
            const d2 = dx * dx + dy * dy
            if (d2 < 12100 && d2 > 0) {
              const a = (1 - Math.sqrt(d2) / 110) * 0.144 * Math.min(particles[i].opacity, particles[j].opacity)
              if (a >= 0.008) {
                ctx.globalAlpha = a
                ctx.beginPath()
                ctx.moveTo(ax, ay)
                ctx.lineTo(bx, by)
                ctx.stroke()
              }
            }
          }
        }

        for (let i = 0; i < count; i++) {
          const p = particles[i]
          if (p.x < -6 || p.x > W + 6 || p.y < -6 || p.y > H + 6) continue
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
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
      }
      raf = requestAnimationFrame(tick)
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
