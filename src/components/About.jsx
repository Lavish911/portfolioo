import Reveal, { SectionHeading } from './Reveal.jsx'
import { SECTIONS } from '../data/portfolio.js'

const APPROACH = [
  { n: '01', title: 'Understand', desc: 'Start with the actual problem, constraints and users.' },
  { n: '02', title: 'Build', desc: 'Turn the idea into a simple working system.' },
  { n: '03', title: 'Validate', desc: 'Test assumptions instead of trusting the first implementation.' },
  { n: '04', title: 'Improve', desc: 'Measure, debug and iterate.' },
]

const SIGNAL = ['IDEA', 'SYSTEM', 'AI / LOGIC', 'PRODUCT', 'USER']

export default function About() {
  const m = SECTIONS.about
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />

        <div className="about-editorial">
          <Reveal y={18}>
            <div className="about-who">
              <p className="mono about-kicker">ABOUT / WHO I AM</p>
              <h3 className="about-statement">
                I build at the intersection of
                <br />
                software engineering and AI.
              </h3>
            </div>
          </Reveal>

          <Reveal y={18} delay={0.08}>
            <div className="about-narrative">
              <p>Most of what I enjoy building sits somewhere between software engineering and AI.</p>
              <p>
                I'm an AI &amp; ML graduate who likes turning messy problems into systems that people
                can actually use — from full-stack applications and real-time interfaces to machine-learning
                pipelines and AI-powered tools. I usually work with Python, JavaScript, React, Node.js,
                FastAPI and ML/DL stacks, along with databases and Docker-based deployment workflows.
              </p>
              <p>
                I care about the part after the prototype: how the pieces connect, how the system behaves
                when something goes wrong, and whether the final product is actually useful.
              </p>
              <p className="about-narrative-strong">
                I'm currently looking for opportunities where I can keep growing as an AI/ML and full-stack
                engineer while working on problems that have real users and real constraints.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal y={18} delay={0.06}>
          <div className="about-approach">
            <h4 className="mono approach-heading">APPROACH</h4>
            <div className="approach-grid">
              {APPROACH.map((s) => (
                <div key={s.n} className="approach-card">
                  <span className="mono approach-number">{s.n} — {s.title}</span>
                  <p className="approach-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal y={18} delay={0.1}>
          <div className="about-signal" aria-hidden="true">
            <div className="signal-flow">
              {SIGNAL.map((label, i) => (
                <div key={label} className="signal-step-wrap">
                  <div className="signal-step">
                    <span className="signal-dot" />
                    <span className="mono signal-text">{label}</span>
                  </div>
                  {i < SIGNAL.length - 1 && (
                    <div className="signal-arrow" aria-hidden="true">
                      <span className="signal-line" />
                      <span className="signal-chevron">↓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
