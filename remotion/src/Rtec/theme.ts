// RTEC palette — campus/learning energy.
// Accent: HSL 140 70% 45% (green).
// Background: warm-undertone dark.

export const ACCENT = "hsl(140, 70%, 45%)";
export const ACCENT_BRIGHT = "hsl(140, 75%, 55%)";
export const ACCENT_SOFT = "hsla(140, 70%, 45%, 0.18)";
export const ACCENT_LINE = "hsla(140, 70%, 45%, 0.55)";
export const ACCENT_GLOW = "hsla(140, 70%, 50%, 0.35)";

export const SECOND = "hsl(30, 70%, 55%)"; // warm secondary (for resume-flow source pills, etc.)
export const SECOND_SOFT = "hsla(30, 70%, 55%, 0.18)";

// Warm-tinted dark neutrals (the brief calls for "subtle warm undertone").
export const BG = "hsl(34, 14%, 6%)";
export const BG_RAISED = "hsl(34, 12%, 9%)";
export const SURFACE = "hsl(34, 12%, 11%)";
export const SURFACE_2 = "hsl(34, 12%, 14%)";
export const SURFACE_BORDER = "hsla(40, 18%, 70%, 0.10)";
export const SURFACE_BORDER_STRONG = "hsla(40, 18%, 70%, 0.18)";

export const TEXT = "hsl(40, 14%, 96%)";
export const TEXT_DIM = "hsla(40, 14%, 92%, 0.66)";
export const TEXT_FAINT = "hsla(40, 14%, 92%, 0.38)";

export const FPS = 30;

// Feature montage timings. 6 beats, ≈19.5s.
export const BEATS = {
	title: { seconds: 2.5 },
	notebot: { seconds: 3.5 },
	resume: { seconds: 3.5 },
	alumni: { seconds: 3.5 },
	alsoShipped: { seconds: 3.5 },
	closer: { seconds: 3.0 },
} as const;

export const OVERLAP_SECONDS = 0.3;
