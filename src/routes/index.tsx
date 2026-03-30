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
import Loader from "#/components/portfolio/Loader";
import SectionCounter from "#/components/portfolio/SectionCounter";
import SmoothScroll from "#/components/portfolio/SmoothScroll";

// Lazy loaded components — kept out of the critical initial bundle
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

function PortfolioPage() {
	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState("hero");
	const observerRef = useRef<IntersectionObserver | null>(null);

	const onLoadComplete = useCallback(() => {
		setLoading(false);
	}, []);

	useEffect(() => {
		const visited = sessionStorage.getItem("portfolio-visited");
		if (visited) {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (loading) return;

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

				// Only update if we found a clearly visible section and it's different
				if (mostVisibleSection && mostVisibleSection !== activeSection) {
					setActiveSection(mostVisibleSection);
				}

				// Reset for next batch of entries
				maxIntersectionRatio = 0;
			},
			{ threshold: [0.2, 0.4, 0.6, 0.8], rootMargin: "-10% 0px -20% 0px" },
		);

		for (const id of sections) {
			const el = document.getElementById(id);
			if (el) observerRef.current?.observe(el);
		}

		// Fallback for returning to absolute top
		const handleScroll = () => {
			if (window.scrollY < 100) {
				setActiveSection("hero");
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			observerRef.current?.disconnect();
			window.removeEventListener("scroll", handleScroll);
		};
	}, [loading]);

	return (
		<SmoothScroll>
			<div className="portfolio-theme">
				<Suspense fallback={null}>
					<WebGLBackground />
				</Suspense>

				{loading && <Loader onComplete={onLoadComplete} />}

				{!loading && (
					<>
						<CustomCursor />
						<Suspense fallback={null}>
							<FloatingNav activeSection={activeSection} />
						</Suspense>
						<SectionCounter activeSection={activeSection} />
						<FilmGrain />

						<main>
							<Suspense fallback={null}>
								<HeroVariantB />
							</Suspense>
							<Suspense fallback={null}>
								<AboutSection />
							</Suspense>
							<Suspense fallback={null}>
								<WorkSection />
								<BlogSection />
								<ContactSection />
							</Suspense>
						</main>
					</>
				)}
			</div>
		</SmoothScroll>
	);
}
