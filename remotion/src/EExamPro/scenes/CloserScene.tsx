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
	const subOp = interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], {
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
					fontSize: 13,
					color: ACCENT_BRIGHT,
					fontFamily: monoFont,
					letterSpacing: 4,
					textTransform: "uppercase",
					opacity: headOp,
				}}
			>
				Capstone
			</div>
			<div
				style={{
					fontSize: 70,
					fontWeight: 700,
					letterSpacing: -2,
					lineHeight: 1.05,
					opacity: headOp,
					transform: `translateY(${lift}px)`,
				}}
			>
				Phitron bootcamp.
				<br />
				<span style={{ color: ACCENT_BRIGHT }}>Team project.</span>
			</div>
			<div
				style={{
					fontSize: 17,
					color: TEXT_DIM,
					opacity: subOp,
					fontFamily: monoFont,
				}}
			>
				Frontend lead · ~29% authorship
			</div>
		</AbsoluteFill>
	);
};
