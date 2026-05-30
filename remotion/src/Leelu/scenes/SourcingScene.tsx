import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { PanelSwap } from "../ui/PanelSwap";
import {
	ACCENT,
	ACCENT_SOFT,
	SURFACE,
	SURFACE_2,
	SURFACE_BORDER,
	SUCCESS,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";

type Candidate = {
	name: string;
	role: string;
	location: string;
	score: number;
};

const CANDIDATES: Candidate[] = [
	{ name: "Alex M.", role: "Senior Frontend Engineer · Stripe", location: "Berlin", score: 94 },
	{ name: "Priya R.", role: "Staff Frontend · Linear", location: "London", score: 91 },
	{ name: "Tomás G.", role: "Lead Engineer · Vercel", location: "Lisbon", score: 88 },
	{ name: "Yuki I.", role: "Senior FE · Notion", location: "Remote", score: 86 },
	{ name: "Sam K.", role: "FE Architect · Figma", location: "Remote", score: 83 },
	{ name: "Leila O.", role: "Senior FE · Posthog", location: "Madrid", score: 81 },
];

const CandidateRow: React.FC<{ c: Candidate; index: number }> = ({ c, index }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	// Streams in: first candidate at ~1.2s, then every ~0.32s.
	const delay = 1.2 + index * 0.32;
	const op = interpolate(
		frame,
		[delay * fps, (delay + 0.35) * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const slide = interpolate(
		frame,
		[delay * fps, (delay + 0.4) * fps],
		[18, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
	);
	// Brief pulse on landing.
	const pulse = interpolate(
		frame,
		[(delay + 0.05) * fps, (delay + 0.4) * fps, (delay + 0.7) * fps],
		[0, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<div
			style={{
				opacity: op,
				transform: `translateY(${slide}px)`,
				padding: "14px 18px",
				borderRadius: 10,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				display: "flex",
				alignItems: "center",
				gap: 16,
				boxShadow: `0 0 ${pulse * 16}px rgba(56,189,248,${pulse * 0.35})`,
			}}
		>
			<div
				style={{
					width: 36,
					height: 36,
					borderRadius: "50%",
					background: `linear-gradient(135deg, hsl(${200 + index * 25} 70% 55%) 0%, hsl(${260 + index * 15} 70% 55%) 100%)`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 13,
					fontWeight: 600,
					color: "white",
				}}
			>
				{c.name.split(" ").map((n) => n[0]).join("")}
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{c.name}</div>
				<div
					style={{
						fontSize: 12,
						color: TEXT_DIM,
						fontFamily: monoFont,
					}}
				>
					{c.role}
				</div>
			</div>
			<div
				style={{
					fontSize: 11,
					color: TEXT_FAINT,
					fontFamily: monoFont,
					width: 70,
				}}
			>
				{c.location}
			</div>
			<div
				style={{
					padding: "6px 12px",
					borderRadius: 8,
					backgroundColor: c.score >= 90 ? ACCENT_SOFT : "rgba(255,255,255,0.05)",
					color: c.score >= 90 ? ACCENT : TEXT_DIM,
					fontSize: 14,
					fontWeight: 700,
					fontFamily: monoFont,
				}}
			>
				{c.score}
			</div>
		</div>
	);
};

export const SourcingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// "Source candidates" button press at ~0.5s, then progress runs.
	const buttonPress = interpolate(frame, [0.4 * fps, 0.7 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const progress = interpolate(
		frame,
		[0.8 * fps, 3.6 * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
	);

	const counter = Math.round(progress * 50);

	return (
		<PanelSwap>
			<div style={{ display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
				{/* Header with role + Source button */}
				<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
					<div style={{ flex: 1 }}>
						<div
							style={{
								fontSize: 13,
								color: TEXT_FAINT,
								fontFamily: monoFont,
								letterSpacing: 1,
								textTransform: "uppercase",
								marginBottom: 4,
							}}
						>
							Sourcing · Senior Frontend Engineer
						</div>
						<div
							style={{
								fontSize: 24,
								fontWeight: 700,
								color: TEXT,
								letterSpacing: -0.3,
							}}
						>
							Sourcing run
						</div>
					</div>
					<div
						style={{
							padding: "10px 18px",
							borderRadius: 10,
							background: `linear-gradient(180deg, ${ACCENT} 0%, hsl(200 90% 50%) 100%)`,
							color: "white",
							fontSize: 14,
							fontWeight: 600,
							boxShadow: `0 0 ${buttonPress * 24}px rgba(56,189,248,${0.4 + buttonPress * 0.3})`,
							transform: `scale(${1 - buttonPress * 0.04})`,
						}}
					>
						✦  Source candidates
					</div>
				</div>

				{/* Progress bar */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 14,
						padding: "12px 16px",
						borderRadius: 10,
						backgroundColor: SURFACE_2,
						border: `1px solid ${SURFACE_BORDER}`,
					}}
				>
					<div
						style={{
							width: 10,
							height: 10,
							borderRadius: "50%",
							backgroundColor: progress < 1 ? ACCENT : SUCCESS,
							boxShadow: `0 0 12px ${progress < 1 ? ACCENT : SUCCESS}`,
						}}
					/>
					<div style={{ fontSize: 13, color: TEXT_DIM, fontFamily: monoFont, minWidth: 180 }}>
						{progress < 1 ? "Scanning sources…" : "Sourcing complete"}
					</div>
					<div
						style={{
							flex: 1,
							height: 6,
							backgroundColor: "rgba(255,255,255,0.06)",
							borderRadius: 3,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								width: `${progress * 100}%`,
								height: "100%",
								background: `linear-gradient(90deg, ${ACCENT} 0%, hsl(200 90% 65%) 100%)`,
							}}
						/>
					</div>
					<div
						style={{
							fontSize: 13,
							fontFamily: monoFont,
							color: TEXT,
							fontWeight: 600,
							minWidth: 90,
							textAlign: "right",
						}}
					>
						{counter} / 50
					</div>
				</div>

				{/* Candidates list */}
				<div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
					{CANDIDATES.map((c, i) => (
						<CandidateRow key={c.name} c={c} index={i} />
					))}
				</div>
			</div>
		</PanelSwap>
	);
};
