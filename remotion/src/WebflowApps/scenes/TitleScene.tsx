import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ACCENT, ACCENT_BRIGHT, TEXT, TEXT_DIM } from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut } from "../anim";

export const TitleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	const titleLift = interpolate(frame, [0.1 * fps, 0.7 * fps], [22, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const subOp = interpolate(frame, [0.55 * fps, 1.05 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const ruleScale = interpolate(frame, [0.3 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				gap: 16,
				fontFamily: displayFont,
				color: TEXT,
			}}
		>
			<div
				style={{
					fontSize: 13,
					color: ACCENT_BRIGHT,
					fontFamily: monoFont,
					letterSpacing: 4,
					textTransform: "uppercase",
					opacity: subOp,
				}}
			>
				Featured · 003
			</div>
			<div
				style={{
					fontSize: 130,
					fontWeight: 800,
					letterSpacing: -6,
					lineHeight: 0.95,
					transform: `translateY(${titleLift}px)`,
				}}
			>
				Webflow Apps
			</div>
			<div
				style={{
					width: 240 * ruleScale,
					height: 2,
					backgroundColor: ACCENT,
					boxShadow: `0 0 14px ${ACCENT}`,
				}}
			/>
			<div
				style={{
					fontSize: 22,
					color: TEXT_DIM,
					opacity: subOp,
					textAlign: "center",
				}}
			>
				Four extensions · one monorepo · one developer
			</div>
		</AbsoluteFill>
	);
};
