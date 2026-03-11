/**
 * Portfolio Icon Set
 *
 * Custom SVG icons designed for the Swiss Brutalism / Aerospace Precision
 * design system. Thin 1.5px strokes, square linecaps, sharp joins.
 * Inherit currentColor so they respond to parent hover states.
 *
 * All icons render at 16x16 by default. Pass `size` to scale.
 */

interface IconProps {
	size?: number;
	className?: string;
}

export const GithubIcon = ({ size = 16, className }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="square"
		strokeLinejoin="miter"
		className={className}
		aria-hidden="true"
	>
		<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
	</svg>
);

export const LinkedinIcon = ({ size = 16, className }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="square"
		strokeLinejoin="miter"
		className={className}
		aria-hidden="true"
	>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect x="2" y="9" width="4" height="12" />
		<rect x="2" y="2" width="4" height="4" />
	</svg>
);

export const MailIcon = ({ size = 16, className }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="square"
		strokeLinejoin="miter"
		className={className}
		aria-hidden="true"
	>
		<rect x="2" y="4" width="20" height="16" />
		<polyline points="22,4 12,13 2,4" />
	</svg>
);

export const ResumeIcon = ({ size = 16, className }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="square"
		strokeLinejoin="miter"
		className={className}
		aria-hidden="true"
	>
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14,2 14,8 20,8" />
		<line x1="8" y1="13" x2="16" y2="13" />
		<line x1="8" y1="17" x2="13" y2="17" />
	</svg>
);

export const ArrowOutIcon = ({ size = 12, className }: IconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="square"
		strokeLinejoin="miter"
		className={className}
		aria-hidden="true"
	>
		<line x1="7" y1="17" x2="17" y2="7" />
		<polyline points="7,7 17,7 17,17" />
	</svg>
);
