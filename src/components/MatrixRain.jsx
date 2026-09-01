import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>/{}[]$#'

export default function MatrixRain({ on }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!on || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const FS = 16
    let W = 0
    let H = 0
    let cols = 0
    let drops = []

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      cols = Math.ceil(W / FS)
      drops = Array(cols)
        .fill(0)
        .map(() => Math.random() * -60)
    }
    resize()

    const id = setInterval(() => {
      ctx.fillStyle = 'rgba(4, 5, 11, 0.16)'
      ctx.fillRect(0, 0, W, H)
      ctx.font = `${FS}px monospace`
      for (let i = 0; i < cols; i++) {
        const ch = CHARS[(Math.random() * CHARS.length) | 0]
        const y = drops[i] * FS
        ctx.fillStyle = Math.random() < 0.05 ? '#d9fbff' : 'rgba(34, 211, 238, 0.72)'
        ctx.fillText(ch, i * FS, y)
        if (y > H && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }, 50)

    window.addEventListener('resize', resize)
    return () => {
      clearInterval(id)
      window.removeEventListener('resize', resize)
    }
  }, [on])

  if (!on) return null
  return <canvas ref={ref} className="matrix-canvas" />
}
