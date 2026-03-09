import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import CustomCursor from "#/components/portfolio/CustomCursor";
import SmoothScroll from "#/components/portfolio/SmoothScroll";
import { getPost } from "#/lib/blog.functions";
import type { BlogPost } from "#/lib/blog.server";

export const Route = createFileRoute("/blog/$slug")({
	loader: ({ params }) => getPost({ data: params.slug }),
	head: ({ loaderData }) => {
		const post = loaderData as BlogPost | undefined;
		if (!post) {
			return {
				meta: [{ title: "Post Not Found | Habiboulaye" }],
			};
		}

		const url = `https://habiboulaye.dev/blog/${post.slug}`;

		return {
			meta: [
				{ title: `${post.title} | Habiboulaye` },
				{ name: "description", content: post.description },
				// Open Graph
				{ property: "og:title", content: post.title },
				{ property: "og:description", content: post.description },
				{ property: "og:type", content: "article" },
				{ property: "og:url", content: url },
				...(post.image ? [{ property: "og:image", content: post.image }] : []),
				{ property: "article:published_time", content: post.date },
				...(post.tags?.map((tag) => ({
					property: "article:tag",
					content: tag,
				})) ?? []),
				// Twitter
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: post.title },
				{ name: "twitter:description", content: post.description },
				...(post.image ? [{ name: "twitter:image", content: post.image }] : []),
			],
			links: [{ rel: "canonical", href: url }],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BlogPosting",
						headline: post.title,
						description: post.description,
						datePublished: post.date,
						url,
						author: {
							"@type": "Person",
							name: "Habiboulaye",
							url: "https://habiboulaye.dev",
						},
						...(post.image ? { image: post.image } : {}),
						...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
					}),
				},
			],
		};
	},
	component: BlogPostRoute,
});

function BlogPostRoute() {
	const post = Route.useLoaderData();
	const progressBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			const totalScroll = document.documentElement.scrollTop;
			const windowHeight =
				document.documentElement.scrollHeight -
				document.documentElement.clientHeight;
			const scroll = (totalScroll / windowHeight) * 100;
			if (progressBarRef.current) {
				progressBarRef.current.style.width = `${scroll}%`;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<SmoothScroll>
			<div className="portfolio-theme min-h-screen bg-background text-foreground pb-32">
				<CustomCursor />

				{/* Reading Progress Bar */}
				<div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-background">
					<div
						ref={progressBarRef}
						className="h-full bg-primary transition-all duration-150 ease-out"
						style={{ width: "0%" }}
					/>
				</div>

				{/* Back Link */}
				<div className="fixed top-8 left-6 md:left-12 z-40">
					<Link
						to="/blog"
						className="font-mono-data text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-surface-border"
						data-cursor="link"
					>
						&larr; BLOG
					</Link>
				</div>

				<main className="mx-auto max-w-3xl px-6 pt-40 md:px-12">
					{/* Header */}
					<header className="mb-16 border-b border-surface-border pb-12">
						<div className="font-mono-data mb-6 flex items-center gap-4 text-[11px] uppercase tracking-widest text-primary">
							<span>{formatDate(post.date)}</span>
							<span className="h-1 w-1 rounded-full bg-surface-border" />
							<span>{post.readingTime} READ</span>
						</div>

						<h1 className="font-display text-[clamp(40px,5vw,80px)] leading-[1.1] uppercase tracking-tight text-foreground">
							{post.title}
						</h1>

						{post.tags.length > 0 && (
							<div className="mt-6 flex flex-wrap gap-3">
								{post.tags.map((tag) => (
									<span
										key={tag}
										className="font-mono-data text-[11px] uppercase tracking-widest text-text-secondary border border-surface-border px-3 py-1"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</header>

					{/* Article Content */}
					<article
						className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-foreground
              prose-p:font-editorial prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground md:prose-p:text-xl
              prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:text-primary prose-code:bg-surface-hover prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-surface-border prose-pre:rounded-none
              prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-blockquote:font-editorial
              prose-table:font-mono-data prose-table:text-sm
              prose-th:text-foreground prose-th:uppercase prose-th:tracking-wider prose-th:text-xs prose-th:border-surface-border
              prose-td:border-surface-border prose-td:text-muted-foreground
              prose-img:border prose-img:border-surface-border prose-img:rounded-none
              prose-hr:border-surface-border"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>

					{/* Footer nav */}
					<nav className="mt-24 border-t border-surface-border pt-12 flex justify-between items-center">
						<Link
							to="/blog"
							className="font-mono-data text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
							data-cursor="link"
						>
							&larr; ALL POSTS
						</Link>
						<Link
							to="/"
							className="font-mono-data text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
							data-cursor="link"
						>
							HOME &rarr;
						</Link>
					</nav>
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
