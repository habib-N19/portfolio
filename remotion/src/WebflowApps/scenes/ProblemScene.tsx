import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { TEXT, ACCENT_BRIGHT } from "../theme";
import { displayFont } from "../fonts";
import { sceneInOut } from "../anim";

export const ProblemScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	const lift = interpolate(frame, [0.1 * fps, 0.8 * fps], [22, 0], {
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
				padding: "0 200px",
				fontFamily: displayFont,
				color: TEXT,
			}}
		>
			<div
				style={{
					fontSize: 58,
					fontWeight: 600,
					letterSpacing: -1,
					textAlign: "center",
					maxWidth: 1300,
					transform: `translateY(${lift}px)`,
					lineHeight: 1.15,
				}}
			>
				Webflow's Designer Extensions
				<br />
				<span style={{ color: ACCENT_BRIGHT }}>deserve serious products.</span>
			</div>
		</AbsoluteFill>
	);
};
