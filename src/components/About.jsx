import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Download } from 'lucide-react'
import { FACTS, SECTIONS, STATS, TERMINAL } from '../data/portfolio.js'
import Counter from './Counter.jsx'
import Magnetic from './Magnetic.jsx'
import Reveal, { SectionHeading } from './Reveal.jsx'
import TiltCard from './TiltCard.jsx'

function Terminal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [lines, setLines] = useState([])
  const [cur, setCur] = useState('')

  useEffect(() => {
    if (!inView) return
    let li = 0
    let ci = 0
    let timer
    let cancelled = false
    const typeCmd = () => {
      if (cancelled) return
      if (li >= TERMINAL.length || !TERMINAL[li]) return
      const entry = TERMINAL[li]
      if (!entry || typeof entry.s !== 'string') return
      const text = entry.s
      ci++
      setCur(`$ ${text.slice(0, ci)}`)
      if (ci < text.length) {
        timer = setTimeout(typeCmd, 20 + Math.random() * 28)
      } else {
        timer = setTimeout(() => {
          if (cancelled) return
          if (li >= TERMINAL.length || !TERMINAL[li]) return
          setLines((l) => [...l, { k: 'cmd', s: `$ ${text}` }])
          setCur('')
          li++
          if (li < TERMINAL.length) timer = setTimeout(nextOut, 220)
        }, 260)
      }
    }
    const nextOut = () => {
      if (cancelled) return
      if (li >= TERMINAL.length || !TERMINAL[li]) return
      const entry = TERMINAL[li]
      if (!entry || typeof entry.s !== 'string') return
      setLines((l) => [...l, { k: 'out', s: entry.s }])
      li++
      if (li < TERMINAL.length) {
        ci = 0
        timer = setTimeout(typeCmd, 420)
      }
    }
    typeCmd()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [inView])

  return (
    <div className="term" ref={ref} data-hover>
      <div className="term-bar">
        <span className="term-dot" style={{ background: '#ff5f57' }} />
        <span className="term-dot" style={{ background: '#febc2e' }} />
        <span className="term-dot" style={{ background: '#28c840' }} />
        <span className="term-title">lavish@raisoni: ~/portfolio</span>
      </div>
      <div className="term-body">
        {lines.map((l, i) =>
          l.k === 'cmd' ? (
            <p key={i} className="term-line term-cmd">{l.s}</p>
          ) : (
            <p key={i} className="term-line term-out">{l.s}</p>
          ),
        )}
        {cur && <p className="term-line term-cmd">{cur}</p>}
        <p className="term-line term-cmd">
          $ <span className="caret" />
        </p>
      </div>
    </div>
  )
}

export default function About() {
  const m = SECTIONS.about
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div className="about-sticky">
          <SectionHeading index={m.index} eyebrow={m.eyebrow} title={m.title} />
          <Reveal delay={0.1}>
            <div className="about-copy">
              <p>
                I'm <strong>Lavish Rahangdale</strong> — an AI &amp; Machine Learning engineer who'd
                rather ship things than talk about shipping things. I live at the intersection of{' '}
                <strong>production web platforms</strong> and <strong>applied machine learning</strong>.
              </p>
              <p>
                Over two internships I've scaled e-commerce backends to thousands of daily requests,
                kept microservices humming at <strong>99.9% uptime for 10K+ users</strong>, and cut
                load times by a third — all while feeding a stubborn curiosity for causal AI,
                computer vision and NLP.
              </p>
              <p>
                Strong DSA foundations, Docker-stained hands, AWS-ready. If it involves models that
                meet real users, I'm interested.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <dl className="facts">
              {FACTS.map(([k, v]) => (
                <div key={k} className="fact-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="about-actions">
              <Magnetic>
                <a className="btn btn-ghost btn-sm" href="./resume.pdf" download="Lavish_Rahangdale_Resume.pdf">
                  <Download size={15} /> Résumé
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
        <div>
          <Reveal delay={0.12}>
            <Terminal />
          </Reveal>
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.07}>
                <TiltCard className="card stat spot" max={5}>
                  <div className="stat-val grad">
                    <Counter end={s.end} format={s.format} />
                  </div>
                  <div className="stat-lbl mono">{s.label}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
