import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin } from 'lucide-react'
import { EDUCATION, SECTIONS, TIMELINE } from '../data/portfolio.js'
import Reveal, { SectionHeading } from './Reveal.jsx'
import JourneySignal from './JourneySignal.jsx'

const JOURNEY = [
  {
    id: 'edu',
    year: '2022',
    period: EDUCATION.period,
    role: EDUCATION.degree,
    org: EDUCATION.school,
    loc: EDUCATION.loc,
    human: 'My degree gave me the foundation to explore both sides of what I enjoy building: software systems and AI.',
    points: ['Focus areas included AI/ML, software engineering, data structures & algorithms, databases and web development.'],
    tags: ['AI/ML', 'Software Engineering', 'DSA', 'DBMS', 'Web Development'],
    icon: GraduationCap,
  },
  {
    id: 'byte',
    year: '2025',
    period: TIMELINE[1].period,
    role: TIMELINE[1].role,
    org: TIMELINE[1].org,
    loc: TIMELINE[1].loc,
    human: 'This was where I became more comfortable with the practical side of web development — turning frontend ideas into working features and learning how much performance and testing matter once an application starts getting used.',
    points: TIMELINE[1].points,
    tags: TIMELINE[1].tags,
    icon: Briefcase,
  },
  {
    id: 'ativeer',
    year: '2025 — 2026',
    period: TIMELINE[0].period,
    role: TIMELINE[0].role,
    org: TIMELINE[0].org,
    loc: TIMELINE[0].loc,
    human: 'I worked across the frontend and backend of an e-commerce platform, building features that had to work reliably beyond the local development environment.',
    points: TIMELINE[0].points,
    tags: TIMELINE[0].tags,
    icon: Briefcase,
  },
  {
    id: 'now',
    year: 'NOW',
    period: '2026 →',
    role: 'AI/ML + Software Engineering',
    org: 'Focused on',
    loc: 'Building with intent',
    human: 'Now I\'m focused on building systems where AI and software engineering meet — from intelligent applications to reliable full-stack products.',
    points: [],
    tags: ['AI/ML', 'Full-Stack', 'Product Engineering'],
    icon: GraduationCap,
  },
]

function JourneyEntry({ entry, index, active, onVisible }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.42, margin: '-12% 0px -32% 0px' })
  const hasEnteredRef = useRef(false)

  useEffect(() => {
    if (isInView) onVisible(index)
  }, [isInView, index, onVisible])

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const animateProps = prefersReduced
    ? { opacity: 1, y: 0 }
    : hasEnteredRef.current
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 16 }

  useEffect(() => {
    if (isInView) hasEnteredRef.current = true
  }, [isInView])

  const Icon = entry.icon

  return (
    <div
      ref={ref}
      className={`journey-entry ${active ? 'is-active' : ''} ${hasEnteredRef.current || prefersReduced ? 'has-entered' : ''}`}
      data-year={entry.year}
    >
      <div className="journey-year mono" aria-hidden="true">
        {entry.year}
      </div>
      <div className="journey-node-wrap">
        <span className={`journey-node ${active ? 'is-active' : ''}`}>
          <span className="journey-node-dot" />
        </span>
      </div>
      <motion.article
        className={`card journey-card ${active ? 'is-active' : ''}`}
        initial={prefersReduced ? false : { opacity: 0, y: 14 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3, margin: '-40px' }}
        transition={{ duration: 0.52, ease: [0.21, 0.65, 0.16, 1] }}
      >
        <div className="journey-card-head">
          <span className="journey-period mono">{entry.period}</span>
          <h3 className="journey-role">
            <span className="journey-role-icon">
              <Icon size={14} />
            </span>
            {entry.role}
          </h3>
          <p className="journey-org">
            {entry.org} <span className="journey-dot-sep">•</span> {entry.loc}
          </p>
        </div>
        <p className="journey-human">{entry.human}</p>
        {entry.points.length > 0 && (
          <ul className="journey-points">
            {entry.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        )}
        <div className="journey-tags">
          {entry.tags.map((t) => (
            <span key={t} className="chip chip-compact">
              {t}
            </span>
          ))}
        </div>
      </motion.article>
    </div>
  )
}

export default function Experience() {
  const m = SECTIONS.experience
  const wrapRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.72', 'end 0.58'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section id="experience" className="section journey-section">
      <div className="container">
        <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />
        <p className="journey-intro">
          From fundamentals to shipping software — a quick view of how I learned, built, and iterated.
        </p>

        <div className="journey-wrap" ref={wrapRef}>
          <div className="journey-rail" aria-hidden="true">
            <motion.div className="journey-fill" style={{ scaleY }} />
          </div>

          <div className="journey-signal-wrap" aria-hidden="true">
            <JourneySignal activeIndex={activeIndex} />
          </div>

          <div className="journey-list">
            {JOURNEY.map((entry, i) => (
              <JourneyEntry key={entry.id} entry={entry} index={i} active={activeIndex === i} onVisible={setActiveIndex} />
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="journey-closing">
            Now I'm focused on building systems where AI and software engineering meet — from intelligent
            applications to reliable full-stack products.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
