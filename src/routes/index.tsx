import { createFileRoute } from "@tanstack/react-router";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import AboutSection from "#/components/portfolio/AboutSection";
import CustomCursor from "#/components/portfolio/CustomCursor";
import FilmGrain from "#/components/portfolio/FilmGrain";
import FloatingNav from "#/components/portfolio/FloatingNav";
import HeroVariantA from "#/components/portfolio/HeroVariantA";
import HeroVariantB from "#/components/portfolio/HeroVariantB";
import Loader from "#/components/portfolio/Loader";
import SectionCounter from "#/components/portfolio/SectionCounter";
import SmoothScroll from "#/components/portfolio/SmoothScroll";

// Lazy loaded heavy components
const WebGLBackground = lazy(
	() => import("#/components/portfolio/WebGLBackground"),
);
const WorkSection = lazy(() => import("#/components/portfolio/WorkSection"));
const BlogSection = lazy(() => import("#/components/portfolio/BlogSection"));
const ContactSection = lazy(
	() => import("#/components/portfolio/ContactSection"),
);

export const Route = createFileRoute("/")({ component: PortfolioPage });

const sections = ["hero", "about", "work", "blog", "contact"];

type HeroVariant = "A" | "B";

function PortfolioPage() {
	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState("hero");
	const [heroVariant, setHeroVariant] = useState<HeroVariant>("A");
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
						<FloatingNav activeSection={activeSection} />
						<SectionCounter activeSection={activeSection} />
						<FilmGrain />

						{/* ── Hero Variant Toggle (dev tool) ── */}
						<div className="fixed bottom-6 left-6 z-[90] flex items-center gap-2 rounded border border-surface-border bg-background/90 px-3 py-2 backdrop-blur-md">
							<span className="font-mono-label text-text-secondary">HERO:</span>
							<button
								type="button"
								onClick={() => setHeroVariant("A")}
								className={`font-mono-data px-2 py-0.5 transition-colors ${
									heroVariant === "A"
										? "bg-primary text-background"
										: "text-text-secondary hover:text-foreground"
								}`}
							>
								A
							</button>
							<button
								type="button"
								onClick={() => setHeroVariant("B")}
								className={`font-mono-data px-2 py-0.5 transition-colors ${
									heroVariant === "B"
										? "bg-primary text-background"
										: "text-text-secondary hover:text-foreground"
								}`}
							>
								B
							</button>
						</div>

						<main>
							{heroVariant === "A" ? <HeroVariantA /> : <HeroVariantB />}
							<AboutSection />
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
