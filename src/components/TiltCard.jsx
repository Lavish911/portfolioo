import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function TiltCard({ children, className = '', max = 7, style }) {
  const ref = useRef(null)
  const rxRaw = useMotionValue(0)
  const ryRaw = useMotionValue(0)
  const rotateX = useSpring(rxRaw, { stiffness: 160, damping: 18 })
  const rotateY = useSpring(ryRaw, { stiffness: 160, damping: 18 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    rxRaw.set(-(py - 0.5) * max)
    ryRaw.set((px - 0.5) * max)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }

  const onLeave = () => {
    rxRaw.set(0)
    ryRaw.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1100, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
