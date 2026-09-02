import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { PROFILE } from '../data/portfolio.js'
import { scrollToId } from '../lib/scroll.js'
import Magnetic from './Magnetic.jsx'
import NeuralCanvas from './NeuralCanvas.jsx'
import RoleRotator from './RoleRotator.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 44, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.21, 0.65, 0.16, 1] },
  },
}

export default function Hero({ booted }) {
  const { scrollY } = useScroll()
  const yTitle = useTransform(scrollY, [0, 700], [0, -110])
  const oTitle = useTransform(scrollY, [0, 520], [1, 0])

  return (
    <section id="home" className="hero">
      <NeuralCanvas />
      <div className="hero-vignette" />
      <motion.div style={{ y: yTitle, opacity: oTitle }} className="hero-inner">
        <motion.div
          className="container"
          variants={container}
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
        >
          <motion.p className="eyebrow hero-kicker mono" variants={item}>
            // initializing portfolio_os v2.0
          </motion.p>
          <h1 className="hero-title">
            <motion.span className="row grad" variants={item}>
              {PROFILE.firstName}
            </motion.span>
            <motion.span className="row grad" variants={item}>
              {PROFILE.lastName}
            </motion.span>
          </h1>
          <motion.div variants={item}>
            <RoleRotator />
          </motion.div>
          <motion.p className="hero-sub" variants={item}>
            {PROFILE.sub}
          </motion.p>
          <motion.div className="hero-cta" variants={item}>
            <Magnetic>
              <button className="btn btn-primary" onClick={() => scrollToId('#projects')}>
                Explore My Work <ArrowUpRight size={17} />
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn btn-ghost" onClick={() => scrollToId('#contact')}>
                Get In Touch
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>
      <div className="hero-foot">
        <div className="container hero-foot-in">
          <button className="scroll-hint mono" onClick={() => scrollToId('#about')}>
            scroll <ChevronDown size={15} />
          </button>
          <div className="status-chip mono">
            <span className="pulse-dot" /> Nagpur, IN — open to work
          </div>
        </div>
      </div>
    </section>
  )
}
