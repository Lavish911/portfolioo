import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Magnetic({ children, strength = 0.32, className = '' }) {
  const ref = useRef(null)
  const xRaw = useMotionValue(0)
  const yRaw = useMotionValue(0)
  const x = useSpring(xRaw, { stiffness: 180, damping: 14, mass: 0.4 })
  const y = useSpring(yRaw, { stiffness: 180, damping: 14, mass: 0.4 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    xRaw.set((e.clientX - (r.left + r.width / 2)) * strength)
    yRaw.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const onLeave = () => {
    xRaw.set(0)
    yRaw.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
