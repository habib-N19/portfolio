import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { TitleScene } from "./scenes/TitleScene";
import { NotebotScene } from "./scenes/NotebotScene";
import { ResumeScene } from "./scenes/ResumeScene";
import { AlumniScene } from "./scenes/AlumniScene";
import { AlsoShippedScene } from "./scenes/AlsoShippedScene";
import { CloserScene } from "./scenes/CloserScene";
import { BEATS, OVERLAP_SECONDS } from "./theme";
import "./fonts";

export const RtecComposition: React.FC = () => {
	const { fps } = useVideoConfig();

	const titleFrames = Math.round(BEATS.title.seconds * fps);
	const notebotFrames = Math.round(BEATS.notebot.seconds * fps);
	const resumeFrames = Math.round(BEATS.resume.seconds * fps);
	const alumniFrames = Math.round(BEATS.alumni.seconds * fps);
	const alsoFrames = Math.round(BEATS.alsoShipped.seconds * fps);
	const closerFrames = Math.round(BEATS.closer.seconds * fps);

	const overlap = Math.round(OVERLAP_SECONDS * fps);

	return (
		<AbsoluteFill>
			<Background />

			<Series>
				<Series.Sequence durationInFrames={titleFrames}>
					<TitleScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={notebotFrames} offset={-overlap}>
					<NotebotScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={resumeFrames} offset={-overlap}>
					<ResumeScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={alumniFrames} offset={-overlap}>
					<AlumniScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={alsoFrames} offset={-overlap}>
					<AlsoShippedScene />
				</Series.Sequence>
				<Series.Sequence durationInFrames={closerFrames} offset={-overlap}>
					<CloserScene />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
