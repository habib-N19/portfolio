import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { githubData } from "#/data/github";

gsap.registerPlugin(ScrollTrigger);

// Calculate relative time string
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Get opacity level for contribution count
function getContribLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 0.2;
  if (count <= 5) return 0.5;
  if (count <= 8) return 0.8;
  return 1;
}

const ContributionHeatmap = () => {
  const weeks = githubData.weeks;
  const cellSize = 12;
  const cellGap = 3;
  const totalWidth = weeks.length * (cellSize + cellGap);
  const totalHeight = 7 * (cellSize + cellGap);

  return (
    <div className="github-heatmap overflow-x-auto pb-2">
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="block"
      >
        {weeks.map((week, wi) =>
          week.contributionDays.map((day, di) => {
            const level = getContribLevel(day.contributionCount);
            return (
              <rect
                key={`${wi}-${di}`}
                className="heatmap-cell"
                x={wi * (cellSize + cellGap)}
                y={di * (cellSize + cellGap)}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={
                  level === 0
                    ? "hsl(var(--bg-border))"
                    : `hsl(var(--accent-signal) / ${level})`
                }
                style={{ opacity: 0 }}
              >
                <title>{`${day.date}: ${day.contributionCount} contributions`}</title>
              </rect>
            );
          })
        )}
      </svg>
    </div>
  );
};

const GitHubSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Stagger reveal for heatmap cells
    const cells = gsap.utils.toArray(".heatmap-cell");
    gsap.to(cells, {
      opacity: 1,
      duration: 0.02,
      stagger: {
        each: 0.004,
        from: "start",
      },
      scrollTrigger: {
        trigger: ".github-heatmap",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Reveal other elements
    const reveals = gsap.utils.toArray(".github-reveal");
    reveals.forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: i * 0.08,
      });
    });

    // Animate stat numbers counting up
    const statNumbers = gsap.utils.toArray(".stat-number");
    statNumbers.forEach((el) => {
      const target = el as HTMLElement;

      gsap.from(target, {
        scrollTrigger: {
          trigger: target,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        textContent: 0,
        duration: 1.5,
        ease: "power2.out",
        snap: { textContent: 1 },
        onUpdate: function () {
          target.textContent = Math.round(
            Number(target.textContent) || 0
          ).toString();
        },
      });
    });
  }, { scope: containerRef });

  return (
    <section id="github" ref={containerRef} className="relative px-6 py-32 md:px-12 lg:px-20">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12" aria-hidden="true">
        005
      </div>

      {/* Header */}
      <div className="github-reveal mb-16 flex items-baseline justify-between">
        <h2 className="font-display text-[clamp(40px,6vw,80px)] text-foreground">
          ACTIVITY
        </h2>
        <a
          href={`https://github.com/${githubData.username}`}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="external"
          className="font-mono-data text-muted-foreground transition-colors hover:text-primary"
        >
          GitHub ↗
        </a>
      </div>

      {/* Contribution Heatmap */}
      <div className="github-reveal mb-12">
        <ContributionHeatmap />
      </div>

      {/* Stats Row */}
      <div className="github-reveal mb-16 grid grid-cols-3 gap-8 border-t border-b border-surface-border py-8">
        <div>
          <span
            className="stat-number font-display text-[clamp(32px,5vw,56px)] text-foreground"
            data-value={githubData.reposCount}
          >
            {githubData.reposCount}
          </span>
          <span className="font-mono-label mt-1 block text-muted-foreground">
            REPOS
          </span>
        </div>
        <div>
          <span
            className="stat-number font-display text-[clamp(32px,5vw,56px)] text-foreground"
            data-value={githubData.commitsThisYear}
          >
            {githubData.commitsThisYear}
          </span>
          <span className="font-mono-label mt-1 block text-muted-foreground">
            COMMITS THIS YEAR
          </span>
        </div>
        <div>
          <span
            className="stat-number font-display text-[clamp(32px,5vw,56px)] text-foreground"
            data-value={githubData.prsMerged}
          >
            {githubData.prsMerged}
          </span>
          <span className="font-mono-label mt-1 block text-muted-foreground">
            PRS MERGED
          </span>
        </div>
      </div>

      {/* Pinned Repositories */}
      <div className="github-reveal mb-16">
        <span className="font-mono-label mb-6 block text-primary">
          PINNED REPOSITORIES
        </span>
        <div className="grid gap-4 sm:grid-cols-2">
          {githubData.pinnedRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              className="github-repo-card group border border-surface-border bg-[hsl(var(--bg-surface)/0.4)] p-5 transition-all duration-300 hover:border-[hsl(var(--accent-signal)/0.3)] hover:bg-[hsl(var(--bg-surface)/0.8)]"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-mono-data text-foreground transition-colors group-hover:text-primary">
                  {repo.name}
                </h3>
                <span className="font-mono-data text-text-secondary text-[11px]">
                  ↗
                </span>
              </div>
              <p className="font-editorial mt-2 text-sm text-muted-foreground line-clamp-2">
                {repo.description}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: repo.primaryLanguage.color }}
                  />
                  <span className="font-mono-data text-[11px] text-muted-foreground">
                    {repo.primaryLanguage.name}
                  </span>
                </span>
                <span className="font-mono-data text-[11px] text-muted-foreground">
                  ⭐ {repo.stargazerCount}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Commits */}
      <div className="github-reveal">
        <span className="font-mono-label mb-6 block text-primary">
          RECENT COMMITS
        </span>
        <div className="space-y-0">
          {githubData.recentCommits.map((commit, i) => (
            <div
              key={i}
              className="flex items-baseline gap-4 border-b border-surface-border/50 py-3 last:border-0"
            >
              <span className="font-mono-data text-[11px] text-text-secondary min-w-[4.5rem]">
                {timeAgo(commit.date)}
              </span>
              <span className="font-mono-data text-[12px] text-foreground flex-1 truncate">
                {commit.message}
              </span>
              <span className="font-mono-data text-[11px] text-text-secondary hidden sm:inline">
                {commit.repo}
              </span>
              <span className="font-mono-label text-[10px] text-text-ghost hidden md:inline border border-surface-border px-1.5 py-0.5">
                {commit.branch}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;
