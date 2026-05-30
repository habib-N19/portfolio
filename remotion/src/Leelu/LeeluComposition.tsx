import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { Chrome } from "./ui/Chrome";
import { Cursor, type Waypoint } from "./ui/Cursor";
import { DashboardScene } from "./scenes/DashboardScene";
import { OpeningsScene } from "./scenes/OpeningsScene";
import { SourcingScene } from "./scenes/SourcingScene";
import { CopilotScene } from "./scenes/CopilotScene";
import { OutreachScene } from "./scenes/OutreachScene";
import { CloserScene } from "./scenes/CloserScene";
import { BEATS } from "./theme";
import "./fonts";

/**
 * Cumulative beat start times (seconds, global) — used for cursor choreography
 * and to pick the active nav highlight.
 */
const STARTS = {
	dashboard: 0,
	openings: BEATS.dashboard.seconds,
	sourcing: BEATS.dashboard.seconds + BEATS.openings.seconds,
	copilot:
		BEATS.dashboard.seconds + BEATS.openings.seconds + BEATS.sourcing.seconds,
	outreach:
		BEATS.dashboard.seconds +
		BEATS.openings.seconds +
		BEATS.sourcing.seconds +
		BEATS.copilot.seconds,
	closer:
		BEATS.dashboard.seconds +
		BEATS.openings.seconds +
		BEATS.sourcing.seconds +
		BEATS.copilot.seconds +
		BEATS.outreach.seconds,
};

const pickActiveNav = (t: number) => {
	if (t < STARTS.openings) return "Dashboard";
	if (t < STARTS.sourcing) return "Openings";
	if (t < STARTS.copilot) return "Sourcing";
	if (t < STARTS.outreach) return "Copilot";
	return "Outreach";
};

/**
 * Cursor waypoints in 1920x1080 viewport coords.
 * Sidebar is 240px wide; topbar is 60px tall.
 */
const CURSOR_PATH: Waypoint[] = [
	// Dashboard idle
	{ atSec: 0.0, x: 960, y: 540 },
	{ atSec: STARTS.dashboard + 2.4, x: 960, y: 540 },

	// Move to Openings in sidebar (Openings is the 5th nav item)
	{ atSec: STARTS.openings + 0.4, x: 130, y: 300 },
	{ atSec: STARTS.openings + 0.7, x: 130, y: 300, click: true },

	// Hover top role card, then click into it
	{ atSec: STARTS.openings + 1.5, x: 700, y: 260 },
	{ atSec: STARTS.openings + 1.8, x: 700, y: 260, click: true },

	// Source candidates button (top-right of sourcing panel)
	{ atSec: STARTS.sourcing + 0.4, x: 1720, y: 200 },
	{ atSec: STARTS.sourcing + 0.55, x: 1720, y: 200, click: true },

	// Drift right while sourcing
	{ atSec: STARTS.sourcing + 2.0, x: 1620, y: 540 },

	// Copilot — drift toward Send to outreach button (bottom of right panel)
	{ atSec: STARTS.copilot + 0.6, x: 1500, y: 540 },
	{ atSec: STARTS.copilot + 3.9, x: 1500, y: 940 },
	{ atSec: STARTS.copilot + 4.1, x: 1500, y: 940, click: true },

	// Outreach idle
	{ atSec: STARTS.outreach + 0.6, x: 1100, y: 500 },
	{ atSec: STARTS.closer - 0.1, x: 960, y: 540 },
];

const SCENE_OVERLAP = 0.25;

export const LeeluComposition: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const t = frame / fps;
	const activeNav = pickActiveNav(t);

	const dashboardFrames = Math.round(BEATS.dashboard.seconds * fps);
	const openingsFrames = Math.round(BEATS.openings.seconds * fps);
	const sourcingFrames = Math.round(BEATS.sourcing.seconds * fps);
	const copilotFrames = Math.round(BEATS.copilot.seconds * fps);
	const outreachFrames = Math.round(BEATS.outreach.seconds * fps);
	const closerFrames = Math.round(BEATS.closer.seconds * fps);

	const overlap = Math.round(SCENE_OVERLAP * fps);

	return (
		<AbsoluteFill>
			<Background />

			{/* Single Chrome instance — slide-in plays only once. */}
			<Chrome activeNav={activeNav}>
				{/* Scenes swap inside the content slot. */}
				<Series>
					<Series.Sequence durationInFrames={dashboardFrames}>
						<DashboardScene />
					</Series.Sequence>
					<Series.Sequence durationInFrames={openingsFrames} offset={-overlap}>
						<OpeningsScene />
					</Series.Sequence>
					<Series.Sequence durationInFrames={sourcingFrames} offset={-overlap}>
						<SourcingScene />
					</Series.Sequence>
					<Series.Sequence durationInFrames={copilotFrames} offset={-overlap}>
						<CopilotScene />
					</Series.Sequence>
					<Series.Sequence durationInFrames={outreachFrames} offset={-overlap}>
						<OutreachScene />
					</Series.Sequence>
					{/* Closer overlay (full-frame, mounts above content). */}
					<Series.Sequence durationInFrames={closerFrames} offset={-overlap}>
						<CloserScene />
					</Series.Sequence>
				</Series>
			</Chrome>

			{/* Cursor sits above everything. */}
			<AbsoluteFill style={{ pointerEvents: "none" }}>
				<Cursor path={CURSOR_PATH} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
