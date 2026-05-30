import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
	ACCENT_BRIGHT,
	SURFACE,
	SURFACE_2,
	SURFACE_BORDER,
	TINTS,
	TEXT,
	TEXT_DIM,
	TEXT_FAINT,
} from "../theme";
import { displayFont, monoFont } from "../fonts";
import { sceneInOut, fadeUp } from "../anim";

/**
 * Suite scene v2 — staggered focus on each app.
 * 4 apps × ~1.6s focus each. Two columns layout: a static left "spine"
 * showing the suite index (1/4 → 4/4 highlights as time progresses), and
 * a right pane that cross-fades between four richer product mockups.
 */

// ── App 1: Consent Guard — cookie banner on a fake site ──
const ConsentApp: React.FC<{ tint: string; visibleT: number }> = ({ tint, visibleT }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Track-toggle press @ ~0.8s of the local sub-beat.
	const localStart = 0.2;
	const localFrame = frame - localStart * fps;
	const localOk = localFrame >= 0;
	const togglePress = localOk
		? interpolate(localFrame, [0.6 * fps, 0.9 * fps], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			})
		: 0;

	return (
		<div
			style={{
				opacity: visibleT,
				flex: 1,
				borderRadius: 14,
				backgroundColor: SURFACE_2,
				overflow: "hidden",
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Fake site header */}
			<div
				style={{
					height: 38,
					backgroundColor: "rgba(255,255,255,0.04)",
					borderBottom: `1px solid ${SURFACE_BORDER}`,
					display: "flex",
					alignItems: "center",
					gap: 8,
					padding: "0 14px",
				}}
			>
				<div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
				<div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#febc2e" }} />
				<div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#28c840" }} />
				<div
					style={{
						marginLeft: 12,
						flex: 1,
						height: 20,
						borderRadius: 5,
						backgroundColor: "rgba(255,255,255,0.05)",
						display: "flex",
						alignItems: "center",
						padding: "0 8px",
						fontSize: 10,
						color: TEXT_FAINT,
						fontFamily: monoFont,
					}}
				>
					🔒 acme.com
				</div>
			</div>

			{/* Faux website content */}
			<div style={{ flex: 1, padding: 22, display: "flex", flexDirection: "column", gap: 10, opacity: 0.6 }}>
				<div style={{ height: 30, width: "55%", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 4 }} />
				<div style={{ height: 10, width: "85%", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3 }} />
				<div style={{ height: 10, width: "70%", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3 }} />
				<div
					style={{
						marginTop: 12,
						display: "grid",
						gridTemplateColumns: "1fr 1fr 1fr",
						gap: 10,
					}}
				>
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							style={{
								height: 90,
								borderRadius: 6,
								backgroundColor: "rgba(255,255,255,0.04)",
							}}
						/>
					))}
				</div>
			</div>

			{/* Cookie banner overlay */}
			<div
				style={{
					position: "absolute",
					left: 26,
					right: 26,
					bottom: 26,
					padding: 18,
					borderRadius: 12,
					backgroundColor: SURFACE,
					border: `1px solid ${tint}80`,
					boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
					display: "flex",
					flexDirection: "column",
					gap: 12,
					transform: `translateY(${(1 - visibleT) * 30}px)`,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: 8,
							backgroundColor: tint,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontSize: 14,
						}}
					>
						🔒
					</div>
					<div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
						Cookie preferences
					</div>
					<div style={{ flex: 1 }} />
					<div
						style={{
							fontSize: 10,
							color: TEXT_FAINT,
							fontFamily: monoFont,
						}}
					>
						GDPR · CCPA
					</div>
				</div>
				<div style={{ fontSize: 11, color: TEXT_DIM, lineHeight: 1.5 }}>
					We use cookies to improve your experience. Manage your preferences below.
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
					{[
						{ label: "Essential", on: true, locked: true },
						{ label: "Analytics", on: togglePress > 0.5, locked: false },
						{ label: "Marketing", on: false, locked: false },
					].map((row) => (
						<div
							key={row.label}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "6px 10px",
								borderRadius: 6,
								backgroundColor: "rgba(255,255,255,0.04)",
								fontSize: 11,
								color: TEXT,
							}}
						>
							<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
								<span>{row.label}</span>
								{row.locked && (
									<span
										style={{
											fontSize: 9,
											padding: "1px 5px",
											borderRadius: 3,
											backgroundColor: "rgba(255,255,255,0.07)",
											color: TEXT_FAINT,
											fontFamily: monoFont,
										}}
									>
										required
									</span>
								)}
							</div>
							<div
								style={{
									width: 26,
									height: 14,
									borderRadius: 7,
									backgroundColor: row.on ? tint : "rgba(255,255,255,0.1)",
									position: "relative",
									transition: "background-color 200ms",
								}}
							>
								<div
									style={{
										position: "absolute",
										top: 1,
										left: row.on ? 14 : 1,
										width: 12,
										height: 12,
										borderRadius: "50%",
										backgroundColor: "white",
									}}
								/>
							</div>
						</div>
					))}
				</div>
				<div style={{ display: "flex", gap: 6 }}>
					<div
						style={{
							flex: 1,
							padding: "8px 12px",
							borderRadius: 7,
							backgroundColor: tint,
							color: "white",
							fontSize: 11,
							fontWeight: 600,
							textAlign: "center",
						}}
					>
						Accept all
					</div>
					<div
						style={{
							flex: 1,
							padding: "8px 12px",
							borderRadius: 7,
							border: `1px solid ${SURFACE_BORDER}`,
							color: TEXT_DIM,
							fontSize: 11,
							textAlign: "center",
						}}
					>
						Save preferences
					</div>
				</div>
			</div>
		</div>
	);
};

// ── App 2: Launch Guard — audit report panel ──
const LaunchApp: React.FC<{ tint: string; visibleT: number }> = ({ tint, visibleT }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const score = Math.round(
		interpolate(frame, [0.4 * fps, 1.4 * fps], [0, 94], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		}),
	);

	const checks = [
		{ label: "SEO meta tags", status: "pass", count: "12 / 12" },
		{ label: "OG images", status: "pass", count: "8 / 8" },
		{ label: "Sitemap.xml", status: "pass", count: "ok" },
		{ label: "Broken links", status: "warn", count: "2 found" },
		{ label: "Form actions", status: "pass", count: "4 / 4" },
		{ label: "Lighthouse perf", status: "pass", count: "92" },
	];

	return (
		<div
			style={{
				opacity: visibleT,
				flex: 1,
				padding: 22,
				borderRadius: 14,
				backgroundColor: SURFACE_2,
				display: "flex",
				flexDirection: "column",
				gap: 14,
				transform: `translateY(${(1 - visibleT) * 30}px)`,
			}}
		>
			{/* Big score */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 18,
					padding: 16,
					borderRadius: 12,
					backgroundColor: SURFACE,
					border: `1px solid ${SURFACE_BORDER}`,
				}}
			>
				<div
					style={{
						width: 70,
						height: 70,
						borderRadius: "50%",
						background: `conic-gradient(${tint} 0deg ${(score / 100) * 360}deg, rgba(255,255,255,0.08) ${(score / 100) * 360}deg 360deg)`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							width: 54,
							height: 54,
							borderRadius: "50%",
							backgroundColor: SURFACE,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 20,
							fontWeight: 700,
							color: TEXT,
							fontFamily: monoFont,
							fontVariantNumeric: "tabular-nums",
						}}
					>
						{score}
					</div>
				</div>
				<div style={{ flex: 1 }}>
					<div
						style={{
							fontSize: 11,
							color: TEXT_FAINT,
							fontFamily: monoFont,
							textTransform: "uppercase",
							letterSpacing: 1,
						}}
					>
						Pre-launch score
					</div>
					<div style={{ fontSize: 18, fontWeight: 600, color: TEXT, marginTop: 2 }}>
						Ready to ship
					</div>
					<div
						style={{
							fontSize: 11,
							color: TEXT_DIM,
							marginTop: 2,
							fontFamily: monoFont,
						}}
					>
						2 minor warnings
					</div>
				</div>
			</div>

			{/* Audit checklist */}
			<div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
				{checks.map((c, i) => {
					const delay = 0.4 + i * 0.12;
					const op = interpolate(frame, [delay * fps, (delay + 0.3) * fps], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					});
					const isPass = c.status === "pass";
					return (
						<div
							key={c.label}
							style={{
								opacity: op,
								display: "flex",
								alignItems: "center",
								gap: 12,
								padding: "10px 12px",
								borderRadius: 8,
								backgroundColor: SURFACE,
								border: `1px solid ${SURFACE_BORDER}`,
							}}
						>
							<div
								style={{
									width: 18,
									height: 18,
									borderRadius: "50%",
									backgroundColor: isPass ? tint : "hsl(45, 95%, 55%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 10,
									color: "white",
									fontWeight: 700,
								}}
							>
								{isPass ? "✓" : "!"}
							</div>
							<div style={{ fontSize: 13, color: TEXT, flex: 1 }}>{c.label}</div>
							<div
								style={{
									fontSize: 11,
									fontFamily: monoFont,
									color: TEXT_DIM,
								}}
							>
								{c.count}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

// ── App 3: CMS Scaffold — collection field builder ──
const CmsApp: React.FC<{ tint: string; visibleT: number }> = ({ tint, visibleT }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const fields = [
		{ name: "Title", type: "Plain text", icon: "T" },
		{ name: "Slug", type: "Slug", icon: "/" },
		{ name: "Cover", type: "Image", icon: "🖼" },
		{ name: "Body", type: "Rich text", icon: "¶" },
		{ name: "Published", type: "Date / time", icon: "🕒" },
		{ name: "Author", type: "Reference", icon: "↗" },
	];

	return (
		<div
			style={{
				opacity: visibleT,
				flex: 1,
				padding: 22,
				borderRadius: 14,
				backgroundColor: SURFACE_2,
				display: "flex",
				flexDirection: "column",
				gap: 14,
				transform: `translateY(${(1 - visibleT) * 30}px)`,
			}}
		>
			{/* Collection header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
				}}
			>
				<div
					style={{
						width: 32,
						height: 32,
						borderRadius: 8,
						backgroundColor: `${tint}30`,
						color: tint,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 16,
					}}
				>
					📚
				</div>
				<div style={{ flex: 1 }}>
					<div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>
						Blog Posts
					</div>
					<div
						style={{
							fontSize: 11,
							color: TEXT_FAINT,
							fontFamily: monoFont,
						}}
					>
						/blog-posts · plural collection
					</div>
				</div>
				<div
					style={{
						padding: "6px 12px",
						borderRadius: 7,
						backgroundColor: tint,
						color: "white",
						fontSize: 12,
						fontWeight: 600,
					}}
				>
					+ Field
				</div>
			</div>

			{/* Field rows */}
			<div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
				{fields.map((f, i) => {
					const delay = 0.3 + i * 0.15;
					const op = interpolate(frame, [delay * fps, (delay + 0.3) * fps], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					});
					const slide = interpolate(frame, [delay * fps, (delay + 0.35) * fps], [-10, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: Easing.out(Easing.cubic),
					});
					return (
						<div
							key={f.name}
							style={{
								opacity: op,
								transform: `translateX(${slide}px)`,
								display: "flex",
								alignItems: "center",
								gap: 14,
								padding: "10px 14px",
								borderRadius: 8,
								backgroundColor: SURFACE,
								border: `1px solid ${SURFACE_BORDER}`,
								borderLeft: `3px solid ${tint}`,
							}}
						>
							<div
								style={{
									width: 22,
									height: 22,
									borderRadius: 5,
									backgroundColor: "rgba(255,255,255,0.05)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: TEXT_DIM,
									fontSize: 11,
									fontFamily: monoFont,
								}}
							>
								{f.icon}
							</div>
							<div style={{ fontSize: 13, fontWeight: 500, color: TEXT, minWidth: 80 }}>
								{f.name}
							</div>
							<div
								style={{
									fontSize: 11,
									color: TEXT_DIM,
									fontFamily: monoFont,
									flex: 1,
								}}
							>
								{f.type}
							</div>
							<div
								style={{
									fontSize: 10,
									color: TEXT_FAINT,
									fontFamily: monoFont,
								}}
							>
								⋮⋮
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

// ── App 4: Web Calc — embeddable mortgage calculator ──
const CalcApp: React.FC<{ tint: string; visibleT: number }> = ({ tint, visibleT }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const value = Math.round(
		interpolate(frame, [0.4 * fps, 1.5 * fps], [0, 4280], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		}),
	);

	const inputs = [
		{ label: "Loan amount", value: "$ 480,000" },
		{ label: "Interest rate", value: "6.25 %" },
		{ label: "Loan term", value: "30 years" },
		{ label: "Down payment", value: "$ 96,000" },
	];

	return (
		<div
			style={{
				opacity: visibleT,
				flex: 1,
				padding: 22,
				borderRadius: 14,
				backgroundColor: SURFACE_2,
				display: "flex",
				flexDirection: "column",
				gap: 14,
				transform: `translateY(${(1 - visibleT) * 30}px)`,
			}}
		>
			{/* Embed code preview */}
			<div
				style={{
					padding: "8px 12px",
					borderRadius: 6,
					backgroundColor: "rgba(0,0,0,0.35)",
					fontFamily: monoFont,
					fontSize: 11,
					color: TEXT_DIM,
				}}
			>
				<span style={{ color: tint }}>&lt;script </span>
				src=<span style={{ color: TEXT }}>"webcalc.io/m/mortgage.js"</span>
				<span style={{ color: tint }}> /&gt;</span>
			</div>

			<div style={{ display: "flex", gap: 14, flex: 1, minHeight: 0 }}>
				{/* Inputs */}
				<div
					style={{
						flex: 1,
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
							marginBottom: 2,
						}}
					>
						Mortgage estimator
					</div>
					{inputs.map((inp, i) => {
						const delay = 0.3 + i * 0.13;
						const op = interpolate(frame, [delay * fps, (delay + 0.3) * fps], [0, 1], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						});
						return (
							<div
								key={inp.label}
								style={{
									opacity: op,
									padding: "8px 10px",
									borderRadius: 7,
									backgroundColor: SURFACE,
									border: `1px solid ${SURFACE_BORDER}`,
								}}
							>
								<div
									style={{
										fontSize: 9,
										color: TEXT_FAINT,
										fontFamily: monoFont,
										textTransform: "uppercase",
										letterSpacing: 1,
									}}
								>
									{inp.label}
								</div>
								<div
									style={{
										fontSize: 14,
										color: TEXT,
										fontFamily: monoFont,
										fontWeight: 600,
										marginTop: 1,
									}}
								>
									{inp.value}
								</div>
							</div>
						);
					})}
				</div>

				{/* Result */}
				<div
					style={{
						flex: 1,
						borderRadius: 12,
						background: `linear-gradient(135deg, ${tint} 0%, hsl(8, 90%, 55%) 100%)`,
						padding: 20,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						color: "white",
						gap: 6,
					}}
				>
					<div
						style={{
							fontSize: 11,
							opacity: 0.85,
							fontFamily: monoFont,
							textTransform: "uppercase",
							letterSpacing: 2,
						}}
					>
						Monthly payment
					</div>
					<div
						style={{
							fontSize: 48,
							fontWeight: 800,
							letterSpacing: -1,
							fontVariantNumeric: "tabular-nums",
							lineHeight: 1,
						}}
					>
						${value.toLocaleString()}
					</div>
					<div style={{ fontSize: 11, opacity: 0.9 }}>
						over 360 months · 7.85% APR
					</div>
				</div>
			</div>
		</div>
	);
};

const APPS = [
	{ name: "Consent Guard", tagline: "Cookies, compliance, calm.", tint: TINTS.consent, App: ConsentApp },
	{ name: "Launch Guard", tagline: "Pre-launch audit, every time.", tint: TINTS.launch, App: LaunchApp },
	{ name: "CMS Scaffold", tagline: "Collections in seconds, not minutes.", tint: TINTS.cms, App: CmsApp },
	{ name: "Web Calc", tagline: "Embeddable calculators, branded.", tint: TINTS.calc, App: CalcApp },
] as const;

const FOCUS_SEC = 2.0; // per-app focus window (after initial header)

export const SuiteScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const op = sceneInOut(frame, fps, durationInFrames);

	// Header settles by 0.6s. Apps focus from 0.6 to 0.6 + 4*FOCUS = 8.6s.
	const headerEnd = 0.6;
	const headerStyle = fadeUp(frame, fps, { delaySec: 0.05, durationSec: 0.45 });

	// Find current focus index by time inside the scene.
	const t = frame / fps;
	let focusIndex = 0;
	for (let i = 0; i < APPS.length; i++) {
		const start = headerEnd + i * FOCUS_SEC;
		const end = start + FOCUS_SEC;
		if (t >= start - 0.1 && t < end) {
			focusIndex = i;
			break;
		}
		if (t >= end) focusIndex = i;
	}

	// Local visibility per app: 0..1 ramp on entry, 1..0 on exit.
	const localT = (i: number) => {
		const start = headerEnd + i * FOCUS_SEC;
		const end = start + FOCUS_SEC;
		const inEnd = start + 0.35;
		const outStart = end - 0.35;
		return interpolate(
			t,
			[start, inEnd, outStart, end],
			[0, 1, 1, 0],
			{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
		);
	};

	const current = APPS[focusIndex];

	return (
		<AbsoluteFill
			style={{
				opacity: op,
				padding: "60px 110px",
				display: "flex",
				flexDirection: "column",
				gap: 18,
				fontFamily: displayFont,
				color: TEXT,
			}}
		>
			{/* Header */}
			<div style={{ ...headerStyle, display: "flex", alignItems: "flex-end", gap: 22 }}>
				<div style={{ flex: 1 }}>
					<div
						style={{
							fontSize: 13,
							color: ACCENT_BRIGHT,
							fontFamily: monoFont,
							letterSpacing: 3,
							textTransform: "uppercase",
							marginBottom: 6,
						}}
					>
						The suite · 0{focusIndex + 1} / 04
					</div>
					<div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>
						{current.name}
					</div>
					<div style={{ fontSize: 15, color: TEXT_DIM, marginTop: 4 }}>
						{current.tagline}
					</div>
				</div>

				{/* Spine: 4 dots indicating which app is in focus */}
				<div style={{ display: "flex", gap: 8 }}>
					{APPS.map((a, i) => {
						const active = i === focusIndex;
						return (
							<div
								key={a.name}
								style={{
									width: active ? 36 : 10,
									height: 10,
									borderRadius: 5,
									backgroundColor: active ? a.tint : "rgba(255,255,255,0.12)",
									transition: "all 250ms",
									boxShadow: active ? `0 0 12px ${a.tint}` : "none",
								}}
							/>
						);
					})}
				</div>
			</div>

			{/* Stage: cross-faded apps */}
			<div style={{ flex: 1, minHeight: 0, position: "relative" }}>
				{APPS.map((a, i) => {
					const v = localT(i);
					if (v <= 0.01) return null;
					const A = a.App;
					return (
						<div
							key={a.name}
							style={{
								position: "absolute",
								inset: 0,
								display: "flex",
							}}
						>
							<A tint={a.tint} visibleT={v} />
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
