export type ProjectTier = "featured" | "selected";

export type ProjectMedia = {
	type: "image" | "video";
	url: string;
	caption?: string;
};

/**
 * A section in the project modal — an optional intro paragraph followed by
 * optional grouped bullet lists. Either field can be empty; the modal
 * renders whatever is present.
 */
export type ProjectSection = {
	intro?: string;
	groups?: { label?: string; items: string[] }[];
};

export interface Project {
	id: string;
	number: string;
	title: string;
	subtitle?: string;
	year: number;
	role: string;
	company?: string;
	shortDesc: string;
	/** Problem statement — short paragraph, narrative hook. */
	problem: string;
	/** What you built / how you approached it. */
	approach: ProjectSection;
	/** What shipped / what you own / impact. */
	outcome: ProjectSection;
	tags: string[];
	tier: ProjectTier;
	liveUrl?: string;
	githubUrl?: string;
	color: string;
	nda?: boolean;
	metrics?: string[];
	heroMedia?: ProjectMedia;
	media?: ProjectMedia[];
}

const TODO_SECTION: ProjectSection = {
	intro: "TODO — write in Phase 3.",
};

/**
 * Featured projects render large at the top of the Work section, each with
 * a case study modal and (eventually) a Remotion-rendered hero video.
 *
 * Selected projects render below as smaller cards.
 */
export const projects: Project[] = [
	{
		id: "leelu",
		number: "001",
		title: "Leelu",
		subtitle: "AI-augmented recruiting platform",
		year: 2025,
		role: "Full-Stack Engineer",
		company: "Softstandard Solutions",
		shortDesc:
			"Full-stack work on an agentic recruiting platform — sourcing pipelines, AI copilot workflows, candidate lifecycle, and the product surfaces that drive them.",
		problem:
			"Recruiters drown in candidate noise. Sourcing pulls from a dozen disconnected providers, scoring is inconsistent, outreach is manual, and scheduling falls through the cracks. Leelu has to behave like a recruiting team that never sleeps — without becoming another dashboard nobody trusts.",
		approach: {
			intro: "I work across the stack, anchored on the agentic core.",
			groups: [
				{
					label: "Backend",
					items: [
						"Sourcing pipeline unifying LinkedIn, Monster, CareerBuilder, Google X-ray, Crustdata, and Bright Data — per-provider circuit breakers, BullMQ workers",
						"Copilot on LangChain + LangGraph with SSE progress streaming so campaigns feel alive instead of opaque",
						"Candidate scoring, interview scheduling with conflict detection",
						"Stripe-gated billing and AI credit enforcement",
					],
				},
				{
					label: "Frontend",
					items: [
						"Sourcing hub — the product surface that drives the agentic pipeline",
						"Copilot campaigns with live progress and inspectable steps",
						"Candidate pipeline and CRM",
						"Scheduling UI with conflict-aware slot management",
					],
				},
			],
		},
		outcome: {
			intro:
				"Around a thousand commits in over a year, concentrated in the modules the product is sold on. Still shipping.",
			groups: [
				{
					label: "Modules I own",
					items: [
						"Sourcing pipeline (multi-provider + circuit breakers + queues)",
						"Copilot workflows (LangGraph state machines + SSE)",
						"Candidate scoring + lifecycle",
						"Interview scheduling with conflict detection",
					],
				},
			],
		},
		tags: [
			"Node.js",
			"Express",
			"MongoDB",
			"Redis",
			"BullMQ",
			"LangChain",
			"LangGraph",
			"OpenAI",
			"Stripe",
			"React",
			"TypeScript",
			"TanStack Query",
			"shadcn/ui",
		],
		tier: "featured",
		nda: true,
		metrics: [
			"6+ sourcing providers unified",
			"46+ feature modules in the backend monolith",
			"SSE + WebSocket real-time pipelines",
		],
		color: "200 90% 55%",
		heroMedia: { type: "video", url: "/project-videos/leelu.mp4" },
	},
	{
		id: "rtec-campus",
		number: "002",
		title: "RTEC Campus Platform",
		subtitle: "A whole campus, online",
		year: 2025,
		role: "Solo Developer & Founder",
		company: "DWMtec",
		shortDesc:
			"My own product. A campus platform for Rangpur Textile Engineering College — academics, AI study help, an alumni intelligence layer, a resume builder that draws from a student's real campus record, and the social fabric to hold it together. Built solo, end-to-end.",
		problem:
			"A college is a hundred small systems pretending to be one — schedules, notices, lectures, clubs, alumni, jobs, donations, events. Most campuses glue them together with WhatsApp groups, PDF announcements, and Google Forms. The result: nothing connects, nothing accumulates, and students graduate with nothing to show for four years besides a transcript. RTEC is the bet that if you put it all in one place, something more interesting becomes possible.",
		approach: {
			intro:
				"Three features I designed to be genuinely useful, not just present. Around them, a full campus stack.",
			groups: [
				{
					label: "Hero features",
					items: [
						"Notebot — an AI study assistant grounded on a student's own course materials. Three modes: explain a concept at beginner / intermediate / advanced level, summarize any uploaded material, or ask questions answered from a specific document. Per-user quota and optional bring-your-own-key.",
						"Resume builder with experience-driven auto-fill — the moat. The platform already knows your courses, clubs, events, donations, alumni profile, and academic record. The resume builder pulls from that aggregate so a student doesn't fabricate experience, they generate from it. Multiple resumes per user, templates, AI refinement.",
						"Alumni intelligence — not a contact list. Searchable by department, graduation year, company, and location, with statistics on top employers, departments, and graduation-year distributions. Current students can see where their seniors ended up and reach out, in-platform.",
					],
				},
				{
					label: "Also shipped",
					items: [
						"Live streaming, video library, real-time chat over WebSocket",
						"Social feed, groups, messages, mentorship, events, calendar",
						"Departments, faculty, courses, notices, clubs, blood donation, career",
						"Role-aware dashboards for students, faculty, and admins",
						"Admin tooling: alumni, KYC, content moderation, analytics, performance",
						"Installable PWA with offline support and push notifications",
					],
				},
				{
					label: "Stack",
					items: [
						"Frontend: TanStack Start, React 19, TypeScript, Tailwind, Radix UI",
						"Backend: Bun + Express + Drizzle ORM + PostgreSQL, modular per-feature services",
						"Real-time: WebSocket server for chat, streaming, presence",
						"Testing: Vitest + Playwright + Jest, including alumni e2e specs",
					],
				},
			],
		},
		outcome: {
			intro:
				"A college platform that does more than digitize attendance — it makes the four years a student spends here add up to something portable. Still shipping.",
			groups: [
				{
					label: "What this build proves",
					items: [
						"Can ship a multi-role platform solo, end-to-end",
						"Can keep a 40+ route surface area coherent without a team",
						"Comfortable owning the stack — frontend, backend, database, real-time, infra",
						"Can think product, not just feature — the resume builder's moat is the kind of decision a founder makes, not an engineer assigned a ticket",
					],
				},
			],
		},
		tags: [
			"TanStack Start",
			"React 19",
			"TypeScript",
			"Tailwind",
			"Radix UI",
			"Bun",
			"Express",
			"Drizzle ORM",
			"PostgreSQL",
			"WebSocket",
			"PWA",
			"AI / LLM",
			"Vitest",
			"Playwright",
		],
		tier: "featured",
		metrics: [
			"40+ application routes",
			"3 hero features — Notebot, Resume Builder, Alumni Intelligence",
			"Solo build — frontend + backend + DB",
			"Installable as PWA",
		],
		color: "140 70% 45%",
		heroMedia: { type: "video", url: "/project-videos/rtec.mp4" },
	},
	{
		id: "webflow-apps",
		number: "003",
		title: "Webflow Apps",
		subtitle: "Four SaaS products I'm building for Webflow",
		year: 2025,
		role: "Solo Developer",
		shortDesc:
			"A Bun monorepo where I'm building four Webflow Designer Extensions in parallel. Started as an Ideapeel internship side experiment in 2023, grew into a SaaS line I keep coming back to.",
		problem:
			"I wanted to take SaaS seriously — not as something to read about, but something to actually ship. Webflow's extension ecosystem is thin in real places, so it was a good environment to try four small bets at once.",
		approach: {
			intro:
				"Four apps, one monorepo, one developer. Each lives in its own workspace, sharing TypeScript packages and tooling.",
			groups: [
				{
					label: "Apps in the suite",
					items: [
						"ConsentGuard",
						"LaunchGuard",
						"CMS Scaffold",
						"WebCalc",
					],
				},
				{
					label: "Stack",
					items: [
						"Bun monorepo with shared TypeScript packages",
						"Cloudflare Workers + Hono for the API layer",
						"LemonSqueezy for licensing and billing",
						"Webflow Designer Extension SDK for the in-Designer surface",
					],
				},
			],
		},
		outcome: {
			intro:
				"Still shipping. The point isn't any single app — it's that I care about SaaS and I'm willing to put work into it on my own time.",
			groups: [
				{
					label: "What this proves",
					items: [
						"I care about product, not just code",
						"Willing to ship things solo, end-to-end, in parallel with a day job",
						"Comfortable across the stack — Workers, edge DB, billing, licensing, design-tool integration",
						"Three years of follow-through on one idea: from internship plugin to a four-app monorepo",
					],
				},
			],
		},
		tags: [
			"TypeScript",
			"Bun",
			"Turbo Monorepo",
			"Webflow Designer API",
			"Cloudflare Workers",
			"Hono",
			"LemonSqueezy",
			"React",
		],
		tier: "featured",
		metrics: [
			"4 SaaS apps in one monorepo",
			"Started 2023, still building",
			"Solo + on my own time",
		],
		color: "20 90% 55%",
		heroMedia: { type: "video", url: "/project-videos/webflow-apps.mp4" },
	},
	{
		id: "e-examination-pro",
		number: "004",
		title: "E-Examination Pro",
		subtitle: "Bootcamp capstone — online examination platform",
		year: 2024,
		role: "Frontend Lead",
		company: "Programming Hero — bootcamp capstone",
		shortDesc:
			"The team project where I learned what it takes to build a real product. An online examination platform with live exams, role-based dashboards, and a community layer. My first ambitious build, done with classmates.",
		problem:
			"As a Programming Hero capstone, I needed a project that pushed beyond CRUD and tutorials. We picked online examinations — enough surface area to require auth, role-based access, real-time pieces, payments, and PDF generation. The point wasn't the product. The point was: can I lead a small team through something that touches every part of a real web app?",
		approach: {
			intro:
				"Built with classmates over the bootcamp's capstone phase. I led the frontend and owned a lot of the integration work.",
			groups: [
				{
					label: "What we shipped",
					items: [
						"Live exam flow with timed sessions and dynamic question rendering",
						"Role-aware dashboards for students, instructors, and admins",
						"Exam result management with PDF export",
						"Course catalog, blog, forum/community, notices",
						"Stripe integration for paid courses",
					],
				},
				{
					label: "Stack",
					items: [
						"React + Vite, Redux Toolkit, TanStack Query, Tailwind, Material UI",
						"Firebase Authentication",
						"Express + MongoDB backend",
						"@react-pdf/renderer for downloadable results",
					],
				},
			],
		},
		outcome: {
			intro:
				"A team capstone shipped. It's not a product I'm selling — it's the project where I figured out how to work on something large with other people.",
			groups: [
				{
					label: "What this build proves",
					items: [
						"Can lead a team through a multi-month build without it falling apart",
						"Comfortable wiring real concerns — auth, payments, role-based access, PDFs",
						"Honest about scope: this is the early-career build that taught me what production code is, not what I'm shipping today",
					],
				},
			],
		},
		tags: [
			"React",
			"Vite",
			"Redux Toolkit",
			"TanStack Query",
			"Tailwind",
			"Material UI",
			"Firebase",
			"Express",
			"MongoDB",
			"Stripe",
		],
		tier: "featured",
		metrics: [
			"Programming Hero capstone — team project",
			"Frontend lead, ~29% authorship",
			"My first ambitious full-stack build",
		],
		color: "280 60% 55%",
		heroMedia: { type: "video", url: "/project-videos/e-examination-pro.mp4" },
	},
	{
		id: "researchflow",
		number: "005",
		title: "ResearchFlow",
		subtitle: "A tool I'm building for visual researchers",
		year: 2025,
		role: "Solo Developer",
		shortDesc:
			"A side product I'm building solo. A capture-organize-export pipeline for visual researchers, spread across a Chrome extension, a web dashboard, and a Figma plugin. One monorepo, three surfaces.",
		problem:
			"Started this because I wanted a project that wasn't a CRUD app or a landing page — something I'd actually want to use myself. Visual researchers were a clear niche: tools exist for storing inspiration but not for turning it into something you can hand off. So this became the place to try that whole pipeline.",
		approach: {
			intro:
				"Three surfaces, one monorepo, shared TypeScript packages. The interesting part for me is making them all feel like one product.",
			groups: [
				{
					label: "Surfaces",
					items: [
						"Chrome extension — the capture layer",
						"Web dashboard — the organize layer",
						"Figma plugin — a second output surface",
					],
				},
				{
					label: "Stack",
					items: [
						"Bun + Turbo monorepo with a shared package",
						"Vite + React + TypeScript across the surfaces",
						"Drizzle ORM and S3 for the storage layer",
						"Figma Plugin API and Chrome Extensions (Manifest V3)",
					],
				},
			],
		},
		outcome: {
			intro:
				"Active build. Not shipped publicly yet — this is me using a personal project to learn the multi-surface side of product engineering.",
			groups: [
				{
					label: "What this proves",
					items: [
						"Comfortable splitting a single product across browser, web, and design-tool surfaces",
						"Willing to build things I actually want to use, not just things that would look good in a portfolio",
						"Treat side projects with monorepo discipline — shared types, shared tooling, not four disconnected repos",
					],
				},
			],
		},
		tags: [
			"TypeScript",
			"Bun",
			"Turbo Monorepo",
			"Vite",
			"React",
			"Chrome Extensions",
			"Figma Plugin API",
			"Drizzle ORM",
			"S3",
		],
		tier: "featured",
		metrics: [
			"3 surfaces in one monorepo",
			"Solo, in progress",
			"Personal product, not client work",
		],
		color: "320 70% 55%",
		heroMedia: { type: "video", url: "/project-videos/researchflow.mp4" },
	},
	{
		id: "oppora-landing",
		number: "006",
		title: "Oppora",
		subtitle: "Marketing site for a Softstandard product",
		year: 2026,
		role: "Frontend Engineer",
		company: "Softstandard Solutions",
		shortDesc:
			"Marketing site for Oppora, a sister product to Leelu at Softstandard. Next.js, motion-led, live at oppora.ai.",
		problem:
			"Sister product to Leelu, same parent company. The landing site needed to convert without giving away product details that weren't ready to be public.",
		approach: {
			groups: [
				{
					label: "What I worked on",
					items: [
						"Frontend on the marketing site — sections, motion, responsive",
						"Next.js with Turbopack, Radix UI, Tailwind",
						"Intercom messenger integration",
					],
				},
			],
		},
		outcome: {
			intro:
				"Live at oppora.ai. NDA limits how much I'll publish here — happy to talk through specifics in conversation.",
		},
		tags: ["Next.js", "TypeScript", "Tailwind", "Radix UI", "Turbopack"],
		tier: "selected",
		nda: true,
		liveUrl: "https://oppora.ai",
		color: "210 70% 50%",
	},
	{
		id: "bix3-frontend",
		number: "007",
		title: "Bix3 Frontend",
		subtitle: "First full-time role — recruitment marketplace SPA",
		year: 2024,
		role: "Full-Stack Engineer (frontend-heavy)",
		company: "Bluebix",
		shortDesc:
			"My first full-time engineering role. Worked on the Bix3 recruitment marketplace frontend — a large React SPA with role-based dashboards, document handling, and Azure SSO. Night shifts while studying DSA during the day.",
		problem:
			"My first real production codebase, my first real team. The job wasn't just to write code — it was to learn what production code actually means: code review, ticket flow, regressions, and how a team holds a large frontend together.",
		approach: {
			groups: [
				{
					label: "What I worked on",
					items: [
						"Frontend tickets across the Bix3 marketplace SPA",
						"Module work on LinkedIn integrations and search features",
						"Role-based access, document viewing, rich-text editing",
					],
				},
				{
					label: "Stack",
					items: [
						"React (CRA), Ant Design",
						"Azure MSAL for single sign-on",
						"CKEditor, react-doc-viewer",
					],
				},
			],
		},
		outcome: {
			intro:
				"Around 200+ commits over the year. Not the most exciting stack today, but it's where I learned how a real engineering team works.",
		},
		tags: ["React", "Ant Design", "Azure MSAL", "CKEditor"],
		tier: "selected",
		nda: true,
		color: "30 70% 50%",
	},
	{
		id: "medical-insurance-predictor",
		number: "008",
		title: "Medical Insurance Predictor",
		subtitle: "My first deployed ML model",
		year: 2025,
		role: "Solo Developer",
		company: "Phitron AI/ML",
		shortDesc:
			"Final project for Phitron's AI/ML course. A scikit-learn regression model wrapped in a Gradio app and shipped to Hugging Face Spaces. The first model I actually deployed — not just trained in a notebook.",
		problem:
			"Notebook ML is one thing. Getting a model into something a real person can poke at — picking inputs, serializing the model, hosting it, dealing with the deployment platform — is where you actually learn it sticks.",
		approach: {
			groups: [
				{
					label: "What I built",
					items: [
						"Trained a regression model on insurance cost data",
						"Pickled the model and wrote a small inference function",
						"Wrapped it in a Gradio interface with proper input constraints",
						"Deployed to Hugging Face Spaces",
					],
				},
				{
					label: "Stack",
					items: ["Python", "scikit-learn", "Pandas", "Gradio", "Hugging Face Spaces"],
				},
			],
		},
		outcome: {
			intro:
				"Live and pokable. Small project, but the first time I'd taken a model the whole way out.",
		},
		tags: ["Python", "scikit-learn", "Pandas", "Gradio", "Hugging Face Spaces"],
		tier: "selected",
		color: "180 60% 45%",
	},
	{
		id: "manami-fashion",
		number: "009",
		title: "Manami Fashion",
		subtitle: "Marketing site for a Bangladeshi garment factory",
		year: 2024,
		role: "Solo Developer",
		shortDesc:
			"A marketing site for a garment manufacturer. Built in Next.js with a full Radix UI suite — wanted to see how far a small static-feeling site could be pushed with proper component primitives.",
		problem:
			"Garment factories around here usually have either no website or a brochure-page from a decade ago. I took this on partly as client work, partly as an excuse to build a real marketing site at depth.",
		approach: {
			groups: [
				{
					label: "What I built",
					items: [
						"Full marketing site with content sections, navigation, forms",
						"Radix UI primitives wired up across the whole component layer",
						"Responsive, motion-aware, accessible",
					],
				},
				{
					label: "Stack",
					items: ["Next.js", "TypeScript", "Tailwind", "Radix UI"],
				},
			],
		},
		outcome: {
			intro:
				"A complete marketing site at a depth most landing builds skip. Good practice for treating client work like product work.",
		},
		tags: ["Next.js", "TypeScript", "Radix UI", "Tailwind"],
		tier: "selected",
		color: "0 0% 25%",
	},
	{
		id: "figma-audit-plugin",
		number: "010",
		title: "Figma Audit Plugin",
		subtitle: "Design + accessibility auditing inside Figma",
		year: 2024,
		role: "Solo Developer",
		shortDesc:
			"A Figma plugin I built to learn the Plugin API at depth. Runs checks on the active file from inside Figma. Where my interest in Designer-tool extensions started — eventually grew into the Webflow Apps suite.",
		problem:
			"After the Ideapeel internship I wanted to keep building inside design tools — they're a great place to ship small products with a clear audience. This plugin was where I went deeper on the Figma Plugin API.",
		approach: {
			groups: [
				{
					label: "What I built",
					items: [
						"Plugin UI in Preact, packaged with @create-figma-plugin",
						"Audit checks running against the active Figma file",
						"Docker-based dev environment + a real test suite",
					],
				},
				{
					label: "Stack",
					items: [
						"@create-figma-plugin (Preact)",
						"Radix UI + Tailwind for the panel UI",
						"Docker, Vitest, Pino",
					],
				},
			],
		},
		outcome: {
			intro:
				"Built more for the learning than the launch. The design-tool plugin instincts I picked up here are what made the Webflow Apps suite possible later.",
		},
		tags: ["TypeScript", "Preact", "Figma Plugin API", "Tailwind", "Radix UI", "Docker", "Vitest"],
		tier: "selected",
		color: "260 60% 55%",
	},
];
