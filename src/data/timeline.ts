export type TimelineTag =
	| "learning"
	| "internship"
	| "work"
	| "building"
	| "shipping";

export interface TimelineNode {
	id: string;
	startYear: number;
	endYear?: number;
	ongoing?: boolean;
	tag: TimelineTag;
	title: string;
	company?: string;
	description: string;
}

export const timelineData: TimelineNode[] = [
	{
		id: "ph-web-dev",
		startYear: 2023,
		tag: "learning",
		title: "Programming Hero — Web Development",
		company: "Programming Hero",
		description:
			"First serious entry into software. HTML, CSS, JavaScript, Node, Express, MongoDB. Built and broke things until the basics felt obvious.",
	},
	{
		id: "ph-next-level",
		startYear: 2023,
		endYear: 2024,
		tag: "learning",
		title: "Programming Hero — Next Level Web Development",
		company: "Programming Hero",
		description:
			"TypeScript, proper MERN, Mongoose, Prisma, Docker, GraphQL, AWS basics, CI/CD. Where the toolkit I still use today was assembled.",
	},
	{
		id: "ideapeel-internship",
		startYear: 2023,
		endYear: 2024,
		tag: "internship",
		title: "First professional role",
		company: "Ideapeel",
		description:
			"Three months at a design agency. Built a Figma plugin and the first sketches of what would later become my Webflow apps line.",
	},
	{
		id: "bluebix-bix3",
		startYear: 2024,
		endYear: 2025,
		tag: "work",
		title: "Full-stack on Bix3 recruitment marketplace",
		company: "Bluebix",
		description:
			"First full-time job — night shift. Shipped on a React/Ant Design SPA over 200+ commits. Real production constraints for the first time.",
	},
	{
		id: "phitron-dsa",
		startYear: 2024,
		endYear: 2025,
		tag: "learning",
		title: "Phitron — Data Structures & Algorithms",
		company: "Phitron",
		description:
			"Days in DSA classes, nights at Bluebix. Closed the gap a self-taught engineer always feels about fundamentals.",
	},
	{
		id: "softstandard",
		startYear: 2025,
		ongoing: true,
		tag: "work",
		title: "Full-stack on Leelu + Oppora",
		company: "Softstandard Solutions",
		description:
			"Current role. Backend pipelines and frontend product surface on Leelu, an AI/agentic recruiting platform. Also shipping Oppora's landing.",
	},
	{
		id: "phitron-ai-ml",
		startYear: 2025,
		ongoing: true,
		tag: "learning",
		title: "Phitron — AI / ML",
		company: "Phitron",
		description:
			"Classical ML through to deployed models. Final project: a medical-insurance cost predictor served from Hugging Face Spaces.",
	},
	{
		id: "own-products",
		startYear: 2025,
		ongoing: true,
		tag: "building",
		title: "RTEC Campus Platform + Webflow Apps monorepo",
		description:
			"Own product work in parallel with the day job. RTEC for a technical college campus. Four Webflow SaaS extensions sharing a Bun monorepo.",
	},
	{
		id: "portfolio-2026",
		startYear: 2026,
		tag: "shipping",
		title: "This portfolio",
		description:
			"You're looking at it. Built to actually represent the work — not as a frame, as the case study itself.",
	},
];
