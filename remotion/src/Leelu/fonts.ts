import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

// Display: Inter Tight — slightly tighter than Inter, great for big editorial titles.
// Loaded with the weights we use across scenes.
const interTight = loadInterTight("normal", {
	weights: ["400", "500", "600", "700", "800"],
	subsets: ["latin"],
});

// Mono: JetBrains Mono — used for stack chips and small uppercase metadata.
const jetBrainsMono = loadJetBrainsMono("normal", {
	weights: ["400", "500", "700"],
	subsets: ["latin"],
});

export const displayFont = interTight.fontFamily;
export const monoFont = jetBrainsMono.fontFamily;

export const waitForFonts = () =>
	Promise.all([interTight.waitUntilDone(), jetBrainsMono.waitUntilDone()]);
