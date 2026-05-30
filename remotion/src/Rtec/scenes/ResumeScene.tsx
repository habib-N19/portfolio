import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
	ACCENT,
	ACCENT_BRIGHT,
	ACCENT_SOFT,
	SECOND,
	SECOND_SOFT,
	SURFACE,
	SURFACE_2,
	SURFACE_BORDER,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut, fadeUp } from "../anim";

const SOURCES = [
	{ icon: "📚", label: "Courses", count: "24 enrolled" },
	{ icon: "🏛", label: "Clubs", count: "Robotics · Debate" },
	{ icon: "📅", label: "Events", count: "12 attended" },
	{ icon: "🎓", label: "Alumni profile", count: "Class of 2025" },
	{ icon: "💝", label: "Donations", count: "3 records" },
];

const RESUME_LINES = [
	{ delay: 1.0, label: "Robotics Club · President", source: 1 },
	{ delay: 1.4, label: "Embedded Systems, Microcontrollers, …", source: 0 },
	{ delay: 1.8, label: "Hackathon — 1st place (Apr 2024)", source: 2 },
	{ delay: 2.2, label: "RTEC · Diploma in Engineering", source: 3 },
];

const SourceCard: React.FC<{ src: (typeof SOURCES)[number]; index: number }> = ({
	src,
	index,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const delay = 0.4 + index * 0.08;
	const op = interpolate(frame, [delay * fps, (delay + 0.35) * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const lift = interpolate(frame, [delay * fps, (delay + 0.4) * fps], [12, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	// Pulse when "feeding into" resume.
	const feedAt = 1.0 + index * 0.4;
	const pulse = interpolate(
		frame,
		[feedAt * fps, (feedAt + 0.25) * fps, (feedAt + 0.7) * fps],
		[0, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<div
			style={{
				opacity: op,
				transform: `translateY(${lift}px)`,
				padding: "10px 14px",
				borderRadius: 10,
				backgroundColor: SURFACE,
				border: `1px solid ${SURFACE_BORDER}`,
				display: "flex",
				alignItems: "center",
				gap: 12,
				boxShadow: `0 0 ${pulse * 16}px hsla(140, 70%, 50%, ${pulse * 0.45})`,
			}}
		>
			<div
				style={{
					width: 32,
					height: 32,
					borderRadius: 8,
					backgroundColor: ACCENT_SOFT,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 14,
				}}
			>
				{src.icon}
			</div>
			<div style={{ minWidth: 0, flex: 1 }}>
				<div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{src.label}</div>
				<div
					style={{
						fontSize: 11,
						color: TEXT_FAINT,
						fontFamily: monoFont,
					}}
				>
					{src.count}
				</div>
			</div>
		</div>
	);
};

const ResumeLine: React.FC<{ line: (typeof RESUME_LINES)[number] }> = ({ line }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const op = interpolate(frame, [line.delay * fps, (line.delay + 0.3) * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const slide = interpolate(frame, [line.delay * fps, (line.delay + 0.4) * fps], [10, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	return (
		<div
			style={{
				opacity: op,
				transform: `translateX(${slide}px)`,
				display: "flex",
				alignItems: "center",
				gap: 8,
				fontSize: 13,
				color: TEXT,
				lineHeight: 1.5,
			}}
		>
			<div
				style={{
					width: 5,
					height: 5,
					borderRadius: "50%",
					backgroundColor: ACCENT,
				}}
			/>
			{line.label}
		</div>
	);
};

export const ResumeScene: React.FC = () => {
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
					Hero feature · 02 / 03
				</div>
				<div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
					Resume builder
				</div>
				<div style={{ fontSize: 17, color: TEXT_DIM, marginTop: 4 }}>
					Auto-fills from a student's real campus record. No fabricated experience.
				</div>
			</div>

			<div style={{ display: "flex", gap: 28, flex: 1, alignItems: "stretch", minHeight: 0 }}>
				{/* Left: sources */}
				<div
					style={{
						width: 330,
						display: "flex",
						flexDirection: "column",
						gap: 8,
					}}
				>
					<div
						style={{
							fontSize: 11,
							color: TEXT_FAINT,
							fontFamily: monoFont,
							letterSpacing: 1,
							textTransform: "uppercase",
							marginBottom: 4,
						}}
					>
						Source records
					</div>
					{SOURCES.map((s, i) => (
						<SourceCard key={s.label} src={s} index={i} />
					))}
				</div>

				{/* Flow arrow */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: 60,
					}}
				>
					<div
						style={{
							fontSize: 32,
							color: ACCENT_BRIGHT,
							opacity: 0.8,
						}}
					>
						→
					</div>
				</div>

				{/* Right: building resume */}
				<div
					style={{
						flex: 1,
						backgroundColor: "white",
						borderRadius: 10,
						padding: "26px 30px",
						color: "#1a1a1a",
						fontFamily: displayFont,
						display: "flex",
						flexDirection: "column",
						gap: 12,
						boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
						...fadeUp(frame, fps, { delaySec: 0.3, durationSec: 0.5 }),
					}}
				>
					<div style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: 8 }}>
						<div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
							Sadia R.
						</div>
						<div
							style={{
								fontSize: 11,
								fontFamily: monoFont,
								color: "#666",
								marginTop: 2,
							}}
						>
							sadia.r@rtec.edu · Computer Engineering · 2025
						</div>
					</div>

					<div>
						<div
							style={{
								fontSize: 10,
								fontFamily: monoFont,
								letterSpacing: 2,
								color: "#999",
								marginBottom: 6,
								textTransform: "uppercase",
							}}
						>
							Leadership & Activities
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							{RESUME_LINES.filter((_, i) => i < 3).map((l, i) => (
								<ResumeLine key={i} line={l} />
							))}
						</div>
					</div>

					<div>
						<div
							style={{
								fontSize: 10,
								fontFamily: monoFont,
								letterSpacing: 2,
								color: "#999",
								marginBottom: 6,
								textTransform: "uppercase",
							}}
						>
							Education
						</div>
						<ResumeLine line={RESUME_LINES[3]} />
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
