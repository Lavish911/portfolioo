const listeners = new Set()

let lowPower = detectWeakGpu()

function detectWeakGpu() {
  try {
    let score = 0
    const cores = navigator.hardwareConcurrency || 4
    const mem = navigator.deviceMemory
    if (cores <= 4) score += 1
    if (mem && mem <= 4) score += 2
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (!gl) return true
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const r = String(
      ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || '',
    )
    if (/swiftshader|llvmpipe|software|basic render/i.test(r)) return true
    if (/intel/i.test(r) && !/iris|arc/i.test(r)) score += 2
    if (/mali|adreno [1-5]|videocore/i.test(r)) score += 2
    return score >= 2
  } catch {
    return false
  }
}

export function isLowPower() {
  return lowPower
}

export function setLowPower(v) {
  if (v === lowPower) return
  lowPower = v
  listeners.forEach((fn) => fn(v))
}

export function onLowPowerChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
