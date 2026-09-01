import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Phone } from 'lucide-react'
import { PROFILE } from '../data/portfolio.js'
import { toast } from '../lib/toast.js'
import Magnetic from './Magnetic.jsx'
import Reveal from './Reveal.jsx'

const SOCIALS = [
  { icon: Github, label: 'GitHub', value: '@Lavish911', href: PROFILE.github, external: true },
  { icon: Linkedin, label: 'LinkedIn', value: 'lavish-rahangdale', href: PROFILE.linkedin, external: true },
  { icon: Mail, label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}`, external: false },
  { icon: Phone, label: 'Phone', value: PROFILE.phoneDisplay, href: PROFILE.phoneHref, external: false },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      toast('Email copied to clipboard')
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${PROFILE.email}`
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <Reveal>
          <p className="eyebrow">// open transmission</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="contact-title">
            <span className="outline">Let's build</span>
            <br />
            <span className="grad">something intelligent.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="contact-sub">
            Graduating in 2026 and actively hunting for full-stack and ML roles. Whether it's an
            opportunity, a collaboration or just a good tech debate — my inbox is open.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="contact-actions">
            <Magnetic strength={0.22}>
              <button className="btn btn-primary btn-lg" onClick={copyEmail}>
                {copied ? <Check size={19} /> : <Copy size={18} />}
                {copied ? 'Copied!' : PROFILE.email}
              </button>
            </Magnetic>
            <a className="mail-alt mono" href={`mailto:${PROFILE.email}`}>
              prefer your own mail app? <ArrowUpRight size={13} />
            </a>
          </div>
        </Reveal>
        <div className="socials">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.label} delay={0.05 + i * 0.06} y={24}>
              <a
                className="card social-tile spot"
                style={{ '--accent': '#22d3ee' }}
                href={s.href}
                target={s.external ? '_blank' : undefined}
                rel={s.external ? 'noreferrer' : undefined}
              >
                <div className="st-top">
                  <s.icon size={21} />
                  <ArrowUpRight size={15} className="st-arrow" />
                </div>
                <span className="st-label">{s.value}</span>
                <span className="st-tag mono">{s.label}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
