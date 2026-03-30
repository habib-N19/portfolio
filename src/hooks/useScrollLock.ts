import { useEffect } from "react";

/**
 * Locks body scroll and pauses Lenis smooth-scroll when `locked` is true.
 * Cleans up on unmount even if the consumer forgets to toggle.
 */
export function useScrollLock(locked: boolean) {
	useEffect(() => {
		if (locked) {
			document.body.style.overflow = "hidden";
			if (typeof window !== "undefined" && (window as any).lenis) {
				(window as any).lenis.stop();
			}
		} else {
			document.body.style.overflow = "";
			if (typeof window !== "undefined" && (window as any).lenis) {
				(window as any).lenis.start();
			}
		}

		return () => {
			document.body.style.overflow = "";
			if (typeof window !== "undefined" && (window as any).lenis) {
				(window as any).lenis.start();
			}
		};
	}, [locked]);
}
