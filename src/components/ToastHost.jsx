import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function ToastHost() {
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    let t
    const on = (e) => {
      setMsg(e.detail)
      clearTimeout(t)
      t = setTimeout(() => setMsg(null), 2600)
    }
    window.addEventListener('app:toast', on)
    return () => {
      window.removeEventListener('app:toast', on)
      clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          className="toast mono"
          initial={{ y: 44, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 44, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          <Check size={14} />
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
