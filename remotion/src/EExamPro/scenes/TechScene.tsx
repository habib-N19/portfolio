import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ACCENT_BRIGHT, ACCENT_SOFT, TEXT } from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut } from "../anim";

const STACK = ["React", "WebRTC", "MongoDB", "Express", "Firebase", "OpenAI"];

export const TechScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 28,
				padding: "0 120px",
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
					opacity: interpolate(frame, [0.1 * fps, 0.5 * fps], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					}),
				}}
			>
				Stack
			</div>
			<div
				style={{
					display: "flex",
					gap: 12,
					flexWrap: "wrap",
					justifyContent: "center",
				}}
			>
				{STACK.map((s, i) => {
					const delay = 0.2 + i * 0.09;
					const op2 = interpolate(frame, [delay * fps, (delay + 0.35) * fps], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					});
					const lift = interpolate(frame, [delay * fps, (delay + 0.45) * fps], [16, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.out(Easing.cubic),
					});
					return (
						<div
							key={s}
							style={{
								opacity: op2,
								transform: `translateY(${lift}px)`,
								padding: "12px 22px",
								borderRadius: 10,
								backgroundColor: ACCENT_SOFT,
								color: ACCENT_BRIGHT,
								border: `1px solid hsla(280, 60%, 55%, 0.32)`,
								fontFamily: monoFont,
								fontSize: 16,
								fontWeight: 600,
							}}
						>
							{s}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
