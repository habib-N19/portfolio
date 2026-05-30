import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

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
	const [mounted, setMounted] = useState(() => {
		if (typeof window === "undefined") return false;
		return !("IntersectionObserver" in window);
	});
	const ref = useRef<HTMLDivElement>(null);
	const mount = useCallback(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		let idleTimer: ReturnType<typeof setTimeout> | null = null;

		if (!("IntersectionObserver" in window)) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					mount();
					observer.disconnect();
				}
			},
			{ rootMargin },
		);
		observer.observe(el);

		if ("requestIdleCallback" in window) {
			window.requestIdleCallback(() => mount(), { timeout: 4000 });
		} else {
			idleTimer = setTimeout(() => mount(), 3000);
		}

		return () => {
			observer.disconnect();
			if (idleTimer) clearTimeout(idleTimer);
		};
	}, [mount, rootMargin]);

	return (
		<div id={id} ref={ref}>
			{mounted ? children : <div style={{ minHeight: "60vh" }} />}
		</div>
	);
}
