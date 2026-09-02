import { useEffect } from 'react'

export default function DebugProbe() {
  useEffect(() => {
    const onError = (e) => console.error('[GLOBAL ERROR]', e.message, e.error?.stack)
    const onRej = (e) => console.error('[UNHANDLED REJECTION]', e.reason)
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRej)
    let rafId
    const heartbeat = () => {
      rafId = requestAnimationFrame(heartbeat)
    }
    rafId = requestAnimationFrame(heartbeat)
    const iv = setInterval(() => {
      try {
        const root = document.getElementById('root')
        const main = document.querySelector('main')
        if (root && getComputedStyle(root).opacity === '0') console.error('[PROBE] ROOT OPACITY 0')
        if (main && main.clientHeight === 0) console.error('[PROBE] MAIN HEIGHT 0')
        if (document.body.innerText.length < 300) console.error('[PROBE] BODY TEXT GONE', document.body.innerText.length)
        if (!Number.isFinite(window.scrollY)) console.error('[PROBE] scrollY NaN')
      } catch {}
    }, 3000)
    return () => {
      clearInterval(iv)
      cancelAnimationFrame(rafId)
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRej)
    }
  }, [])
  return null
}
