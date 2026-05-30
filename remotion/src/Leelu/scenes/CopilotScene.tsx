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

const USER_PROMPT = "Draft outreach for top 5 candidates from this sourcing run.";

const AI_REPLY = [
	"Hi {name},",
	"",
	"I came across your work at {company} — your shipping cadence on the design-system migration stood out.",
	"",
	"We're building Leelu's frontend at Softstandard. Worth a 20-min chat next week?",
	"",
	"— Habib",
];

const useTypewriter = (text: string, startSec: number, charsPerSec: number) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const elapsed = Math.max(0, frame - startSec * fps);
	const total = Math.min(text.length, Math.floor((elapsed / fps) * charsPerSec));
	return text.slice(0, total);
};

const PromptLine: React.FC = () => {
	const text = useTypewriter(USER_PROMPT, 0.5, 38);
	return (
		<div
			style={{
				alignSelf: "flex-end",
				maxWidth: 420,
				padding: "10px 14px",
				borderRadius: "14px 14px 4px 14px",
				backgroundColor: ACCENT_SOFT,
				border: `1px solid hsla(200, 90%, 55%, 0.4)`,
				color: TEXT,
				fontSize: 14,
				lineHeight: 1.5,
			}}
		>
			{text || " "}
		</div>
	);
};

const AiLine: React.FC<{ line: string; index: number }> = ({ line, index }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const start = 2.3 + index * 0.28;
	const op = interpolate(
		frame,
		[start * fps, (start + 0.3) * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const lift = interpolate(
		frame,
		[start * fps, (start + 0.3) * fps],
		[6, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
	);

	const isBlank = line === "";

	return (
		<div
			style={{
				opacity: op,
				transform: `translateY(${lift}px)`,
				fontSize: 13,
				color: isBlank ? "transparent" : TEXT,
				lineHeight: 1.6,
			}}
		>
			{line.replace("{name}", "Priya").replace("{company}", "Linear") || " "}
		</div>
	);
};

export const CopilotScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Background candidate list (faded behind the slide-in panel).
	const dim = interpolate(frame, [0, 0.3 * fps], [0, 0.4], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Right-side Copilot panel slides in.
	const panelX = interpolate(frame, [0, 0.6 * fps], [800, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	// "Send to outreach" CTA glow late.
	const ctaGlow = interpolate(
		frame,
		[3.7 * fps, 4.2 * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<PanelSwap>
			<div style={{ position: "relative", height: "100%", display: "flex" }}>
				{/* Faded backdrop */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundColor: "rgba(0,0,0,0.4)",
						opacity: dim * 1.4,
						pointerEvents: "none",
					}}
				/>

				{/* Hint of candidate list left */}
				<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, opacity: 0.35 }}>
					{[94, 91, 88, 86, 83].map((s, i) => (
						<div
							key={i}
							style={{
								padding: "12px 16px",
								borderRadius: 10,
								backgroundColor: SURFACE,
								border: `1px solid ${SURFACE_BORDER}`,
								display: "flex",
								alignItems: "center",
								gap: 14,
							}}
						>
							<div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: SURFACE_2 }} />
							<div style={{ flex: 1, height: 10, backgroundColor: SURFACE_2, borderRadius: 4 }} />
							<div
								style={{
									padding: "4px 10px",
									borderRadius: 6,
									backgroundColor: ACCENT_SOFT,
									color: ACCENT,
									fontSize: 12,
									fontFamily: monoFont,
									fontWeight: 700,
								}}
							>
								{s}
							</div>
						</div>
					))}
				</div>

				{/* Copilot panel */}
				<div
					style={{
						width: 560,
						transform: `translateX(${panelX}px)`,
						marginLeft: 24,
						backgroundColor: SURFACE,
						border: `1px solid ${SURFACE_BORDER}`,
						borderRadius: 14,
						padding: 22,
						display: "flex",
						flexDirection: "column",
						gap: 18,
						boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
					}}
				>
					{/* Header */}
					<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
						<div
							style={{
								width: 38,
								height: 38,
								borderRadius: 10,
								background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(280 70% 60%) 100%)`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontSize: 18,
							}}
						>
							✦
						</div>
						<div>
							<div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>Copilot</div>
							<div style={{ fontSize: 11, color: TEXT_FAINT, fontFamily: monoFont }}>
								Drafting outreach
							</div>
						</div>
					</div>

					{/* Conversation */}
					<div
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							gap: 12,
							padding: 16,
							borderRadius: 10,
							backgroundColor: SURFACE_2,
							overflow: "hidden",
						}}
					>
						<PromptLine />

						{/* AI message block */}
						<div
							style={{
								padding: 14,
								borderRadius: "14px 14px 14px 4px",
								backgroundColor: SURFACE,
								border: `1px solid ${SURFACE_BORDER}`,
								display: "flex",
								flexDirection: "column",
								gap: 2,
								marginTop: 6,
							}}
						>
							<div
								style={{
									fontSize: 10,
									color: TEXT_FAINT,
									fontFamily: monoFont,
									textTransform: "uppercase",
									letterSpacing: 1,
									marginBottom: 6,
								}}
							>
								Draft · personalized for Priya R.
							</div>
							{AI_REPLY.map((line, i) => (
								<AiLine key={i} line={line} index={i} />
							))}
						</div>
					</div>

					{/* CTA */}
					<div
						style={{
							display: "flex",
							gap: 10,
						}}
					>
						<div
							style={{
								flex: 1,
								padding: "12px 14px",
								borderRadius: 10,
								background: `linear-gradient(180deg, ${ACCENT} 0%, hsl(200 90% 50%) 100%)`,
								color: "white",
								fontSize: 14,
								fontWeight: 600,
								textAlign: "center",
								boxShadow: `0 0 ${ctaGlow * 26}px rgba(56,189,248,${ctaGlow * 0.55})`,
							}}
						>
							✉  Send to outreach
						</div>
						<div
							style={{
								padding: "12px 14px",
								borderRadius: 10,
								backgroundColor: SURFACE_2,
								border: `1px solid ${SURFACE_BORDER}`,
								color: TEXT_DIM,
								fontSize: 14,
								fontWeight: 500,
							}}
						>
							Edit
						</div>
					</div>
				</div>
			</div>
		</PanelSwap>
	);
};
