import { useEffect, useRef, useState } from 'react'
import { isLowPower, onLowPowerChange, setLowPower } from '../lib/perf.js'

const CAM_Z = 3.6

function makeGlow(r, g, b) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const x = c.getContext('2d')
  const grd = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, `rgba(${r},${g},${b},0.9)`)
  grd.addColorStop(0.6, `rgba(${r},${g},${b},0.28)`)
  grd.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = grd
  x.fillRect(0, 0, 64, 64)
  return c
}

const SPRITES =
  typeof document !== 'undefined'
    ? [makeGlow(103, 232, 249), makeGlow(196, 181, 253), makeGlow(249, 168, 212)]
    : []

export default function NeuralCanvas() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [active, setActive] = useState(true)
  const [low, setLowState] = useState(isLowPower())

  useEffect(() => onLowPowerChange(setLowState), [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '140px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    const el = wrapRef.current
    if (!canvas || !el) return
    const ctx = canvas.getContext('2d')
    const mobile = window.innerWidth < 768
    const N = low ? (mobile ? 50 : 75) : mobile ? 85 : 135
    const dpr = Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.5)

    let W = 0
    let H = 0
    let f = 0

    const resize = () => {
      W = canvas.clientWidth || el.clientWidth
      H = canvas.clientHeight || el.clientHeight
      canvas.width = Math.max(1, W * dpr)
      canvas.height = Math.max(1, H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      f = H * 0.95
    }

    const base = new Float32Array(N * 3)
    const disp = new Float32Array(N * 3)
    const wobDir = new Float32Array(N * 3)
    const phase = new Float32Array(N)
    const speed = new Float32Array(N)
    const colIdx = new Uint8Array(N)

    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 1.55 + (Math.random() - 0.5) * 0.55
      base[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      base[i * 3 + 1] = r * Math.cos(phi)
      base[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      let wx = Math.random() - 0.5
      let wy = Math.random() - 0.5
      let wz = Math.random() - 0.5
      const wl = Math.hypot(wx, wy, wz) || 1
      wobDir[i * 3] = wx / wl
      wobDir[i * 3 + 1] = wy / wl
      wobDir[i * 3 + 2] = wz / wl
      phase[i] = Math.random() * Math.PI * 2
      speed[i] = 0.6 + Math.random() * 1.1
      const cr = Math.random()
      colIdx[i] = cr < 0.12 ? 2 : cr < 0.64 ? 0 : 1
    }

    const maxD = low ? 0.72 : 0.62
    const cap = low ? 280 : 520
    const segs = []
    outer: for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = base[i * 3] - base[j * 3]
        const dy = base[i * 3 + 1] - base[j * 3 + 1]
        const dz = base[i * 3 + 2] - base[j * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < maxD * maxD) {
          segs.push(i, j)
          if (segs.length > cap) break outer
        }
      }
    }

    const NS = low ? 0 : 110
    const stars = new Float32Array(NS * 3)
    for (let i = 0; i < NS; i++) {
      let x = Math.random() - 0.5
      let y = Math.random() - 0.5
      let z = Math.random() - 0.5
      const l = Math.hypot(x, y, z) || 1
      const rr = 3.2 + Math.random() * 3.4
      stars[i * 3] = (x / l) * rr
      stars[i * 3 + 1] = (y / l) * rr
      stars[i * 3 + 2] = (z / l) * rr
    }

    const mouse = { x: -9999, y: -9999, nx: 0, ny: 0 }
    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.nx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ny = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const perf = { started: false, done: isLowPower(), frames: 0, acc: 0 }
    let raf
    let rotY = Math.random() * Math.PI * 2
    let rotX = 0
    let last = performance.now()
    const t0 = last

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = (now - t0) / 1000

      if (!perf.done) {
        if (!perf.started && t > 2.5) {
          perf.started = true
          perf.frames = 0
          perf.acc = 0
        } else if (perf.started && dt < 0.25) {
          perf.frames++
          perf.acc += dt
          if (perf.acc >= 2) {
            perf.done = true
            if (perf.frames / perf.acc < 35) setLowPower(true)
          }
        }
      }

      const rect = canvas.getBoundingClientRect()
      const cx = W / 2
      const cy = H / 2
      const mx = mouse.x - rect.left
      const my = mouse.y - rect.top

      rotY += dt * 0.09
      const targetRY = rotY + mouse.nx * 0.45
      const targetRX = -mouse.ny * 0.3
      rotX += (targetRX - rotX) * 0.05

      const cy_ = Math.cos(targetRY)
      const sy_ = Math.sin(targetRY)
      const cx_ = Math.cos(rotX)
      const sx_ = Math.sin(rotX)

      const mwx = ((mx - cx) * CAM_Z) / f
      const mwy = (-(my - cy) * CAM_Z) / f
      const imy1 = mwy * cx_
      const imz1 = -mwy * sx_
      const imx2 = mwx * cy_ - imz1 * sy_
      const imz2 = mwx * sy_ + imz1 * cy_

      const PX = new Float32Array(N)
      const PY = new Float32Array(N)
      const PS = new Float32Array(N)
      const PA = new Float32Array(N)

      for (let i = 0; i < N; i++) {
        const ix = i * 3
        const w = Math.sin(t * speed[i] + phase[i]) * 0.03
        let x = base[ix] + wobDir[ix] * w
        let y = base[ix + 1] + wobDir[ix + 1] * w
        let z = base[ix + 2] + wobDir[ix + 2] * w

        const dx = x - imx2
        const dy = y - imy1
        const dz = z - imz2
        const d2 = dx * dx + dy * dy + dz * dz
        disp[ix] *= 0.9
        disp[ix + 1] *= 0.9
        disp[ix + 2] *= 0.9
        if (d2 < 0.7225 && d2 > 0.0001) {
          const d = Math.sqrt(d2)
          const push = ((1 - d / 0.85) * 0.05) / d
          disp[ix] += dx * push
          disp[ix + 1] += dy * push
          disp[ix + 2] += dz * push
        }
        x += disp[ix]
        y += disp[ix + 1]
        z += disp[ix + 2]

        const x1 = x * cy_ + z * sy_
        const z1 = -x * sy_ + z * cy_
        const y2 = y * cx_ - z1 * sx_
        const z2 = y * sx_ + z1 * cx_

        const persp = f / (z2 + CAM_Z)
        PX[i] = cx + x1 * persp
        PY[i] = cy - y2 * persp
        PS[i] = persp
        PA[i] = 0.35 + 0.65 * ((z2 + 2.1) / 4.2)
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      if (NS > 0) {
        ctx.fillStyle = 'rgba(191, 219, 254, 0.5)'
        for (let i = 0; i < NS; i++) {
          const x = stars[i * 3]
          const y = stars[i * 3 + 1]
          const z = stars[i * 3 + 2]
          const x1 = x * cy_ + z * sy_
          const z1 = -x * sy_ + z * cy_
          const y2 = y * cx_ - z1 * sx_
          const z2 = y * sx_ + z1 * cx_
          const persp = f / (z2 + CAM_Z)
          ctx.fillRect(cx + x1 * persp, cy - y2 * persp, 1.6, 1.6)
        }
      }

      ctx.strokeStyle = low ? 'rgba(56,189,248,0.22)' : 'rgba(56,189,248,0.15)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let s = 0; s < segs.length; s += 2) {
        const a = segs[s]
        const b = segs[s + 1]
        ctx.moveTo(PX[a], PY[a])
        ctx.lineTo(PX[b], PY[b])
      }
      ctx.stroke()

      for (let i = 0; i < N; i++) {
        const size = Math.min(Math.max(PS[i] * 0.34, 3), 24)
        ctx.globalAlpha = Math.max(0.15, Math.min(PA[i], 1))
        ctx.drawImage(SPRITES[colIdx[i]], PX[i] - size, PY[i] - size, size * 2, size * 2)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now) => {
      if (activeRef.current) draw(now)
      raf = requestAnimationFrame(loop)
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseout', onLeave)

    if (reduceMotion) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [low])

  return (
    <div className="hero-canvas" ref={wrapRef}>
      <canvas ref={canvasRef} className="neural-canvas" />
    </div>
  )
}
