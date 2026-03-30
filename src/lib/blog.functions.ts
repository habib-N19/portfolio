import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { getAllPosts, getPostBySlug } from "./blog.server";

/**
 * Fetch all published blog posts (metadata only, no HTML content).
 * Used by the blog index page and landing page BlogSection.
 */
export const getPublishedPosts = createServerFn({ method: "GET" }).handler(
	async () => {
		// Blog index is semi-static: cache 5 min, serve stale up to 1 hour
		setResponseHeader(
			"Cache-Control",
			"public, s-maxage=300, stale-while-revalidate=3600",
		);
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
		// Individual posts rarely change: cache 10 min, serve stale up to 1 hour
		setResponseHeader(
			"Cache-Control",
			"public, s-maxage=600, stale-while-revalidate=3600",
		);
		return post;
	});
