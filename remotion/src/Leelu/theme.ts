// Brief-mandated colors for the Leelu walkthrough.
// Accent: HSL 200 90% 55%
// Background: hsl(220 10% 6%) — very dark neutral, film-grain friendly.

export const ACCENT = "hsl(200, 90%, 55%)";
export const ACCENT_SOFT = "hsla(200, 90%, 55%, 0.16)";
export const ACCENT_LINE = "hsla(200, 90%, 55%, 0.55)";
export const ACCENT_GLOW = "hsla(200, 90%, 55%, 0.35)";

export const BG = "hsl(220, 10%, 6%)";
export const BG_RAISED = "hsl(220, 10%, 9%)";
export const SURFACE = "hsl(220, 10%, 11%)";
export const SURFACE_2 = "hsl(220, 10%, 14%)";
export const SURFACE_BORDER = "hsla(220, 16%, 70%, 0.10)";
export const SURFACE_BORDER_STRONG = "hsla(220, 16%, 70%, 0.18)";

export const TEXT = "hsl(220, 12%, 96%)";
export const TEXT_DIM = "hsla(220, 12%, 92%, 0.62)";
export const TEXT_FAINT = "hsla(220, 12%, 92%, 0.36)";

export const SUCCESS = "hsl(150, 60%, 50%)";
export const WARN = "hsl(40, 90%, 60%)";

// Walkthrough timings (seconds). 6 beats, ~22s total.
export const FPS = 30;

export const BEATS = {
	dashboard: { seconds: 3.0 },
	openings: { seconds: 3.5 },
	sourcing: { seconds: 4.5 },
	copilot: { seconds: 4.5 },
	outreach: { seconds: 4.0 },
	closer: { seconds: 2.5 },
} as const;

export const OVERLAP_SECONDS = 0.25;
