import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { PanelSwap } from "../ui/PanelSwap";
import {
	ACCENT,
	ACCENT_SOFT,
	SURFACE,
	SURFACE_BORDER,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";

type Tile = {
	label: string;
	target: number;
	suffix?: string;
	delta?: string;
};

const TILES: Tile[] = [
	{ label: "Active openings", target: 28, delta: "+4 this week" },
	{ label: "Candidates sourced", target: 1247, delta: "+312" },
	{ label: "Replies this week", target: 86, delta: "+19" },
	{ label: "Interviews scheduled", target: 17, delta: "+5" },
];

const useCounter = (target: number, startSec: number, durSec: number) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = interpolate(
		frame,
		[startSec * fps, (startSec + durSec) * fps],
		[0, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		},
	);
	return Math.round(target * t);
};

const KpiTile: React.FC<{ tile: Tile; index: number }> = ({ tile, index }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const delay = 0.5 + index * 0.12;
	const value = useCounter(tile.target, delay, 1.2);

	const lift = interpolate(
		frame,
		[delay * fps, (delay + 0.45) * fps],
		[14, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
	);
	const op = interpolate(
		frame,
		[delay * fps, (delay + 0.45) * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<div
			style={{
				flex: 1,
				padding: 22,
				borderRadius: 14,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				opacity: op,
				transform: `translateY(${lift}px)`,
				display: "flex",
				flexDirection: "column",
				gap: 8,
			}}
		>
			<div style={{ fontSize: 13, color: TEXT_DIM, fontFamily: displayFont }}>
				{tile.label}
			</div>
			<div
				style={{
					fontSize: 38,
					fontWeight: 700,
					letterSpacing: -1,
					color: TEXT,
					fontVariantNumeric: "tabular-nums",
				}}
			>
				{value.toLocaleString()}
			</div>
			{tile.delta ? (
				<div
					style={{
						fontSize: 12,
						fontFamily: monoFont,
						color: ACCENT,
						backgroundColor: ACCENT_SOFT,
						padding: "3px 8px",
						borderRadius: 6,
						alignSelf: "flex-start",
					}}
				>
					{tile.delta}
				</div>
			) : null}
		</div>
	);
};

export const DashboardScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Recent activity rows fade in after KPIs.
	const rowsOp = interpolate(frame, [1.2 * fps, 1.7 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<PanelSwap delaySec={0}>
			<div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>
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
						Workspace overview
					</div>
					<div
						style={{
							fontSize: 28,
							fontWeight: 700,
							letterSpacing: -0.5,
							color: TEXT,
						}}
					>
						Good morning, Habib
					</div>
				</div>

				<div style={{ display: "flex", gap: 14 }}>
					{TILES.map((t, i) => (
						<KpiTile key={t.label} tile={t} index={i} />
					))}
				</div>

				{/* Recent activity */}
				<div
					style={{
						opacity: rowsOp,
						borderRadius: 14,
						backgroundColor: SURFACE,
						border: `1px solid ${SURFACE_BORDER}`,
						padding: 20,
						flex: 1,
						display: "flex",
						flexDirection: "column",
						gap: 12,
					}}
				>
					<div
						style={{
							fontSize: 14,
							color: TEXT_DIM,
							fontFamily: displayFont,
							fontWeight: 500,
						}}
					>
						Recent activity
					</div>
					{[
						{ who: "Sourcing run", what: "Senior Frontend Engineer", n: "12 candidates", time: "2m" },
						{ who: "Copilot", what: "Drafted outreach for 5 candidates", n: "Queued", time: "5m" },
						{ who: "Reply", what: "Priya R. → Senior FE Eng", n: "Interested", time: "12m" },
					].map((row, i) => {
						const delay = 1.5 + i * 0.15;
						const op = interpolate(
							frame,
							[delay * fps, (delay + 0.4) * fps],
							[0, 1],
							{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
						);
						return (
							<div
								key={i}
								style={{
									opacity: op,
									display: "flex",
									alignItems: "center",
									gap: 14,
									padding: "10px 0",
									borderBottom: i < 2 ? `1px solid ${SURFACE_BORDER}` : "none",
								}}
							>
								<div
									style={{
										width: 8,
										height: 8,
										borderRadius: "50%",
										backgroundColor: ACCENT,
										boxShadow: `0 0 12px ${ACCENT}`,
									}}
								/>
								<div style={{ minWidth: 140, fontSize: 13, color: TEXT_DIM }}>
									{row.who}
								</div>
								<div style={{ flex: 1, fontSize: 14, color: TEXT }}>{row.what}</div>
								<div
									style={{
										fontSize: 12,
										color: TEXT_FAINT,
										fontFamily: monoFont,
									}}
								>
									{row.n}
								</div>
								<div
									style={{
										fontSize: 12,
										color: TEXT_FAINT,
										fontFamily: monoFont,
										width: 40,
										textAlign: "right",
									}}
								>
									{row.time}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</PanelSwap>
	);
};
