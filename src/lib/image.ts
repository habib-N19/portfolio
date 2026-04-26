export function buildUnsplashUrl(url: string, width: number, quality = 75) {
	if (!url.includes("images.unsplash.com")) return url;

	const hasQuery = url.includes("?");
	const base = hasQuery ? url.split("?")[0] : url;
	const query = new URLSearchParams({
		auto: "format,compress",
		fit: "max",
		w: String(width),
		q: String(quality),
	});

	return `${base}?${query.toString()}`;
}

export function buildUnsplashSrcSet(url: string, widths: number[]) {
	if (!url.includes("images.unsplash.com")) return `${url} 1x`;

	return widths
		.map((width) => `${buildUnsplashUrl(url, width)} ${width}w`)
		.join(", ");
}
