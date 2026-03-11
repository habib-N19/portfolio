/**
 * Identity Config — Single source of truth for personal data.
 *
 * Every component that displays name, role, socials, or tech stack
 * should import from here. Change once, updates everywhere.
 */

export const identity = {
	name: {
		first: "HABIBOULAYE",
		last: "DIALLO",
		full: "Habiboulaye Diallo",
		/** Short version for footer / copyright */
		short: "H. DIALLO",
	},

	role: "FULL-STACK DEVELOPER",

	tagline:
		"I build web applications with React, TypeScript, and WebGL — focused on performance, accessibility, and interfaces worth interacting with.",

	location: "Your City",

	availability: {
		open: true,
		label: "OPEN TO OPPORTUNITIES",
		/** What you're open to — shown in contact section */
		types: "full-time roles · freelance projects · open source collabs",
	},

	socials: {
		github: {
			handle: "yourhandle",
			url: "https://github.com/yourhandle",
		},
		linkedin: {
			handle: "yourhandle",
			url: "https://linkedin.com/in/yourhandle",
		},
		readcv: {
			handle: "yourhandle",
			url: "https://read.cv/yourhandle",
		},
		email: "hello@yourname.dev",
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
		domain: "habiboulaye.dev",
		url: "https://habiboulaye.dev",
	},
} as const;

export type Identity = typeof identity;
