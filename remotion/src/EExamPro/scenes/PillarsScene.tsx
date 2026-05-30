import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
	ACCENT,
	ACCENT_BRIGHT,
	ACCENT_SOFT,
	SURFACE,
	SURFACE_2,
	SURFACE_BORDER,
	SUCCESS,
	DANGER,
	WARN,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut, fadeUp } from "../anim";

/**
 * Pillars scene v2 — three sub-beats with a focus index.
 *
 * Layout: a "stage" with three slots (Exam · Proctor · AI). At any moment
 * one slot is *focused* (large, foreground) and the other two are *minified*
 * (small, off to the right, dim). Focus passes Exam → Proctor → AI over the
 * scene's duration so each pillar gets visible attention.
 */

const SUB_BEAT_SEC = 2.3; // each pillar gets ~2.3s of focus

type Pillar = "exam" | "proctor" | "ai";

const usePillarFocus = (): Pillar => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame / fps;
	if (t < SUB_BEAT_SEC) return "exam";
	if (t < SUB_BEAT_SEC * 2) return "proctor";
	return "ai";
};

// ── Exam card content ──
const ExamCard: React.FC<{ focused: boolean }> = ({ focused }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const secs = Math.round(
		interpolate(frame, [0, 5.5 * fps], [30 * 60, 30 * 60 - 8], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}),
	);
	const mm = String(Math.floor(secs / 60)).padStart(2, "0");
	const ss = String(secs % 60).padStart(2, "0");

	// Option B is selected at ~1.4s (within exam focus window)
	const selectedB = frame >= 1.4 * fps;
	const selectBlink = interpolate(frame, [1.4 * fps, 1.7 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const opts = [
		{ key: "A", label: "Polymorphism — multiple shapes" },
		{ key: "B", label: "Encapsulation — bundling data and methods" },
		{ key: "C", label: "Inheritance — class derivation" },
		{ key: "D", label: "Abstraction — hiding details" },
	];

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				borderRadius: 14,
				padding: focused ? 26 : 14,
				display: "flex",
				flexDirection: "column",
				gap: focused ? 14 : 8,
				overflow: "hidden",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<div
					style={{
						fontSize: focused ? 12 : 9,
						color: TEXT_FAINT,
						fontFamily: monoFont,
						textTransform: "uppercase",
						letterSpacing: 1,
					}}
				>
					Question 7 of 25 · OOP Fundamentals
				</div>
				{focused && (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							padding: "5px 10px",
							borderRadius: 6,
							backgroundColor: SURFACE_2,
							border: `1px solid ${SURFACE_BORDER}`,
						}}
					>
						<span
							style={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								backgroundColor: WARN,
								boxShadow: `0 0 8px ${WARN}`,
							}}
						/>
						<span
							style={{
								fontSize: 14,
								fontFamily: monoFont,
								color: TEXT,
								fontWeight: 600,
								fontVariantNumeric: "tabular-nums",
							}}
						>
							{mm}:{ss}
						</span>
					</div>
				)}
			</div>

			<div style={{ fontSize: focused ? 22 : 12, color: TEXT, fontWeight: 600, lineHeight: 1.35 }}>
				Which OOP principle restricts direct access to an object's state and exposes
				behavior through methods?
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: focused ? 8 : 4 }}>
				{opts.map((o) => {
					const isActive = selectedB && o.key === "B";
					return (
						<div
							key={o.key}
							style={{
								display: "flex",
								alignItems: "center",
								gap: focused ? 12 : 6,
								padding: focused ? "12px 14px" : "5px 7px",
								borderRadius: focused ? 10 : 5,
								backgroundColor: isActive ? ACCENT_SOFT : SURFACE_2,
								border: `1px solid ${isActive ? `hsla(280, 60%, 55%, ${0.5 + selectBlink * 0.5})` : SURFACE_BORDER}`,
								boxShadow: isActive ? `0 0 ${selectBlink * 18}px ${ACCENT_SOFT}` : "none",
							}}
						>
							<div
								style={{
									width: focused ? 26 : 14,
									height: focused ? 26 : 14,
									borderRadius: focused ? 7 : 4,
									backgroundColor: isActive ? ACCENT : "rgba(255,255,255,0.06)",
									color: isActive ? "white" : TEXT_DIM,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: focused ? 13 : 8,
									fontWeight: 700,
									fontFamily: monoFont,
									flexShrink: 0,
								}}
							>
								{o.key}
							</div>
							<div style={{ fontSize: focused ? 14 : 9, color: TEXT, flex: 1, lineHeight: 1.3 }}>
								{o.label}
							</div>
						</div>
					);
				})}
			</div>

			{focused && (
				<div
					style={{
						marginTop: "auto",
						display: "flex",
						alignItems: "center",
						gap: 14,
					}}
				>
					<div style={{ flex: 1 }}>
						<div
							style={{
								height: 5,
								borderRadius: 3,
								backgroundColor: "rgba(255,255,255,0.07)",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									width: "28%",
									height: "100%",
									background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_BRIGHT} 100%)`,
								}}
							/>
						</div>
						<div
							style={{
								marginTop: 4,
								fontSize: 11,
								color: TEXT_FAINT,
								fontFamily: monoFont,
							}}
						>
							7 / 25 answered
						</div>
					</div>
					<div
						style={{
							padding: "9px 18px",
							borderRadius: 9,
							backgroundColor: ACCENT,
							color: "white",
							fontSize: 13,
							fontWeight: 600,
						}}
					>
						Next →
					</div>
				</div>
			)}
		</div>
	);
};

// ── Proctor camera ──
const ProctorCard: React.FC<{ focused: boolean }> = ({ focused }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// REC blink across entire scene (so it pulses even when minified)
	const blink = (frame / fps) * 4;
	const recBlink = (Math.sin(blink) + 1) / 2;

	// Audio bars
	const bars = Array.from({ length: focused ? 14 : 8 }, (_, i) => {
		const h = (Math.sin((frame / fps) * 5 + i * 0.7) + 1) / 2;
		return Math.max(0.18, h * 0.95);
	});

	// Sweep line position (cycles up/down)
	const sweepCycle = ((frame / fps) % 2) / 2;
	const sweepPos = sweepCycle > 0.5 ? (1 - sweepCycle) * 2 : sweepCycle * 2;

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				borderRadius: 14,
				padding: focused ? 22 : 12,
				display: "flex",
				flexDirection: "column",
				gap: focused ? 14 : 8,
				overflow: "hidden",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span
						style={{
							width: focused ? 9 : 6,
							height: focused ? 9 : 6,
							borderRadius: "50%",
							backgroundColor: DANGER,
							opacity: recBlink,
							boxShadow: `0 0 8px ${DANGER}`,
						}}
					/>
					<span
						style={{
							fontSize: focused ? 12 : 9,
							fontFamily: monoFont,
							color: TEXT,
							fontWeight: 700,
							letterSpacing: 1,
						}}
					>
						REC · PROCTOR
					</span>
				</div>
				{focused && (
					<span style={{ fontSize: 10, color: TEXT_FAINT, fontFamily: monoFont }}>
						WebRTC · peer-to-peer
					</span>
				)}
			</div>

			{/* Camera feed */}
			<div
				style={{
					flex: 1,
					minHeight: 0,
					borderRadius: focused ? 10 : 6,
					position: "relative",
					overflow: "hidden",
					background: `linear-gradient(135deg, hsl(265 30% 18%) 0%, hsl(280 25% 12%) 100%)`,
				}}
			>
				{/* Person silhouette */}
				<div
					style={{
						position: "absolute",
						left: "50%",
						bottom: "-20%",
						transform: "translateX(-50%)",
						width: "70%",
						height: "120%",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: "50%",
							transform: "translateX(-50%)",
							width: "44%",
							aspectRatio: "1",
							borderRadius: "50%",
							background: "rgba(255,255,255,0.08)",
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: "30%",
							left: "50%",
							transform: "translateX(-50%)",
							width: "100%",
							height: "100%",
							borderRadius: "50% 50% 0 0",
							background: "rgba(255,255,255,0.06)",
						}}
					/>
				</div>

				{/* Scanner sweep */}
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: `${sweepPos * 100}%`,
						height: 2,
						background: `linear-gradient(90deg, transparent 0%, ${ACCENT_BRIGHT} 50%, transparent 100%)`,
						boxShadow: `0 0 12px ${ACCENT_BRIGHT}`,
					}}
				/>

				{/* Face-detected overlay (only when focused, after delay) */}
				{focused && frame > SUB_BEAT_SEC * fps + 0.6 * fps && (
					<>
						<div
							style={{
								position: "absolute",
								left: "50%",
								top: "18%",
								transform: "translateX(-50%)",
								width: "32%",
								aspectRatio: "1",
								border: `2px solid ${SUCCESS}`,
								borderRadius: 6,
							}}
						/>
						<div
							style={{
								position: "absolute",
								left: "50%",
								top: "56%",
								transform: "translateX(-50%)",
								padding: "3px 9px",
								borderRadius: 4,
								backgroundColor: "rgba(0,0,0,0.6)",
								color: SUCCESS,
								fontSize: 11,
								fontFamily: monoFont,
								fontWeight: 600,
							}}
						>
							✓ Face detected
						</div>
					</>
				)}
			</div>

			{/* Audio bars */}
			<div
				style={{
					display: "flex",
					alignItems: "flex-end",
					gap: 3,
					height: focused ? 22 : 10,
				}}
			>
				{bars.map((h, i) => (
					<div
						key={i}
						style={{
							flex: 1,
							height: `${h * 100}%`,
							background: `linear-gradient(180deg, ${ACCENT_BRIGHT} 0%, ${ACCENT} 100%)`,
							borderRadius: 1,
						}}
					/>
				))}
			</div>

			{focused && (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						fontSize: 10,
						fontFamily: monoFont,
						color: TEXT_FAINT,
					}}
				>
					<span>encrypted · DTLS-SRTP</span>
					<span>1080p · 30fps</span>
				</div>
			)}
		</div>
	);
};

// ── AI helper ──
const AiCard: React.FC<{ focused: boolean }> = ({ focused }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const text = "Hint: think about how data is hidden behind public methods, exposed only through a controlled interface.";
	// Type out only when focused (during AI sub-beat)
	const aiStartFrame = SUB_BEAT_SEC * 2 * fps + 0.35 * fps;
	const elapsed = Math.max(0, frame - aiStartFrame);
	const chars = focused ? Math.min(text.length, Math.floor((elapsed / fps) * 38)) : 0;
	const typed = text.slice(0, chars);

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: SURFACE,
				border: `1px solid hsla(280, 60%, 55%, 0.55)`,
				borderRadius: 14,
				padding: focused ? 22 : 12,
				display: "flex",
				flexDirection: "column",
				gap: focused ? 14 : 8,
				overflow: "hidden",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<div
					style={{
						width: focused ? 36 : 22,
						height: focused ? 36 : 22,
						borderRadius: focused ? 9 : 6,
						background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(220, 70%, 55%) 100%)`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontSize: focused ? 18 : 12,
					}}
				>
					✦
				</div>
				<div style={{ flex: 1 }}>
					<div style={{ fontSize: focused ? 15 : 11, color: TEXT, fontWeight: 600 }}>
						AI question helper
					</div>
					{focused && (
						<div style={{ fontSize: 10, color: TEXT_FAINT, fontFamily: monoFont }}>
							OpenAI · streaming
						</div>
					)}
				</div>
			</div>

			{focused ? (
				<>
					{/* Student prompt bubble */}
					<div
						style={{
							alignSelf: "flex-end",
							maxWidth: 320,
							padding: "9px 13px",
							borderRadius: "14px 14px 4px 14px",
							backgroundColor: SURFACE_2,
							border: `1px solid ${SURFACE_BORDER}`,
							fontSize: 12,
							color: TEXT,
						}}
					>
						I need a hint on Q7.
					</div>

					{/* AI streaming answer */}
					<div
						style={{
							padding: 14,
							borderRadius: "14px 14px 14px 4px",
							backgroundColor: ACCENT_SOFT,
							border: `1px solid hsla(280, 60%, 55%, 0.32)`,
							fontSize: 13,
							color: TEXT,
							lineHeight: 1.55,
							minHeight: 90,
						}}
					>
						{typed || " "}
						{typed.length < text.length && (
							<span
								style={{
									display: "inline-block",
									width: 7,
									height: 14,
									backgroundColor: ACCENT_BRIGHT,
									marginLeft: 2,
									verticalAlign: "middle",
									opacity: 0.85,
								}}
							/>
						)}
					</div>

					<div
						style={{
							marginTop: "auto",
							fontSize: 10,
							fontFamily: monoFont,
							color: TEXT_FAINT,
							display: "flex",
							alignItems: "center",
							gap: 6,
						}}
					>
						<span>⚡ no answers · hints only</span>
					</div>
				</>
			) : (
				// Minified: just show 3 skeleton lines
				<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
					<div style={{ height: 5, width: "85%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
					<div style={{ height: 5, width: "70%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
					<div style={{ height: 5, width: "55%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
				</div>
			)}
		</div>
	);
};

// ── Stage layout ──
type Slot = { pillar: Pillar; label: string };

const PILLAR_LABELS: Record<Pillar, string> = {
	exam: "Live exam",
	proctor: "WebRTC proctor",
	ai: "AI helper",
};

const SLOTS: Slot[] = [
	{ pillar: "exam", label: PILLAR_LABELS.exam },
	{ pillar: "proctor", label: PILLAR_LABELS.proctor },
	{ pillar: "ai", label: PILLAR_LABELS.ai },
];

const PillarComponent: React.FC<{ pillar: Pillar; focused: boolean }> = ({ pillar, focused }) => {
	if (pillar === "exam") return <ExamCard focused={focused} />;
	if (pillar === "proctor") return <ProctorCard focused={focused} />;
	return <AiCard focused={focused} />;
};

export const PillarsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);
	const focus = usePillarFocus();

	// Active label
	const activeLabel = PILLAR_LABELS[focus];

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				padding: "60px 110px",
				display: "flex",
				flexDirection: "column",
				gap: 18,
				fontFamily: displayFont,
				color: TEXT,
			}}
		>
			<div style={fadeUp(frame, fps, { delaySec: 0.05, durationSec: 0.4 })}>
				<div
					style={{
						fontSize: 13,
						color: ACCENT_BRIGHT,
						fontFamily: monoFont,
						letterSpacing: 3,
						textTransform: "uppercase",
						marginBottom: 6,
					}}
				>
					Three pillars · {activeLabel}
				</div>
				<div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
					<div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
						{activeLabel}
					</div>
					{/* spine dots */}
					<div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
						{SLOTS.map((s) => {
							const active = s.pillar === focus;
							return (
								<div
									key={s.pillar}
									style={{
										width: active ? 32 : 10,
										height: 10,
										borderRadius: 5,
										backgroundColor: active ? ACCENT : "rgba(255,255,255,0.12)",
										boxShadow: active ? `0 0 10px ${ACCENT}` : "none",
									}}
								/>
							);
						})}
					</div>
				</div>
			</div>

			{/* Stage */}
			<div
				style={{
					flex: 1,
					minHeight: 0,
					display: "flex",
					gap: 16,
				}}
			>
				{/* Focused slot — takes ~70% width */}
				<div style={{ flex: 7, minHeight: 0 }}>
					<PillarComponent pillar={focus} focused />
				</div>

				{/* Minified slots — the other two pillars */}
				<div style={{ flex: 3, display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
					{SLOTS.filter((s) => s.pillar !== focus).map((s) => (
						<div key={s.pillar} style={{ flex: 1, minHeight: 0, opacity: 0.55 }}>
							<PillarComponent pillar={s.pillar} focused={false} />
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
