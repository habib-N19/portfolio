import { createFileRoute } from "@tanstack/react-router";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useReducer,
	useRef,
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

export const Route = createFileRoute("/")({ component: IndexPage });

const sections = ["hero", "about", "work", "blog", "contact"];

type PortfolioState = {
	showLoader: boolean;
	showWebGL: boolean;
	activeSection: string;
};

type PortfolioAction =
	| { type: "complete-loader" }
	| { type: "enable-webgl" }
	| { type: "set-active-section"; section: string };

function portfolioReducer(
	state: PortfolioState,
	action: PortfolioAction,
): PortfolioState {
	switch (action.type) {
		case "complete-loader":
			if (!state.showLoader) return state;
			return { ...state, showLoader: false };
		case "enable-webgl":
			if (state.showWebGL) return state;
			return { ...state, showWebGL: true };
		case "set-active-section":
			if (state.activeSection === action.section) return state;
			return { ...state, activeSection: action.section };
		default:
			return state;
	}
}

function IndexPage() {
	const [state, dispatch] = useReducer(portfolioReducer, undefined, () => {
		if (typeof window === "undefined") {
			return { showLoader: false, showWebGL: false, activeSection: "hero" };
		}
		const signals = getClientPerfSignals();
		const visited = sessionStorage.getItem("portfolio-visited") === "true";
		return {
			showLoader: !visited && !signals.prefersReducedMotion,
			showWebGL: false,
			activeSection: "hero",
		};
	});
	const observerRef = useRef<IntersectionObserver | null>(null);

	const onLoadComplete = useCallback(() => {
		dispatch({ type: "complete-loader" });
	}, []);

	useEffect(() => {
		const signals = getClientPerfSignals();

		if (!shouldEnableWebGLBackground(signals)) return;

		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		if ("requestIdleCallback" in window) {
			requestIdleCallback(() => dispatch({ type: "enable-webgl" }), {
				timeout: 1500,
			});
		} else {
			timeoutId = setTimeout(() => dispatch({ type: "enable-webgl" }), 800);
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
					dispatch({
						type: "set-active-section",
						section: mostVisibleSection,
					});
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
				dispatch({ type: "set-active-section", section: "hero" });
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
					{state.showWebGL && (
						<Suspense fallback={null}>
							<WebGLBackground />
						</Suspense>
					)}

					<CustomCursor />
					<Suspense fallback={null}>
						<FloatingNav activeSection={state.activeSection} />
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

					{state.showLoader && <Loader onComplete={onLoadComplete} />}
				</div>
			</SmoothScroll>
		</MotionProvider>
	);
}
