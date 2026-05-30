import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { PanelSwap } from "../ui/PanelSwap";
import {
	ACCENT,
	ACCENT_SOFT,
	SURFACE,
	SURFACE_2,
	SURFACE_BORDER,
	SUCCESS,
	WARN,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";

const STAGES = [
	{ day: "Day 0", title: "First message", body: "Personalized cold reach", icon: "✉" },
	{ day: "Day 3", title: "Follow-up", body: "Soft reminder + value", icon: "↻" },
	{ day: "Day 7", title: "Final touch", body: "Last-call CTA", icon: "✓" },
];

type Pill = "Queued" | "Sent" | "Replied";

const PILL_COLOR: Record<Pill, { bg: string; fg: string }> = {
	Queued: { bg: "rgba(255,255,255,0.06)", fg: TEXT_DIM },
	Sent: { bg: ACCENT_SOFT, fg: ACCENT },
	Replied: { bg: "hsla(150, 60%, 50%, 0.16)", fg: SUCCESS },
};

const usePillState = (start: Pill, end: Pill, flipAtSec: number): Pill => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	return frame >= flipAtSec * fps ? end : start;
};

const StageCard: React.FC<{ stage: (typeof STAGES)[number]; index: number }> = ({
	stage,
	index,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const delay = 0.3 + index * 0.18;
	const op = interpolate(
		frame,
		[delay * fps, (delay + 0.4) * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const slide = interpolate(
		frame,
		[delay * fps, (delay + 0.45) * fps],
		[20, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
	);

	return (
		<div
			style={{
				opacity: op,
				transform: `translateX(${slide}px)`,
				flex: 1,
				padding: 20,
				borderRadius: 12,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				display: "flex",
				flexDirection: "column",
				gap: 10,
				position: "relative",
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
						width: 32,
						height: 32,
						borderRadius: 8,
						backgroundColor: ACCENT_SOFT,
						color: ACCENT,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 14,
					}}
				>
					{stage.icon}
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
					{stage.day}
				</div>
			</div>
			<div style={{ fontSize: 16, fontWeight: 600, color: TEXT }}>{stage.title}</div>
			<div style={{ fontSize: 12, color: TEXT_DIM }}>{stage.body}</div>

			{/* Mini email body skeleton */}
			<div
				style={{
					marginTop: 6,
					padding: 10,
					borderRadius: 8,
					backgroundColor: SURFACE_2,
					display: "flex",
					flexDirection: "column",
					gap: 6,
				}}
			>
				<div style={{ height: 6, width: "60%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3 }} />
				<div style={{ height: 6, width: "95%", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3 }} />
				<div style={{ height: 6, width: "80%", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3 }} />
			</div>
		</div>
	);
};

const StatusRow: React.FC<{
	name: string;
	start: Pill;
	end: Pill;
	flipAtSec: number;
	index: number;
}> = ({ name, start, end, flipAtSec, index }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const delay = 1.4 + index * 0.18;
	const op = interpolate(
		frame,
		[delay * fps, (delay + 0.35) * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const state = usePillState(start, end, flipAtSec);
	const colors = PILL_COLOR[state];

	// Flip flash
	const flash = interpolate(
		frame,
		[flipAtSec * fps - 1, flipAtSec * fps, (flipAtSec + 0.5) * fps],
		[0, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<div
			style={{
				opacity: op,
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "10px 14px",
				borderRadius: 8,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
			}}
		>
			<div
				style={{
					width: 28,
					height: 28,
					borderRadius: "50%",
					background: `linear-gradient(135deg, hsl(${200 + index * 25} 70% 55%) 0%, hsl(${260 + index * 15} 70% 55%) 100%)`,
				}}
			/>
			<div style={{ flex: 1, fontSize: 13, color: TEXT }}>{name}</div>
			<div
				style={{
					padding: "4px 10px",
					borderRadius: 999,
					backgroundColor: colors.bg,
					color: colors.fg,
					fontSize: 11,
					fontFamily: monoFont,
					boxShadow: `0 0 ${flash * 10}px ${colors.fg}`,
				}}
			>
				{state}
			</div>
		</div>
	);
};

export const OutreachScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const replyCount = interpolate(frame, [2.7 * fps, 3.5 * fps], [0, 3], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	return (
		<PanelSwap>
			<div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
				<div>
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
						Outreach · Senior Frontend Engineer
					</div>
					<div
						style={{
							fontSize: 24,
							fontWeight: 700,
							color: TEXT,
							letterSpacing: -0.3,
						}}
					>
						Sequence builder
					</div>
				</div>

				{/* 3 stages */}
				<div style={{ display: "flex", gap: 14 }}>
					{STAGES.map((s, i) => (
						<StageCard key={s.day} stage={s} index={i} />
					))}
				</div>

				{/* Status column */}
				<div
					style={{
						flex: 1,
						display: "flex",
						gap: 18,
					}}
				>
					<div
						style={{
							flex: 1,
							padding: 16,
							borderRadius: 12,
							backgroundColor: SURFACE_2,
							border: `1px solid ${SURFACE_BORDER}`,
							display: "flex",
							flexDirection: "column",
							gap: 10,
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "baseline",
								marginBottom: 4,
							}}
						>
							<div style={{ fontSize: 13, color: TEXT_DIM, fontFamily: displayFont, fontWeight: 500 }}>
								Live status
							</div>
							<div style={{ fontSize: 11, color: TEXT_FAINT, fontFamily: monoFont }}>
								5 sequences · {Math.round(replyCount)} replies
							</div>
						</div>
						<StatusRow name="Priya R."  start="Queued" end="Replied" flipAtSec={2.1} index={0} />
						<StatusRow name="Alex M."   start="Queued" end="Sent"    flipAtSec={1.7} index={1} />
						<StatusRow name="Tomás G."  start="Queued" end="Replied" flipAtSec={2.5} index={2} />
						<StatusRow name="Yuki I."   start="Queued" end="Sent"    flipAtSec={1.9} index={3} />
						<StatusRow name="Sam K."    start="Queued" end="Replied" flipAtSec={3.0} index={4} />
					</div>
				</div>
			</div>
		</PanelSwap>
	);
};
