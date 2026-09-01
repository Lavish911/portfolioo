import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'

export default function Counter({ end = 0, format = (v) => `${Math.round(v)}`, duration = 1.8, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [inView, end, duration, format])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
