import gsap from "gsap";
import { useEffect, useRef } from "react";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
	// const [count, setCount] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const visited = sessionStorage.getItem("portfolio-visited");

		if (prefersReducedMotion) {
			sessionStorage.setItem("portfolio-visited", "true");
			onComplete();
			return;
		}

		const tl = gsap.timeline({
			onComplete: () => {
				sessionStorage.setItem("portfolio-visited", "true");
				onComplete();
			},
		});

		if (visited) {
			// 0.3s simple fade for returning visits
			// setCount(100);
			tl.to(containerRef.current, {
				opacity: 0,
				duration: 0.3,
				ease: "power2.inOut",
			});
		} else {
			// 1.6s counter scrub
			const counter = { val: 0 };
			tl.to(counter, {
				val: 100,
				duration: 1.6,
				ease: "power3.out",
				// onUpdate: () => setCount(Math.round(counter.val)),
			})
				// Iris wipe (loader shrinks into center circle to reveal site)
				.to(containerRef.current, {
					clipPath: "circle(0% at 50% 50%)",
					duration: 0.8,
					ease: "power3.inOut",
				});
		}

		return () => {
			tl.kill();
		};
	}, [onComplete]);

	// If repeat visit and reduced motion, skip rendering entirely
	// Guard against SSR — sessionStorage/window only available in the browser
	if (typeof window !== "undefined") {
		const visited = sessionStorage.getItem("portfolio-visited");
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (visited && reducedMotion) return null;
	}

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]"
			style={{ clipPath: "circle(150% at 50% 50%)" }}
		>
			{/* <span className="font-mono text-[clamp(48px,10vw,120px)] font-light tracking-wider text-white tabular-nums">
				{String(count).padStart(3, "0")}
			</span> */}
		</div>
	);
};

export default Loader;
