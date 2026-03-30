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
		"I build web applications with React, TypeScript, and WebGL — focused on performance, accessibility, and interfaces worth interacting with.",

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
		// readcv: {
		// 	handle: "yourhandle",
		// 	url: "https://read.cv/yourhandle",
		// },
		email: "habiburnabiarafat@gmail.com",
	},

	/** Resume PDF path (served from /public) */
	resumePath: "/resume.pdf",

	/** Primary tech stack shown in hero / overview areas */
	techStack: [
		"React",
		"TypeScript",
		"Node.js",
		"WebGL",
		"Three.js",
		"GSAP",
		"PostgreSQL",
		"TanStack",
	],

	/** Site metadata */
	site: {
		domain: "hn-arafat.dev",
		url: "https://hn-arafat.dev",
	},
} as const;

export type Identity = typeof identity;
