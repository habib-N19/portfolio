import { Composition } from "remotion";
import { LeeluComposition } from "./Leelu/LeeluComposition";
import { RtecComposition } from "./Rtec/RtecComposition";
import { WebflowAppsComposition } from "./WebflowApps/WebflowAppsComposition";
import { EExamProComposition } from "./EExamPro/EExamProComposition";
import { ResearchFlowComposition } from "./ResearchFlow/ResearchFlowComposition";

// Compositions are registered here as each project's video is built.
// Each brief in ../docs/remotion-briefs/ corresponds to one Composition id.
//
// Standard composition shape: 1920x1080, 30fps.

// Leelu walkthrough: 6 beats with overlaps ≈ 21s = 630 frames.
const LEELU_DURATION_FRAMES = 630;

// Rtec montage: 6 beats with overlaps ≈ 18s = 540 frames.
const RTEC_DURATION_FRAMES = 540;

// WebflowApps: 6 beats (2.5 + 2.5 + 9.0 + 2.5 + 2.5 + 2.0 = 21.0s) with
// 5 × 0.3s overlaps = 19.5s effective ≈ 585 frames. Round to 600.
const WEBFLOW_APPS_DURATION_FRAMES = 600;

// EExamPro: 5 beats (2.5 + 2.5 + 7.0 + 2.5 + 2.5 = 17.0s) with 4 × 0.3s
// overlaps = 15.8s effective ≈ 474 frames. Round to 480.
const EEXAMPRO_DURATION_FRAMES = 480;

// ResearchFlow: 4 beats (2.5 + 6.0 + 2.5 + 3.0 = 14.0s) with 3 × 0.3s
// overlaps = 13.1s effective ≈ 393 frames. Round to 405.
const RESEARCHFLOW_DURATION_FRAMES = 405;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Leelu"
				component={LeeluComposition}
				durationInFrames={LEELU_DURATION_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Rtec"
				component={RtecComposition}
				durationInFrames={RTEC_DURATION_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="WebflowApps"
				component={WebflowAppsComposition}
				durationInFrames={WEBFLOW_APPS_DURATION_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="EExaminationPro"
				component={EExamProComposition}
				durationInFrames={EEXAMPRO_DURATION_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Researchflow"
				component={ResearchFlowComposition}
				durationInFrames={RESEARCHFLOW_DURATION_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
