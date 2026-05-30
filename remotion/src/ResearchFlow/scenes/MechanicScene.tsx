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

/**
 * Mechanic scene v2 — browser on left, Figma on right, card flies across,
 * then the Figma plugin sidebar opens with extracted metadata.
 */

const BrowserChrome: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div
			style={{
				flex: 1,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				borderRadius: 12,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
			}}
		>
			<div
				style={{
					height: 36,
					backgroundColor: SURFACE_2,
					borderBottom: `1px solid ${SURFACE_BORDER}`,
					display: "flex",
					alignItems: "center",
					gap: 8,
					padding: "0 12px",
				}}
			>
				<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
				<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#febc2e" }} />
				<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#28c840" }} />
				<div
					style={{
						marginLeft: 14,
						flex: 1,
						height: 22,
						borderRadius: 6,
						backgroundColor: "rgba(255,255,255,0.05)",
						display: "flex",
						alignItems: "center",
						padding: "0 10px",
						fontSize: 11,
						color: TEXT_FAINT,
						fontFamily: monoFont,
					}}
				>
					🔒 dribbble.com/shots
				</div>
				<div
					style={{
						padding: "3px 8px",
						borderRadius: 6,
						backgroundColor: ACCENT_SOFT,
						color: ACCENT_BRIGHT,
						fontSize: 10,
						fontFamily: monoFont,
						fontWeight: 700,
						letterSpacing: 1,
					}}
				>
					RF
				</div>
			</div>
			<div style={{ flex: 1, minHeight: 0, padding: 14, position: "relative" }}>{children}</div>
		</div>
	);
};

const FigmaChrome: React.FC<{ pluginPanelT: number; children: React.ReactNode }> = ({
	pluginPanelT,
	children,
}) => {
	const panelW = 220 * pluginPanelT;

	return (
		<div
			style={{
				flex: 1,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				borderRadius: 12,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
			}}
		>
			<div
				style={{
					height: 36,
					backgroundColor: SURFACE_2,
					borderBottom: `1px solid ${SURFACE_BORDER}`,
					display: "flex",
					alignItems: "center",
					gap: 10,
					padding: "0 12px",
				}}
			>
				<div
					style={{
						width: 22,
						height: 22,
						borderRadius: 5,
						background: "linear-gradient(135deg, #f24e1e 0%, #ff7262 50%, #a259ff 100%)",
					}}
				/>
				<div style={{ fontSize: 12, color: TEXT, fontFamily: displayFont }}>
					Inspiration · Mood board
				</div>
				<div style={{ flex: 1 }} />
				<div
					style={{
						padding: "3px 8px",
						borderRadius: 6,
						backgroundColor: ACCENT_SOFT,
						color: ACCENT_BRIGHT,
						fontSize: 10,
						fontFamily: monoFont,
						fontWeight: 700,
						letterSpacing: 1,
					}}
				>
					RF · Plugin
				</div>
			</div>
			<div style={{ flex: 1, minHeight: 0, display: "flex" }}>
				{/* Canvas */}
				<div
					style={{
						flex: 1,
						minWidth: 0,
						position: "relative",
						background:
							"repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 30px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 30px)",
					}}
				>
					{children}
				</div>
				{/* Plugin sidebar */}
				{pluginPanelT > 0.01 && (
					<div
						style={{
							width: panelW,
							borderLeft: `1px solid ${SURFACE_BORDER}`,
							backgroundColor: SURFACE_2,
							padding: 12,
							display: "flex",
							flexDirection: "column",
							gap: 10,
							overflow: "hidden",
						}}
					>
						<PluginInner appearT={pluginPanelT} />
					</div>
				)}
			</div>
		</div>
	);
};

const PluginInner: React.FC<{ appearT: number }> = ({ appearT }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// All inner items fade in once the panel is mostly open (appearT > 0.6).
	const innerT = Math.max(0, (appearT - 0.6) / 0.4);

	const fadeAt = (delay: number) =>
		interpolate(
			frame,
			[(3.0 + delay) * fps, (3.0 + delay + 0.3) * fps],
			[0, 1],
			{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
		);

	if (innerT < 0.05) {
		return <div />;
	}

	const palette = [
		"hsl(320, 60%, 50%)",
		"hsl(345, 55%, 45%)",
		"hsl(20, 70%, 60%)",
		"hsl(280, 50%, 55%)",
		"hsl(220, 30%, 25%)",
	];

	return (
		<div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, opacity: innerT }}>
			<div
				style={{
					fontSize: 10,
					color: TEXT_FAINT,
					fontFamily: monoFont,
					textTransform: "uppercase",
					letterSpacing: 1,
				}}
			>
				Captured item
			</div>

			{/* Thumbnail */}
			<div
				style={{
					width: "100%",
					aspectRatio: "16 / 10",
					borderRadius: 6,
					background: `linear-gradient(135deg, hsl(320 60% 45%) 0%, hsl(350 55% 35%) 100%)`,
					opacity: fadeAt(0),
				}}
			/>

			{/* URL */}
			<div style={{ opacity: fadeAt(0.15) }}>
				<div
					style={{
						fontSize: 9,
						color: TEXT_FAINT,
						fontFamily: monoFont,
						letterSpacing: 1,
						textTransform: "uppercase",
						marginBottom: 2,
					}}
				>
					Source
				</div>
				<div
					style={{
						padding: "5px 7px",
						borderRadius: 5,
						backgroundColor: "rgba(255,255,255,0.05)",
						fontSize: 10,
						color: TEXT_DIM,
						fontFamily: monoFont,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					dribbble.com/landing
				</div>
			</div>

			{/* Tags */}
			<div style={{ opacity: fadeAt(0.3) }}>
				<div
					style={{
						fontSize: 9,
						color: TEXT_FAINT,
						fontFamily: monoFont,
						letterSpacing: 1,
						textTransform: "uppercase",
						marginBottom: 4,
					}}
				>
					Tags
				</div>
				<div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
					{["landing", "saas", "dark"].map((t) => (
						<div
							key={t}
							style={{
								padding: "2px 7px",
								borderRadius: 999,
								backgroundColor: ACCENT_SOFT,
								color: ACCENT_BRIGHT,
								fontSize: 9,
								fontFamily: monoFont,
							}}
						>
							{t}
						</div>
					))}
				</div>
			</div>

			{/* Palette */}
			<div style={{ opacity: fadeAt(0.45) }}>
				<div
					style={{
						fontSize: 9,
						color: TEXT_FAINT,
						fontFamily: monoFont,
						letterSpacing: 1,
						textTransform: "uppercase",
						marginBottom: 4,
					}}
				>
					Palette
				</div>
				<div style={{ display: "flex", gap: 3 }}>
					{palette.map((c, i) => (
						<div
							key={i}
							style={{
								flex: 1,
								height: 20,
								borderRadius: 3,
								backgroundColor: c,
								border: `1px solid rgba(255,255,255,0.08)`,
							}}
						/>
					))}
				</div>
			</div>

			{/* Insert button */}
			<div
				style={{
					marginTop: "auto",
					padding: "8px 10px",
					borderRadius: 6,
					backgroundColor: ACCENT,
					color: "white",
					fontSize: 11,
					fontWeight: 600,
					textAlign: "center",
					opacity: fadeAt(0.6),
				}}
			>
				Insert on canvas
			</div>
		</div>
	);
};

const SOURCES = [
	{ hue: 200, label: "UI · Dashboard" },
	{ hue: 320, label: "UI · Landing" },
	{ hue: 30, label: "UI · Cards" },
	{ hue: 150, label: "UI · Mobile" },
];
const CLIP_INDEX = 1;

export const MechanicScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	// Beat structure:
	//   0.0–0.8s   setup, hover the clip card
	//   0.8–1.0s   click ripple
	//   1.0–2.2s   card lifts off and flies across the screen
	//   2.2–2.6s   lands on Figma canvas
	//   2.6–3.0s   landing pulse + plugin sidebar starts opening
	//   3.0–5.0s   plugin sidebar contents populate (URL, tags, palette, insert button)
	//   5.0+       hold

	const clickT = interpolate(frame, [0.8 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const flyT = interpolate(frame, [1.0 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.cubic),
	});

	// Plugin sidebar opens after the card lands.
	const pluginPanelT = interpolate(frame, [2.6 * fps, 3.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const START_X = 230;
	const START_Y = 360;
	const END_X = 1180;
	const END_Y = 520;
	const flyX = START_X + (END_X - START_X) * flyT;
	const flyY = START_Y + (END_Y - START_Y) * flyT - Math.sin(flyT * Math.PI) * 140;
	const flyScale = 1 + Math.sin(flyT * Math.PI) * 0.15;
	const flyRot = (flyT - 0.5) * 12;

	const liftedOff = flyT > 0.02;

	const land = interpolate(frame, [2.15 * fps, 2.55 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				padding: "60px 70px",
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
						marginBottom: 4,
					}}
				>
					The mechanic
				</div>
				<div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
					Clip from the web. Land in Figma.
				</div>
			</div>

			<div
				style={{
					flex: 1,
					display: "flex",
					gap: 30,
					minHeight: 0,
					alignItems: "stretch",
					position: "relative",
				}}
			>
				{/* Browser */}
				<BrowserChrome>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 10,
							height: "100%",
						}}
					>
						{SOURCES.map((s, i) => {
							const isClip = i === CLIP_INDEX;
							const hidden = isClip && liftedOff;
							const buttonShow = isClip && !liftedOff;
							const delay = 0.2 + i * 0.08;
							const op2 = interpolate(frame, [delay * fps, (delay + 0.3) * fps], [0, 1], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
							});
							return (
								<div
									key={i}
									style={{
										opacity: hidden ? 0 : op2,
										position: "relative",
										borderRadius: 10,
										overflow: "hidden",
										background: `linear-gradient(135deg, hsl(${s.hue} 60% 45%) 0%, hsl(${s.hue + 30} 55% 35%) 100%)`,
									}}
								>
									<div
										style={{
											position: "absolute",
											inset: 12,
											display: "flex",
											flexDirection: "column",
											gap: 5,
										}}
									>
										<div style={{ height: 8, width: "55%", backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
										<div style={{ height: 6, width: "90%", backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 2 }} />
										<div style={{ height: 6, width: "75%", backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 2 }} />
									</div>
									<div
										style={{
											position: "absolute",
											left: 10,
											bottom: 10,
											padding: "3px 8px",
											borderRadius: 4,
											backgroundColor: "rgba(0,0,0,0.45)",
											fontSize: 10,
											color: "white",
											fontFamily: monoFont,
										}}
									>
										{s.label}
									</div>

									{buttonShow && (
										<div
											style={{
												position: "absolute",
												right: 10,
												top: 10,
												padding: "6px 10px",
												borderRadius: 8,
												backgroundColor: ACCENT,
												color: "white",
												fontSize: 11,
												fontWeight: 700,
												fontFamily: monoFont,
												letterSpacing: 0.5,
												boxShadow: `0 0 ${clickT * 22}px ${ACCENT}`,
												transform: `scale(${1 - clickT * 0.06})`,
												display: "flex",
												alignItems: "center",
												gap: 6,
											}}
										>
											<span>✂</span>
											Clip
										</div>
									)}
								</div>
							);
						})}
					</div>
				</BrowserChrome>

				{/* Figma */}
				<FigmaChrome pluginPanelT={pluginPanelT}>
					{[
						{ x: 30, y: 30, w: 130, h: 90, hue: 180 },
						{ x: 200, y: 60, w: 110, h: 80, hue: 50 },
						{ x: 60, y: 160, w: 110, h: 80, hue: 270 },
					].map((c, i) => (
						<div
							key={i}
							style={{
								position: "absolute",
								left: c.x,
								top: c.y,
								width: c.w,
								height: c.h,
								borderRadius: 6,
								background: `linear-gradient(135deg, hsl(${c.hue} 60% 45%) 0%, hsl(${c.hue + 30} 55% 35%) 100%)`,
								border: "1px solid rgba(255,255,255,0.1)",
								opacity: 0.85,
							}}
						/>
					))}

					{/* Drop target */}
					<div
						style={{
							position: "absolute",
							left: 200,
							top: 170,
							width: 170,
							height: 110,
							borderRadius: 8,
							border: `2px dashed ${ACCENT_BRIGHT}`,
							opacity: interpolate(frame, [0.6 * fps, 2.2 * fps, 2.4 * fps], [0, 1, 0], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
							}),
							boxShadow: `0 0 ${land * 30}px ${ACCENT_SOFT}`,
						}}
					/>

					{/* Landed card */}
					{flyT >= 0.98 && (
						<div
							style={{
								position: "absolute",
								left: 200,
								top: 170,
								width: 170,
								height: 110,
								borderRadius: 8,
								background: `linear-gradient(135deg, hsl(320 60% 45%) 0%, hsl(350 55% 35%) 100%)`,
								border: `2px solid ${ACCENT_BRIGHT}`,
								boxShadow: `0 0 ${land * 30}px ${ACCENT}`,
							}}
						>
							<div
								style={{
									position: "absolute",
									left: 8,
									bottom: 8,
									padding: "3px 8px",
									borderRadius: 4,
									backgroundColor: "rgba(0,0,0,0.45)",
									fontSize: 10,
									color: "white",
									fontFamily: monoFont,
								}}
							>
								UI · Landing
							</div>
						</div>
					)}
				</FigmaChrome>

				{/* Flying card (in scene root) */}
				{liftedOff && flyT < 0.98 && (
					<div
						style={{
							position: "absolute",
							left: flyX,
							top: flyY,
							width: 200 * flyScale,
							height: 130 * flyScale,
							borderRadius: 10,
							background: `linear-gradient(135deg, hsl(320 60% 45%) 0%, hsl(350 55% 35%) 100%)`,
							border: `2px solid ${ACCENT_BRIGHT}`,
							boxShadow: `0 18px 40px rgba(0,0,0,0.5), 0 0 30px ${ACCENT_SOFT}`,
							transform: `rotate(${flyRot}deg)`,
							pointerEvents: "none",
						}}
					>
						<div
							style={{
								position: "absolute",
								left: 12,
								bottom: 10,
								padding: "4px 8px",
								borderRadius: 4,
								backgroundColor: "rgba(0,0,0,0.55)",
								fontSize: 11,
								color: "white",
								fontFamily: monoFont,
							}}
						>
							UI · Landing
						</div>
					</div>
				)}

				{/* Center arrow — fades out once plugin opens */}
				<div
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						color: ACCENT_BRIGHT,
						fontSize: 30,
						opacity: 0.7 * (1 - pluginPanelT),
						pointerEvents: "none",
					}}
				>
					→
				</div>
			</div>
		</AbsoluteFill>
	);
};
