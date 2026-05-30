import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ACCENT, ACCENT_GLOW, BG } from "./theme";

/**
 * Subtle parallax-y background: a slow, very faint accent gradient that drifts
 * across the screen, plus an SVG grain overlay to give the dark neutral some
 * texture without ever competing with foreground type.
 */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// Slow horizontal drift, full length of the comp.
	const driftX = interpolate(
		frame,
		[0, durationInFrames],
		[-6, 6],
		{ easing: Easing.inOut(Easing.sin) },
	);
	const driftY = interpolate(
		frame,
		[0, durationInFrames],
		[4, -4],
		{ easing: Easing.inOut(Easing.sin) },
	);

	// A very slow scale on the glow keeps things alive.
	const glowScale = interpolate(
		frame,
		[0, durationInFrames],
		[1, 1.18],
		{ easing: Easing.inOut(Easing.sin) },
	);

	return (
		<AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
			{/* Soft accent glow, large and feathered. */}
			<div
				style={{
					position: "absolute",
					left: "50%",
					top: "50%",
					width: 1800,
					height: 1800,
					borderRadius: "50%",
					transform: `translate(-50%, -50%) translate(${driftX}%, ${driftY}%) scale(${glowScale})`,
					background: `radial-gradient(circle at center, ${ACCENT_GLOW} 0%, rgba(0,0,0,0) 60%)`,
					filter: "blur(40px)",
					opacity: 0.65,
				}}
			/>

			{/* Secondary cool wash, low and toward bottom. */}
			<div
				style={{
					position: "absolute",
					left: "20%",
					top: "70%",
					width: 1400,
					height: 1400,
					borderRadius: "50%",
					transform: `translate(-50%, -50%) translate(${-driftX}%, ${-driftY}%)`,
					background: `radial-gradient(circle at center, ${ACCENT} 0%, rgba(0,0,0,0) 65%)`,
					filter: "blur(60px)",
					opacity: 0.12,
				}}
			/>

			{/* Faint horizontal scanline rule for grid feel. */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage:
						"repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 80px)",
					opacity: 0.5,
				}}
			/>

			{/* SVG film grain — static turbulence baked into a data-uri. */}
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
				<filter id="leelu-grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#leelu-grain)" />
			</svg>

			{/* Top + bottom vignettes to anchor type. */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.55) 100%)",
				}}
			/>
		</AbsoluteFill>
	);
};
