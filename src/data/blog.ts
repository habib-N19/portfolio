export interface BlogPost {
	id: string;
	number: string;
	title: string;
	date: string;
	readTime: string;
	excerpt: string;
	imageUrl: string;
	tags: string[];
}

/**
 * Static blog post data used by the landing page BlogSection component.
 * The `id` field must match the markdown filename in content/blog/ (without .md).
 *
 * This is intentionally static — the landing page doesn't use a route loader,
 * and we want zero network requests for the homepage blog preview.
 * The blog index and post pages use server functions instead.
 */
export const blogPosts: BlogPost[] = [
	{
		id: "the-webgl-layer-that-runs-this-portfolio",
		number: "001",
		title: "The WebGL Layer That Runs This Portfolio",
		date: "May 2026",
		readTime: "8 min",
		excerpt:
			"How a fixed canvas, three uniforms, and a particle field create atmosphere without stealing focus from the content.",
		imageUrl:
			"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
		tags: ["WebGL", "GLSL", "Performance"],
	},
	{
		id: "gsap-splittext-a-case-study-in-patience",
		number: "002",
		title: "GSAP SplitText: A Case Study in Patience",
		date: "Apr 2026",
		readTime: "5 min",
		excerpt:
			"Character-level reveals feel magical when timed right and nauseating when timed wrong. Here's where the line is.",
		imageUrl:
			"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
		tags: ["GSAP", "Animation", "UX"],
	},
	{
		id: "why-this-portfolio-isnt-built-with-nextjs",
		number: "003",
		title: "Why This Portfolio Isn't Built With Next.js",
		date: "Mar 2026",
		readTime: "6 min",
		excerpt:
			"A framework decision rationale — what I gained with TanStack Start, what I gave up, and whether I'd do it again.",
		imageUrl:
			"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
		tags: ["Architecture", "TanStack", "React"],
	},
	{
		id: "building-a-custom-cursor-with-semantic-states",
		number: "004",
		title: "Building a Custom Cursor With 7 Semantic States",
		date: "Feb 2026",
		readTime: "7 min",
		excerpt:
			"Most custom cursors are decorative. This one communicates — play icons on video, arrows on external links, text carets on selectable content.",
		imageUrl:
			"https://images.unsplash.com/photo-1550439062-609e1531270e?w=600&h=400&fit=crop",
		tags: ["UI", "Interaction", "CSS"],
	},
	{
		id: "what-i-built-and-why-it-didnt-ship",
		number: "005",
		title: "What I Built and Why It Didn't Ship",
		date: "Jan 2026",
		readTime: "4 min",
		excerpt:
			"Three projects that never made it to production. What went wrong, what I learned, and why showing failure builds more trust than hiding it.",
		imageUrl:
			"https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop",
		tags: ["Career", "Honesty", "Growth"],
	},
];
