import { createFileRoute, Link } from "@tanstack/react-router";
import CustomCursor from "#/components/portfolio/CustomCursor";
import SmoothScroll from "#/components/portfolio/SmoothScroll";
import { getPublishedPosts } from "#/lib/blog.functions";

export const Route = createFileRoute("/blog/")({
	loader: () => getPublishedPosts(),
	head: () => ({
		meta: [
			{ title: "Writing | habiburnabiarafat" },
			{
				name: "description",
				content:
					"Articles on creative development, WebGL, animation, architecture decisions, and building for the modern web.",
			},
			{ property: "og:title", content: "Writing | habiburnabiarafat" },
			{
				property: "og:description",
				content:
					"Articles on creative development, WebGL, animation, architecture decisions, and building for the modern web.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: "https://habiburnabiarafat.dev/blog" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Writing | habiburnabiarafat" },
			{
				name: "twitter:description",
				content:
					"Articles on creative development, WebGL, animation, architecture decisions, and building for the modern web.",
			},
		],
		links: [{ rel: "canonical", href: "https://habiburnabiarafat.dev/blog" }],
	}),
	component: BlogIndexRoute,
});

function BlogIndexRoute() {
	const posts = Route.useLoaderData();

	return (
		<SmoothScroll>
			<div className="portfolio-theme min-h-screen bg-background text-foreground">
				<CustomCursor />

				<main className="px-6 py-32 md:px-12 lg:px-20 mx-auto max-w-7xl">
					<div className="mb-24 flex items-baseline justify-between">
						<h1 className="font-display text-[clamp(48px,8vw,120px)] leading-none text-foreground uppercase tracking-tight">
							WRITING
						</h1>
						<Link
							to="/"
							className="font-mono-data text-muted-foreground hover:text-primary transition-colors"
							data-cursor="link"
						>
							[&larr; RETURN HOME]
						</Link>
					</div>

					<div className="relative">
						{/* Header row */}
						<div className="font-mono-label mb-4 hidden grid-cols-[60px_1fr_160px_80px] gap-4 border-b border-surface-border pb-3 text-text-secondary md:grid uppercase text-xs">
							<span>NO.</span>
							<span>TITLE</span>
							<span>DATE</span>
							<span className="text-right">READ</span>
						</div>

						{/* Post rows */}
						{posts.map((post, index) => (
							<Link
								key={post.slug}
								to="/blog/$slug"
								params={{ slug: post.slug }}
								className="group relative grid grid-cols-1 gap-2 border-b border-surface-border py-6 transition-colors duration-300 hover:bg-surface-hover md:grid-cols-[60px_1fr_160px_80px] md:items-center md:gap-4"
								data-cursor="link"
							>
								<span className="font-mono-data text-text-secondary transition-colors duration-300 group-hover:text-primary">
									[{String(index + 1).padStart(2, "0")}]
								</span>

								<div>
									<h3 className="font-editorial text-xl md:text-2xl text-foreground transition-colors duration-300 group-hover:text-primary">
										{post.title}
									</h3>
									<p className="font-mono-data mt-2 text-[11px] text-muted-foreground md:hidden uppercase tracking-widest">
										{formatDate(post.date)} &middot; {post.readingTime}
									</p>
								</div>

								<span className="font-mono-data hidden text-[11px] uppercase tracking-widest text-text-secondary md:block">
									{formatDate(post.date)}
								</span>

								<span className="font-mono-data hidden text-[11px] uppercase tracking-widest text-right text-text-secondary md:block">
									{post.readingTime}
								</span>
							</Link>
						))}

						{posts.length === 0 && (
							<p className="font-editorial text-lg text-muted-foreground py-12">
								No posts yet. Check back soon.
							</p>
						)}
					</div>
				</main>
			</div>
		</SmoothScroll>
	);
}

/** Format "2026-05-10" → "MAY 10, 2026" */
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date
		.toLocaleDateString("en-US", {
			month: "long",
			day: "2-digit",
			year: "numeric",
		})
		.toUpperCase();
}
