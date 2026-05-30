import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ACCENT_BRIGHT, TEXT, TEXT_DIM } from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut } from "../anim";

export const CloserScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	const lift = interpolate(frame, [0.1 * fps, 0.8 * fps], [22, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const headOp = interpolate(frame, [0.1 * fps, 0.7 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const subOp = interpolate(frame, [0.55 * fps, 1.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 18,
				padding: "0 120px",
				fontFamily: displayFont,
				color: TEXT,
				textAlign: "center",
			}}
		>
			<div
				style={{
					fontSize: 72,
					fontWeight: 700,
					letterSpacing: -2,
					lineHeight: 1.05,
					opacity: headOp,
					transform: `translateY(${lift}px)`,
				}}
			>
				A Webflow SaaS suite.
				<br />
				<span style={{ color: ACCENT_BRIGHT }}>Solo.</span>
			</div>
			<div
				style={{
					fontSize: 16,
					color: TEXT_DIM,
					fontFamily: monoFont,
					letterSpacing: 1,
					opacity: subOp,
				}}
			>
				one monorepo · one developer
			</div>
		</AbsoluteFill>
	);
};
