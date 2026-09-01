import { useEffect, useRef } from 'react'
import { PROFILE } from '../data/portfolio.js'
import { scrambleTo } from './ScrambleText.jsx'

export default function RoleRotator() {
  const ref = useRef(null)

  useEffect(() => {
    let i = 0
    let timer
    const swap = () => {
      i = (i + 1) % PROFILE.roles.length
      if (ref.current) scrambleTo(ref.current, PROFILE.roles[i], 560)
      timer = setTimeout(swap, 2700)
    }
    timer = setTimeout(swap, 2300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="hero-role mono">
      <span className="slash">//</span>
      <span ref={ref}>{PROFILE.roles[0]}</span>
      <span className="caret" />
    </div>
  )
}
