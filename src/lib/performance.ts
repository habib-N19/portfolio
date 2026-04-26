export type PerfSignals = {
	isMobile: boolean;
	prefersReducedMotion: boolean;
	saveData: boolean;
	lowPowerDevice: boolean;
};

export type MotionTier = "full" | "reduced" | "minimal";

export function shouldUseEnhancedEffects(signals: PerfSignals) {
	return !signals.prefersReducedMotion && !signals.saveData;
}

export function shouldEnableWebGLBackground(signals: PerfSignals) {
	return (
		!signals.isMobile &&
		!signals.prefersReducedMotion &&
		!signals.saveData &&
		!signals.lowPowerDevice
	);
}

export function getMotionTier(signals: PerfSignals): MotionTier {
	if (signals.prefersReducedMotion || signals.saveData) return "minimal";
	if (signals.isMobile || signals.lowPowerDevice) return "reduced";
	return "full";
}

export function getClientPerfSignals(): PerfSignals {
	if (typeof window === "undefined") {
		return {
			isMobile: false,
			prefersReducedMotion: false,
			saveData: false,
			lowPowerDevice: false,
		};
	}

	const isMobile = window.matchMedia("(max-width: 1024px)").matches;
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const saveData = (navigator as any).connection?.saveData === true;
	const cores = navigator.hardwareConcurrency || 8;
	const lowPowerDevice = cores <= 4;

	return { isMobile, prefersReducedMotion, saveData, lowPowerDevice };
}
