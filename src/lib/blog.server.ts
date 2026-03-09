import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import readingTime from "reading-time";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPostMeta {
	slug: string;
	title: string;
	date: string;
	description: string;
	tags: string[];
	image: string;
	published: boolean;
	readingTime: string;
	readingTimeMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
	content: string; // HTML string
}

// ─── Config ──────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

const marked = new Marked({
	gfm: true,
	breaks: false,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseFrontmatter(filePath: string): {
	data: Record<string, unknown>;
	content: string;
} {
	const raw = fs.readFileSync(filePath, "utf-8");
	return matter(raw);
}

function formatReadingTime(minutes: number): string {
	const rounded = Math.max(1, Math.ceil(minutes));
	return `${String(rounded).padStart(2, "0")} MIN`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get metadata for all published posts, sorted by date descending.
 * Does NOT include the HTML content — use getPostBySlug for that.
 */
export function getAllPosts(): BlogPostMeta[] {
	if (!fs.existsSync(CONTENT_DIR)) {
		return [];
	}

	const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

	const posts: BlogPostMeta[] = files
		.map((filename) => {
			const slug = filename.replace(/\.md$/, "");
			const filePath = path.join(CONTENT_DIR, filename);
			const { data, content } = parseFrontmatter(filePath);

			const stats = readingTime(content);

			return {
				slug,
				title: (data.title as string) ?? slug,
				date: (data.date as string) ?? "",
				description: (data.description as string) ?? "",
				tags: (data.tags as string[]) ?? [],
				image: (data.image as string) ?? "",
				published: (data.published as boolean) ?? false,
				readingTime: formatReadingTime(stats.minutes),
				readingTimeMinutes: Math.ceil(stats.minutes),
			};
		})
		.filter((post) => post.published)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
}

/**
 * Get a single post by slug, including parsed HTML content.
 * Returns null if the file doesn't exist or isn't published.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const filePath = path.join(CONTENT_DIR, `${slug}.md`);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	const { data, content } = parseFrontmatter(filePath);

	if (!(data.published as boolean)) {
		return null;
	}

	const stats = readingTime(content);
	const html = await marked.parse(content);

	return {
		slug,
		title: (data.title as string) ?? slug,
		date: (data.date as string) ?? "",
		description: (data.description as string) ?? "",
		tags: (data.tags as string[]) ?? [],
		image: (data.image as string) ?? "",
		published: true,
		readingTime: formatReadingTime(stats.minutes),
		readingTimeMinutes: Math.ceil(stats.minutes),
		content: html,
	};
}
