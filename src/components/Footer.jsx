import { ArrowUp } from 'lucide-react'
import { NAV_LINKS } from '../data/portfolio.js'
import { scrollToId } from '../lib/scroll.js'
import Magnetic from './Magnetic.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <span>© {new Date().getFullYear()} Lavish Rahangdale — crafted with React &amp; Three.js</span>
        <nav className="footer-links">
          {NAV_LINKS.slice(1).map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(`#${l.id}`)
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <span className="konami-hint">↑↑↓↓←→←→BA</span>
        <Magnetic strength={0.4}>
          <button className="card to-top" onClick={() => scrollToId('#home')} aria-label="Back to top">
            <ArrowUp size={17} />
          </button>
        </Magnetic>
      </div>
    </footer>
  )
}
