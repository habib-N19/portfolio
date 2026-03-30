import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Points } from "three";

function BackgroundParticles() {
	const particlesRef = useRef<Points>(null);
	const elapsedRef = useRef(0);

	// Generate dense, slow particles
	const [positions, basePositions, speeds] = useMemo(() => {
		const particleCount = 1800;
		const pos = new Float32Array(particleCount * 3);
		const basePos = new Float32Array(particleCount * 3);
		const spd = new Float32Array(particleCount);

		for (let i = 0; i < particleCount; i++) {
			const x = (Math.random() - 0.5) * 20;
			const y = (Math.random() - 0.5) * 20;
			const z = (Math.random() - 0.5) * 10 - 2; // pushed back

			pos[i * 3] = x;
			pos[i * 3 + 1] = y;
			pos[i * 3 + 2] = z;

			basePos[i * 3] = x;
			basePos[i * 3 + 1] = y;
			basePos[i * 3 + 2] = z;

			spd[i] = Math.random() * 0.15 + 0.05; // very slow
		}
		return [pos, basePos, spd];
	}, []);

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

			let nextBaseY = basePositions[idxY] + speed * safeDelta;
			let wrapped = false;
			if (nextBaseY > 10) {
				nextBaseY -= 20;
				wrapped = true;
			}
			basePositions[idxY] = nextBaseY;

			const currentX = positionsAttr.array[idxX] as number;
			const currentY = positionsAttr.array[idxY] as number;
			const currentZ = positionsAttr.array[idxZ] as number;

			if (wrapped) {
				positionsAttr.array[idxX] = basePositions[idxX];
				positionsAttr.array[idxY] = nextBaseY;
				positionsAttr.array[idxZ] = basePositions[idxZ];
			} else {
				positionsAttr.array[idxX] =
					currentX + (basePositions[idxX] - currentX) * lerpFactor;
				positionsAttr.array[idxY] =
					currentY + (nextBaseY - currentY) * lerpFactor;
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
	const [positions, basePositions, speeds] = useMemo(() => {
		const particleCount = 50; // Much fewer
		const pos = new Float32Array(particleCount * 3);
		const basePos = new Float32Array(particleCount * 3);
		const spd = new Float32Array(particleCount);

		for (let i = 0; i < particleCount; i++) {
			const x = (Math.random() - 0.5) * 20;
			const y = (Math.random() - 0.5) * 20;
			const z = (Math.random() - 0.5) * 5 + 2; // closer to camera

			pos[i * 3] = x;
			pos[i * 3 + 1] = y;
			pos[i * 3 + 2] = z;

			basePos[i * 3] = x;
			basePos[i * 3 + 1] = y;
			basePos[i * 3 + 2] = z;

			spd[i] = Math.random() * 0.4 + 0.2; // faster
		}
		return [pos, basePos, spd];
	}, []);

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

			// Background drift
			let nextBaseY = basePositions[idxY] + speed * safeDelta;
			let wrapped = false;
			if (nextBaseY > 10) {
				nextBaseY -= 20;
				wrapped = true;
			}
			basePositions[idxY] = nextBaseY;

			const currentX = positionsAttr.array[idxX] as number;
			const currentY = positionsAttr.array[idxY] as number;
			const currentZ = positionsAttr.array[idxZ] as number;

			if (wrapped) {
				positionsAttr.array[idxX] = basePositions[idxX];
				positionsAttr.array[idxY] = nextBaseY;
				positionsAttr.array[idxZ] = basePositions[idxZ];
			} else {
				positionsAttr.array[idxX] =
					currentX + (basePositions[idxX] - currentX) * lerpFactor;
				positionsAttr.array[idxY] =
					currentY + (nextBaseY - currentY) * lerpFactor;
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
