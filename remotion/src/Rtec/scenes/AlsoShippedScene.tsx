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

const FeatureCard: React.FC<{
	index: number;
	tag: string;
	title: string;
	children: React.ReactNode;
}> = ({ index, tag, title, children }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const delay = 0.3 + index * 0.18;
	const op = interpolate(frame, [delay * fps, (delay + 0.4) * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const lift = interpolate(frame, [delay * fps, (delay + 0.45) * fps], [22, 0], {
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
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				borderRadius: 14,
				padding: 24,
				display: "flex",
				flexDirection: "column",
				gap: 14,
				minWidth: 0,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					fontSize: 11,
					color: ACCENT_BRIGHT,
					fontFamily: monoFont,
					letterSpacing: 2,
					textTransform: "uppercase",
				}}
			>
				{tag}
			</div>
			<div style={{ fontSize: 20, fontWeight: 700, color: TEXT, letterSpacing: -0.3 }}>
				{title}
			</div>
			<div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
				{children}
			</div>
		</div>
	);
};

const LiveStreamMock: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const liveBlink = interpolate(
		frame,
		[0.6 * fps, 0.8 * fps, 1.0 * fps, 1.2 * fps],
		[1, 0.3, 1, 0.3],
		{ extrapolateLeft: "clamp", extrapolateRight: "extend" },
	);
	const viewers = Math.round(
		interpolate(frame, [0.5 * fps, 2.2 * fps], [0, 487], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		}),
	);
	return (
		<div
			style={{
				flex: 1,
				backgroundColor: SURFACE_2,
				borderRadius: 10,
				position: "relative",
				overflow: "hidden",
				display: "flex",
				alignItems: "flex-end",
				padding: 12,
				background: `linear-gradient(135deg, hsl(140 25% 14%) 0%, hsl(34 20% 10%) 100%)`,
			}}
		>
			{/* Play button */}
			<div
				style={{
					position: "absolute",
					left: "50%",
					top: "45%",
					transform: "translate(-50%, -50%)",
					width: 56,
					height: 56,
					borderRadius: "50%",
					backgroundColor: "rgba(255,255,255,0.92)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#1a1a1a",
					fontSize: 22,
				}}
			>
				▶
			</div>

			{/* LIVE pill */}
			<div
				style={{
					position: "absolute",
					top: 12,
					left: 12,
					display: "flex",
					alignItems: "center",
					gap: 6,
					padding: "5px 10px",
					borderRadius: 6,
					backgroundColor: "rgba(220, 40, 40, 0.9)",
					fontSize: 11,
					fontFamily: monoFont,
					color: "white",
					fontWeight: 700,
					letterSpacing: 1,
				}}
			>
				<span
					style={{
						width: 6,
						height: 6,
						borderRadius: "50%",
						backgroundColor: "white",
						opacity: liveBlink,
					}}
				/>
				LIVE
			</div>

			<div
				style={{
					position: "absolute",
					top: 12,
					right: 12,
					padding: "5px 10px",
					borderRadius: 6,
					backgroundColor: "rgba(0,0,0,0.55)",
					fontSize: 11,
					fontFamily: monoFont,
					color: "white",
				}}
			>
				👁 {viewers}
			</div>

			{/* Caption */}
			<div
				style={{
					backgroundColor: "rgba(0,0,0,0.6)",
					backdropFilter: "blur(8px)",
					padding: "8px 12px",
					borderRadius: 6,
					fontSize: 12,
					color: "white",
				}}
			>
				Convocation 2025 · Main Auditorium
			</div>
		</div>
	);
};

const LibraryGrid: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const items = Array.from({ length: 6 }, (_, i) => i);

	return (
		<div
			style={{
				flex: 1,
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: 8,
			}}
		>
			{items.map((i) => {
				const delay = 0.6 + i * 0.08;
				const op = interpolate(frame, [delay * fps, (delay + 0.35) * fps], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				const scale = interpolate(frame, [delay * fps, (delay + 0.4) * fps], [0.9, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: Easing.out(Easing.cubic),
				});
				return (
					<div
						key={i}
						style={{
							opacity: op,
							transform: `scale(${scale})`,
							borderRadius: 8,
							backgroundColor: SURFACE_2,
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							padding: 10,
							position: "relative",
							overflow: "hidden",
							background: `linear-gradient(135deg, hsl(${130 + i * 8} 25% ${12 + i}%) 0%, hsl(${20 + i * 6} 20% 10%) 100%)`,
						}}
					>
						<div
							style={{
								position: "absolute",
								right: 6,
								top: 6,
								padding: "2px 6px",
								borderRadius: 4,
								backgroundColor: "rgba(0,0,0,0.55)",
								fontSize: 9,
								fontFamily: monoFont,
								color: "white",
							}}
						>
							{["12:42", "08:17", "23:05", "04:30", "15:21", "37:08"][i]}
						</div>
						<div
							style={{
								marginTop: "auto",
								height: 5,
								width: "60%",
								backgroundColor: "rgba(255,255,255,0.4)",
								borderRadius: 2,
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

const ChatThread: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const messages = [
		{ from: "Rafi", text: "Anyone need Embedded notes?", side: "left", delay: 0.7 },
		{ from: "You", text: "Sending now ✓", side: "right", delay: 1.05 },
		{ from: "Sadia", text: "Thanks!! Lab is at 3pm rt?", side: "left", delay: 1.4 },
		{ from: "You", text: "Yep — Lab 3", side: "right", delay: 1.75 },
	];

	return (
		<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end" }}>
			{messages.map((m, i) => {
				const op = interpolate(frame, [m.delay * fps, (m.delay + 0.3) * fps], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				const slide = interpolate(frame, [m.delay * fps, (m.delay + 0.35) * fps], [10, 0], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: Easing.out(Easing.cubic),
				});
				const isRight = m.side === "right";
				return (
					<div
						key={i}
						style={{
							opacity: op,
							transform: `translateY(${slide}px)`,
							alignSelf: isRight ? "flex-end" : "flex-start",
							maxWidth: "80%",
							padding: "8px 12px",
							borderRadius: isRight ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
							backgroundColor: isRight ? ACCENT_SOFT : SURFACE_2,
							border: isRight ? `1px solid hsla(140, 70%, 50%, 0.4)` : `1px solid ${SURFACE_BORDER}`,
							fontSize: 13,
							color: TEXT,
						}}
					>
						{!isRight && (
							<div
								style={{
									fontSize: 10,
									color: TEXT_FAINT,
									fontFamily: monoFont,
									marginBottom: 2,
								}}
							>
								{m.from}
							</div>
						)}
						{m.text}
					</div>
				);
			})}
		</div>
	);
};

export const AlsoShippedScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	const header = fadeUp(frame, fps, { delaySec: 0.05, durationSec: 0.45 });

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
					Also shipped
				</div>
				<div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
					A whole campus, online
				</div>
			</div>

			<div style={{ display: "flex", gap: 14, flex: 1, minHeight: 0 }}>
				<FeatureCard index={0} tag="Live" title="Stream">
					<LiveStreamMock />
				</FeatureCard>
				<FeatureCard index={1} tag="On-demand" title="Library">
					<LibraryGrid />
				</FeatureCard>
				<FeatureCard index={2} tag="Real-time" title="Chat">
					<ChatThread />
				</FeatureCard>
			</div>
		</AbsoluteFill>
	);
};
