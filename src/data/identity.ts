/**
 * Identity Config — Single source of truth for personal data.
 *
 * Every component that displays name, role, socials, or tech stack
 * should import from here. Change once, updates everywhere.
 */

export const identity = {
	name: {
		first: "HABIBUR NABI",
		last: "ARAFAT",
		full: "Habibur Nabi Arafat",
		/** Short version for footer / copyright */
		short: "HN. ARAFAT",
	},

	role: "FULL-STACK DEVELOPER",

	tagline:
		"Full-stack developer shipping AI-augmented products at Softstandard, building Webflow SaaS on the side, and running my own campus platform.",

	/** One-line origin note for the about section — surfaces the non-linear path honestly. */
	originNote:
		"Trained as a textile engineer. Self-taught into software in 2023 through a deliberate curriculum (Programming Hero → Phitron) — shipping production code ever since.",

	location: "Dhaka, Bangladesh",

	availability: {
		open: true,
		label: "OPEN TO OPPORTUNITIES",
		/** What you're open to — shown in contact section */
		types: "full-time roles · freelance projects · open source collabs",
	},

	socials: {
		github: {
			handle: "habib-N19",
			url: "https://github.com/habib-N19",
		},
		linkedin: {
			handle: "habib-n19",
			url: "https://www.linkedin.com/in/habib-n19/",
		},
		email: "habiburnabiarafat@gmail.com",
	},

	/** Resume PDF path (served from /public) */
	resumePath: "/resume.pdf",

	/** Primary tech stack shown in hero / overview areas — reflects actual day-to-day work. */
	techStack: [
		"TypeScript",
		"React",
		"Next.js",
		"Node.js",
		"Express",
		"MongoDB",
		"PostgreSQL",
		"Prisma",
	],

	/** Site metadata */
	site: {
		domain: "hn-arafat.dev",
		url: "https://hn-arafat.dev",
	},
} as const;
