import { Easing, interpolate } from "remotion";

export const fadeUp = (
	frame: number,
	fps: number,
	{ delaySec = 0, durationSec = 0.55, lift = 14 } = {},
) => {
	const delay = delaySec * fps;
	const duration = durationSec * fps;
	const t = interpolate(frame, [delay, delay + duration], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	return { opacity: t, transform: `translateY(${(1 - t) * lift}px)` };
};

export const sceneInOut = (
	frame: number,
	fps: number,
	durationInFrames: number,
	{ inSec = 0.4, outSec = 0.4 } = {},
) => {
	const inEnd = inSec * fps;
	const outStart = durationInFrames - outSec * fps;
	return interpolate(
		frame,
		[0, inEnd, outStart, durationInFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
};
