/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Points } from "three";

function pseudoRandom(index: number, salt: number) {
	const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
	return value - Math.floor(value);
}

function createParticleBuffers(
	particleCount: number,
	zScale: number,
	zOffset: number,
	minSpeed: number,
	speedRange: number,
) {
	const positions = new Float32Array(particleCount * 3);
	const basePositions = new Float32Array(particleCount * 3);
	const speeds = new Float32Array(particleCount);

	for (let i = 0; i < particleCount; i++) {
		const x = (pseudoRandom(i, 1) - 0.5) * 20;
		const y = (pseudoRandom(i, 2) - 0.5) * 20;
		const z = (pseudoRandom(i, 3) - 0.5) * zScale + zOffset;

		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;

		basePositions[i * 3] = x;
		basePositions[i * 3 + 1] = y;
		basePositions[i * 3 + 2] = z;

		speeds[i] = pseudoRandom(i, 4) * speedRange + minSpeed;
	}

	return { positions, basePositions, speeds };
}

function BackgroundParticles() {
	const particlesRef = useRef<Points>(null);
	const elapsedRef = useRef(0);

	// Generate dense, slow particles
	const { positions, basePositions, speeds } = useMemo(
		() => createParticleBuffers(1800, 10, -2, 0.05, 0.15),
		[],
	);

	useFrame((_, delta) => {
		if (!particlesRef.current) return;
		const positionsAttr = particlesRef.current.geometry.attributes.position;

		// Cap delta to prevent massive jumps if framedrops occur during scroll end
		const safeDelta = Math.min(delta, 0.05);
		elapsedRef.current += safeDelta;
		const lerpFactor = 0.1; // Use a fixed lerp factor instead of time-based exponential to ensure deterministic smoothing when wheel stops

		for (let i = 0; i < positionsAttr.count; i++) {
			const idxX = i * 3;
			const idxY = i * 3 + 1;
			const idxZ = i * 3 + 2;

			const speed = speeds[i];
			const startY = basePositions[idxY];
			const driftY = ((startY + elapsedRef.current * speed + 10) % 20) - 10;
			const wrapped = driftY < startY;

			const currentX = positionsAttr.array[idxX] as number;
			const currentY = positionsAttr.array[idxY] as number;
			const currentZ = positionsAttr.array[idxZ] as number;

			if (wrapped) {
				positionsAttr.array[idxX] = basePositions[idxX];
				positionsAttr.array[idxY] = driftY;
				positionsAttr.array[idxZ] = basePositions[idxZ];
			} else {
				positionsAttr.array[idxX] =
					currentX + (basePositions[idxX] - currentX) * lerpFactor;
				positionsAttr.array[idxY] = currentY + (driftY - currentY) * lerpFactor;
				positionsAttr.array[idxZ] =
					currentZ + (basePositions[idxZ] - currentZ) * lerpFactor;
			}
		}

		positionsAttr.needsUpdate = true;

		particlesRef.current.rotation.y += safeDelta * 0.02;
		particlesRef.current.rotation.x = Math.sin(elapsedRef.current * 0.1) * 0.05;
	});

	return (
		<points ref={particlesRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={0.02}
				color="#E8FF47"
				transparent
				opacity={0.15}
				sizeAttenuation={true}
				depthWrite={false}
				blending={AdditiveBlending}
			/>
		</points>
	);
}

function ForegroundParticles() {
	const particlesRef = useRef<Points>(null);
	const elapsedRef = useRef(0);

	// Generate sparse, fast, larger particles
	const { positions, basePositions, speeds } = useMemo(
		() => createParticleBuffers(50, 5, 2, 0.2, 0.4),
		[],
	);

	useFrame((_, delta) => {
		if (!particlesRef.current) return;
		const positionsAttr = particlesRef.current.geometry.attributes.position;

		// Cap delta to prevent massive jumps if framedrops occur
		const safeDelta = Math.min(delta, 0.05);
		elapsedRef.current += safeDelta;
		const lerpFactor = 0.1;

		for (let i = 0; i < positionsAttr.count; i++) {
			const idxX = i * 3;
			const idxY = i * 3 + 1;
			const idxZ = i * 3 + 2;

			const speed = speeds[i];
			const startY = basePositions[idxY];
			const driftY = ((startY + elapsedRef.current * speed + 10) % 20) - 10;
			const wrapped = driftY < startY;

			const currentX = positionsAttr.array[idxX] as number;
			const currentY = positionsAttr.array[idxY] as number;
			const currentZ = positionsAttr.array[idxZ] as number;

			if (wrapped) {
				positionsAttr.array[idxX] = basePositions[idxX];
				positionsAttr.array[idxY] = driftY;
				positionsAttr.array[idxZ] = basePositions[idxZ];
			} else {
				positionsAttr.array[idxX] =
					currentX + (basePositions[idxX] - currentX) * lerpFactor;
				positionsAttr.array[idxY] = currentY + (driftY - currentY) * lerpFactor;
				positionsAttr.array[idxZ] =
					currentZ + (basePositions[idxZ] - currentZ) * lerpFactor;
			}
		}

		positionsAttr.needsUpdate = true;

		// Counter-rotate slightly
		particlesRef.current.rotation.y -= safeDelta * 0.03;
		particlesRef.current.rotation.x = Math.sin(elapsedRef.current * 0.3) * 0.08;
	});

	return (
		<points ref={particlesRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={0.07} // larger size
				color="#E8FF47"
				transparent
				opacity={0.6} // more visible
				sizeAttenuation={true}
				depthWrite={false}
				blending={AdditiveBlending}
			/>
		</points>
	);
}

export default function WebGLBackground() {
	return (
		<div
			id="webgl-bg"
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 0,
				pointerEvents: "none",
				background: "var(--bg-void)", // Dark near-black clear color
			}}
		>
			<Canvas
				camera={{ position: [0, 0, 5], fov: 50 }}
				dpr={[1, 2]} // Optimize for high DPI, cap at 2 for performance
				gl={{ antialias: false, alpha: false }} // No alpha needed, handlig background manually
			>
				<BackgroundParticles />
				<ForegroundParticles />
				{/* Subtle fog blending into the void background */}
				<fog attach="fog" args={["#080808", 3, 15]} />
			</Canvas>
		</div>
	);
}
