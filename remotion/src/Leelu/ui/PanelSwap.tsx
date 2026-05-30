import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

type PanelSwapProps = {
	delaySec?: number;
	children: React.ReactNode;
};

/**
 * Cross-fade for content panels swapping inside Chrome.
 * Lives inside a <Series.Sequence>, so frame is local.
 */
export const PanelSwap: React.FC<PanelSwapProps> = ({ delaySec = 0, children }) => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();

	const inEnd = (delaySec + 0.35) * fps;
	const outStart = durationInFrames - 0.25 * fps;

	const opacity = interpolate(
		frame,
		[delaySec * fps, inEnd, outStart, durationInFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				opacity,
				padding: "28px 32px",
				overflow: "hidden",
			}}
		>
			{children}
		</div>
	);
};
