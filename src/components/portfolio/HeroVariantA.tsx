import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { identity } from "#/data/identity";
import { SplitText } from "./SplitText";

/**
 * Hero Variant A: "The Developer Card"
 *
 * Identity-first. Name, role, one-liner, social links, availability status.
 * Everything a recruiter needs in 3 seconds. Cinematic GSAP entrance preserved.
 */
const HeroVariantA = () => {
	const [showScroll, setShowScroll] = useState(true);
	const containerRef = useRef<HTMLElement>(null);
	const tlRef = useRef<gsap.core.Timeline>(null);

	useEffect(() => {
		const scrollHandler = () => {
			if (window.scrollY > 50) setShowScroll(false);
		};
		window.addEventListener("scroll", scrollHandler, { passive: true });
		return () => {
			window.removeEventListener("scroll", scrollHandler);
		};
	}, []);

	useGSAP(
		() => {
			const tl = gsap.timeline({ delay: 0.2 });
			tlRef.current = tl;

			// 1. Name rises in, character by character
			tl.from(".hero-name .split-char", {
				y: 150,
				opacity: 0,
				duration: 1.2,
				stagger: 0.035,
				ease: "power4.out",
			});

			// 2. Role title fades in
			tl.from(
				".hero-role",
				{
					y: 30,
					opacity: 0,
					duration: 0.8,
					ease: "power3.out",
				},
				"-=0.5",
			);

			// 3. One-liner description
			tl.from(
				".hero-desc",
				{
					y: 20,
					opacity: 0,
					duration: 0.8,
					ease: "power3.out",
				},
				"-=0.4",
			);

			// 4. Divider line draws in
			tl.from(
				".hero-divider",
				{
					scaleX: 0,
					duration: 0.6,
					ease: "power2.inOut",
				},
				"-=0.3",
			);

			// 5. Social links + status stagger in
			tl.from(
				".hero-link-item",
				{
					y: 15,
					opacity: 0,
					duration: 0.5,
					stagger: 0.08,
					ease: "power2.out",
				},
				"-=0.2",
			);

			// 6. Status badge
			tl.from(
				".hero-status",
				{
					y: 15,
					opacity: 0,
					duration: 0.5,
					ease: "power2.out",
				},
				"-=0.3",
			);

			// 7. Scroll indicator
			tl.from(
				".hero-scroll",
				{
					opacity: 0,
					duration: 1,
				},
				"-=0.2",
			);
		},
		{ scope: containerRef },
	);

	return (
		<section
			id="hero"
			ref={containerRef}
			className="relative flex min-h-screen flex-col justify-end px-6 pb-16 md:px-12 lg:px-20"
		>
			{/* Ghost number */}
			<div
				className="section-ghost-number absolute right-4 top-8 md:right-12"
				aria-hidden="true"
			>
				001
			</div>

			<div className="mb-16 md:mb-24">
				{/* Name — the focal point */}
				<h1>
					<div className="overflow-hidden">
						<SplitText
							text={identity.name.first}
							className="hero-name font-display text-[clamp(56px,14vw,200px)] leading-[0.92] text-foreground"
						/>
					</div>
					<div className="overflow-hidden">
						<SplitText
							text={identity.name.last}
							className="hero-name font-display text-[clamp(56px,14vw,200px)] leading-[0.92] text-foreground"
						/>
					</div>
				</h1>

				{/* Role */}
				<div className="hero-role mt-6">
					<p className="font-mono-data text-lg tracking-wider text-primary md:text-xl">
						{identity.role}
					</p>
				</div>

				{/* One-liner */}
				<div className="hero-desc mt-6 max-w-2xl">
					<p className="font-editorial text-base leading-relaxed text-muted-foreground md:text-lg">
						{identity.tagline}
					</p>
				</div>

				{/* Divider */}
				<div className="hero-divider mt-10 h-px w-full origin-left bg-surface-border" />

				{/* Links + Status row */}
				<div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					{/* Social links */}
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
						<a
							href={identity.socials.github.url}
							target="_blank"
							rel="noopener noreferrer"
							data-cursor="external"
							className="hero-link-item group flex items-center gap-2 font-mono-data text-foreground transition-colors hover:text-primary"
						>
							<span className="text-muted-foreground transition-colors group-hover:text-primary">
								GH
							</span>
							<span className="text-text-secondary">/</span>
							<span>{identity.socials.github.handle}</span>
							<span className="text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
								↗
							</span>
						</a>

						<a
							href={identity.socials.linkedin.url}
							target="_blank"
							rel="noopener noreferrer"
							data-cursor="external"
							className="hero-link-item group flex items-center gap-2 font-mono-data text-foreground transition-colors hover:text-primary"
						>
							<span className="text-muted-foreground transition-colors group-hover:text-primary">
								LI
							</span>
							<span className="text-text-secondary">/</span>
							<span>{identity.socials.linkedin.handle}</span>
							<span className="text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
								↗
							</span>
						</a>

						<a
							href={`mailto:${identity.socials.email}`}
							data-cursor="external"
							className="hero-link-item group flex items-center gap-2 font-mono-data text-foreground transition-colors hover:text-primary"
						>
							<span className="text-muted-foreground transition-colors group-hover:text-primary">
								EM
							</span>
							<span className="text-text-secondary">/</span>
							<span>{identity.socials.email}</span>
						</a>
					</div>

					{/* Availability status */}
					{identity.availability.open && (
						<div className="hero-status flex items-center gap-3">
							<span
								className="accent-dot"
								style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
							/>
							<span className="font-mono-label text-primary">
								{identity.availability.label}
							</span>
						</div>
					)}
				</div>

				{/* Tech stack as subtle texture */}
				<div className="mt-8 flex flex-wrap gap-2">
					{identity.techStack.map((tech) => (
						<span
							key={tech}
							className="hero-link-item font-mono-data border border-surface-border px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:border-primary/30 hover:text-foreground"
						>
							{tech}
						</span>
					))}
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
	);
};

export default HeroVariantA;
