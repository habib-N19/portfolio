import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SuiteScene } from "./scenes/SuiteScene";
import { TechScene } from "./scenes/TechScene";
import { OriginScene } from "./scenes/OriginScene";
import { CloserScene } from "./scenes/CloserScene";
import { BEATS, OVERLAP_SECONDS } from "./theme";
import "./fonts";

export const WebflowAppsComposition: React.FC = () => {
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
				<Series.Sequence durationInFrames={f(BEATS.suite.seconds)} offset={-overlap}>
					<SuiteScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={f(BEATS.tech.seconds)} offset={-overlap}>
					<TechScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={f(BEATS.origin.seconds)} offset={-overlap}>
					<OriginScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={f(BEATS.closer.seconds)} offset={-overlap}>
					<CloserScene />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
