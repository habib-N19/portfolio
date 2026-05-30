import { useGSAP } from "@gsap/react";
import { useCallback, useRef, useState } from "react";
import { AboutContent } from "#/components/portfolio/AboutContent";
import { AboutResumeModal } from "#/components/portfolio/AboutResumeModal";
import { useEscapeKey } from "#/hooks/useEscapeKey";
import { useScrollLock } from "#/hooks/useScrollLock";
import { gsap } from "#/lib/gsap-setup";
import { useMotionTier } from "#/lib/motion-context";

const AboutSection = () => {
	const motionTier = useMotionTier();
	const containerRef = useRef<HTMLElement>(null);
	const [isResumeOpen, setIsResumeOpen] = useState(false);

	const closeResume = useCallback(() => {
		const dur = motionTier === "reduced" ? 0.15 : 0.3;
		const panelDur = motionTier === "reduced" ? 0.2 : 0.4;
		gsap.to(".resume-modal-bg", { opacity: 0, duration: dur });
		gsap.to(".resume-modal-panel", {
			y: "100%",
			duration: panelDur,
			ease: "power3.in",
			onComplete: () => setIsResumeOpen(false),
		});
	}, [motionTier]);

	useEscapeKey(closeResume, isResumeOpen);
	useScrollLock(isResumeOpen);

	const openResume = useCallback(() => setIsResumeOpen(true), []);

	// Animate modal in when selected changes
	useGSAP(
		() => {
			if (isResumeOpen) {
				const bgDur = motionTier === "reduced" ? 0.15 : 0.3;
				const panelDur = motionTier === "reduced" ? 0.25 : 0.5;
				gsap.fromTo(
					".resume-modal-bg",
					{ opacity: 0 },
					{ opacity: 1, duration: bgDur },
				);
				gsap.fromTo(
					".resume-modal-panel",
					{ y: "100%" },
					{ y: 0, duration: panelDur, ease: "power3.out" },
				);
			}
		},
		{ dependencies: [isResumeOpen, motionTier] },
	);

	useGSAP(
		() => {
			if (motionTier === "minimal") return;
			const isReduced = motionTier === "reduced";
			const elements = gsap.utils.toArray(".about-reveal");

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
					duration: isReduced ? 0.5 : 1,
					ease: "power2.out",
					delay: isReduced ? i * 0.03 : i * 0.1,
				});
			});
		},
		{ scope: containerRef, dependencies: [motionTier] },
	);

	return (
		<>
			<section
				id="about"
				ref={containerRef}
				className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20"
			>
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

					<AboutContent onOpenResume={openResume} />
				</div>
			</section>
			<AboutResumeModal isOpen={isResumeOpen} onClose={closeResume} />
		</>
	);
};

export default AboutSection;
