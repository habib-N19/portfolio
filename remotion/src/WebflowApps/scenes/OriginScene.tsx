import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ACCENT_BRIGHT, TEXT, TEXT_DIM } from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut } from "../anim";

const MILESTONES = [
	{ year: "2023", label: "Internship at Ideapeel" },
	{ year: "2024", label: "First two apps shipped" },
	{ year: "2025", label: "Four-app monorepo" },
];

export const OriginScene: React.FC = () => {
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
				gap: 32,
				padding: "0 200px",
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
				Origin
			</div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 30,
				}}
			>
				{MILESTONES.map((m, i) => {
					const delay = 0.3 + i * 0.25;
					const op2 = interpolate(frame, [delay * fps, (delay + 0.4) * fps], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					});
					const lift = interpolate(frame, [delay * fps, (delay + 0.5) * fps], [14, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.out(Easing.cubic),
					});
					return (
						<div
							key={m.year}
							style={{ display: "flex", alignItems: "center", gap: 30 }}
						>
							<div
								style={{
									opacity: op2,
									transform: `translateY(${lift}px)`,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 6,
								}}
							>
								<div
									style={{
										fontSize: 36,
										fontWeight: 700,
										color: ACCENT_BRIGHT,
										letterSpacing: -1,
										fontFamily: displayFont,
									}}
								>
									{m.year}
								</div>
								<div
									style={{
										fontSize: 14,
										color: TEXT_DIM,
										textAlign: "center",
										maxWidth: 200,
									}}
								>
									{m.label}
								</div>
							</div>
							{i < MILESTONES.length - 1 && (
								<div
									style={{
										width: 70,
										height: 1,
										backgroundColor: "rgba(255,255,255,0.18)",
										opacity: op2,
									}}
								/>
							)}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
