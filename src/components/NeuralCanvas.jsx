import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const NEUTRAL_PRIMARY = new THREE.Color('#737373')
const NEUTRAL_SECONDARY = new THREE.Color('#A3A3A3')
const NEUTRAL_DARK = new THREE.Color('#525252')
const AMBER_ACCENT = new THREE.Color('#F5A623')

function makeSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.28, 'rgba(255,255,255,0.82)')
  grd.addColorStop(0.55, 'rgba(255,255,255,0.22)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function Cloud({ count, visibleRef }) {
  const groupRef = useRef(null)
  const wireRef = useRef(null)
  const starsRef = useRef(null)
  const pointsAttr = useRef(null)
  const linesAttr = useRef(null)
  const spin = useRef({ base: Math.random() * Math.PI * 2 })
  const { camera, pointer } = useThree()
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const tex = useMemo(makeSprite, [])

  const nodes = useMemo(() => {
    const base = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const wobDir = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    const speed = new Float32Array(count)
    const tmp = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const rad = 1.55 + (Math.random() - 0.5) * 0.55
      tmp.setFromSphericalCoords(rad, phi, theta)
      base[i * 3] = tmp.x
      base[i * 3 + 1] = tmp.y
      base[i * 3 + 2] = tmp.z
      const roll = Math.random()
      let c
      if (roll < 0.08) c = AMBER_ACCENT
      else if (roll < 0.22) c = NEUTRAL_DARK
      else if (roll < 0.62) c = NEUTRAL_PRIMARY
      else c = NEUTRAL_SECONDARY
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      tmp.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
      wobDir[i * 3] = tmp.x
      wobDir[i * 3 + 1] = tmp.y
      wobDir[i * 3 + 2] = tmp.z
      phase[i] = Math.random() * Math.PI * 2
      speed[i] = 0.6 + Math.random() * 1.1
    }
    return { base, col, wobDir, phase, speed }
  }, [count])

  const livePos = useMemo(() => new Float32Array(count * 3), [count])

  const segs = useMemo(() => {
    const pairs = []
    const maxD = 0.62
    outer: for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = nodes.base[i * 3] - nodes.base[j * 3]
        const dy = nodes.base[i * 3 + 1] - nodes.base[j * 3 + 1]
        const dz = nodes.base[i * 3 + 2] - nodes.base[j * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < maxD * maxD) {
          pairs.push(i, j)
          if (pairs.length > 820) break outer
        }
      }
    }
    return pairs
  }, [nodes, count])

  const linePos = useMemo(() => new Float32Array(Math.max(segs.length / 2, 1) * 6), [segs])
  const disp = useMemo(() => new Float32Array(count * 3), [count])

  const starsGeo = useMemo(() => {
    const n = 320
    const p = new Float32Array(n * 3)
    const tmp = new THREE.Vector3()
    for (let i = 0; i < n; i++) {
      tmp
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(3.4 + Math.random() * 3.6)
      p[i * 3] = tmp.x
      p[i * 3 + 1] = tmp.y
      p[i * 3 + 2] = tmp.z
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  }, [])

  const wireGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.02, 1)), [])
  const mp = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    try {
      if (prefersReduced) return
      if (visibleRef && !visibleRef.current) return
      if (document.hidden) return
      if (!Number.isFinite(delta) || delta <= 0 || delta > 0.2) delta = 0.016
      const t = state.clock.elapsedTime
      if (!Number.isFinite(t)) return
      mp.set(pointer.x, pointer.y, 0.5).unproject(camera)
      dir.copy(mp).sub(camera.position).normalize()
      if (!Number.isFinite(dir.x) || !Number.isFinite(dir.y) || !Number.isFinite(dir.z)) return
      const denom = dir.z
      if (!Number.isFinite(denom) || Math.abs(denom) < 1e-6) return
      const tt = -camera.position.z / denom
      if (!Number.isFinite(tt)) return
      mp.copy(camera.position).add(dir.multiplyScalar(tt))
      if (!Number.isFinite(mp.x) || !Number.isFinite(mp.y) || !Number.isFinite(mp.z)) return

      const { base, wobDir, phase, speed } = nodes
      for (let i = 0; i < count; i++) {
        const ix = i * 3
        const w = Math.sin(t * speed[i] + phase[i]) * 0.03
        let x = base[ix] + wobDir[ix] * w
        let y = base[ix + 1] + wobDir[ix + 1] * w
        let z = base[ix + 2] + wobDir[ix + 2] * w
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
          x = base[ix]
          y = base[ix + 1]
          z = base[ix + 2]
        }
        const dx = x - mp.x
        const dy = y - mp.y
        const dz = z - mp.z
        const d2 = dx * dx + dy * dy + dz * dz
        disp[ix] *= 0.9
        disp[ix + 1] *= 0.9
        disp[ix + 2] *= 0.9
        if (d2 < 0.7225 && d2 > 0.0001) {
          const d = Math.sqrt(d2)
          if (!Number.isFinite(d) || d < 1e-6) {
          } else {
            const push = ((1 - d / 0.85) * 0.05) / d
            if (Number.isFinite(push)) {
              disp[ix] += dx * push
              disp[ix + 1] += dy * push
              disp[ix + 2] += dz * push
            }
          }
        }
        const nx = x + disp[ix]
        const ny = y + disp[ix + 1]
        const nz = z + disp[ix + 2]
        livePos[ix] = Number.isFinite(nx) ? nx : x
        livePos[ix + 1] = Number.isFinite(ny) ? ny : y
        livePos[ix + 2] = Number.isFinite(nz) ? nz : z
      }

      if (pointsAttr.current) pointsAttr.current.needsUpdate = true

      for (let s = 0; s < segs.length; s += 2) {
        const a = segs[s] * 3
        const b = segs[s + 1] * 3
        const o = (s / 2) * 6
        const ax = livePos[a]
        const ay = livePos[a + 1]
        const az = livePos[a + 2]
        const bx = livePos[b]
        const by = livePos[b + 1]
        const bz = livePos[b + 2]
        if (![ax, ay, az, bx, by, bz].every(Number.isFinite)) continue
        linePos[o] = ax
        linePos[o + 1] = ay
        linePos[o + 2] = az
        linePos[o + 3] = bx
        linePos[o + 4] = by
        linePos[o + 5] = bz
      }
      if (linesAttr.current) linesAttr.current.needsUpdate = true

      const g = groupRef.current
      if (g) {
        spin.current.base = (spin.current.base + delta * 0.07) % (Math.PI * 2)
        const targetY = pointer.x * 0.3 + spin.current.base
        const targetX = -pointer.y * 0.18
        if (Number.isFinite(targetY) && Number.isFinite(targetX)) {
          g.rotation.y += (targetY - g.rotation.y) * 0.045
          g.rotation.x += (targetX - g.rotation.x) * 0.045
        }
      }
      if (wireRef.current) {
        wireRef.current.rotation.y -= delta * 0.06
        wireRef.current.rotation.z += delta * 0.02
      }
      if (starsRef.current) {
        starsRef.current.rotation.y += delta * 0.008
        if (!Number.isFinite(starsRef.current.rotation.y)) starsRef.current.rotation.y = 0
      }
    } catch (e) {
      console.error('[NeuralCanvas] frame error:', e)
    }
  })

  return (
    <>
      <group ref={groupRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute ref={pointsAttr} attach="attributes-position" args={[livePos, 3]} />
            <bufferAttribute attach="attributes-color" args={[nodes.col, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.038}
            map={tex}
            vertexColors
            transparent
            opacity={0.46}
            depthWrite={false}
            blending={THREE.NormalBlending}
            sizeAttenuation
          />
        </points>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute ref={linesAttr} attach="attributes-position" args={[linePos, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#475569"
            transparent
            opacity={0.08}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </lineSegments>
        <lineSegments ref={wireRef}>
          <edgesGeometry args={[wireGeo]} />
          <lineBasicMaterial color="#525252" transparent opacity={0.028} depthWrite={false} />
        </lineSegments>
      </group>
      <points ref={starsRef} geometry={starsGeo}>
        <pointsMaterial
          size={0.016}
          color="#737373"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.NormalBlending}
          sizeAttenuation
        />
      </points>
    </>
  )
}

export default function NeuralCanvas() {
  const [count] = useState(() => {
    if (typeof window === 'undefined') return 140
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) return 72
    return window.innerWidth < 768 ? 92 : 150
  })
  const wrapRef = useRef(null)
  const visibleRef = useRef(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { rootMargin: '120px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="hero-canvas" ref={wrapRef}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.6], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        onCreated={({ gl }) => {
          const canvas = gl.domElement
          if (!canvas) return
          const onLost = (e) => {
            e.preventDefault()
            console.warn('[NeuralCanvas] WebGL context lost')
          }
          const onRestored = () => {
            console.warn('[NeuralCanvas] WebGL context restored')
          }
          canvas.addEventListener('webglcontextlost', onLost, false)
          canvas.addEventListener('webglcontextrestored', onRestored, false)
          const checkSize = () => {
            if (canvas.width === 0 || canvas.height === 0) {
              console.warn('[NeuralCanvas] canvas dimensions invalid', canvas.width, canvas.height)
            }
          }
          const visHandler = () => {
            if (!document.hidden) checkSize()
          }
          document.addEventListener('visibilitychange', visHandler)
        }}
      >
        <Cloud count={count} visibleRef={visibleRef} />
      </Canvas>
    </div>
  )
}
