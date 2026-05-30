// Webflow Apps — warm orange accent suite.
export const ACCENT = "hsl(20, 90%, 55%)";
export const ACCENT_BRIGHT = "hsl(20, 95%, 62%)";
export const ACCENT_SOFT = "hsla(20, 90%, 55%, 0.18)";
export const ACCENT_GLOW = "hsla(20, 90%, 55%, 0.32)";

// Per-app subtle tonal shift off the base orange (brief calls for this).
export const TINTS = {
	consent: "hsl(15, 88%, 56%)", // red-orange
	launch: "hsl(28, 92%, 58%)", // amber
	cms: "hsl(38, 90%, 56%)", // yellow-orange
	calc: "hsl(8, 86%, 60%)", // coral
} as const;

export const BG = "hsl(22, 14%, 6%)";
export const BG_RAISED = "hsl(22, 12%, 9%)";
export const SURFACE = "hsl(22, 12%, 11%)";
export const SURFACE_2 = "hsl(22, 12%, 14%)";
export const SURFACE_BORDER = "hsla(30, 18%, 70%, 0.10)";

export const TEXT = "hsl(30, 14%, 96%)";
export const TEXT_DIM = "hsla(30, 14%, 92%, 0.66)";
export const TEXT_FAINT = "hsla(30, 14%, 92%, 0.38)";

export const FPS = 30;

export const BEATS = {
	title: { seconds: 2.5 },
	problem: { seconds: 2.5 },
	suite: { seconds: 9.0 },
	tech: { seconds: 2.5 },
	origin: { seconds: 2.5 },
	closer: { seconds: 2.0 },
} as const;

export const OVERLAP_SECONDS = 0.3;
