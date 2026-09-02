import { BarChart3, ExternalLink, FlaskConical, Github, HeartPulse, Sparkles, Terminal, Vote } from 'lucide-react'
import { PROJECTS, SECTIONS } from '../data/portfolio.js'
import Reveal, { SectionHeading } from './Reveal.jsx'

const ICONS = { HeartPulse, Sparkles, Terminal, Vote, BarChart3, FlaskConical }

function ArchitectureDiagram({ steps }) {
  return (
    <div className="arch-diagram" aria-hidden="true">
      <div className="arch-label mono">Architecture</div>
      <div className="arch-flow">
        {steps.map((label, i) => (
          <div key={label} className="arch-step-wrap">
            <div className="arch-step">
              <span className="arch-dot" />
              <span className="arch-step-text mono">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="arch-arrow">
                <span className="arch-line" />
                <span className="arch-chevron">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturedCard({ project, index }) {
  const Icon = ICONS[project.icon]
  return (
    <Reveal y={24}>
      <article className="case-card case-featured card">
        <div className="case-featured-header">
          <div className="case-header-left">
            <p className="case-tag mono">{project.tag}</p>
            <h3 className="case-title">
              <span className="case-icon-wrap" aria-hidden="true">
                <Icon size={18} />
              </span>
              {project.title}
            </h3>
            <p className="case-one-liner">{project.desc}</p>
          </div>
          <span className="case-index mono">0{index + 1}</span>
        </div>

        <div className="case-featured-body">
          <div className="case-main">
            <div className="case-block">
              <h4 className="case-label mono">Problem</h4>
              <p className="case-text">{project.problem}</p>
            </div>
            <div className="case-block">
              <h4 className="case-label mono">Solution</h4>
              <p className="case-text">{project.solution}</p>
            </div>
            <div className="case-tech">
              {project.tech.map((t) => (
                <span key={t} className="chip chip-compact">
                  {t}
                </span>
              ))}
            </div>
            <div className="case-highlights">
              <h4 className="case-label mono">Highlights</h4>
              <ul>
                {project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="case-links">
              {project.live && (
                <a className="btn btn-primary btn-sm case-cta" href={project.live} target="_blank" rel="noreferrer">
                  Live Demo <ExternalLink size={14} />
                </a>
              )}
              <a className="btn btn-ghost btn-sm case-cta" href={project.source} target="_blank" rel="noreferrer">
                <Github size={14} /> GitHub
              </a>
            </div>
          </div>
          <div className="case-arch">
            <ArchitectureDiagram steps={project.arch} />
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function CompactCard({ project, index }) {
  const Icon = ICONS[project.icon]
  return (
    <Reveal y={20} delay={index * 0.04}>
      <article className="case-card case-compact card">
        <div className="case-compact-header">
          <span className="case-icon-wrap small">
            <Icon size={16} />
          </span>
          <p className="case-tag mono small">{project.tag}</p>
        </div>
        <h3 className="case-title small">{project.title}</h3>
        <p className="case-desc small">{project.desc}</p>
        <div className="case-tech small">
          {project.tech.map((t) => (
            <span key={t} className="chip chip-compact">
              {t}
            </span>
          ))}
        </div>
        <div className="case-links small">
          {project.live && (
            <a className="btn btn-primary btn-sm" href={project.live} target="_blank" rel="noreferrer">
              <ExternalLink size={13} /> Live
            </a>
          )}
          <a className="btn btn-ghost btn-sm" href={project.source} target="_blank" rel="noreferrer">
            <Github size={13} /> Source
          </a>
        </div>
      </article>
    </Reveal>
  )
}

export default function Projects() {
  const m = SECTIONS.projects
  const featured = PROJECTS.filter((p) => p.featured)
  const compact = PROJECTS.filter((p) => !p.featured)

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />
        <p className="projects-intro">A selection of systems built for real users — each designed to be understood in seconds.</p>

        <div className="case-featured-stack">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {compact.length > 0 && (
          <>
            <div className="case-compact-grid">
              {compact.map((p, i) => (
                <CompactCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </>
        )}

        <Reveal delay={0.05}>
          <p className="deck-more">
            More experiments & builds on{' '}
            <a href="https://github.com/Lavish911?tab=repositories" target="_blank" rel="noreferrer">
              GitHub →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
