import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { NAV_LINKS, PROFILE } from '../data/portfolio.js'
import { scrollToId, startScroll, stopScroll } from '../lib/scroll.js'
import Magnetic from './Magnetic.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-42% 0px -52% 0px' },
    )
    NAV_LINKS.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (open) stopScroll()
    else startScroll()
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (id) => {
    setOpen(false)
    startScroll()
    scrollToId(`#${id}`)
  }

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <button className="logo" onClick={() => go('home')} aria-label="Home">
            <span className="logo-mark">LR</span>
            <span className="logo-name">{PROFILE.name}</span>
          </button>
          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                className={`nav-link mono${active === l.id ? ' active' : ''}`}
                onClick={() => go(l.id)}
              >
                {l.label}
              </button>
            ))}
          </nav>
          <div className="nav-right">
            <Magnetic className="nav-cta">
              <button className="btn btn-primary btn-sm" onClick={() => go('contact')}>
                Hire Me <ArrowUpRight size={15} />
              </button>
            </Magnetic>
            <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.nav initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
              {NAV_LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  className="menu-link"
                  variants={{ hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.65, 0.16, 1] } } }}
                  onClick={() => go(l.id)}
                >
                  <em>0{i + 1}</em> {l.label}
                </motion.button>
              ))}
            </motion.nav>
            <motion.div
              className="menu-foot mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${PROFILE.email}`}>Email</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
