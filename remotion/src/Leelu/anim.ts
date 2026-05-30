import { Easing, interpolate } from "remotion";

/**
 * Fade + tiny upward lift, used for almost every text reveal.
 * Soft eases per the brief — no springs, no bounce.
 */
export const fadeUp = (
	frame: number,
	fps: number,
	{ delaySec = 0, durationSec = 0.6, lift = 14 } = {},
) => {
	const delay = delaySec * fps;
	const duration = durationSec * fps;
	const t = interpolate(frame, [delay, delay + duration], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	return {
		opacity: t,
		transform: `translateY(${(1 - t) * lift}px)`,
	};
};

/**
 * Symmetric in/out: fades up at delaySec, holds, then fades out late in the
 * sequence's lifetime so scenes don't pop out.
 */
export const fadeInOut = (
	frame: number,
	fps: number,
	totalSeconds: number,
	{ delaySec = 0, durationSec = 0.6, lift = 14, outSec = 0.5 } = {},
) => {
	const delay = delaySec * fps;
	const duration = durationSec * fps;
	const total = totalSeconds * fps;
	const outStart = total - outSec * fps;

	const inProgress = interpolate(frame, [delay, delay + duration], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const outProgress = interpolate(frame, [outStart, total], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});

	const opacity = Math.min(inProgress, outProgress);
	const t = inProgress;
	return {
		opacity,
		transform: `translateY(${(1 - t) * lift}px)`,
	};
};
