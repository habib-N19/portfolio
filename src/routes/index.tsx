import { createFileRoute } from "@tanstack/react-router";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import CustomCursor from "#/components/portfolio/CustomCursor";
import FilmGrain from "#/components/portfolio/FilmGrain";
import { LazySection } from "#/components/portfolio/LazySection";
import Loader from "#/components/portfolio/Loader";
import SmoothScroll from "#/components/portfolio/SmoothScroll";
import { MotionProvider } from "#/lib/motion-context";
import {
	getClientPerfSignals,
	shouldEnableWebGLBackground,
} from "#/lib/performance";

const WebGLBackground = lazy(
	() => import("#/components/portfolio/WebGLBackground"),
);
const HeroVariantB = lazy(() => import("#/components/portfolio/HeroVariantB"));
const FloatingNav = lazy(() => import("#/components/portfolio/FloatingNav"));
const AboutSection = lazy(() => import("#/components/portfolio/AboutSection"));
const WorkSection = lazy(() => import("#/components/portfolio/WorkSection"));
const BlogSection = lazy(() => import("#/components/portfolio/BlogSection"));
const ContactSection = lazy(
	() => import("#/components/portfolio/ContactSection"),
);

export const Route = createFileRoute("/")({ component: PortfolioPage });

const sections = ["hero", "about", "work", "blog", "contact"];

export function PortfolioPage() {
	const [showLoader, setShowLoader] = useState(false);
	const [showWebGL, setShowWebGL] = useState(false);
	const [activeSection, setActiveSection] = useState("hero");
	const observerRef = useRef<IntersectionObserver | null>(null);

	const onLoadComplete = useCallback(() => {
		setShowLoader(false);
	}, []);

	useEffect(() => {
		const signals = getClientPerfSignals();
		const visited = sessionStorage.getItem("portfolio-visited") === "true";

		if (!visited && !signals.prefersReducedMotion) {
			setShowLoader(true);
		}

		if (!shouldEnableWebGLBackground(signals)) return;

		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		if ("requestIdleCallback" in window) {
			requestIdleCallback(() => setShowWebGL(true), { timeout: 1500 });
		} else {
			timeoutId = setTimeout(() => setShowWebGL(true), 800);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, []);

	useEffect(() => {
		let maxIntersectionRatio = 0;
		let mostVisibleSection = "";

		observerRef.current = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						if (entry.intersectionRatio > maxIntersectionRatio) {
							maxIntersectionRatio = entry.intersectionRatio;
							mostVisibleSection = entry.target.id;
						}
					}
				}

				if (mostVisibleSection) {
					setActiveSection((prev) =>
						prev === mostVisibleSection ? prev : mostVisibleSection,
					);
				}

				maxIntersectionRatio = 0;
			},
			{ threshold: [0.2, 0.4, 0.6, 0.8], rootMargin: "-10% 0px -20% 0px" },
		);

		for (const id of sections) {
			const el = document.getElementById(id);
			if (el) observerRef.current?.observe(el);
		}

		const handleScroll = () => {
			if (window.scrollY < 100) {
				setActiveSection((prev) => (prev === "hero" ? prev : "hero"));
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			observerRef.current?.disconnect();
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<MotionProvider>
			<SmoothScroll>
				<div className="portfolio-theme">
					{showWebGL && (
						<Suspense fallback={null}>
							<WebGLBackground />
						</Suspense>
					)}

					<CustomCursor />
					<Suspense fallback={null}>
						<FloatingNav activeSection={activeSection} />
					</Suspense>
					<FilmGrain />

					<main>
						<Suspense fallback={null}>
							<HeroVariantB />
						</Suspense>
						<LazySection id="about">
							<Suspense fallback={null}>
								<AboutSection />
							</Suspense>
						</LazySection>
						<LazySection id="work">
							<Suspense fallback={null}>
								<WorkSection />
							</Suspense>
						</LazySection>
						<LazySection id="blog">
							<Suspense fallback={null}>
								<BlogSection />
							</Suspense>
						</LazySection>
						<LazySection id="contact">
							<Suspense fallback={null}>
								<ContactSection />
							</Suspense>
						</LazySection>
					</main>

					{showLoader && <Loader onComplete={onLoadComplete} />}
				</div>
			</SmoothScroll>
		</MotionProvider>
	);
}
