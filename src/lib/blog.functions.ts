import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAllPosts, getPostBySlug } from "./blog.server";

/**
 * Fetch all published blog posts (metadata only, no HTML content).
 * Used by the blog index page and landing page BlogSection.
 */
export const getPublishedPosts = createServerFn({ method: "GET" }).handler(
	async () => {
		return getAllPosts();
	},
);

/**
 * Fetch a single blog post by slug, including parsed HTML content.
 * Throws notFound() if the slug doesn't match any published post.
 */
export const getPost = createServerFn({ method: "GET" })
	.inputValidator(z.string())
	.handler(async ({ data: slug }) => {
		const post = await getPostBySlug(slug);
		if (!post) {
			throw notFound();
		}
		return post;
	});
