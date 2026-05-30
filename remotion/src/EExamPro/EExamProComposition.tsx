import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { PillarsScene } from "./scenes/PillarsScene";
import { TechScene } from "./scenes/TechScene";
import { CloserScene } from "./scenes/CloserScene";
import { BEATS, OVERLAP_SECONDS } from "./theme";
import "./fonts";

export const EExamProComposition: React.FC = () => {
	const { fps } = useVideoConfig();
	const f = (s: number) => Math.round(s * fps);
	const overlap = Math.round(OVERLAP_SECONDS * fps);

	return (
		<AbsoluteFill>
			<Background />
			<Series>
				<Series.Sequence durationInFrames={f(BEATS.title.seconds)}>
					<TitleScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={f(BEATS.problem.seconds)} offset={-overlap}>
					<ProblemScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={f(BEATS.pillars.seconds)} offset={-overlap}>
					<PillarsScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={f(BEATS.tech.seconds)} offset={-overlap}>
					<TechScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={f(BEATS.closer.seconds)} offset={-overlap}>
					<CloserScene />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
