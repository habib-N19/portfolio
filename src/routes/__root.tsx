import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLocale } from "#/paraglide/runtime";
import PostHogProvider from "../integrations/posthog/provider";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

import { Link } from "@tanstack/react-router";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

const PERSON_JSONLD = JSON.stringify({
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Person",
			name: "habiburnabiarafat",
			url: "https://habiburnabiarafat.dev",
			jobTitle: "Creative Developer",
			sameAs: [],
		},
		{
			"@type": "WebSite",
			name: "habiburnabiarafat",
			url: "https://habiburnabiarafat.dev",
		},
	],
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "habiburnabiarafat - Creative Developer",
			},
			{
				name: "description",
				content:
					"Portfolio of habiburnabiarafat, a creative developer specializing in performant and aesthetic web experiences.",
			},
			{
				property: "og:title",
				content: "habiburnabiarafat - Creative Developer",
			},
			{
				property: "og:description",
				content:
					"Portfolio of habiburnabiarafat, a creative developer specializing in performant and aesthetic web experiences.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:url",
				content: "https://habiburnabiarafat.dev",
			},
			{
				property: "og:image",
				content: "https://habiburnabiarafat.dev/logo512.png",
			},
			{
				property: "og:image:width",
				content: "512",
			},
			{
				property: "og:image:height",
				content: "512",
			},
			// Twitter Card
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "habiburnabiarafat - Creative Developer",
			},
			{
				name: "twitter:description",
				content:
					"Portfolio of habiburnabiarafat, a creative developer specializing in performant and aesthetic web experiences.",
			},
			{
				name: "twitter:image",
				content: "https://habiburnabiarafat.dev/logo512.png",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "canonical",
				href: "https://habiburnabiarafat.dev",
			},
			// Preload critical fonts (above-fold display + mono)
			{
				rel: "preload",
				href: "/fonts/bebas-neue-400-latin.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				href: "/fonts/jetbrains-mono-latin.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			// DNS prefetch for external image CDN
			{
				rel: "dns-prefetch",
				href: "https://images.unsplash.com",
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				children: PERSON_JSONLD,
			},
		],
	}),
	notFoundComponent: () => (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center portfolio-theme">
			<h1 className="font-display mb-4 text-9xl text-foreground">404</h1>
			<p className="font-editorial mb-8 text-xl text-muted-foreground">
				The link you followed may be broken, or the page may have been removed.
			</p>
			<Link
				to="/"
				className="font-mono-data border border-primary px-8 py-3 text-primary transition-colors hover:bg-primary hover:text-black"
			>
				[RETURN TO ORIGIN]
			</Link>
		</div>
	),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body
				className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]"
				suppressHydrationWarning
			>
				<PostHogProvider>
					<TanStackQueryProvider>
						{children}
						{import.meta.env.DEV && <DevtoolsMount />}
					</TanStackQueryProvider>
				</PostHogProvider>
				<Scripts />
			</body>
		</html>
	);
}

function DevtoolsMount() {
	const [state, setState] = useState<{
		TanStackDevtools:
			| (typeof import("@tanstack/react-devtools"))["TanStackDevtools"]
			| null;
		RouterPanel:
			| (typeof import("@tanstack/react-router-devtools"))["TanStackRouterDevtoolsPanel"]
			| null;
		queryDevtools: unknown;
	}>({
		TanStackDevtools: null,
		RouterPanel: null,
		queryDevtools: null,
	});

	useEffect(() => {
		let mounted = true;
		void Promise.all([
			import("@tanstack/react-devtools"),
			import("@tanstack/react-router-devtools"),
			import("../integrations/tanstack-query/devtools"),
		]).then(([reactDevtools, routerDevtools, queryDevtools]) => {
			if (!mounted) return;
			setState({
				TanStackDevtools: reactDevtools.TanStackDevtools,
				RouterPanel: routerDevtools.TanStackRouterDevtoolsPanel,
				queryDevtools: queryDevtools.default,
			});
		});

		return () => {
			mounted = false;
		};
	}, []);

	if (!state.TanStackDevtools || !state.RouterPanel || !state.queryDevtools) {
		return null;
	}

	return (
		<state.TanStackDevtools
			config={{
				position: "bottom-right",
			}}
			plugins={[
				{
					name: "Tanstack Router",
					render: <state.RouterPanel />,
				},
				state.queryDevtools,
			]}
		/>
	);
}
