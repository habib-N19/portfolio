import { useEffect } from "react";

/**
 * Calls `handler` when the Escape key is pressed — only while `enabled` is true.
 */
export function useEscapeKey(handler: () => void, enabled: boolean) {
	useEffect(() => {
		if (!enabled) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") handler();
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [handler, enabled]);
}
