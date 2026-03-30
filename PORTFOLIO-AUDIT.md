# Portfolio Audit: habiburnabiarafat

**Date**: March 9, 2026
**Stack**: TanStack Start + React + Vite + Tailwind v4 + GSAP + Three.js + Lenis
**Skills Applied**: TanStack Start Best Practices, SEO Audit, React/Vercel Performance, Frontend Design, Web Interface Guidelines

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [TanStack Start Audit](#2-tanstack-start-audit)
3. [React & Performance Audit](#3-react--performance-audit)
4. [SEO Audit: Landing Page](#4-seo-audit-landing-page)
5. [SEO Audit: Blog System & Writing Strategy](#5-seo-audit-blog-system--writing-strategy)
6. [Hero Section & Content Copywriting Audit](#6-hero-section--content-copywriting-audit)
7. [Section Ordering Recommendation](#7-section-ordering-recommendation)
8. [Frontend Design Audit](#8-frontend-design-audit)
9. [Prioritized Action Plan](#9-prioritized-action-plan)

---

## 1. Executive Summary

The portfolio has a strong visual identity (Swiss Brutalism x Aerospace Precision) and solid foundational tech choices (TanStack Start, React Compiler, Tailwind v4). However, it has critical gaps in **SEO infrastructure**, **performance optimization**, **content strategy**, and **blog system architecture** that will prevent it from achieving its goal as a serious blogging platform.

### Top 5 Priority Issues

| # | Issue | Impact |
|---|-------|--------|
| 1 | Blog system is hardcoded -- no real content pipeline | CRITICAL |
| 2 | No code-splitting for Three.js/GSAP (huge initial bundle) | CRITICAL |
| 3 | Missing sitemap, canonical URLs, structured data, Twitter cards | HIGH |
| 4 | Hero copy is vague -- doesn't tell visitors who you are | HIGH |
| 5 | Section ordering buries blog content and limits discoverability | HIGH |

---

## 2. TanStack Start Audit

### What's Done Right

- **SSR enabled** -- `routeTree.gen.ts:119` confirms `ssr: true`. Good for SEO and initial paint.
- **`defaultPreload: 'intent'`** -- `router.tsx:14`. Route preloading on hover/focus. Correct per `bundle-preload` rule.
- **`scrollRestoration: true`** -- `router.tsx:13`. Prevents scroll position loss on navigation.
- **React Compiler enabled** -- `vite.config.ts:24`. Automatic memoization without manual `useMemo`/`useCallback`.
- **Theme init script prevents FOUC** -- `__root.tsx:28`. Follows `rendering-hydration-no-flicker` pattern exactly.
- **`suppressHydrationWarning`** on `<html>` -- `__root.tsx:105`. Correct for the theme script pattern per `ssr-hydration-safety`.
- **T3 Env validation** -- `env.ts` exists. Follows `env-functions` rule for typed environment variables.

### Issues Found

#### CRITICAL: No `createServerFn` usage anywhere

**Rule violated**: `sf-create-server-fn`
**Location**: Entire codebase
**Problem**: All data is imported as static TypeScript files from `src/data/`. There are zero `createServerFn` calls. While this works for a static portfolio, the blog system *needs* server functions for:
- Fetching blog post content (from MDX files, CMS, or database)
- Generating dynamic OG images
- Contact form submission
- GitHub API integration (currently all mock data in `src/data/github.ts`)

**Fix**: Create `src/lib/blog.functions.ts` and `src/lib/github.functions.ts` with `createServerFn` for data fetching. This keeps the bundle lean and enables dynamic content.

#### HIGH: No file separation convention

**Rule violated**: `file-separation`
**Location**: `src/data/`, `src/db/`
**Problem**: The project has database setup (`src/db/schema.ts`, `src/db/index.ts`) that could accidentally be imported client-side. No `.server.ts` or `.functions.ts` conventions are used.

**Fix**: Rename `src/db/index.ts` to `src/db/index.server.ts`. Create `src/lib/*.functions.ts` for any server functions. Keep shared types in plain `.ts` files.

#### HIGH: Hydration mismatch in ContactSection

**Rule violated**: `ssr-hydration-safety`
**Location**: `src/components/portfolio/ContactSection.tsx:12-21`
**Problem**: `new Date().toLocaleTimeString()` runs during render. Server and client will produce different times, causing a hydration mismatch. React will silently re-render, losing SSR benefits.

**Fix**: Initialize `time` as empty string (already done), but also add `suppressHydrationWarning` on the time element, or defer the entire clock to a client-only component.

#### MEDIUM: No streaming SSR / Suspense boundaries

**Rule violated**: `ssr-streaming`
**Location**: `src/routes/index.tsx`
**Problem**: All 8 sections render eagerly. No Suspense boundaries exist. Once the blog goes dynamic, every section will block the full page render.

**Fix**: Wrap non-critical sections (GitHub, Blog, Resume) in `<Suspense>` boundaries with skeleton fallbacks. Await only hero/about data in the loader.

#### MEDIUM: No static prerendering configured

**Rule violated**: `ssr-prerender`
**Location**: `vite.config.ts`
**Problem**: The landing page and about page are fully static but still SSR on every request. Blog posts (once built) would also benefit from caching.

**Fix**: Add prerender config for `/` and `/about`. For blog posts, use `Cache-Control` headers with `s-maxage` for ISR-like behavior.

#### LOW: Unused integrations bloating the bundle

**Location**: `__root.tsx:111-119`
**Problem**: TanStack Devtools panel and React Query Devtools are rendered in production. PostHog provider wraps everything even without a key. TanStack Query provider wraps the app but is never used.

**Fix**: Conditionally render devtools only in development. Wrap PostHog/Query providers behind feature flags or env checks. Remove TanStack Query provider if not using it for data fetching.

#### LOW: Lenis cleanup bug

**Location**: `src/components/portfolio/SmoothScroll.tsx:33-36`
**Problem**: The cleanup function creates a NEW anonymous arrow function instead of removing the one added on line 24. The original callback is never removed from the GSAP ticker, causing a memory leak.

**Fix**: Store the callback in a variable:
```tsx
const rafCallback = (time: number) => lenis.raf(time * 1000);
gsap.ticker.add(rafCallback);
// cleanup:
gsap.ticker.remove(rafCallback);
```

---

## 3. React & Performance Audit

### CRITICAL: No code-splitting for heavy dependencies

**Rule violated**: `bundle-dynamic-imports`, `bundle-conditional`
**Location**: `src/routes/index.tsx:1-17`

All 16 components are statically imported:
- **Three.js** (`@react-three/fiber`, `three`) -- ~150KB+ gzipped
- **GSAP** (`gsap`, `gsap/ScrollTrigger`) -- ~30KB gzipped
- **Lenis** -- ~10KB gzipped
- All 8 section components with their own GSAP usage

This means every first-time visitor downloads the entire Three.js library before seeing anything.

**Fix**: Use `React.lazy()` for heavy components:
```tsx
const WebGLBackground = lazy(() => import('#/components/portfolio/WebGLBackground'))
const WorkSection = lazy(() => import('#/components/portfolio/WorkSection'))
// etc.
```
Wrap in `<Suspense>` with appropriate skeletons.

### HIGH: WebGL particles run continuously

**Location**: `src/components/portfolio/WebGLBackground.tsx:30-52`
**Problem**: 2000 particles are animated every frame with a `useFrame` loop. This runs even when the user is reading a blog section at the bottom of the page. On mobile, this drains battery.

**Fix**:
1. Reduce particle count (500 is plenty for atmosphere)
2. Pause animation when the component isn't in viewport (IntersectionObserver)
3. Skip on mobile entirely (check `navigator.hardwareConcurrency` or `(pointer: coarse)`)
4. Use `frameloop="demand"` on Canvas and invalidate only when needed

### HIGH: FilmGrain SVG filter on full viewport

**Location**: `src/components/portfolio/FilmGrain.tsx` (z-9999, covers entire page)
**Problem**: An SVG turbulence filter running at full viewport resolution is extremely expensive. Every frame of scrolling forces the browser to re-composite this layer.

**Fix**: Replace SVG filter with a CSS `background-image` using a static noise texture PNG (2-4KB). Apply with `mix-blend-mode: overlay`. Same visual effect, near-zero performance cost.

### HIGH: No `content-visibility` for off-screen sections

**Rule violated**: `rendering-content-visibility`
**Location**: All section components
**Problem**: All 8 full-screen sections render and lay out immediately, even though only 1-2 are visible at a time.

**Fix**: Add CSS to each section:
```css
section[id] {
  content-visibility: auto;
  contain-intrinsic-size: 0 100vh;
}
```
This tells the browser to skip layout/paint for off-screen sections. Massive win for initial render.

### MEDIUM: ScrollProgress uses useState for every scroll pixel

**Rule violated**: `rerender-use-ref-transient-values`
**Location**: `src/routes/blog/$slug.tsx:23-33`
**Problem**: `setScrollProgress()` fires on every scroll event, causing a re-render of the entire blog post page for each pixel scrolled.

**Fix**: Use `useRef` and update the progress bar's `style.width` directly via DOM ref, not state.

### MEDIUM: ContactSection clock causes re-render every second

**Rule violated**: `rerender-use-ref-transient-values`
**Location**: `src/components/portfolio/ContactSection.tsx:12-21`
**Problem**: `setTime()` triggers a re-render of the entire ContactSection (including all GSAP animations) every 1000ms.

**Fix**: Extract the clock into a tiny isolated component that only re-renders itself.

### MEDIUM: `createPortal` SSR guard uses `typeof document`

**Location**: `src/components/portfolio/WorkSection.tsx:170`
**Problem**: `typeof document !== 'undefined'` works but is fragile. TanStack Start's SSR should handle this via conditional rendering in effects.

**Fix**: Move the portal check into a `useEffect` that sets a `mounted` ref, or use `React.lazy` with `ssr: false`.

### LOW: Google Fonts loaded via CSS @import

**Location**: `src/styles.css:1`
**Problem**: CSS `@import` for Google Fonts is render-blocking. The browser must fetch the CSS file, parse it, then fetch the font files, creating a waterfall.

**Fix**: Use `<link rel="preconnect">` and `<link rel="stylesheet">` in the HTML head (via `__root.tsx` head config). Even better: self-host the fonts and use `font-display: swap`.

### LOW: No image optimization strategy

**Location**: Various components
**Problem**: Blog hover images use raw Unsplash URLs. No WebP/AVIF conversion, no responsive `srcset`, no width/height attributes (causes CLS).

**Fix**: Self-host optimized images or use a CDN with transformation (Cloudinary, imgix). Always set width/height or use aspect-ratio CSS.

---

## 4. SEO Audit: Landing Page

### Crawlability & Indexation

| Check | Status | Notes |
|-------|--------|-------|
| robots.txt | PARTIAL | Exists but has no `Sitemap:` directive |
| XML Sitemap | MISSING | No sitemap.xml at all |
| Canonical URLs | MISSING | No `<link rel="canonical">` on any page |
| SSL/HTTPS | UNKNOWN | Placeholder domain `yourportfolio.domain` |
| URL structure | GOOD | Clean: `/`, `/blog`, `/blog/$slug` |
| Internal linking | WEAK | Blog links use `<a href>` not `<Link>` in BlogSection |

### Meta Tags

| Check | Status | Notes |
|-------|--------|-------|
| Title | PARTIAL | `habiburnabiarafat - Creative Developer` -- good but could include a value prop |
| Description | PARTIAL | Generic. Doesn't mention specific skills or what you build |
| OG:title | OK | Matches page title |
| OG:description | OK | Matches meta description |
| OG:image | MISSING | Placeholder URL. No actual OG image exists |
| OG:url | MISSING | Placeholder `https://yourportfolio.domain` |
| Twitter Card | MISSING | No `twitter:card`, `twitter:site`, `twitter:image` |
| Canonical | MISSING | No canonical URL on any page |

### Structured Data (JSON-LD)

**Completely missing.** For a portfolio, you need:

1. **Person schema** -- name, job title, url, social links, image
2. **WebSite schema** -- site name, url
3. **BlogPosting schema** -- for each blog post (title, author, datePublished, image)
4. **BreadcrumbList** -- for blog post pages

### Content Issues

| Issue | Impact | Location |
|-------|--------|----------|
| Single H1 per page | FAIL | Landing page has no `<h1>`. Each section has its own `<h2>` but the hero has none. |
| Heading hierarchy | PARTIAL | Sections jump from section `<h2>` directly to project `<h3>`. OK structure. |
| Keyword targeting | WEAK | No clear primary keyword. "Creative Developer" is in meta but not in visible H1. |
| Alt text on images | FAIL | Blog hover images have `alt=""` (empty). Portrait placeholder has no img. |
| Content depth | WEAK | Landing page is mostly visual. Very little crawlable text content. |

### Specific Fixes Needed

1. **Add sitemap.xml** -- List `/`, `/blog`, and all `/blog/$slug` pages. Reference in robots.txt.
2. **Add canonical URLs** -- Self-referencing on every page.
3. **Add Twitter Card meta** -- `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
4. **Create real OG image** -- 1200x630px. Your name, title, and brand aesthetic.
5. **Fix manifest.json** -- `__root.tsx:76` still says "TanStack App". Change to "habiburnabiarafat".
6. **Add Person JSON-LD** -- On the landing page.
7. **Add BlogPosting JSON-LD** -- On each blog post page.
8. **Add an H1 to the hero** -- The hero display text ("BUILDING THINGS THAT DON'T--") should be wrapped in an `<h1>`.
9. **BlogSection uses `<a>` not `<Link>`** -- `BlogSection.tsx:101` uses raw `<a href>` instead of TanStack Router `<Link>`. This bypasses client-side navigation and loses preloading benefits.

---

## 5. SEO Audit: Blog System & Writing Strategy

### Current State: Broken

The blog system has 3 critical problems:

1. **Inconsistent data sources** -- Landing page `BlogSection` shows 5 posts from `data/blog.ts`. The `/blog` index page shows 2 completely different posts hardcoded inline. These are different articles.
2. **Static content** -- `blog/$slug.tsx` renders the same hardcoded article about brutalist design for every slug. Visiting `/blog/anything` shows identical content.
3. **No content pipeline** -- No MDX, no markdown files, no CMS, no database storage. There's no way to actually write and publish blog posts.

### Recommended Blog Architecture

#### Option A: MDX Files (Recommended for a developer blog)

```
content/
  blog/
    webgl-layer-portfolio.mdx
    gsap-splittext-case-study.mdx
    why-not-nextjs.mdx
```

Use `@mdx-js/rollup` or `@vinxi/mdx` with Vite. Each MDX file gets frontmatter (title, date, tags, description, image) and compiles at build time. Create a `createServerFn` to read and serve the content.

#### Option B: Database (if you want a CMS later)

Use the existing Drizzle + PostgreSQL setup. Create a `posts` table. Build an admin interface or use a headless CMS (Payload, Sanity) that writes to your DB.

### Blog Post SEO Checklist (per article)

Every blog post you write should have:

| Element | Example |
|---------|---------|
| **Title tag** | `Building a WebGL Background in TanStack Start \| habiburnabiarafat` (under 60 chars) |
| **Meta description** | 150-160 chars summarizing the value. Include primary keyword. |
| **OG:image** | Unique per post. 1200x630. Show title + brand. |
| **Canonical URL** | `https://yourdomain.com/blog/webgl-background` |
| **Structured data** | BlogPosting JSON-LD with author, datePublished, image |
| **H1** | One per page, matches the topic |
| **Internal links** | Link to related posts and portfolio sections |
| **Alt text** | Descriptive alt on every image |
| **URL slug** | Descriptive, hyphenated, lowercase |

### Blog Content Strategy

Since you're positioning as a "creative developer," your blog should establish authority in that niche. Here's a topical cluster approach:

#### Pillar Topics (long, comprehensive)
1. **Creative Development** -- "The Creative Developer's Toolkit in 2026"
2. **WebGL/Three.js** -- "WebGL for Web Developers: From Particles to Shaders"
3. **Animation** -- "Web Animation Masterclass: GSAP, CSS, and the Browser"

#### Supporting Posts (link back to pillars)
- "Building This Portfolio's WebGL Background Layer" -> links to WebGL pillar
- "GSAP SplitText: Character Animation Deep Dive" -> links to Animation pillar
- "Why I Chose TanStack Start Over Next.js" -> links to Creative Dev pillar
- "Custom Cursors: 7 Semantic States Explained" -> links to Animation pillar
- "Lenis + GSAP: Smooth Scroll Without the Jank" -> links to Animation pillar
- "Performance-First Portfolio Design" -> links to Creative Dev pillar

#### Writing Format for SEO + Readability

```
# [Clear, keyword-rich title] (H1)

[2-3 sentence intro establishing the problem/hook]
[Primary keyword in first 100 words]

## [Section with H2] 
[Content with code examples, images, demos]

## [Section with H2]
[More content]

## Key Takeaways (or TL;DR)
[Bullet points summarizing value]

---
Related: [link to related post], [link to related post]
```

#### E-E-A-T Signals to Include

- **Experience**: "I built this for my portfolio, here's what happened"
- **Expertise**: Show real code, explain trade-offs, benchmark results
- **Author bio**: Add an author section at the bottom of each post with your photo, links, brief credentials
- **Date**: Always show `datePublished` and `dateModified`

---

## 6. Hero Section & Content Copywriting Audit

### Current Hero Copy

```
BUILDING
THINGS THAT
DON'T--

Creative Developer . Based in Your City
Currently: Available for opportunities
```

### Problems

1. **"BUILDING THINGS THAT DON'T--"** -- The em dash creates intrigue but says nothing. What don't they do? Break? Suck? Ship? A visitor scanning in 3 seconds has no idea what you do or why they should care. Mystery is fine for art; portfolios need clarity.

2. **"Creative Developer"** is overused and vague. It doesn't differentiate you from thousands of other "creative developers."

3. **"Based in Your City"** -- Placeholder. Needs real location.

4. **"Available for opportunities"** -- Passive. Doesn't tell the visitor what kind of opportunities or what value you bring.

5. **No H1 tag** -- The display text is just styled `<span>` elements inside `<SplitText>`. Search engines see no heading.

### Recommended Hero Copy

Your hero should answer 3 questions in under 5 seconds:
1. **Who are you?** (Name/title)
2. **What do you do?** (Specific value)
3. **Why should I care?** (Differentiator)

**Option A: Complete the sentence**
```
BUILDING
INTERFACES THAT
FEEL ALIVE.

habiburnabiarafat -- Full-Stack Developer
React . WebGL . Motion Design
```

**Option B: Direct and specific**
```
habiburnabiarafat
FULL-STACK
DEVELOPER.

Turning complex systems into expressive, high-performance web experiences.
Currently: Open to full-time roles and collabs
```

**Option C: Keep the mystery, add context**
```
BUILDING
THINGS THAT
DON'T EXIST YET.

habiburnabiarafat . Full-Stack Creative Developer . [Your City]
Specializing in WebGL, animation systems, and developer tooling.
```

### About Section Copy

**Current**:
> "I've been writing software for five years. Most of it is invisible infrastructure -- the kind that works until it doesn't. I'm trying to make the invisible feel worth looking at."

**Assessment**: This is actually strong writing. The "invisible infrastructure" metaphor works. However:
- "Five years" is vague. When did you start? What milestone matters?
- The italic quote below it feels like filler. "Every pixel is a decision" is a cliche.

**Recommended edit**:
> "I've been writing software since [year]. I started with invisible infrastructure -- APIs, build pipelines, the things that work until they don't. Now I focus on making those systems *feel* worth looking at: through motion, WebGL, and interfaces that respond to the person using them."

Drop the italic quote entirely. Replace with a specific achievement or philosophy that's uniquely yours.

### Contact Section Copy

**Current**: "LET'S BUILD SOMETHING WORTH SHIPPING."

**Assessment**: Strong CTA. The word "shipping" reinforces a builder identity. Keep it.

**Issues**: All links are placeholders (`yourhandle`, `hello@yourname.dev`). The footer says "YOUR NAME." Fix all of these before launch.

---

## 7. Section Ordering Recommendation

### Current Order

```
1. Hero        (001)
2. About       (002)
3. Work        (003)
4. Timeline    (004)
5. GitHub      (005)
6. Resume      (006)
7. Blog        (007)
8. Contact     (008)
```

### Problems with Current Order

1. **Blog is buried at position 7** -- If you want to be taken seriously as a blogger, blog content should be much higher. Visitors who come for your writing will bounce before reaching it.

2. **Timeline at position 4 is too early** -- Career history is lower-priority content. It's interesting but not what converts visitors or demonstrates current value.

3. **GitHub at position 5 is filler** -- Mock contribution data with `"yourhandle"` adds no value. Even with real data, a heatmap alone doesn't tell a story.

4. **Resume at position 6 is redundant** -- The About section already covers who you are. A downloadable resume link in the header or contact section is sufficient.

5. **Work section before Blog** -- For a portfolio-first site this is fine, but if you're positioning as someone who writes, blog should compete for the #3 slot.

### Recommended Order

```
1. Hero        -- WHO: Identity, value prop, first impression
2. About       -- WHY: Your story, skills, what makes you different
3. Work        -- WHAT: Proof of capability through projects
4. Blog        -- THINK: Your ideas, writing, thought leadership
5. Contact     -- HOW: CTA, availability, links
```

**Removed sections**: Timeline, GitHub, Resume.

**Why remove them:**
- **Timeline** -- Merge key milestones into About section as a brief "Journey" subsection (3-4 bullet points max, not a full section).
- **GitHub** -- Either integrate real GitHub stats as a small widget inside About or Work, or remove entirely. A section of mock data hurts credibility.
- **Resume** -- Add a "Download Resume" button to the About section or the FloatingNav. It doesn't need its own full-screen section.

### Alternative: Keep 6 Sections

If you want more depth:

```
1. Hero
2. About (absorb timeline highlights)
3. Work
4. Blog / Writing
5. GitHub Activity (real data only, small section)
6. Contact (absorb resume download)
```

### Section Transition Logic

Each section should answer a natural follow-up question:

```
Hero:     "Who is this?" -> Scroll
About:    "What can they do?" -> Scroll
Work:     "Show me proof." -> Scroll
Blog:     "How do they think?" -> Scroll
Contact:  "I'm convinced. How do I reach them?"
```

This follows the narrative arc of **Interest -> Credibility -> Proof -> Thought Leadership -> Action**.

---

## 8. Frontend Design Audit

### What's Working

- **Typography system is excellent** -- 4 fonts with specific roles (display, editorial, mono-data, mono-label). Consistent hierarchy.
- **Color palette is distinctive** -- Near-black background with chartreuse accent (#E8FF47) is memorable and avoids the "AI portfolio" aesthetic.
- **Brutalist aesthetic is intentional** -- Ghost numbers, rule lines, uppercase labels, monospace data fields. This has a clear design POV.
- **Interaction design is thoughtful** -- Floating nav with expand-on-hover labels, cursor states, hover image previews on blog posts, project slide-in panel.
- **Accessibility consideration** -- `prefers-reduced-motion` is respected in CSS, touch device detection for custom cursor.

### What Needs Work

#### Loader: Reconsider for repeat visitors

**Location**: `src/components/portfolio/Loader.tsx`
**Issue**: The loading animation (000-100 counter + iris wipe) is impressive but delays content by several seconds on first visit. It uses `sessionStorage` to skip on repeat visits, which means every new tab/session triggers it again.

**Recommendation**: Either make it much shorter (1-1.5s max) or skip it entirely. The content should speak for itself. If you keep it, persist the skip flag in `localStorage` instead of `sessionStorage`.

#### Custom cursor: Consider mobile CLS

**Location**: `src/components/portfolio/CustomCursor.tsx`
**Issue**: The cursor component correctly skips on touch devices, but it renders a full-viewport overlay on desktop. Ensure it doesn't interfere with accessibility (screen readers, keyboard nav).

#### Work section modal: Keyboard trap risk

**Location**: `src/components/portfolio/WorkSection.tsx:170-239`
**Issue**: The slide-in project panel has no focus trap. When open, tab-key navigation can escape behind the modal into the background content.

**Fix**: Add focus trap using `@radix-ui/react-focus-scope` or a simple manual implementation. This is a WCAG requirement for modal dialogs.

#### Blog section: Links bypass router

**Location**: `src/components/portfolio/BlogSection.tsx:101`
**Issue**: Uses `<a href={/blog/${post.id}}>` instead of `<Link to="/blog/$slug" params={{ slug: post.id }}>`. This causes a full page reload instead of client-side navigation, losing the smooth transition and preloading benefits.

#### Ghost numbers: Decorative but indexable

**Location**: All section components
**Issue**: Ghost numbers (001, 002, etc.) are raw text in the DOM. Screen readers will read them. Search engines may index them as content.

**Fix**: Add `aria-hidden="true"` to all ghost number elements.

#### Touch targets: FloatingNav buttons

**Location**: `src/components/portfolio/FloatingNav.tsx:69-92`
**Issue**: Nav buttons have `px-3 py-2` padding. On mobile (when scaled), these may be below the 44x44px minimum touch target. The nav also animates to `scale: 0.85` on scroll, further shrinking targets.

**Fix**: Ensure minimum 44x44px touch targets. Consider hiding the floating nav on very small screens or switching to a hamburger menu.

---

## 9. Prioritized Action Plan

### Phase 1: Critical Fixes (Do Before Launch)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Build a real blog system (MDX or DB-backed) | CRITICAL | HIGH |
| 2 | Replace all placeholder content (name, links, city, email) | CRITICAL | LOW |
| 3 | Add `React.lazy()` + Suspense for WebGLBackground, Three.js, heavy sections | CRITICAL | MEDIUM |
| 4 | Add sitemap.xml and reference in robots.txt | HIGH | LOW |
| 5 | Add canonical URLs on all pages | HIGH | LOW |
| 6 | Add Person + WebSite JSON-LD on landing page | HIGH | LOW |
| 7 | Add BlogPosting JSON-LD on blog pages | HIGH | LOW |
| 8 | Fix hero: add H1 tag, update copy to be specific | HIGH | LOW |
| 9 | Fix manifest.json (still says "TanStack App") | HIGH | LOW |
| 10 | Create real OG image (1200x630) | HIGH | MEDIUM |

### Phase 2: Performance Wins (First Week)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 11 | Replace FilmGrain SVG filter with CSS noise texture | HIGH | LOW |
| 12 | Add `content-visibility: auto` to all sections | HIGH | LOW |
| 13 | Fix Lenis cleanup bug in SmoothScroll.tsx | MEDIUM | LOW |
| 14 | Reduce WebGL particles to 500, pause when off-screen | MEDIUM | MEDIUM |
| 15 | Fix scroll progress bar to use ref instead of state | MEDIUM | LOW |
| 16 | Extract ContactSection clock into isolated component | MEDIUM | LOW |
| 17 | Self-host fonts instead of Google Fonts @import | MEDIUM | MEDIUM |
| 18 | Fix BlogSection to use `<Link>` instead of `<a>` | MEDIUM | LOW |

### Phase 3: SEO & Content (First Month)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 19 | Add Twitter Card meta tags | MEDIUM | LOW |
| 20 | Reorder sections: Hero > About > Work > Blog > Contact | HIGH | MEDIUM |
| 21 | Merge Timeline into About section | MEDIUM | MEDIUM |
| 22 | Remove or rebuild GitHub section with real API data | MEDIUM | MEDIUM |
| 23 | Move Resume to a download button in About/Nav | LOW | LOW |
| 24 | Write first 3 real blog posts with full SEO optimization | HIGH | HIGH |
| 25 | Add author bio component to blog posts | MEDIUM | LOW |
| 26 | Add `aria-hidden="true"` to ghost numbers | LOW | LOW |
| 27 | Add focus trap to Work section project modal | MEDIUM | LOW |
| 28 | Remove unused scaffold files (demo.*, Header.tsx, Footer.tsx, NavLink.tsx) | LOW | LOW |

### Phase 4: Long-Term (Ongoing)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 29 | Set up real GitHub API integration via `createServerFn` | MEDIUM | MEDIUM |
| 30 | Add contact form with server function + rate limiting | MEDIUM | MEDIUM |
| 31 | Configure static prerendering for `/` and `/about` | MEDIUM | LOW |
| 32 | Add RSS feed for blog | MEDIUM | LOW |
| 33 | Strip devtools from production builds | LOW | LOW |
| 34 | Add reading time calculation from actual content length | LOW | LOW |
| 35 | Add related posts component at bottom of each blog post | MEDIUM | MEDIUM |

---

*Generated by auditing against: TanStack Start Best Practices (13 rules), Vercel React Performance (11 rules), SEO Audit Framework, Frontend Design Guidelines, Web Interface Guidelines.*
