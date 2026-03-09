import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function AtmosphereParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const { clock } = useThree()

  // Generate 2000 particles spread across a wide volume
  const [positions, basePositions, speeds] = useMemo(() => {
    const particleCount = 2000
    const pos = new Float32Array(particleCount * 3)
    const basePos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Random position across viewport and depth
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 10

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      basePos[i * 3] = x
      basePos[i * 3 + 1] = y
      basePos[i * 3 + 2] = z

      // Random specific speed for each particle
      spd[i] = Math.random() * 0.5 + 0.1
    }
    return [pos, basePos, spd]
  }, [])

  // Animate the particles
  useFrame((state, delta) => {
    if (!particlesRef.current) return
    const positionsAttr = particlesRef.current.geometry.attributes.position

    // Map NDC cursor (-1 to 1) to rough world coordinates at z=0 
    // Camera is at z=5, so width is ~10 at z=0 depending on fov
    const pointerX = state.pointer.x * 12;
    const pointerY = state.pointer.y * 8; // Adjust based on common aspect ratios

    for (let i = 0; i < positionsAttr.count; i++) {
      const xStr = i * 3
      const yStr = i * 3 + 1
      const zStr = i * 3 + 2
      
      const currentX = positionsAttr.array[xStr] as number
      const currentY = positionsAttr.array[yStr] as number
      const currentZ = positionsAttr.array[zStr] as number
      const speed = speeds[i]

      // INTERACTION: Repulsion
      const dx = pointerX - currentX;
      const dy = pointerY - currentY;
      const distSq = dx * dx + dy * dy;
      const radiusSq = 9.0; // Interaction radius squared

      if (distSq < radiusSq && distSq > 0.01) {
        // Push away from cursor
        const force = (radiusSq - distSq) / radiusSq;
        // Move opposite to dx, dy
        positionsAttr.array[xStr] = currentX - (dx / Math.sqrt(distSq)) * force * 0.2;
        positionsAttr.array[zStr] = currentZ - force * 0.1;
      } else {
        // Spring back to base X/Z
        const baseX = basePositions[xStr];
        const baseZ = basePositions[zStr];
        positionsAttr.array[xStr] = currentX + (baseX - currentX) * 0.05;
        positionsAttr.array[zStr] = currentZ + (baseZ - currentZ) * 0.05;
      }

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
