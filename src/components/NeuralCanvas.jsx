import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const SLATE_PRIMARY = new THREE.Color('#64748B')
const SLATE_SECONDARY = new THREE.Color('#94A3B8')
const BLUE_MUTED = new THREE.Color('#38BDF8')
const VIOLET_MUTED = new THREE.Color('#8B7CF6')

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
      if (roll < 0.10) c = BLUE_MUTED
      else if (roll < 0.20) c = VIOLET_MUTED
      else if (roll < 0.55) c = SLATE_PRIMARY
      else c = SLATE_SECONDARY
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
    if (prefersReduced) return
    if (visibleRef && !visibleRef.current) return
    if (document.hidden) return
    const t = state.clock.elapsedTime
    mp.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(mp).sub(camera.position).normalize()
    const tt = -camera.position.z / dir.z
    mp.copy(camera.position).add(dir.multiplyScalar(tt))

    const { base, wobDir, phase, speed } = nodes
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const w = Math.sin(t * speed[i] + phase[i]) * 0.03
      let x = base[ix] + wobDir[ix] * w
      let y = base[ix + 1] + wobDir[ix + 1] * w
      let z = base[ix + 2] + wobDir[ix + 2] * w
      const dx = x - mp.x
      const dy = y - mp.y
      const dz = z - mp.z
      const d2 = dx * dx + dy * dy + dz * dz
      disp[ix] *= 0.9
      disp[ix + 1] *= 0.9
      disp[ix + 2] *= 0.9
      if (d2 < 0.7225 && d2 > 0.0001) {
        const d = Math.sqrt(d2)
        const push = ((1 - d / 0.85) * 0.05) / d
        disp[ix] += dx * push
        disp[ix + 1] += dy * push
        disp[ix + 2] += dz * push
      }
      livePos[ix] = x + disp[ix]
      livePos[ix + 1] = y + disp[ix + 1]
      livePos[ix + 2] = z + disp[ix + 2]
    }

    if (pointsAttr.current) pointsAttr.current.needsUpdate = true

    for (let s = 0; s < segs.length; s += 2) {
      const a = segs[s] * 3
      const b = segs[s + 1] * 3
      const o = (s / 2) * 6
      linePos[o] = livePos[a]
      linePos[o + 1] = livePos[a + 1]
      linePos[o + 2] = livePos[a + 2]
      linePos[o + 3] = livePos[b]
      linePos[o + 4] = livePos[b + 1]
      linePos[o + 5] = livePos[b + 2]
    }
    if (linesAttr.current) linesAttr.current.needsUpdate = true

    const g = groupRef.current
    if (g) {
      spin.current.base += delta * 0.07
      g.rotation.y += (pointer.x * 0.3 + spin.current.base - g.rotation.y) * 0.045
      g.rotation.x += (-pointer.y * 0.18 - g.rotation.x) * 0.045
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.06
      wireRef.current.rotation.z += delta * 0.02
    }
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008
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
          <lineBasicMaterial color="#64748B" transparent opacity={0.032} depthWrite={false} />
        </lineSegments>
      </group>
      <points ref={starsRef} geometry={starsGeo}>
        <pointsMaterial
          size={0.016}
          color="#64748B"
          transparent
          opacity={0.14}
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
      >
        <Cloud count={count} visibleRef={visibleRef} />
      </Canvas>
    </div>
  )
}
