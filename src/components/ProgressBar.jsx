import { motion, useScroll, useSpring } from 'framer-motion'

export default function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return <motion.div className="progress" style={{ scaleX }} />
}
