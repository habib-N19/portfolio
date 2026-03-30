import { useGSAP } from "@gsap/react";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { resumeData } from "#/data/resume";
import { timelineData } from "#/data/timeline";
import { useEscapeKey } from "#/hooks/useEscapeKey";
import { useScrollLock } from "#/hooks/useScrollLock";
import { gsap } from "#/lib/gsap-setup";

const skills = {
	Languages: ["TypeScript", "Python", "GLSL", "HTML/CSS"],
	Frameworks: ["React", "Next.js", "Three.js", "Node.js"],
	Tools: ["GSAP", "Figma", "Docker", "Vite"],
	Concepts: ["WebGL", "Performance", "Accessibility", "Animation"],
};

const AboutSection = () => {
	const containerRef = useRef<HTMLElement>(null);
	const [isResumeOpen, setIsResumeOpen] = useState(false);

	const closeResume = useCallback(() => {
		gsap.to(".resume-modal-bg", { opacity: 0, duration: 0.3 });
		gsap.to(".resume-modal-panel", {
			y: "100%",
			duration: 0.4,
			ease: "power3.in",
			onComplete: () => setIsResumeOpen(false),
		});
	}, []);

	useEscapeKey(closeResume, isResumeOpen);
	useScrollLock(isResumeOpen);

	const openResume = () => setIsResumeOpen(true);

	// Animate modal in when selected changes
	useGSAP(
		() => {
			if (isResumeOpen) {
				gsap.fromTo(
					".resume-modal-bg",
					{ opacity: 0 },
					{ opacity: 1, duration: 0.3 },
				);
				gsap.fromTo(
					".resume-modal-panel",
					{ y: "100%" },
					{ y: 0, duration: 0.5, ease: "power3.out" },
				);
			}
		},
		{ dependencies: [isResumeOpen] },
	);

	useGSAP(
		() => {
			// Select all elements with the reveal attribute
			const elements = gsap.utils.toArray(".about-reveal");

			elements.forEach((el, i) => {
				gsap.from(el as HTMLElement, {
					scrollTrigger: {
						trigger: el as HTMLElement,
						start: "top 85%", // Trigger when the top of the element hits 85% of viewport
						toggleActions: "play none none reverse", // Play on enter, reverse on exit
					},
					y: 40,
					opacity: 0,
					duration: 1,
					ease: "power2.out",
					delay: i * 0.1, // Stagger slightly based on DOM order
				});
			});
		},
		{ scope: containerRef },
	);

	return (
		<>
			<section
				id="about"
				ref={containerRef}
				className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20"
			>
				{/* Ghost number */}
				<div
					className="section-ghost-number absolute right-4 top-8 md:right-12"
					aria-hidden="true"
				>
					002
				</div>

				<div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
					{/* Portrait placeholder */}
					<div className="about-reveal">
						<div
							className="aspect-[3/4] w-full border border-surface-border"
							style={{
								background: "hsl(var(--bg-surface))",
								filter: "grayscale(100%) contrast(1.1)",
							}}
						>
							<div className="flex h-full items-center justify-center">
								<span className="font-mono-label text-text-ghost">
									[ YOUR PORTRAIT ]
								</span>
							</div>
						</div>
						<p className="font-mono-label mt-4 text-text-secondary">
							CREATIVE DEVELOPER — 2026
						</p>
					</div>

					{/* Bio + Skills */}
					<div>
						<div className="about-reveal">
							<h2 className="font-display mb-12 text-[clamp(40px,6vw,80px)] text-foreground">
								ABOUT
							</h2>
							<div className="content-width space-y-6 font-editorial text-base leading-[1.72] text-foreground">
								<p>
									I've been writing software for five years. Most of it is
									invisible infrastructure — the kind that works until it
									doesn't. I'm trying to make the invisible feel worth looking
									at.
								</p>
								<p className="italic text-muted-foreground">
									The intersection of engineering precision and creative
									expression is where I do my best work. I believe every pixel
									is a decision, and every animation is a conversation with the
									person experiencing it.
								</p>

								<div className="pt-6 flex flex-wrap gap-4">
									<button
										onClick={openResume}
										className="inline-block border border-surface-border bg-background px-6 py-3 font-mono-label text-foreground transition-colors hover:border-primary hover:text-primary"
									>
										[👁] PREVIEW RESUME
									</button>
									<a
										href="/resume.pdf"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block border border-transparent px-6 py-3 font-mono-label text-text-secondary transition-colors hover:text-foreground"
									>
										[↓] DOWNLOAD
									</a>
								</div>
							</div>
						</div>

						{/* Skills constellation */}
						<div className="about-reveal mt-16">
							<div className="space-y-8">
								{Object.entries(skills).map(([category, items]) => (
									<div key={category}>
										<span className="font-mono-label mb-3 block text-text-secondary">
											{category}
										</span>
										<div className="flex flex-wrap gap-2">
											{items.map((skill) => (
												<div
													key={skill}
													className="skill-node font-mono-data text-foreground"
												>
													{skill}
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Condensed Timeline / Journey */}
						<div className="about-reveal mt-20 pt-16 border-t border-surface-border">
							<h3 className="font-mono-label text-text-secondary mb-8">
								JOURNEY / MILESTONES
							</h3>
							<div className="space-y-6">
								{timelineData.map((node) => (
									<div
										key={node.year}
										className="grid grid-cols-[80px_1fr] items-start gap-4"
									>
										<div className="font-mono-data text-muted-foreground pt-1">
											{node.year}
										</div>
										<div>
											<h4 className="font-display text-2xl text-foreground tracking-wide leading-none">
												{node.title}
											</h4>
											<p className="font-editorial text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
												{node.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Embedded Resume Modal Panel */}
			{isResumeOpen &&
				typeof document !== "undefined" &&
				createPortal(
					<div className="portfolio-theme contents">
						<div
							className="resume-modal-bg fixed inset-0 z-[95] bg-background/90 backdrop-blur-sm"
							onClick={closeResume}
						/>
						<div
							className="resume-modal-panel resume-panel fixed bottom-0 left-0 right-0 z-[96] h-[90vh] overflow-y-auto rounded-t-2xl border-t border-surface-border p-8 md:p-12 lg:p-16"
							style={{ overscrollBehavior: "contain" }}
							data-lenis-prevent="true"
						>
							<div className="mx-auto max-w-3xl pb-24">
								<div className="flex items-start justify-between">
									<button
										onClick={closeResume}
										className="font-mono-label text-text-secondary transition-colors hover:text-foreground"
									>
										↓ CLOSE
									</button>
									<a
										href="/resume.pdf"
										target="_blank"
										rel="noopener noreferrer"
										className="font-mono-label text-primary transition-colors hover:opacity-70"
									>
										[DOWNLOAD PDF]
									</a>
								</div>

								<div className="mt-16 text-center">
									<h2 className="font-display text-5xl md:text-7xl">
										{resumeData.name}
									</h2>
									<p className="font-mono-data mt-4">{resumeData.title}</p>
								</div>

								<div className="mt-16 space-y-16">
									{/* Contact */}
									<div className="flex justify-center gap-6">
										<a
											href={`mailto:${resumeData.email}`}
											className="font-mono-data hover:underline"
										>
											{resumeData.email}
										</a>
										<a
											href={`https://${resumeData.site}`}
											target="_blank"
											rel="noopener noreferrer"
											className="font-mono-data hover:underline"
										>
											{resumeData.site}
										</a>
										<span className="font-mono-data text-muted-foreground">
											{resumeData.location}
										</span>
									</div>

									{/* Experience */}
									<div className="border-t border-black/10 pt-12">
										<h3 className="font-mono-label mb-8 tracking-widest text-black/40">
											EXPERIENCE
										</h3>
										<div className="space-y-12">
											{resumeData.experience.map((exp: any, idx: number) => (
												<div key={idx}>
													<div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
														<h4 className="font-display text-2xl">
															{exp.role}
														</h4>
														<span className="font-mono-data text-sm opacity-60">
															{exp.period}
														</span>
													</div>
													<p className="font-mono-data mt-1 text-sm opacity-80">
														{exp.company}
													</p>
													<p className="font-editorial mt-4 leading-relaxed opacity-90">
														{exp.description}
													</p>
												</div>
											))}
										</div>
									</div>

									{/* Education */}
									<div className="border-t border-black/10 pt-12">
										<h3 className="font-mono-label mb-8 tracking-widest text-black/40">
											EDUCATION
										</h3>
										{resumeData.education.map((edu: any, idx: number) => (
											<div key={idx} className="mb-6">
												<div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
													<h4 className="font-display text-xl">{edu.degree}</h4>
													<span className="font-mono-data text-sm opacity-60">
														{edu.year}
													</span>
												</div>
												<p className="font-mono-data mt-1 text-sm opacity-80">
													{edu.institution}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
};

export default AboutSection;
