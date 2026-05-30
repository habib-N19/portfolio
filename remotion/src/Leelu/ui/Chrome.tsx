import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
	ACCENT,
	BG_RAISED,
	SURFACE,
	SURFACE_BORDER,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";

const NAV_ITEMS: Array<{ label: string; icon: string }> = [
	{ label: "Dashboard", icon: "▦" },
	{ label: "Candidates", icon: "◔" },
	{ label: "Pipeline", icon: "▤" },
	{ label: "Copilot", icon: "✦" },
	{ label: "Openings", icon: "◇" },
	{ label: "Sourcing", icon: "◎" },
	{ label: "Outreach", icon: "✉" },
	{ label: "Inbox", icon: "▢" },
	{ label: "Analytics", icon: "▥" },
];

type ChromeProps = {
	activeNav: string;
	children: React.ReactNode;
};

/**
 * Persistent dashboard chrome: sidebar + top bar.
 * Slides in at the start of the comp, then stays put.
 * `useCurrentFrame()` here is relative to the comp root (Chrome lives outside Series).
 */
export const Chrome: React.FC<ChromeProps> = ({ activeNav, children }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const sidebarX = interpolate(frame, [0, 0.7 * fps], [-260, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const topbarY = interpolate(frame, [0.15 * fps, 0.85 * fps], [-60, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const contentOpacity = interpolate(frame, [0.5 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const SIDEBAR_W = 240;
	const TOPBAR_H = 60;

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				display: "flex",
				fontFamily: displayFont,
				color: TEXT,
			}}
		>
			{/* Sidebar */}
			<div
				style={{
					width: SIDEBAR_W,
					backgroundColor: BG_RAISED,
					borderRight: `1px solid ${SURFACE_BORDER}`,
					transform: `translateX(${sidebarX}px)`,
					display: "flex",
					flexDirection: "column",
					padding: "0 12px",
				}}
			>
				{/* Brand */}
				<div
					style={{
						height: TOPBAR_H,
						display: "flex",
						alignItems: "center",
						gap: 10,
						padding: "0 8px",
						borderBottom: `1px solid ${SURFACE_BORDER}`,
					}}
				>
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: 8,
							background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(220 90% 60%) 100%)`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontSize: 16,
							fontWeight: 700,
						}}
					>
						L
					</div>
					<div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>
						Leelu
					</div>
				</div>

				{/* Nav */}
				<nav style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 2 }}>
					{NAV_ITEMS.map((item) => {
						const isActive = item.label === activeNav;
						return (
							<div
								key={item.label}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 12,
									padding: "9px 12px",
									borderRadius: 8,
									fontSize: 14,
									fontWeight: 500,
									color: isActive ? TEXT : TEXT_DIM,
									backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
									borderLeft: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
									paddingLeft: isActive ? 10 : 12,
								}}
							>
								<span
									style={{
										fontSize: 14,
										width: 18,
										color: isActive ? ACCENT : TEXT_FAINT,
									}}
								>
									{item.icon}
								</span>
								<span>{item.label}</span>
							</div>
						);
					})}
				</nav>

				{/* Footer */}
				<div
					style={{
						marginTop: "auto",
						padding: "12px 8px",
						borderTop: `1px solid ${SURFACE_BORDER}`,
						display: "flex",
						alignItems: "center",
						gap: 10,
					}}
				>
					<div
						style={{
							width: 32,
							height: 32,
							borderRadius: "50%",
							backgroundColor: SURFACE,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 13,
							fontWeight: 600,
							color: TEXT_DIM,
						}}
					>
						HA
					</div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<span style={{ fontSize: 13, fontWeight: 500 }}>Habib</span>
						<span style={{ fontSize: 11, color: TEXT_FAINT, fontFamily: monoFont }}>
							habib@softstandard.io
						</span>
					</div>
				</div>
			</div>

			{/* Right side: topbar + content */}
			<div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
				{/* Topbar */}
				<div
					style={{
						height: TOPBAR_H,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "0 28px",
						borderBottom: `1px solid ${SURFACE_BORDER}`,
						backgroundColor: BG_RAISED,
						transform: `translateY(${topbarY}px)`,
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
						<div
							style={{
								padding: "5px 12px",
								borderRadius: 8,
								backgroundColor: SURFACE,
								fontSize: 13,
								color: TEXT_DIM,
								fontFamily: monoFont,
							}}
						>
							softstandard
						</div>
						<span style={{ color: TEXT_FAINT, fontSize: 13 }}>/</span>
						<span style={{ fontSize: 14, fontWeight: 500, color: TEXT }}>
							{activeNav}
						</span>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
						<div
							style={{
								padding: "6px 12px",
								borderRadius: 8,
								border: `1px solid ${SURFACE_BORDER}`,
								backgroundColor: SURFACE,
								fontSize: 12,
								color: TEXT_FAINT,
								minWidth: 220,
								fontFamily: monoFont,
							}}
						>
							⌕  Search
						</div>
						<div
							style={{
								width: 32,
								height: 32,
								borderRadius: "50%",
								background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(280 70% 60%) 100%)`,
							}}
						/>
					</div>
				</div>

				{/* Content slot */}
				<div
					style={{
						flex: 1,
						minHeight: 0,
						opacity: contentOpacity,
						position: "relative",
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
