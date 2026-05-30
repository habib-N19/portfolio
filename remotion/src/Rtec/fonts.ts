import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

const interTight = loadInterTight("normal", {
	weights: ["400", "500", "600", "700", "800"],
	subsets: ["latin"],
});

const jetBrainsMono = loadJetBrainsMono("normal", {
	weights: ["400", "500", "700"],
	subsets: ["latin"],
});

export const displayFont = interTight.fontFamily;
export const monoFont = jetBrainsMono.fontFamily;

export const waitForFonts = () =>
	Promise.all([interTight.waitUntilDone(), jetBrainsMono.waitUntilDone()]);
