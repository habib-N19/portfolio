import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { identity } from "#/data/identity";
import { type Project, projects } from "#/data/projects";
import { useEscapeKey } from "#/hooks/useEscapeKey";
import { useScrollLock } from "#/hooks/useScrollLock";
import { gsap } from "#/lib/gsap-setup";
import {
	ArrowOutIcon,
	GithubIcon,
	LinkedinIcon,
	MailIcon,
	ResumeIcon,
} from "./icons";
import { SplitText } from "./SplitText";

/**
 * Hero Variant B: "Split Hero"
 *
 * Left side: Identity (name, role, links, status).
 * Right side: Featured project preview with rotation — clickable to open details.
 */

const featuredProjects = projects
	.filter((p) => p.media && p.media.length > 0)
	.slice(0, 3);

const HeroVariantB = () => {
	const [showScroll, setShowScroll] = useState(true);
	const [activeProjectIdx, setActiveProjectIdx] = useState(0);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const containerRef = useRef<HTMLElement>(null);
	const tlRef = useRef<gsap.core.Timeline>(null);
	const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const activeProject = featuredProjects[activeProjectIdx] || projects[0];

	useEffect(() => {
		const scrollHandler = () => {
			if (window.scrollY > 50) setShowScroll(false);
		};
		window.addEventListener("scroll", scrollHandler, { passive: true });
		return () => {
			window.removeEventListener("scroll", scrollHandler);
		};
	}, []);

	// Auto-rotate projects
	useEffect(() => {
		if (featuredProjects.length <= 1) return;
		autoplayRef.current = setInterval(() => {
			setActiveProjectIdx((prev) => (prev + 1) % featuredProjects.length);
		}, 5000);
		return () => {
			if (autoplayRef.current) clearInterval(autoplayRef.current);
		};
	}, []);

	const goToProject = useCallback((idx: number) => {
		if (autoplayRef.current) clearInterval(autoplayRef.current);
		setActiveProjectIdx(idx);
		autoplayRef.current = setInterval(() => {
			setActiveProjectIdx((prev) => (prev + 1) % featuredProjects.length);
		}, 5000);
	}, []);

	// Animate project image transition
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run animation when project index changes
	useEffect(() => {
		gsap.fromTo(
			".hero-project-image",
			{ opacity: 0, scale: 1.05 },
			{ opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
		);
		gsap.fromTo(
			".hero-project-info",
			{ y: 10, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.15 },
		);
	}, [activeProjectIdx]);

	// ── Project detail panel ──
	const openProject = (project: Project) => {
		// Pause autoplay while detail is open
		if (autoplayRef.current) clearInterval(autoplayRef.current);
		setSelectedProject(project);
		window.history.pushState({}, "", `?project=${project.id}`);
	};

	const closeProject = useCallback(() => {
		gsap.to(".hero-modal-bg", { opacity: 0, duration: 0.3 });
		gsap.to(".hero-modal-panel", {
			x: "100%",
			duration: 0.4,
			ease: "power3.in",
			onComplete: () => {
				setSelectedProject(null);
				window.history.pushState({}, "", window.location.pathname);
				// Restart autoplay
				if (featuredProjects.length > 1) {
					autoplayRef.current = setInterval(() => {
						setActiveProjectIdx((prev) => (prev + 1) % featuredProjects.length);
					}, 5000);
				}
			},
		});
	}, []);

	useEscapeKey(closeProject, !!selectedProject);
	useScrollLock(!!selectedProject);

	// Animate modal in
	// biome-ignore lint/correctness/useExhaustiveDependencies: animate on selectedProject change
	useEffect(() => {
		if (selectedProject) {
			gsap.fromTo(
				".hero-modal-bg",
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3 },
			);
			gsap.fromTo(
				".hero-modal-panel",
				{ x: "100%" },
				{ x: 0, duration: 0.5, ease: "power3.out" },
			);

			// Media reveal animations
			setTimeout(() => {
				const mediaElements = gsap.utils.toArray(".hero-project-media-reveal");
				for (const [i, el] of mediaElements.entries()) {
					gsap.fromTo(
						el as HTMLElement,
						{ y: 40, opacity: 0 },
						{
							scrollTrigger: {
								trigger: el as HTMLElement,
								scroller: ".hero-modal-panel",
								start: "top 95%",
								toggleActions: "play none none reverse",
							},
							y: 0,
							opacity: 1,
							duration: 0.8,
							ease: "power2.out",
							delay: i * 0.1,
						},
					);
				}
			}, 400);
		}
	}, [selectedProject]);

	useGSAP(
		() => {
			const tl = gsap.timeline({ delay: 0.2 });
			tlRef.current = tl;

			// 1. Name rises in
			tl.from(".hero-name .split-char", {
				y: 150,
				opacity: 0,
				duration: 1.2,
				stagger: 0.035,
				ease: "power4.out",
			});

			// 2. Role + meta
			tl.from(
				".hero-identity-meta",
				{
					y: 25,
					opacity: 0,
					duration: 0.8,
					stagger: 0.1,
					ease: "power3.out",
				},
				"-=0.5",
			);

			// 3. Left-side links
			tl.from(
				".hero-left-link",
				{
					y: 15,
					opacity: 0,
					duration: 0.5,
					stagger: 0.06,
					ease: "power2.out",
				},
				"-=0.3",
			);

			// 4. Right side: project card
			tl.from(
				".hero-project-card",
				{
					x: 60,
					opacity: 0,
					duration: 1,
					ease: "power3.out",
				},
				"-=0.8",
			);

			// 5. Scroll indicator
			tl.from(
				".hero-scroll",
				{
					opacity: 0,
					duration: 1,
				},
				"-=0.4",
			);
		},
		{ scope: containerRef },
	);

	return (
		<>
			<section
				id="hero"
				ref={containerRef}
				className="relative flex min-h-screen flex-col justify-center px-6 py-16 md:px-12 lg:px-20"
			>
				{/* Ghost number — hidden on mobile to avoid overlapping name */}
				<div
					className="section-ghost-number absolute right-4 top-8 hidden md:block md:right-12"
					aria-hidden="true"
				>
					001
				</div>

				<div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 xl:gap-24">
					{/* ── Left: Identity ── */}
					<div>
						{/* Name */}
						<h1>
							<div className="overflow-hidden">
								<SplitText
									text={identity.name.first}
									className="hero-name font-display text-[clamp(48px,10vw,140px)] leading-[0.92] text-foreground"
								/>
							</div>
							<div className="overflow-hidden">
								<SplitText
									text={identity.name.last}
									className="hero-name font-display text-[clamp(48px,10vw,140px)] leading-[0.92] text-foreground"
								/>
							</div>
						</h1>

						{/* Role */}
						<div className="hero-identity-meta mt-6">
							<p className="font-mono-data text-lg tracking-wider text-primary">
								{identity.role}
							</p>
						</div>

						{/* One-liner */}
						<div className="hero-identity-meta mt-5 max-w-lg">
							<p className="font-editorial text-base leading-relaxed text-muted-foreground">
								{identity.tagline}
							</p>
						</div>

						{/* Status */}
						<div className="hero-identity-meta mt-6 flex items-center gap-3">
							{identity.availability.open && (
								<>
									<span
										className="accent-dot"
										style={{
											animation: "pulse-glow 2s ease-in-out infinite",
										}}
									/>
									<span className="font-mono-label text-primary">
										{identity.availability.label}
									</span>
								</>
							)}
						</div>

						{/* Social links with icons */}
						<div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1">
							<a
								href={identity.socials.github.url}
								target="_blank"
								rel="noopener noreferrer"
								data-cursor="external"
								className="hero-left-link group flex min-h-[44px] items-center gap-2 font-mono-data text-foreground transition-colors hover:text-primary"
							>
								<GithubIcon
									size={15}
									className="text-text-secondary transition-colors group-hover:text-primary"
								/>
								<span>{identity.socials.github.handle}</span>
								<ArrowOutIcon
									size={12}
									className="text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</a>

							<a
								href={identity.socials.linkedin.url}
								target="_blank"
								rel="noopener noreferrer"
								data-cursor="external"
								className="hero-left-link group flex min-h-[44px] items-center gap-2 font-mono-data text-foreground transition-colors hover:text-primary"
							>
								<LinkedinIcon
									size={15}
									className="text-text-secondary transition-colors group-hover:text-primary"
								/>
								<span>{identity.socials.linkedin.handle}</span>
								<ArrowOutIcon
									size={12}
									className="text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</a>

							<a
								href={`mailto:${identity.socials.email}`}
								data-cursor="external"
								className="hero-left-link group flex min-h-[44px] items-center gap-2 font-mono-data text-foreground transition-colors hover:text-primary"
							>
								<MailIcon
									size={15}
									className="text-text-secondary transition-colors group-hover:text-primary"
								/>
								<span>{identity.socials.email}</span>
							</a>

							<button
								type="button"
								onClick={() => {
									const aboutSection = document.getElementById("about");
									if (aboutSection) {
										aboutSection.scrollIntoView({
											behavior: "smooth",
										});
										// Trigger resume open after scroll completes
										setTimeout(() => {
											const resumeBtn =
												aboutSection.querySelector<HTMLButtonElement>("button");
											if (resumeBtn) resumeBtn.click();
										}, 800);
									}
								}}
								className="hero-left-link group flex min-h-[44px] items-center gap-2 font-mono-data text-foreground transition-colors hover:text-primary"
							>
								<ResumeIcon
									size={15}
									className="text-text-secondary transition-colors group-hover:text-primary"
								/>
								<span>Resume</span>
							</button>
						</div>

						{/* Tech stack chips */}
						<div className="mt-6 flex flex-wrap gap-1.5">
							{identity.techStack.slice(0, 6).map((tech) => (
								<span
									key={tech}
									className="hero-left-link font-mono-data border border-surface-border px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-primary/30 hover:text-foreground"
								>
									{tech}
								</span>
							))}
						</div>
					</div>

					{/* ── Right: Featured Project Preview (clickable) ── */}
					<div className="hero-project-card">
						<button
							type="button"
							onClick={() => openProject(activeProject)}
							className="block w-full text-left border border-surface-border bg-background/30 backdrop-blur-sm project-card-hover transition-all duration-300 hover:border-primary/30"
						>
							{/* Project image */}
							<div className="hero-project-image aspect-[16/10] w-full overflow-hidden border-b border-surface-border">
								{activeProject.media && activeProject.media[0] ? (
									<img
										src={activeProject.media[0].url}
										srcSet={`${activeProject.media[0].url.replace(/w=\d+/, "w=640")} 640w, ${activeProject.media[0].url.replace(/w=\d+/, "w=960")} 960w, ${activeProject.media[0].url.replace(/w=\d+/, "w=1280")} 1280w, ${activeProject.media[0].url} 1600w`}
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
										alt={activeProject.media[0].caption || activeProject.title}
										width={1600}
										height={1000}
										fetchPriority="high"
										className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
										style={{
											filter: "grayscale(30%) contrast(1.05)",
										}}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-surface">
										<span className="font-mono-label text-text-ghost">
											[ PROJECT PREVIEW ]
										</span>
									</div>
								)}
							</div>

							{/* Project info */}
							<div className="hero-project-info p-5 md:p-6">
								<div className="flex items-start justify-between gap-4">
									<div className="min-w-0">
										<span className="font-mono-label text-text-secondary">
											[{activeProject.number}] &mdash; {activeProject.role}
										</span>
										<h2 className="font-display mt-1 text-[clamp(24px,3vw,40px)] leading-[0.95] text-foreground">
											{activeProject.title}
										</h2>
										<p className="font-editorial mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
											{activeProject.shortDesc}
										</p>
									</div>
									<span className="font-mono-data shrink-0 text-text-secondary">
										{activeProject.year}
									</span>
								</div>

								{/* Tags */}
								<div className="mt-4 flex flex-wrap gap-1.5">
									{activeProject.tags.slice(0, 4).map((tag) => (
										<span
											key={tag}
											className="font-mono-data border border-surface-border px-2 py-0.5 text-[11px] text-text-secondary"
										>
											{tag}
										</span>
									))}
								</div>

								{/* "View details" hint */}
								<div className="mt-4 flex items-center gap-1.5 font-mono-label text-primary opacity-60 transition-opacity group-hover:opacity-100">
									<span>VIEW PROJECT</span>
									<ArrowOutIcon size={11} />
								</div>
							</div>
						</button>

						{/* Project navigation dots — outside the clickable button */}
						{featuredProjects.length > 1 && (
							<div className="flex items-center justify-between border border-t-0 border-surface-border px-5 py-1 md:px-6">
								<div className="-ml-2 flex gap-0">
									{featuredProjects.map((project, idx) => (
										<button
											type="button"
											key={project.id}
											onClick={() => goToProject(idx)}
											className="flex min-h-[44px] min-w-[44px] items-center justify-center"
											aria-label={`View project ${idx + 1}`}
										>
											<span
												className={`block h-1.5 rounded-full transition-all duration-300 ${
													idx === activeProjectIdx
														? "w-6 bg-primary"
														: "w-1.5 bg-surface-border hover:bg-muted-foreground"
												}`}
											/>
										</button>
									))}
								</div>
								<div className="-mr-2 flex gap-0">
									<button
										type="button"
										onClick={() =>
											goToProject(
												(activeProjectIdx - 1 + featuredProjects.length) %
													featuredProjects.length,
											)
										}
										className="flex min-h-[44px] min-w-[44px] items-center justify-center font-mono-label text-text-secondary transition-colors hover:text-foreground"
										aria-label="Previous project"
									>
										&larr;
									</button>
									<button
										type="button"
										onClick={() =>
											goToProject(
												(activeProjectIdx + 1) % featuredProjects.length,
											)
										}
										className="flex min-h-[44px] min-w-[44px] items-center justify-center font-mono-label text-text-secondary transition-colors hover:text-foreground"
										aria-label="Next project"
									>
										&rarr;
									</button>
								</div>
							</div>
						)}

						{/* Subtle label under card */}
						<p className="font-mono-label mt-3 text-right text-text-ghost">
							FEATURED WORK &mdash; {activeProjectIdx + 1}/
							{featuredProjects.length}
						</p>
					</div>
				</div>

				{/* Scroll indicator */}
				{showScroll && (
					<div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2">
						<div className="flex flex-col items-center gap-2">
							<span className="font-mono-label text-text-ghost">SCROLL</span>
							<div className="h-8 w-px bg-text-ghost" />
						</div>
					</div>
				)}
			</section>

			{/* ── Project Detail Panel (portaled) ── */}
			{selectedProject &&
				typeof document !== "undefined" &&
				createPortal(
					<div className="portfolio-theme contents">
						{/* Backdrop */}
						<button
							type="button"
							className="hero-modal-bg fixed inset-0 z-[95] bg-background/95 backdrop-blur-md"
							onClick={closeProject}
							aria-label="Close project details"
						/>
						{/* Panel */}
						<div
							className="hero-modal-panel fixed bottom-0 right-0 top-0 z-[96] w-full overflow-y-auto border-l border-surface-border bg-background p-8 md:w-[70vw] md:p-12 lg:p-16"
							style={{ overscrollBehavior: "contain" }}
							data-lenis-prevent="true"
						>
							<button
								type="button"
								onClick={closeProject}
								className="font-mono-label mb-12 text-text-secondary transition-colors hover:text-foreground"
							>
								&larr; CLOSE
							</button>

							<span className="font-mono-label text-text-secondary">
								[{selectedProject.number}] &mdash; {selectedProject.year}{" "}
								&mdash; {selectedProject.role}
							</span>
							<h2 className="font-display mt-2 text-[clamp(36px,5vw,72px)] text-foreground">
								{selectedProject.title}
							</h2>

							<div className="mt-12 grid gap-12 md:grid-cols-3">
								<div>
									<span className="font-mono-label mb-3 block text-primary">
										PROBLEM
									</span>
									<p className="font-editorial text-sm text-foreground">
										{selectedProject.problem}
									</p>
								</div>
								<div>
									<span className="font-mono-label mb-3 block text-primary">
										APPROACH
									</span>
									<p className="font-editorial text-sm text-foreground">
										{selectedProject.approach}
									</p>
								</div>
								<div>
									<span className="font-mono-label mb-3 block text-primary">
										OUTCOME
									</span>
									<p className="font-editorial text-sm text-foreground">
										{selectedProject.outcome}
									</p>
								</div>
							</div>

							<div className="mt-12">
								<span className="font-mono-label mb-3 block text-text-secondary">
									TECH STACK
								</span>
								<div className="flex flex-wrap gap-2">
									{selectedProject.tags.map((tag: string) => (
										<span
											key={tag}
											className="font-mono-data border border-surface-border px-3 py-1 text-foreground"
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							<div className="mt-12 flex gap-6">
								{selectedProject.liveUrl && (
									<a
										href={selectedProject.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
										data-cursor="external"
										className="font-mono-data text-primary transition-opacity hover:opacity-70"
									>
										[&nearr; LIVE SITE]
									</a>
								)}
								{selectedProject.githubUrl && (
									<a
										href={selectedProject.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										data-cursor="external"
										className="font-mono-data text-foreground transition-opacity hover:opacity-70"
									>
										[&varr; GITHUB]
									</a>
								)}
							</div>

							{/* Media Gallery */}
							{selectedProject.media && selectedProject.media.length > 0 && (
								<div className="mt-20 border-t border-surface-border pt-12">
									<span className="font-mono-label mb-8 block text-primary">
										VISUALS
									</span>
									<div className="grid gap-8">
										{selectedProject.media.map((item) => (
											<figure
												key={item.url}
												className="hero-project-media-reveal group relative overflow-hidden border border-surface-border"
											>
												{item.type === "image" ? (
													<img
														src={item.url}
														srcSet={`${item.url.replace(/w=\d+/, "w=640")} 640w, ${item.url.replace(/w=\d+/, "w=960")} 960w, ${item.url.replace(/w=\d+/, "w=1280")} 1280w, ${item.url} 1600w`}
														sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
														alt={
															item.caption || `${selectedProject.title} media`
														}
														width={1600}
														height={1000}
														loading="lazy"
														className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
													/>
												) : (
													<video
														src={item.url}
														autoPlay
														muted
														loop
														playsInline
														className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
													/>
												)}
												{item.caption && (
													<figcaption className="font-mono-data border-t border-surface-border bg-surface-strong px-4 py-3 text-[11px] text-muted-foreground">
														{item.caption}
													</figcaption>
												)}
											</figure>
										))}
									</div>
								</div>
							)}
						</div>
					</div>,
					document.body,
				)}
		</>
	);
};

export default HeroVariantB;
