import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"p",
	"a",
	"strong",
	"em",
	"ul",
	"ol",
	"li",
	"blockquote",
	"code",
	"pre",
	"hr",
	"img",
	"table",
	"thead",
	"tbody",
	"tr",
	"th",
	"td",
	"br",
	"span",
	"div",
];

export function sanitizeBlogHtml(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: {
			a: ["href", "target", "rel", "title"],
			img: ["src", "alt", "title", "width", "height", "loading"],
			code: ["class"],
			pre: ["class"],
			"*": ["id", "class"],
		},
		allowedSchemes: ["http", "https", "mailto"],
		allowProtocolRelative: false,
		transformTags: {
			a: sanitizeHtml.simpleTransform(
				"a",
				{ rel: "noopener noreferrer" },
				true,
			),
		},
	});
}
