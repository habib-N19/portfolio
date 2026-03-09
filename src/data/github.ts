// GitHub mock data — structured to match the GitHub GraphQL API shape
// Replace with real API calls when GITHUB_TOKEN is configured

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface PinnedRepo {
  name: string;
  description: string;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string };
  url: string;
}

export interface RecentCommit {
  message: string;
  branch: string;
  repo: string;
  date: string; // ISO string
}

export interface GitHubData {
  username: string;
  totalContributions: number;
  reposCount: number;
  commitsThisYear: number;
  prsMerged: number;
  weeks: ContributionWeek[];
  pinnedRepos: PinnedRepo[];
  recentCommits: RecentCommit[];
}

// Generate a realistic contribution calendar (52 weeks × 7 days)
function generateContributionCalendar(): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  const today = new Date();

  for (let w = 51; w >= 0; w--) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));

      // Weighted random: more zeros, occasional bursts
      const rand = Math.random();
      let count = 0;
      if (rand > 0.35) count = 0;
      else if (rand > 0.15) count = Math.floor(Math.random() * 4) + 1;
      else if (rand > 0.05) count = Math.floor(Math.random() * 6) + 4;
      else count = Math.floor(Math.random() * 8) + 8;

      // Weekends are quieter
      if (d === 0 || d === 6) count = Math.floor(count * 0.4);

      days.push({
        contributionCount: count,
        date: date.toISOString().split("T")[0],
      });
    }
    weeks.push({ contributionDays: days });
  }
  return weeks;
}

export const githubData: GitHubData = {
  username: "yourhandle",
  totalContributions: 847,
  reposCount: 34,
  commitsThisYear: 247,
  prsMerged: 12,
  weeks: generateContributionCalendar(),
  pinnedRepos: [
    {
      name: "portfolio-v2",
      description: "Performance-first WebGL + GSAP portfolio. The site IS the case study.",
      stargazerCount: 47,
      primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      url: "https://github.com/yourhandle/portfolio-v2",
    },
    {
      name: "shader-playground",
      description: "Collection of GLSL fragment shaders — noise, distortion, particles.",
      stargazerCount: 23,
      primaryLanguage: { name: "GLSL", color: "#5686a5" },
      url: "https://github.com/yourhandle/shader-playground",
    },
    {
      name: "mono-cms",
      description: "Minimal headless CMS with real-time preview and webhook support.",
      stargazerCount: 89,
      primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      url: "https://github.com/yourhandle/mono-cms",
    },
    {
      name: "scroll-engine",
      description: "Lightweight scroll animation library built on IntersectionObserver.",
      stargazerCount: 31,
      primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
      url: "https://github.com/yourhandle/scroll-engine",
    },
  ],
  recentCommits: [
    {
      message: "feat: add WebGL grain shader overlay",
      branch: "main",
      repo: "portfolio-v2",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      message: "fix: Lenis scroll sync with GSAP ticker",
      branch: "main",
      repo: "portfolio-v2",
      date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      message: "docs: update README with deployment guide",
      branch: "main",
      repo: "mono-cms",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      message: "refactor: extract particle system into module",
      branch: "develop",
      repo: "shader-playground",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      message: "perf: reduce draw calls in scene renderer",
      branch: "main",
      repo: "portfolio-v2",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};
