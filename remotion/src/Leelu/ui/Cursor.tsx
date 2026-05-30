import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ACCENT } from "../theme";

export type Waypoint = {
	atSec: number;
	x: number;
	y: number;
	click?: boolean;
};

type CursorProps = {
	path: Waypoint[];
	startSec?: number;
};

/**
 * Animated arrow cursor that tweens through waypoints.
 * Emits a click ripple when a waypoint has click=true.
 * Coordinates are in viewport pixels (1920x1080).
 */
export const Cursor: React.FC<CursorProps> = ({ path, startSec = 0 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame / fps;

	if (path.length === 0) return null;

	const visible = t >= startSec;
	if (!visible) return null;

	// Find segment.
	let x = path[0].x;
	let y = path[0].y;
	for (let i = 0; i < path.length - 1; i++) {
		const a = path[i];
		const b = path[i + 1];
		if (t >= a.atSec && t <= b.atSec) {
			const local = (t - a.atSec) / (b.atSec - a.atSec);
			const eased = Easing.inOut(Easing.cubic)(local);
			x = a.x + (b.x - a.x) * eased;
			y = a.y + (b.y - a.y) * eased;
			break;
		}
		if (t > b.atSec) {
			x = b.x;
			y = b.y;
		}
	}

	// Ripples: trigger at every waypoint with click=true.
	const clicks = path.filter((p) => p.click);

	const enterOpacity = interpolate(
		frame,
		[startSec * fps, (startSec + 0.25) * fps],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<>
			{clicks.map((c, i) => {
				const clickFrame = c.atSec * fps;
				const elapsed = frame - clickFrame;
				if (elapsed < 0 || elapsed > 0.6 * fps) return null;
				const progress = interpolate(elapsed, [0, 0.6 * fps], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: Easing.out(Easing.cubic),
				});
				const scale = 0.6 + progress * 2.2;
				const opacity = 1 - progress;
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: c.x,
							top: c.y,
							width: 28,
							height: 28,
							marginLeft: -14,
							marginTop: -14,
							borderRadius: "50%",
							border: `2px solid ${ACCENT}`,
							transform: `scale(${scale})`,
							opacity,
							pointerEvents: "none",
						}}
					/>
				);
			})}

			{/* Arrow */}
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				style={{
					position: "absolute",
					left: x,
					top: y,
					opacity: enterOpacity,
					filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
					pointerEvents: "none",
				}}
			>
				<path
					d="M3 3 L3 18 L7.5 14 L10.2 20.5 L12.7 19.5 L10 13 L16 13 Z"
					fill="white"
					stroke="black"
					strokeWidth="1"
					strokeLinejoin="round"
				/>
			</svg>
		</>
	);
};
