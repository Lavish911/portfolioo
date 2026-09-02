import { BarChart3, ExternalLink, Github, HeartPulse, Sparkles, Terminal, Vote } from 'lucide-react'
import { PROJECTS, SECTIONS } from '../data/portfolio.js'
import Reveal, { SectionHeading } from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

const ICONS = { HeartPulse, Sparkles, Terminal, Vote, BarChart3 }

export default function Projects() {
  const m = SECTIONS.projects
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />
        <div className="deck">
          {PROJECTS.map((p, i) => {
            const Icon = ICONS[p.icon]
            return (
              <div key={p.id} className="p-slot" style={{ '--i': i }}>
                <Reveal y={50}>
                  <TiltCard
                    className="card p-card spot"
                    max={4}
                    style={{ '--accent': p.accent, '--accent2': p.accent2 }}
                  >
                    <span className="p-idx">0{i + 1}</span>
                    <div className="p-info">
                      <p className="p-tag mono">{p.tag}</p>
                      <h3 className="p-title">{p.title}</h3>
                      <p className="p-sub">{p.sub}</p>
                      <p className="p-desc">{p.desc}</p>
                      <ul className="p-points">
                        {p.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                      <div className="p-tech">
                        {p.tech.map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="p-links">
                        <a
                          className="btn btn-ghost btn-sm"
                          href={p.source}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Github size={15} /> Source Code
                        </a>
                        {p.live && (
                          <a
                            className="btn btn-primary btn-sm"
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink size={15} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-visual">
                      <Icon size={78} className="p-visual-icon" strokeWidth={1.2} />
                      {p.orbit.map((o, oi) => (
                        <span key={o} className={`p-orbit po-${oi + 1}`}>
                          {o}
                        </span>
                      ))}
                    </div>
                  </TiltCard>
                </Reveal>
              </div>
            )
          })}
        </div>
        <Reveal delay={0.05}>
          <p className="deck-more">
            More experiments, coursework &amp; builds on{' '}
            <a href="https://github.com/Lavish911?tab=repositories" target="_blank" rel="noreferrer">
              GitHub →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
