import { SECTIONS, SKILL_GROUPS } from '../data/portfolio.js'
import Reveal, { SectionHeading } from './Reveal.jsx'

const STACK_STEPS = ['Frontend', 'Backend / APIs', 'Data / Database', 'AI / ML', 'Deployment']

function StackFlow() {
  return (
    <div className="stack-flow" aria-hidden="true">
      <div className="stack-flow-label mono">STACK FLOW</div>
      <div className="stack-flow-track">
        {STACK_STEPS.map((label, i) => (
          <div key={label} className="stack-node-wrap">
            <div className="stack-node">
              <span className="stack-dot" />
              <span className="stack-text mono">{label}</span>
            </div>
            {i < STACK_STEPS.length - 1 && (
              <div className="stack-connector">
                <span className="stack-line" />
                <span className="stack-arrow">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const m = SECTIONS.skills
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />
        <p className="skills-intro">
          A structured view of the technologies I work with and how they fit together.
        </p>

        <div className="capability-grid">
          {SKILL_GROUPS.map((g) => (
            <Reveal key={g.id} y={18}>
              <article className="capability-card">
                <div className="capability-header">
                  <span className="capability-number mono">{g.number}</span>
                  <h3 className="capability-title">{g.title}</h3>
                </div>
                <p className="capability-desc">{g.desc}</p>
                <div className="capability-tags">
                  {g.tags.map((t) => (
                    <span key={t} className="chip chip-skill">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <StackFlow />
        </Reveal>
      </div>
    </section>
  )
}
