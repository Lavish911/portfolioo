import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin } from 'lucide-react'
import { EDUCATION, SECTIONS, TIMELINE } from '../data/portfolio.js'
import Reveal, { SectionHeading } from './Reveal.jsx'

export default function Experience() {
  const m = SECTIONS.experience
  const wrapRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.72', 'end 0.55'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />
        <div className="timeline" ref={wrapRef}>
          <div className="tl-rail">
            <motion.div className="tl-fill" style={{ scaleY }} />
          </div>
          {TIMELINE.map((t, i) => {
            const side = i % 2 === 0 ? -1 : 1
            return (
              <div key={t.role} className="tl-item">
                <span className="tl-dot" />
                <motion.div
                  className="tl-content"
                  initial={{ opacity: 0, x: side * 52 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ duration: 0.75, ease: [0.21, 0.65, 0.16, 1] }}
                >
                  <TimelineCard item={t} />
                </motion.div>
              </div>
            )
          })}
        </div>
        <Reveal delay={0.08}>
          <div className="edu-wrap">
            <div className="edu">
              <div className="edu-icon">
                <GraduationCap size={27} />
              </div>
              <div>
                <h3>{EDUCATION.degree}</h3>
                <p className="org">{EDUCATION.school}</p>
              </div>
              <div className="edu-meta mono">
                <span>{EDUCATION.period}</span>
                <span>
                  <MapPin size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> {EDUCATION.loc}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TimelineCard({ item }) {
  return (
    <article className="card tl-card spot" style={{ '--accent': '#a78bfa' }}>
      <span className="tl-period">{item.period}</span>
      <h3 className="tl-role">{item.role}</h3>
      <p className="tl-org">
        <Briefcase size={14} /> {item.org}
        <MapPin size={13} /> {item.loc}
      </p>
      <ul className="tl-points">
        {item.points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      <div className="skill-tags">
        {item.tags.map((tg) => (
          <span key={tg} className="chip">
            {tg}
          </span>
        ))}
      </div>
    </article>
  )
}
