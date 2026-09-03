import { useEffect, useState } from 'react'
import { toast } from './lib/toast.js'
import { initLenis } from './lib/scroll.js'
import About from './components/About.jsx'
import Background from './components/Background.jsx'
import Contact from './components/Contact.jsx'
import Cursor from './components/Cursor.jsx'
import Experience from './components/Experience.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import MatrixRain from './components/MatrixRain.jsx'
import Navbar from './components/Navbar.jsx'
import Preloader from './components/Preloader.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import ToastHost from './components/ToastHost.jsx'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export default function App() {
  const [booted, setBooted] = useState(false)
  const [matrix, setMatrix] = useState(false)

  useEffect(() => {
    initLenis()
  }, [])

  useEffect(() => {
    document.body.style.overflow = booted ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [booted])

  useEffect(() => {
    let buf = []
    const onKey = (e) => {
      if (matrix && e.key === 'Escape') {
        setMatrix(false)
        toast('MATRIX MODE OFFLINE')
        return
      }
      buf = [...buf, e.key].slice(-KONAMI.length)
      if (buf.join(',') === KONAMI.join(',')) {
        buf = []
        setMatrix((m) => {
          toast(!m ? 'MATRIX MODE ENGAGED' : 'MATRIX MODE OFFLINE')
          return !m
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [matrix])

  return (
    <>
      <Preloader onDone={() => setBooted(true)} />
      <Cursor />
      <ProgressBar />
      <Background />
      <Navbar />
      <main>
        <Hero booted={booted} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <MatrixRain on={matrix} />
      <ToastHost />
    </>
  )
}
