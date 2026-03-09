---
title: "Why This Portfolio Isn't Built With Next.js"
date: "2026-03-15"
description: "A framework decision rationale — what I gained with TanStack Start, what I gave up, and whether I'd do it again."
tags: ["Architecture", "TanStack", "React"]
image: "/blog/not-nextjs.jpg"
published: true
---

Every junior developer's portfolio is built with Next.js. I know because I've reviewed hundreds of them. The stack is always the same: Next.js, Tailwind, Vercel, maybe a headless CMS. The result is always the same too — fast to deploy, indistinguishable from every other portfolio.

I chose TanStack Start. Here's why.

## The Problem With Default Choices

Next.js is a good framework. It's also the *default* framework, and defaults are dangerous for portfolios. A portfolio exists to demonstrate taste and technical judgment. Using the most popular tool demonstrates neither — it demonstrates that you followed the tutorial.

This isn't framework tribalism. It's a design decision. The framework you choose *is* part of the portfolio.

## What TanStack Start Gives Me

### Type-safe routing from the filesystem

Every route parameter, every search param, every loader return type — fully typed end to end. No `any` casts, no runtime surprises. The `createFileRoute` API generates types from the file path itself.

```typescript
// The slug param is typed automatically from the filename
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    // params.slug is string — guaranteed by the router
    return getPost({ data: params.slug });
  },
})
```

### Server functions that feel like RPC

`createServerFn` lets me write server-side code that the client calls like a regular function. No API routes, no REST conventions, no serialization boilerplate.

```typescript
const getPost = createServerFn({ method: 'GET' })
  .validator(z.string())
  .handler(async ({ data: slug }) => {
    const post = await getPostBySlug(slug);
    if (!post) throw notFound();
    return post;
  });
```

### Full SSR with streaming

The page is server-rendered on first load. The HTML arrives with content already in it — Google can index it, screen readers can parse it, and users on slow connections see content immediately.

## What I Gave Up

- **Ecosystem size.** Next.js has thousands of plugins, examples, and Stack Overflow answers. TanStack Start has a growing but smaller community.
- **Edge runtime.** Next.js on Vercel can run at the edge trivially. TanStack Start's deployment story is more manual.
- **Image optimization.** Next.js `<Image>` component is genuinely excellent. I handle images manually here.

## Would I Do It Again?

Yes. Without hesitation.

The constraints forced better decisions. Without automatic image optimization, I was forced to think about image formats and sizes explicitly. Without a massive plugin ecosystem, I had to understand the underlying APIs. Without the safety net of "just use Next.js," I had to justify every architectural choice.

That's exactly what a portfolio should demonstrate.
