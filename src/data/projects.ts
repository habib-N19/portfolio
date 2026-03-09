export interface Project {
  id: string;
  number: string;
  title: string;
  year: number;
  role: string;
  shortDesc: string;
  problem: string;
  approach: string;
  outcome: string;
  tags: string[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: "kinetic-ui",
    number: "001",
    title: "Kinetic UI System",
    year: 2025,
    role: "Lead Developer",
    shortDesc: "A motion-first component library built for expressive interfaces",
    problem: "Existing component libraries treat animation as an afterthought, bolting motion onto static components rather than designing from motion-first principles.",
    approach: "Built a component system where every element has physics-based defaults — spring tensions, damping ratios, and gesture responses baked into the primitive layer.",
    outcome: "Reduced animation code in consuming apps by 70%. Adopted by 3 internal teams.",
    tags: ["React", "TypeScript", "Framer Motion", "Storybook"],
    featured: true,
    liveUrl: "#",
    githubUrl: "#",
    color: "68 100% 64%",
  },
  {
    id: "void-renderer",
    number: "002",
    title: "Void Renderer",
    year: 2025,
    role: "Creative Developer",
    shortDesc: "Real-time generative visuals responding to audio input",
    problem: "Live performance visuals are typically pre-rendered or use rigid templates that don't respond to the actual energy of the music.",
    approach: "WebGL fragment shaders driven by Web Audio API frequency analysis. Each visual parameter maps to a frequency band with configurable sensitivity curves.",
    outcome: "Used in 2 live performances. 60fps sustained on mid-range hardware.",
    tags: ["WebGL", "GLSL", "Web Audio API", "Three.js"],
    featured: false,
    liveUrl: "#",
    githubUrl: "#",
    color: "280 60% 50%",
  },
  {
    id: "delta-sync",
    number: "003",
    title: "Delta Sync Engine",
    year: 2024,
    role: "Full-Stack Developer",
    shortDesc: "Local-first data synchronization with conflict resolution",
    problem: "Collaborative editing requires real-time sync, but most solutions sacrifice offline capability or conflict resolution quality.",
    approach: "Implemented CRDTs for automatic conflict resolution with a custom sync protocol that batches operations and resolves over WebSocket connections.",
    outcome: "Sub-50ms sync latency. Zero data loss across 10,000+ test conflict scenarios.",
    tags: ["TypeScript", "CRDTs", "WebSocket", "IndexedDB"],
    featured: false,
    githubUrl: "#",
    color: "200 80% 50%",
  },
  {
    id: "terra-map",
    number: "004",
    title: "Terra Mapping Platform",
    year: 2024,
    role: "Frontend Developer",
    shortDesc: "Interactive geospatial data visualization for environmental research",
    problem: "Researchers needed to visualize multi-layered environmental datasets on maps without GIS expertise.",
    approach: "Built a drag-and-drop layer system on top of Mapbox GL with custom WebGL overlay shaders for heatmap and particle flow visualization.",
    outcome: "Adopted by a university research lab. Processing 2M+ data points in real-time.",
    tags: ["React", "Mapbox GL", "WebGL", "D3.js", "Python"],
    featured: false,
    liveUrl: "#",
    githubUrl: "#",
    color: "150 60% 40%",
  },
  {
    id: "mono-cms",
    number: "005",
    title: "Mono CMS",
    year: 2024,
    role: "Solo Developer",
    shortDesc: "A headless CMS designed for developer portfolios",
    problem: "Existing CMSs are either too complex for a portfolio or too simple for structured content like project case studies.",
    approach: "Built a minimal headless CMS with a schema-first approach — define your content model in TypeScript, get a type-safe API and admin UI automatically.",
    outcome: "Open-sourced. 200+ GitHub stars. Powers this portfolio.",
    tags: ["TypeScript", "Node.js", "SQLite", "React"],
    featured: false,
    githubUrl: "#",
    color: "40 80% 55%",
  },
];
