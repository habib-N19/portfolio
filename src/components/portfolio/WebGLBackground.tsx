import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function AtmosphereParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const { clock } = useThree()

  // Generate 2000 particles spread across a wide volume
  const [positions, speeds] = useMemo(() => {
    const particleCount = 2000
    const pos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Random position across viewport and depth
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10

      // Random specific speed for each particle
      spd[i] = Math.random() * 0.5 + 0.1
    }
    return [pos, spd]
  }, [])

  // Animate the particles
  useFrame((_, delta) => {
    if (!particlesRef.current) return
    const positionsAttr = particlesRef.current.geometry.attributes.position

    for (let i = 0; i < positionsAttr.count; i++) {
      const yStr = i * 3 + 1
      const currentY = positionsAttr.array[yStr] as number
      const speed = speeds[i]

      // Particles drift upwards, simulating atmosphere/data
      let nextY = currentY + speed * delta

      // Reset when they go too high
      if (nextY > 10) {
        nextY = -10
      }

      positionsAttr.array[yStr] = nextY
    }

    positionsAttr.needsUpdate = true

    // Subtle global rotation
    particlesRef.current.rotation.y += delta * 0.05
    particlesRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#E8FF47"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function WebGLBackground() {
  return (
    <div
      id="webgl-bg"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'var(--bg-void)', // Dark near-black clear color
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]} // Optimize for high DPI, cap at 2 for performance
        gl={{ antialias: false, alpha: false }} // No alpha needed, handlig background manually
      >
        <AtmosphereParticles />
        {/* Subtle fog blending into the void background */}
        <fog attach="fog" args={['#080808', 3, 15]} />
      </Canvas>
    </div>
  )
}
