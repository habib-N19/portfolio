import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { ACCENT, TEXT, TEXT_DIM } from "../theme";
import { displayFont, monoFont } from "../fonts";

/**
 * Closer overlays the full frame (not inside Chrome's content panel).
 * It dims the dashboard slightly and presents the headline.
 */
export const CloserScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();

	const dim = interpolate(frame, [0, 0.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const headlineOp = interpolate(frame, [0.3 * fps, 0.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const headlineLift = interpolate(frame, [0.3 * fps, 0.9 * fps], [16, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const sublineOp = interpolate(frame, [0.7 * fps, 1.3 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const outOp = interpolate(
		frame,
		[durationInFrames - 0.4 * fps, durationInFrames],
		[1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<AbsoluteFill
			style={{
				opacity: outOp,
				pointerEvents: "none",
			}}
		>
			{/* Dim layer */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundColor: "rgba(8, 10, 14, 0.78)",
					opacity: dim,
				}}
			/>

			{/* Centered content */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 18,
					fontFamily: displayFont,
					color: TEXT,
					textAlign: "center",
				}}
			>
				<div
					style={{
						fontSize: 14,
						color: ACCENT,
						fontFamily: monoFont,
						letterSpacing: 3,
						textTransform: "uppercase",
						opacity: headlineOp,
					}}
				>
					Leelu
				</div>
				<div
					style={{
						fontSize: 72,
						fontWeight: 700,
						letterSpacing: -2,
						lineHeight: 1.05,
						opacity: headlineOp,
						transform: `translateY(${headlineLift}px)`,
						maxWidth: 1200,
					}}
				>
					Source. Score.
					<br />
					Reach out — on autopilot.
				</div>
				<div
					style={{
						fontSize: 18,
						color: TEXT_DIM,
						opacity: sublineOp,
						fontWeight: 400,
					}}
				>
					Built at Softstandard · Backend pipelines · Product surface · Marketing site
				</div>
			</div>
		</AbsoluteFill>
	);
};
