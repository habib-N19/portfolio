import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ACCENT, ACCENT_GLOW, BG } from "./theme";

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	const driftX = interpolate(frame, [0, durationInFrames], [-5, 5], {
		easing: Easing.inOut(Easing.sin),
	});
	const driftY = interpolate(frame, [0, durationInFrames], [3, -3], {
		easing: Easing.inOut(Easing.sin),
	});
	const glowScale = interpolate(frame, [0, durationInFrames], [1, 1.16], {
		easing: Easing.inOut(Easing.sin),
	});

	return (
		<AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
			{/* Soft green accent glow upper-right (campus/learning warmth) */}
			<div
				style={{
					position: "absolute",
					left: "70%",
					top: "20%",
					width: 1700,
					height: 1700,
					borderRadius: "50%",
					transform: `translate(-50%, -50%) translate(${driftX}%, ${driftY}%) scale(${glowScale})`,
					background: `radial-gradient(circle at center, ${ACCENT_GLOW} 0%, rgba(0,0,0,0) 60%)`,
					filter: "blur(40px)",
					opacity: 0.6,
				}}
			/>

			{/* Warm secondary wash bottom-left */}
			<div
				style={{
					position: "absolute",
					left: "15%",
					top: "75%",
					width: 1300,
					height: 1300,
					borderRadius: "50%",
					transform: `translate(-50%, -50%) translate(${-driftX}%, ${-driftY}%)`,
					background: `radial-gradient(circle at center, hsla(30, 70%, 50%, 0.22) 0%, rgba(0,0,0,0) 65%)`,
					filter: "blur(60px)",
					opacity: 0.9,
				}}
			/>

			{/* Faint grid scanlines */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage:
						"repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 90px)",
					opacity: 0.5,
				}}
			/>

			{/* Film grain */}
			<svg
				width="100%"
				height="100%"
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.08,
					mixBlendMode: "overlay",
					pointerEvents: "none",
				}}
			>
				<filter id="rtec-grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#rtec-grain)" />
			</svg>

			{/* Vignette */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.55) 100%)",
				}}
			/>
		</AbsoluteFill>
	);
};
