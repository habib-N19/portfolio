import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface PostHogProviderProps {
	children: ReactNode;
}

/**
 * Deferred PostHog provider — loads posthog-js only after the page is idle,
 * keeping it out of the critical rendering path (~90KB saved from initial bundle).
 */
export default function PostHogProvider({ children }: PostHogProviderProps) {
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current) return;
		if (typeof window === "undefined") return;
		if (!import.meta.env.VITE_POSTHOG_KEY) return;

		initialized.current = true;

		const initPostHog = async () => {
			const { default: posthog } = await import("posthog-js");
			posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
				api_host:
					import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
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
	}, []);

	// No PostHogProvider wrapper needed — posthog-js works globally once init'd
	return <>{children}</>;
}
