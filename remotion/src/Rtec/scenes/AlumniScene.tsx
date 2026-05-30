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

const FILTERS = [
	{ label: "Department", value: "Computer Eng" },
	{ label: "Year", value: "2018 – 2024" },
	{ label: "Company", value: "Any" },
];

const TOP_EMPLOYERS = [
	{ name: "Grameenphone", n: 38 },
	{ name: "bKash", n: 31 },
	{ name: "Pathao", n: 22 },
	{ name: "Brain Station 23", n: 19 },
	{ name: "Other", n: 87 },
];

const Bar: React.FC<{ e: (typeof TOP_EMPLOYERS)[number]; index: number; max: number }> = ({
	e,
	index,
	max,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const delay = 0.9 + index * 0.12;
	const op = interpolate(frame, [delay * fps, (delay + 0.35) * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const grow = interpolate(frame, [delay * fps, (delay + 0.7) * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	return (
		<div
			style={{
				opacity: op,
				display: "flex",
				alignItems: "center",
				gap: 14,
			}}
		>
			<div style={{ fontSize: 13, color: TEXT, width: 170, flexShrink: 0 }}>
				{e.name}
			</div>
			<div
				style={{
					flex: 1,
					height: 12,
					borderRadius: 4,
					backgroundColor: "rgba(255,255,255,0.05)",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: `${(e.n / max) * 100 * grow}%`,
						height: "100%",
						background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_BRIGHT} 100%)`,
						boxShadow: index === 0 ? `0 0 12px ${ACCENT}` : "none",
					}}
				/>
			</div>
			<div
				style={{
					width: 40,
					textAlign: "right",
					fontSize: 13,
					fontFamily: monoFont,
					color: TEXT,
					fontWeight: 600,
				}}
			>
				{Math.round(e.n * grow)}
			</div>
		</div>
	);
};

const StatTile: React.FC<{
	label: string;
	value: string;
	delay: number;
}> = ({ label, value, delay }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const op = interpolate(frame, [delay * fps, (delay + 0.35) * fps], [0, 1], {
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
			style={{
				opacity: op,
				transform: `translateY(${lift}px)`,
				flex: 1,
				padding: "16px 18px",
				borderRadius: 12,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				display: "flex",
				flexDirection: "column",
				gap: 4,
			}}
		>
			<div
				style={{
					fontSize: 11,
					color: TEXT_FAINT,
					fontFamily: monoFont,
					textTransform: "uppercase",
					letterSpacing: 1,
				}}
			>
				{label}
			</div>
			<div
				style={{
					fontSize: 28,
					fontWeight: 700,
					color: TEXT,
					letterSpacing: -0.5,
					fontVariantNumeric: "tabular-nums",
				}}
			>
				{value}
			</div>
		</div>
	);
};

export const AlumniScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	const header = fadeUp(frame, fps, { delaySec: 0.05, durationSec: 0.45 });

	const max = TOP_EMPLOYERS.reduce((a, b) => Math.max(a, b.n), 0);

	// Animated counters
	const alumniCount = Math.round(
		interpolate(frame, [0.5 * fps, 1.3 * fps], [0, 1247], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		}),
	);
	const deptCount = Math.round(
		interpolate(frame, [0.6 * fps, 1.4 * fps], [0, 6], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		}),
	);
	const yearsSpan = Math.round(
		interpolate(frame, [0.7 * fps, 1.5 * fps], [0, 14], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		}),
	);

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				padding: "70px 110px",
				display: "flex",
				flexDirection: "column",
				gap: 22,
				fontFamily: displayFont,
				color: TEXT,
			}}
		>
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
					Hero feature · 03 / 03
				</div>
				<div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
					Alumni intelligence
				</div>
				<div style={{ fontSize: 17, color: TEXT_DIM, marginTop: 4 }}>
					Not a contact list — a searchable network with statistics on top.
				</div>
			</div>

			{/* Filter chips */}
			<div
				style={{
					display: "flex",
					gap: 10,
					...fadeUp(frame, fps, { delaySec: 0.3, durationSec: 0.45 }),
				}}
			>
				{FILTERS.map((f) => (
					<div
						key={f.label}
						style={{
							padding: "8px 14px",
							borderRadius: 10,
							backgroundColor: SURFACE_2,
							border: `1px solid ${SURFACE_BORDER}`,
							display: "flex",
							alignItems: "baseline",
							gap: 8,
							fontFamily: monoFont,
							fontSize: 12,
						}}
					>
						<span style={{ color: TEXT_FAINT, textTransform: "uppercase", letterSpacing: 1 }}>
							{f.label}
						</span>
						<span style={{ color: TEXT, fontWeight: 600 }}>{f.value}</span>
					</div>
				))}
			</div>

			{/* Stat tiles */}
			<div style={{ display: "flex", gap: 12 }}>
				<StatTile label="Alumni indexed" value={alumniCount.toLocaleString()} delay={0.45} />
				<StatTile label="Departments" value={String(deptCount)} delay={0.55} />
				<StatTile label="Years covered" value={String(yearsSpan)} delay={0.65} />
			</div>

			{/* Bars */}
			<div
				style={{
					flex: 1,
					backgroundColor: SURFACE,
					border: `1px solid ${SURFACE_BORDER}`,
					borderRadius: 12,
					padding: "20px 24px",
					display: "flex",
					flexDirection: "column",
					gap: 12,
					...fadeUp(frame, fps, { delaySec: 0.75, durationSec: 0.5 }),
				}}
			>
				<div
					style={{
						fontSize: 12,
						color: TEXT_DIM,
						fontFamily: monoFont,
						textTransform: "uppercase",
						letterSpacing: 1,
					}}
				>
					Top employers · Computer Engineering · 2018–2024
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 6 }}>
					{TOP_EMPLOYERS.map((e, i) => (
						<Bar key={e.name} e={e} index={i} max={max} />
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
