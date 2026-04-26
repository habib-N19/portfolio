import { useGSAP } from "@gsap/react";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { blogPosts } from "#/data/blog";
import { gsap } from "#/lib/gsap-setup";
import { useMotionTier } from "#/lib/motion-context";

const BlogSection = () => {
	const motionTier = useMotionTier();
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const imageContainerRef = useRef<HTMLDivElement>(null);

	const hoveredPost = blogPosts.find((p) => p.id === hoveredId);

	const xTo = useRef<gsap.QuickToFunc | null>(null);
	const yTo = useRef<gsap.QuickToFunc | null>(null);

	useGSAP(
		() => {
			if (motionTier === "minimal") return;
			const trackDur = motionTier === "reduced" ? 0.2 : 0.4;
			xTo.current = gsap.quickTo(imageContainerRef.current, "left", {
				duration: trackDur,
				ease: "power3",
			});
			yTo.current = gsap.quickTo(imageContainerRef.current, "top", {
				duration: trackDur,
				ease: "power3",
			});

			gsap.set(imageContainerRef.current, { opacity: 0, scale: 0.92 });
		},
		{ scope: sectionRef, dependencies: [motionTier] },
	);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (xTo.current && yTo.current) {
			xTo.current(e.clientX + 24);
			yTo.current(e.clientY - 90);
		}
	};

	useGSAP(
		() => {
			if (motionTier === "minimal") return;
			const isReduced = motionTier === "reduced";
			const elements = gsap.utils.toArray(".blog-reveal");
			elements.forEach((el, i) => {
				gsap.from(el as HTMLElement, {
					scrollTrigger: {
						trigger: el as HTMLElement,
						start: "top 85%",
						toggleActions: "play none none none",
						once: true,
					},
					y: isReduced ? 8 : 20,
					opacity: 0,
					duration: isReduced ? 0.25 : 0.5,
					ease: "power2.out",
					delay: isReduced ? i * 0.02 : i * 0.08,
				});
			});
		},
		{ scope: sectionRef, dependencies: [motionTier] },
	);

	// Handle hovered ID image animation
	useGSAP(
		() => {
			if (hoveredId) {
				gsap.to(imageContainerRef.current, {
					opacity: 1,
					scale: 1,
					duration: 0.25,
					ease: "power2.out",
				});
			} else {
				gsap.to(imageContainerRef.current, {
					opacity: 0,
					scale: 0.92,
					duration: 0.25,
					ease: "power2.in",
				});
			}
		},
		{ dependencies: [hoveredId], scope: sectionRef },
	);

	return (
		<section
			id="blog"
			ref={sectionRef}
			className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20"
			onMouseMove={handleMouseMove}
		>
			<h2 className="blog-reveal font-display mb-16 text-[clamp(40px,6vw,80px)] text-foreground">
				WRITING
			</h2>

			{/* Editorial table */}
			<div className="relative">
				{/* Header row */}
				<div className="font-mono-label mb-4 hidden grid-cols-[60px_1fr_120px_80px] gap-4 border-b border-surface-border pb-3 text-text-secondary md:grid">
					<span>NO.</span>
					<span>TITLE</span>
					<span>DATE</span>
					<span className="text-right">READ</span>
				</div>

				{/* Post rows */}
				{blogPosts.map((post) => (
					<Link
						key={post.id}
						to="/blog/$slug"
						params={{ slug: post.id }}
						className="blog-reveal group relative grid grid-cols-1 gap-2 border-b border-surface-border py-5 transition-colors duration-300 hover:bg-surface-hover md:grid-cols-[60px_1fr_120px_80px] md:items-center md:gap-4"
						data-cursor="link"
						onMouseEnter={() => setHoveredId(post.id)}
						onMouseLeave={() => setHoveredId(null)}
					>
						<span className="font-mono-data text-text-secondary transition-colors duration-300 group-hover:text-primary">
							[{post.number}]
						</span>

						<div>
							<h3 className="font-editorial text-base text-foreground transition-colors duration-300 group-hover:text-primary md:text-lg">
								{post.title}
							</h3>
							<p className="mt-1 text-sm text-muted-foreground md:hidden">
								{post.date} · {post.readTime}
							</p>
						</div>

						<span className="font-mono-data hidden text-text-secondary md:block">
							{post.date}
						</span>

						<span className="font-mono-data hidden text-right text-text-secondary md:block">
							{post.readTime}
						</span>

						{/* Tags on hover — desktop only */}
						<div
							className="col-span-full hidden overflow-hidden transition-all duration-300 ease-out md:block"
							style={{
								height: hoveredId === post.id ? "auto" : 0,
								opacity: hoveredId === post.id ? 1 : 0,
							}}
						>
							<p className="font-editorial pb-2 pt-1 text-sm text-muted-foreground">
								{post.excerpt}
							</p>
							<div className="flex gap-2 pb-1">
								{post.tags.map((tag) => (
									<span
										key={tag}
										className="font-mono-data text-[11px] text-text-secondary"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Floating hover image preview — desktop only */}
			<div
				ref={imageContainerRef}
				className="pointer-events-none fixed z-[80] hidden overflow-hidden border border-surface-border md:block"
				style={{
					width: 280,
					height: 180,
				}}
			>
				{hoveredPost && (
					<img
						src={hoveredPost.imageUrl}
						alt=""
						width={600}
						height={400}
						className="h-full w-full object-cover grayscale"
						loading="lazy"
					/>
				)}
				{/* Grain overlay on image */}
				<div
					className="absolute inset-0"
					style={{
						background: `hsl(var(--accent-signal) / 0.06)`,
						mixBlendMode: "overlay",
					}}
				/>
			</div>
		</section>
	);
};

export default BlogSection;
