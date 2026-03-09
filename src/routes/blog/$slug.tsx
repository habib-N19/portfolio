import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SmoothScroll from "#/components/portfolio/SmoothScroll";
import CustomCursor from "#/components/portfolio/CustomCursor";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const { slug } = Route.useParams();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SmoothScroll>
      <div className="portfolio-theme min-h-screen bg-background text-foreground pb-32">
        <CustomCursor />

        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-background">
          <div
            className="h-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Back Link */}
        <div className="fixed top-8 left-6 md:left-12 z-40">
          <Link
            to="/blog"
            className="font-mono-data text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-surface-border"
            data-cursor="link"
          >
            ← BLOG
          </Link>
        </div>

        <main className="mx-auto max-w-3xl px-6 pt-40 md:px-12">
          {/* Header */}
          <header className="mb-16 border-b border-surface-border pb-12">
            <div className="font-mono-data mb-6 flex items-center gap-4 text-[11px] uppercase tracking-widest text-primary">
              <span>MARCH 01, 2026</span>
              <span className="h-1 w-1 rounded-full bg-surface-border" />
              <span>04 MIN READ</span>
            </div>
            
            <h1 className="font-display text-[clamp(40px,5vw,80px)] leading-[1.1] uppercase tracking-tight text-foreground">
              {slug.replace(/-/g, " ")} 
            </h1>
          </header>

          {/* Article Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div className="font-editorial text-lg leading-relaxed text-muted-foreground md:text-xl">
              <p className="first-letter:float-left first-letter:mr-6 first-letter:text-8xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-primary">
                The web has become homogenous. Standardized frameworks, utility
                classes, and safe design patterns have led to an internet where
                every SaaS product and personal portfolio looks exactly the
                same.
              </p>
              
              <p className="mt-8">
                In 2026, we are seeing a violent pendulum swing back towards authorship. 
                Swiss Brutalism married with Aerospace Precision is the new heuristic for 
                craft. It relies on extremely restrictive typographic scales, raw structural 
                elements, and removing the rounded, soft edges of the previous decade's "friendly" UI paradigm.
              </p>

              <h2 className="font-display mt-16 mb-8 text-3xl uppercase tracking-tight text-foreground">
                The Demise of the Card Widget
              </h2>

              <p>
                To understand this shift, one must look at the over-reliance on the ubiquitous 
                "card" pattern. A drop-shadowed, 8px border-radius white rectangle floating on an 
                off-white background. It signaled safety. It signaled "this is an organized unit of 
                content." But when everything is a card, nothing sits within a true hierarchy.
              </p>

              <p className="mt-8">
                The new spec abandons the card for the table, the rule line, and the raw flex grid. 
                Separation is achieved via explicit borders (1px solid var(--surface-border)) or 
                extreme macro-whitespace, never by artificial elevation shadows.
              </p>
            </div>
          </article>
        </main>
      </div>
    </SmoothScroll>
  );
}
