import { useGSAP } from "@gsap/react";
import { useCallback, useRef, useState } from "react";
import { WorkGitHubActivity } from "#/components/portfolio/WorkGitHubActivity";
import { WorkProjectModal } from "#/components/portfolio/WorkProjectModal";
import { WorkProjectsGrid } from "#/components/portfolio/WorkProjectsGrid";
import { type Project, projects } from "#/data/projects";
import { useEscapeKey } from "#/hooks/useEscapeKey";
import { useScrollLock } from "#/hooks/useScrollLock";
import { gsap } from "#/lib/gsap-setup";
import { useMotionTier } from "#/lib/motion-context";

const WorkSection = () => {
	const motionTier = useMotionTier();
	const [selected, setSelected] = useState<Project | null>(null);
	const containerRef = useRef<HTMLElement>(null);

	const handleClose = useCallback(() => {
		const dur = motionTier === "reduced" ? 0.15 : 0.3;
		const panelDur = motionTier === "reduced" ? 0.2 : 0.4;
		gsap.to(".project-modal-bg", { opacity: 0, duration: dur });
		gsap.to(".project-modal-panel", {
			x: "100%",
			duration: panelDur,
			ease: "power3.in",
			onComplete: () => {
				setSelected(null);
				window.history.pushState({}, "", window.location.pathname);
			},
		});
	}, [motionTier]);

	useEscapeKey(handleClose, !!selected);
	useScrollLock(!!selected);

	const openProject = (project: Project) => {
		setSelected(project);
		window.history.pushState({}, "", `?project=${project.id}`);
	};

	useGSAP(
		() => {
			if (motionTier === "minimal") return;
			const isReduced = motionTier === "reduced";
			const elements = gsap.utils.toArray(".work-reveal");

			elements.forEach((el, i) => {
				gsap.from(el as HTMLElement, {
					scrollTrigger: {
						trigger: el as HTMLElement,
						start: "top 85%",
						toggleActions: "play none none none",
						once: true,
					},
					y: isReduced ? 15 : 40,
					opacity: 0,
					duration: isReduced ? 0.4 : 0.8,
					ease: "power2.out",
					delay: isReduced ? i * 0.03 : i * 0.1,
				});
			});
		},
		{ scope: containerRef, dependencies: [motionTier] },
	);

	// Animate modal in when selected changes
	useGSAP(
		() => {
			if (selected) {
				const isReduced = motionTier === "reduced";
				const bgDur = isReduced ? 0.15 : 0.3;
				const panelDur = isReduced ? 0.25 : 0.5;

				gsap.fromTo(
					".project-modal-bg",
					{ opacity: 0 },
					{ opacity: 1, duration: bgDur },
				);
				gsap.fromTo(
					".project-modal-panel",
					{ x: "100%" },
					{ x: 0, duration: panelDur, ease: "power3.out" },
				);

				if (motionTier !== "minimal") {
					setTimeout(
						() => {
							const mediaElements = gsap.utils.toArray(".project-media-reveal");
							mediaElements.forEach((el, i) => {
								gsap.fromTo(
									el as HTMLElement,
									{ y: isReduced ? 15 : 40, opacity: 0 },
									{
										scrollTrigger: {
											trigger: el as HTMLElement,
											scroller: ".project-modal-panel",
											start: "top 95%",
											toggleActions: "play none none none",
											once: true,
										},
										y: 0,
										opacity: 1,
										duration: isReduced ? 0.4 : 0.8,
										ease: "power2.out",
										delay: isReduced ? i * 0.03 : i * 0.1,
									},
								);
							});
						},
						isReduced ? 150 : 400,
					);
				}
			}
		},
		{ dependencies: [selected, motionTier] },
	);

	const featuredProjects = projects.filter((p) => p.tier === "featured");
	const lead = featuredProjects[0];
	const otherFeatured = featuredProjects.slice(1);
	const selectedWork = projects.filter((p) => p.tier === "selected");

	return (
		<>
			<section
				id="work"
				ref={containerRef}
				className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20 overflow-hidden"
			>
				<h2 className="work-reveal relative z-10 font-display mb-16 text-[clamp(40px,6vw,80px)] text-foreground">
					SELECTED WORK
				</h2>
				<WorkProjectsGrid
					featured={lead}
					projects={otherFeatured}
					selected={selectedWork}
					onOpenProject={openProject}
				/>
				<WorkGitHubActivity />
			</section>
			<WorkProjectModal project={selected} onClose={handleClose} />
		</>
	);
};

export default WorkSection;
