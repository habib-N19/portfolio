import { createFileRoute, Link } from '@tanstack/react-router'
import SmoothScroll from '#/components/portfolio/SmoothScroll'
import CustomCursor from '#/components/portfolio/CustomCursor'

// 2 static placeholder posts as requested
const placeholderPosts = [
  {
    id: "brutalism-in-2026",
    number: "01",
    title: "Why Brutalist Web Design is Dominating 2026",
    date: "MARCH 01, 2026",
    readTime: "04 MIN",
  },
  {
    id: "webgl-performance",
    number: "02",
    title: "Optimizing WebGL Particle Systems for Mobile",
    date: "FEBRUARY 14, 2026",
    readTime: "08 MIN",
  }
];

export const Route = createFileRoute('/blog/')({
  component: BlogIndexRoute,
})

function BlogIndexRoute() {
  return (
    <SmoothScroll>
      <div className="portfolio-theme min-h-screen bg-background text-foreground">
        <CustomCursor />
        
        <main className="px-6 py-32 md:px-12 lg:px-20 mx-auto max-w-7xl">
          <div className="mb-24 flex items-baseline justify-between">
            <h1 className="font-display text-[clamp(48px,8vw,120px)] leading-none text-foreground uppercase tracking-tight">
              WRITING
            </h1>
            <Link to="/" className="font-mono-data text-muted-foreground hover:text-primary transition-colors">
              [← RETURN HOME]
            </Link>
          </div>

          <div className="relative">
            {/* Header row */}
            <div className="font-mono-label mb-4 hidden grid-cols-[60px_1fr_160px_80px] gap-4 border-b border-surface-border pb-3 text-text-secondary md:grid uppercase text-xs">
              <span>NO.</span>
              <span>TITLE</span>
              <span>DATE</span>
              <span className="text-right">READ</span>
            </div>

            {/* Post rows */}
            {placeholderPosts.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.id }}
                className="group relative grid grid-cols-1 gap-2 border-b border-surface-border py-6 transition-colors duration-300 hover:bg-surface-hover md:grid-cols-[60px_1fr_160px_80px] md:items-center md:gap-4 block"
                data-cursor="link"
              >
                <span className="font-mono-data text-text-secondary transition-colors duration-300 group-hover:text-primary">
                  [{post.number}]
                </span>

                <div>
                  <h3 className="font-editorial text-xl md:text-2xl text-foreground transition-colors duration-300 group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="font-mono-data mt-2 text-[11px] text-muted-foreground md:hidden uppercase tracking-widest">
                    {post.date} · {post.readTime}
                  </p>
                </div>

                <span className="font-mono-data hidden text-[11px] uppercase tracking-widest text-text-secondary md:block">
                  {post.date}
                </span>

                <span className="font-mono-data hidden text-[11px] uppercase tracking-widest text-right text-text-secondary md:block">
                  {post.readTime}
                </span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </SmoothScroll>
  )
}
