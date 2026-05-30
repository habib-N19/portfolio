import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
	ACCENT,
	ACCENT_BRIGHT,
	ACCENT_SOFT,
	SURFACE,
	SURFACE_BORDER,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut } from "../anim";

const STACK = ["Next.js 15", "React 19", "Prisma", "Postgres", "Playwright"];

export const CloserScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	const headLift = interpolate(frame, [0.1 * fps, 0.8 * fps], [22, 0], {
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
				gap: 22,
				padding: 60,
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
				DWMtec
			</div>
			<div
				style={{
					fontSize: 80,
					fontWeight: 700,
					letterSpacing: -2,
					lineHeight: 1.05,
					opacity: headOp,
					transform: `translateY(${headLift}px)`,
					maxWidth: 1300,
				}}
			>
				Own product. Solo build.
				<br />
				Shipped 2025.
			</div>
			<div
				style={{
					fontSize: 18,
					color: TEXT_DIM,
					opacity: subOp,
				}}
			>
				A campus that lives online — streaming, library, chat, install-as-app.
			</div>

			{/* Stack chips */}
			<div
				style={{
					display: "flex",
					gap: 10,
					marginTop: 14,
					flexWrap: "wrap",
					justifyContent: "center",
				}}
			>
				{STACK.map((s, i) => {
					const delay = 1.0 + i * 0.08;
					const chipOp = interpolate(frame, [delay * fps, (delay + 0.35) * fps], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					});
					const lift = interpolate(frame, [delay * fps, (delay + 0.4) * fps], [10, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.out(Easing.cubic),
					});
					return (
						<div
							key={s}
							style={{
								opacity: chipOp,
								transform: `translateY(${lift}px)`,
								padding: "8px 14px",
								borderRadius: 8,
								backgroundColor: ACCENT_SOFT,
								color: ACCENT_BRIGHT,
								border: `1px solid hsla(140, 70%, 50%, 0.32)`,
								fontFamily: monoFont,
								fontSize: 13,
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
