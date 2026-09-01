import { motion } from 'framer-motion'
import { BarChart3, Brain, Code2, Cpu, Database, Globe, Server } from 'lucide-react'
import { MARQUEE, SECTIONS, SKILL_GROUPS } from '../data/portfolio.js'
import Reveal, { SectionHeading } from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

const ICONS = {
  Code2,
  Globe,
  Brain,
  Database,
  Server,
  Cpu,
  BarChart3,
}

export default function Skills() {
  const m = SECTIONS.skills
  const row = [...MARQUEE, ...MARQUEE]
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />
        <div className="skills-grid">
          {SKILL_GROUPS.map((g, i) => {
            const Icon = ICONS[g.icon]
            return (
              <Reveal key={g.title} delay={(i % 4) * 0.07}>
                <TiltCard
                  className="card skill-card spot"
                  max={6}
                  style={{ '--accent': g.color }}
                >
                  <div className="skill-icon">
                    <Icon size={21} />
                  </div>
                  <Icon size={104} className="skill-ghost" />
                  <h3>{g.title}</h3>
                  <div className="skill-tags">
                    {g.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="meter-head mono">
                    <span>PROFICIENCY</span>
                    <span>{g.level}%</span>
                  </div>
                  <div className="meter">
                    <motion.span
                      className="meter-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${g.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.25, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
        <Reveal delay={0.1}>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {row.map((t, i) => (
                <span key={i}>
                  {t} <b>•</b>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
