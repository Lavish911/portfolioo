import { useEffect, useState } from 'react'

export default function Preloader({ onDone }) {
  const [n, setN] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let v = 0
    const id = setInterval(() => {
      v += Math.random() * 15 + 7
      if (v >= 100) {
        v = 100
        clearInterval(id)
        setTimeout(() => {
          setOut(true)
          onDone()
        }, 300)
        setTimeout(() => setGone(true), 1400)
      }
      setN(Math.floor(v))
    }, 100)
    return () => clearInterval(id)
  }, [onDone])

  if (gone) return null

  return (
    <div className={`preloader${out ? ' out' : ''}`}>
      <span className="pre-corner pc-tl mono">LAVISH RAHANGDALE</span>
      <span className="pre-corner pc-tr mono">PORTFOLIO_OS v2.0</span>
      <span className="pre-corner pc-bl mono">AI × WEB × ML</span>
      <div className="pre-inner">
        <div className="pre-num grad">{n}%</div>
        <p className="pre-label mono">INITIALIZING NEURAL INTERFACE</p>
        <div className="pre-bar">
          <i style={{ width: `${n}%` }} />
        </div>
      </div>
    </div>
  )
}
