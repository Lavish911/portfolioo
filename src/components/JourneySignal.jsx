import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const NEUTRAL = new THREE.Color('#737373')
const NEUTRAL_DARK = new THREE.Color('#525252')
const AMBER = new THREE.Color('#F5A623')

function SignalCloud({ count, activeIndex, visibleRef }) {
  const groupRef = useRef(null)
  const pointsRef = useRef(null)
  const linesRef = useRef(null)
  const visiblePointsRef = useRef(null)
  const { pointer } = useThree()
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const { positions, colors, basePositions, phases } = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const total = isMobile ? Math.min(32, count) : count
    const pos = new Float32Array(total * 3)
    const col = new Float32Array(total * 3)
    const base = new Float32Array(total * 3)
    const ph = new Float32Array(total)
    const centers = [
      { y: -1.15, x: 0.02, count: Math.floor(total * 0.22) },
      { y: -0.38, x: -0.08, count: Math.floor(total * 0.26) },
      { y: 0.42, x: 0.07, count: Math.floor(total * 0.28) },
      { y: 1.18, x: -0.02, count: total - Math.floor(total * 0.22) - Math.floor(total * 0.26) - Math.floor(total * 0.28) },
    ]
    let idx = 0
    centers.forEach((c, ci) => {
      for (let i = 0; i < c.count; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * 0.18 + (ci === activeIndex ? 0.02 : 0)
        const x = c.x + Math.cos(angle) * r
        const y = c.y + Math.sin(angle) * r * 0.65
        const z = (Math.random() - 0.5) * 0.14
        pos[idx * 3] = x
        pos[idx * 3 + 1] = y
        pos[idx * 3 + 2] = z
        base[idx * 3] = x
        base[idx * 3 + 1] = y
        base[idx * 3 + 2] = z
        ph[idx] = Math.random() * Math.PI * 2
        const isActive = ci === activeIndex
        const colPick = isActive ? AMBER : Math.random() < 0.35 ? NEUTRAL_DARK : NEUTRAL
        col[idx * 3] = colPick.r
        col[idx * 3 + 1] = colPick.g
        col[idx * 3 + 2] = colPick.b
        idx++
      }
    })
    return { positions: pos, colors: col, basePositions: base, phases: ph }
  }, [count, activeIndex])

  const linePositions = useMemo(() => {
    const centers = [
      new THREE.Vector3(0.02, -1.15, 0),
      new THREE.Vector3(-0.08, -0.38, 0),
      new THREE.Vector3(0.07, 0.42, 0),
      new THREE.Vector3(-0.02, 1.18, 0),
    ]
    const segs = []
    for (let i = 0; i < centers.length - 1; i++) {
      segs.push(centers[i].x, centers[i].y, centers[i].z, centers[i + 1].x, centers[i + 1].y, centers[i + 1].z)
    }
    return new Float32Array(segs)
  }, [])

  const visibleLineLen = useMemo(() => {
    if (activeIndex < 0) return 0
    return (activeIndex + 1) * 6
  }, [activeIndex])

  useFrame((state, delta) => {
    if (prefersReduced) return
    if (visibleRef && !visibleRef.current) return
    if (document.hidden) return
    const t = state.clock.elapsedTime
    const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const positionsAttr = pointsRef.current?.geometry?.attributes?.position
    if (!positionsAttr) return
    const arr = positionsAttr.array
    for (let i = 0; i < arr.length / 3; i++) {
      const baseX = basePositions[i * 3]
      const baseY = basePositions[i * 3 + 1]
      const baseZ = basePositions[i * 3 + 2]
      const drift = Math.sin(t * 0.42 + phases[i]) * 0.018
      arr[i * 3] = baseX + drift
      arr[i * 3 + 1] = baseY + Math.cos(t * 0.31 + phases[i]) * 0.012
      arr[i * 3 + 2] = baseZ
    }
    positionsAttr.needsUpdate = true

    if (groupRef.current && !isCoarse) {
      const targetY = pointer.x * 0.08
      const targetX = -pointer.y * 0.05
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04
    }

    if (linesRef.current) {
      linesRef.current.visible = true
    }
    if (visiblePointsRef.current) {
      const len = Math.min(visibleLineLen, linePositions.length)
      const geom = visiblePointsRef.current.geometry
      const posAttr = geom.getAttribute('position')
      if (posAttr) {
        posAttr.needsUpdate = true
      }
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.032} vertexColors transparent opacity={0.62} sizeAttenuation depthWrite={false} blending={THREE.NormalBlending} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={NEUTRAL} transparent opacity={0.13} depthWrite={false} />
      </lineSegments>
      <lineSegments ref={visiblePointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions.slice(0, visibleLineLen), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={AMBER} transparent opacity={0.52} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

export default function JourneySignal({ activeIndex = 0 }) {
  const wrapRef = useRef(null)
  const visibleRef = useRef(true)
  const [count] = useState(() => {
    if (typeof window === 'undefined') return 68
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) return 28
    return window.innerWidth < 768 ? 36 : 78
  })

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { rootMargin: '120px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="journey-signal" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        onCreated={({ gl }) => {
          const canvas = gl.domElement
          if (!canvas) return
          const onLost = (e) => {
            e.preventDefault()
            console.warn('[JourneySignal] WebGL context lost')
          }
          const onRestored = () => console.warn('[JourneySignal] WebGL context restored')
          canvas.addEventListener('webglcontextlost', onLost, false)
          canvas.addEventListener('webglcontextrestored', onRestored, false)
        }}
      >
        <SignalCloud count={count} activeIndex={activeIndex} visibleRef={visibleRef} />
      </Canvas>
    </div>
  )
}
