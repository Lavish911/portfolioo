import { motion } from 'framer-motion'
import ScrambleText from './ScrambleText.jsx'

export default function Reveal({ children, delay = 0, y = 30, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.21, 0.65, 0.16, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ index, eyebrow, title }) {
  return (
    <Reveal className="section-head">
      <div>
        <p className="eyebrow">
          <ScrambleText text={eyebrow} />
        </p>
        <h2 className="head-title">
          <ScrambleText text={title} delay={0.12} />
        </h2>
      </div>
      <span className="section-index">{index}</span>
    </Reveal>
  )
}
