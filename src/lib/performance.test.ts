import { describe, expect, it } from "vitest";
import {
	getMotionTier,
	shouldEnableWebGLBackground,
	shouldUseEnhancedEffects,
} from "./performance";

const base = {
	isMobile: false,
	prefersReducedMotion: false,
	saveData: false,
	lowPowerDevice: false,
} as const;

describe("shouldUseEnhancedEffects", () => {
	it("disables for reduced motion", () => {
		expect(shouldUseEnhancedEffects({ ...base, prefersReducedMotion: true })).toBe(false);
	});

	it("disables for save-data", () => {
		expect(shouldUseEnhancedEffects({ ...base, saveData: true })).toBe(false);
	});

	it("enables when both clear", () => {
		expect(shouldUseEnhancedEffects(base)).toBe(true);
	});
});

describe("shouldEnableWebGLBackground", () => {
	it("disables on mobile", () => {
		expect(shouldEnableWebGLBackground({ ...base, isMobile: true })).toBe(false);
	});

	it("disables for reduced motion", () => {
		expect(shouldEnableWebGLBackground({ ...base, prefersReducedMotion: true })).toBe(false);
	});

	it("disables for save-data", () => {
		expect(shouldEnableWebGLBackground({ ...base, saveData: true })).toBe(false);
	});

	it("disables for low-power device", () => {
		expect(shouldEnableWebGLBackground({ ...base, lowPowerDevice: true })).toBe(false);
	});

	it("enables on desktop with all clear", () => {
		expect(shouldEnableWebGLBackground(base)).toBe(true);
	});
});

describe("getMotionTier", () => {
	it("returns minimal for reduced motion", () => {
		expect(getMotionTier({ ...base, prefersReducedMotion: true })).toBe("minimal");
	});

	it("returns minimal for save-data", () => {
		expect(getMotionTier({ ...base, saveData: true })).toBe("minimal");
	});

	it("returns reduced for mobile", () => {
		expect(getMotionTier({ ...base, isMobile: true })).toBe("reduced");
	});

	it("returns reduced for low-power device", () => {
		expect(getMotionTier({ ...base, lowPowerDevice: true })).toBe("reduced");
	});

	it("returns full for capable desktop", () => {
		expect(getMotionTier(base)).toBe("full");
	});
});
