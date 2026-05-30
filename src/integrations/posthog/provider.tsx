import posthog from "posthog-js";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { env } from "#/env";

interface PostHogProviderProps {
	children: ReactNode;
}

/**
 * Deferred PostHog provider — loads posthog-js only after the page is idle,
 * keeping it out of the critical rendering path (~90KB saved from initial bundle).
 */
export default function PostHogProvider({ children }: PostHogProviderProps) {
	const initialized = useRef(false);

	const key = env.VITE_POSTHOG_KEY;
	const host = env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";
	const hasUsableKey =
		typeof key === "string" &&
		key.trim().length > 0 &&
		!key.includes("xxx") &&
		key.startsWith("phc_");

	useEffect(() => {
		if (initialized.current) return;
		if (typeof window === "undefined") return;
		if (!hasUsableKey) return;
		const safeKey = key as string;

		initialized.current = true;

		const initPostHog = () => {
			posthog.init(safeKey, {
				api_host: host,
				person_profiles: "identified_only",
				capture_pageview: false,
				defaults: "2025-11-30",
			});
		};

		// Use requestIdleCallback to defer until browser is idle
		if ("requestIdleCallback" in window) {
			requestIdleCallback(() => initPostHog());
		} else {
			// Fallback: defer by 3 seconds
			setTimeout(() => initPostHog(), 3000);
		}
	}, [hasUsableKey, host]);

	// No PostHogProvider wrapper needed — posthog-js works globally once init'd
	return <>{children}</>;
}
