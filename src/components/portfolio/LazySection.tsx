import { type ReactNode, useEffect, useRef, useState } from "react";

type LazySectionProps = {
	id: string;
	children: ReactNode;
	rootMargin?: string;
};

export function LazySection({
	id,
	children,
	rootMargin = "300px 0px",
}: LazySectionProps) {
	const [mounted, setMounted] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		let idleTimer: ReturnType<typeof setTimeout> | null = null;

		if (!("IntersectionObserver" in window)) {
			setMounted(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setMounted(true);
					observer.disconnect();
				}
			},
			{ rootMargin },
		);
		observer.observe(el);

		if ("requestIdleCallback" in window) {
			(window as any).requestIdleCallback(
				() => {
					if (!mounted) setMounted(true);
				},
				{ timeout: 4000 },
			);
		} else {
			idleTimer = setTimeout(() => setMounted(true), 3000);
		}

		return () => {
			observer.disconnect();
			if (idleTimer) clearTimeout(idleTimer);
		};
	}, [rootMargin]);

	return (
		<div id={id} ref={ref}>
			{mounted ? children : <div style={{ minHeight: "60vh" }} />}
		</div>
	);
}
