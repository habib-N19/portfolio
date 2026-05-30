import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
	ACCENT,
	ACCENT_BRIGHT,
	ACCENT_SOFT,
	SURFACE,
	SURFACE_2,
	SURFACE_BORDER,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut, fadeUp } from "../anim";

const MODES = ["Beginner", "Intermediate", "Advanced"] as const;

const ANSWER_LINES = [
	"Photosynthesis converts light into chemical energy.",
	"Plants absorb CO₂ + water, release O₂ as a byproduct.",
	"The Calvin cycle then fixes carbon into glucose.",
];

const useTypewriter = (text: string, startSec: number, charsPerSec: number) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const elapsed = Math.max(0, frame - startSec * fps);
	const total = Math.min(text.length, Math.floor((elapsed / fps) * charsPerSec));
	return text.slice(0, total);
};

const AnswerLine: React.FC<{ line: string; index: number }> = ({ line, index }) => {
	const start = 1.4 + index * 0.5;
	const text = useTypewriter(line, start, 50);
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const lift = interpolate(frame, [start * fps, (start + 0.3) * fps], [8, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	return (
		<div
			style={{
				fontSize: 16,
				color: TEXT,
				lineHeight: 1.55,
				transform: `translateY(${lift}px)`,
			}}
		>
			{text || " "}
		</div>
	);
};

export const NotebotScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	const header = fadeUp(frame, fps, { delaySec: 0.05, durationSec: 0.45 });

	// Highlight bounces from Beginner → Intermediate at ~0.9s.
	const activeMode = frame < 0.9 * fps ? 0 : frame < 1.8 * fps ? 1 : 2;

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				padding: "80px 110px",
				display: "flex",
				flexDirection: "column",
				gap: 24,
				fontFamily: displayFont,
				color: TEXT,
			}}
		>
			{/* Header */}
			<div style={header}>
				<div
					style={{
						fontSize: 13,
						color: ACCENT_BRIGHT,
						fontFamily: monoFont,
						letterSpacing: 3,
						textTransform: "uppercase",
						marginBottom: 8,
					}}
				>
					Hero feature · 01 / 03
				</div>
				<div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
					Notebot
				</div>
				<div style={{ fontSize: 17, color: TEXT_DIM, marginTop: 4 }}>
					An AI study assistant, grounded on your own course materials.
				</div>
			</div>

			<div style={{ display: "flex", gap: 22, flex: 1, minHeight: 0 }}>
				{/* Left: source document card */}
				<div
					style={{
						width: 360,
						backgroundColor: SURFACE,
						border: `1px solid ${SURFACE_BORDER}`,
						borderRadius: 14,
						padding: 22,
						display: "flex",
						flexDirection: "column",
						gap: 14,
						...fadeUp(frame, fps, { delaySec: 0.3, durationSec: 0.5 }),
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
						}}
					>
						<div
							style={{
								width: 34,
								height: 42,
								borderRadius: 4,
								backgroundColor: ACCENT_SOFT,
								color: ACCENT_BRIGHT,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 16,
							}}
						>
							📄
						</div>
						<div style={{ minWidth: 0 }}>
							<div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
								Biology · Week 6
							</div>
							<div
								style={{
									fontSize: 11,
									color: TEXT_FAINT,
									fontFamily: monoFont,
								}}
							>
								photosynthesis.pdf · 14 pages
							</div>
						</div>
					</div>

					{/* Skeleton lines mimicking PDF content */}
					<div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
						{[100, 88, 95, 70, 92, 80, 64].map((w, i) => (
							<div
								key={i}
								style={{
									height: 6,
									width: `${w}%`,
									backgroundColor: i === 2 ? ACCENT_SOFT : "rgba(255,255,255,0.06)",
									borderRadius: 3,
								}}
							/>
						))}
					</div>

					<div
						style={{
							marginTop: "auto",
							display: "flex",
							alignItems: "center",
							gap: 8,
							fontSize: 11,
							color: TEXT_FAINT,
							fontFamily: monoFont,
						}}
					>
						<span
							style={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								backgroundColor: ACCENT,
								boxShadow: `0 0 8px ${ACCENT}`,
							}}
						/>
						Grounded
					</div>
				</div>

				{/* Right: answer panel */}
				<div
					style={{
						flex: 1,
						backgroundColor: SURFACE,
						border: `1px solid ${SURFACE_BORDER}`,
						borderRadius: 14,
						padding: 22,
						display: "flex",
						flexDirection: "column",
						gap: 16,
						...fadeUp(frame, fps, { delaySec: 0.45, durationSec: 0.55 }),
					}}
				>
					{/* Mode toggle */}
					<div
						style={{
							display: "flex",
							gap: 6,
							padding: 4,
							backgroundColor: SURFACE_2,
							borderRadius: 10,
							alignSelf: "flex-start",
						}}
					>
						{MODES.map((m, i) => {
							const active = i === activeMode;
							return (
								<div
									key={m}
									style={{
										padding: "8px 16px",
										borderRadius: 7,
										fontSize: 13,
										fontFamily: monoFont,
										color: active ? "white" : TEXT_DIM,
										backgroundColor: active ? ACCENT : "transparent",
										fontWeight: active ? 600 : 500,
									}}
								>
									{m}
								</div>
							);
						})}
					</div>

					<div
						style={{
							fontSize: 11,
							color: TEXT_FAINT,
							fontFamily: monoFont,
							textTransform: "uppercase",
							letterSpacing: 1,
						}}
					>
						Explain · streaming from photosynthesis.pdf
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						{ANSWER_LINES.map((l, i) => (
							<AnswerLine key={i} line={l} index={i} />
						))}
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
