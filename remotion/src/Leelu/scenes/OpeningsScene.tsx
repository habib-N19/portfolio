import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { PanelSwap } from "../ui/PanelSwap";
import {
	ACCENT,
	ACCENT_SOFT,
	SURFACE,
	SURFACE_2,
	SURFACE_BORDER,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";

type Role = {
	title: string;
	location: string;
	stage: string;
	candidates: number;
};

const ROLES: Role[] = [
	{ title: "Senior Frontend Engineer", location: "Remote · EU", stage: "Sourcing", candidates: 24 },
	{ title: "ML Platform Engineer", location: "London", stage: "Interviewing", candidates: 18 },
	{ title: "Staff Backend Engineer", location: "Remote · Global", stage: "Sourcing", candidates: 9 },
	{ title: "Product Designer", location: "Berlin", stage: "Open", candidates: 0 },
	{ title: "DevOps Engineer", location: "Remote · EU", stage: "Sourcing", candidates: 11 },
];

const RoleCard: React.FC<{ role: Role; index: number; highlight: boolean }> = ({
	role,
	index,
	highlight,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const delay = 0.4 + index * 0.08;
	const op = interpolate(
		frame,
		[delay * fps, (delay + 0.35) * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const lift = interpolate(
		frame,
		[delay * fps, (delay + 0.35) * fps],
		[12, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
	);

	// Highlight (top card) gets accent border after click @ ~1.8s.
	const highlightT = interpolate(frame, [1.7 * fps, 2.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				opacity: op,
				transform: `translateY(${lift}px)`,
				padding: 18,
				borderRadius: 12,
				backgroundColor: highlight ? SURFACE_2 : SURFACE,
				border: `1px solid ${highlight ? `rgba(56, 189, 248, ${highlightT * 0.7})` : SURFACE_BORDER}`,
				display: "flex",
				alignItems: "center",
				gap: 18,
				boxShadow: highlight ? `0 0 0 ${highlightT * 2}px rgba(56,189,248,${highlightT * 0.18})` : "none",
			}}
		>
			<div
				style={{
					width: 40,
					height: 40,
					borderRadius: 10,
					backgroundColor: ACCENT_SOFT,
					color: ACCENT,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 18,
					fontFamily: displayFont,
				}}
			>
				◇
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontSize: 16, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
					{role.title}
				</div>
				<div
					style={{
						fontSize: 12,
						color: TEXT_FAINT,
						fontFamily: monoFont,
					}}
				>
					{role.location}
				</div>
			</div>
			<div
				style={{
					fontSize: 12,
					padding: "4px 10px",
					borderRadius: 999,
					color: role.stage === "Open" ? TEXT_FAINT : ACCENT,
					backgroundColor: role.stage === "Open" ? "rgba(255,255,255,0.05)" : ACCENT_SOFT,
					fontFamily: monoFont,
				}}
			>
				{role.stage}
			</div>
			<div style={{ width: 80, textAlign: "right" }}>
				<div
					style={{
						fontSize: 18,
						fontWeight: 700,
						color: TEXT,
						fontFamily: monoFont,
					}}
				>
					{role.candidates}
				</div>
				<div style={{ fontSize: 10, color: TEXT_FAINT, fontFamily: monoFont }}>
					candidates
				</div>
			</div>
		</div>
	);
};

export const OpeningsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const headerOp = interpolate(frame, [0.1 * fps, 0.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<PanelSwap>
			<div style={{ display: "flex", flexDirection: "column", gap: 22, height: "100%" }}>
				<div style={{ opacity: headerOp }}>
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
						Openings
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "baseline",
							gap: 16,
						}}
					>
						<div
							style={{
								fontSize: 28,
								fontWeight: 700,
								letterSpacing: -0.5,
								color: TEXT,
							}}
						>
							Active roles
						</div>
						<div
							style={{
								fontSize: 14,
								color: TEXT_DIM,
								fontFamily: monoFont,
							}}
						>
							28 open
						</div>
					</div>
				</div>

				<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
					{ROLES.map((r, i) => (
						<RoleCard key={r.title} role={r} index={i} highlight={i === 0} />
					))}
				</div>
			</div>
		</PanelSwap>
	);
};
