export interface TimelineNode {
  year: number;
  tag: string;
  title: string;
  description: string;
}

export const timelineData: TimelineNode[] = [
  {
    year: 2026,
    tag: "LAUNCH",
    title: "This portfolio, v1.0",
    description: "You're looking at it. A creative statement disguised as a developer portfolio. Built with intention, shipped with conviction.",
  },
  {
    year: 2024,
    tag: "SHIPPED",
    title: "Open source contributions",
    description: "Published Mono CMS, contributed to 3 open source projects. Started writing technical blog posts about creative development.",
  },
  {
    year: 2023,
    tag: "WORK",
    title: "First engineering role",
    description: "Joined a product team as a frontend developer. Shipped features used by thousands. Learned what production-grade code actually means.",
  },
  {
    year: 2022,
    tag: "LEARNING",
    title: "Deep dive into WebGL & shaders",
    description: "Self-directed study: Three.js, GLSL shaders, shipped 4 experiments. None in production. All on GitHub.",
  },
  {
    year: 2021,
    tag: "PROJECT",
    title: "First React app shipped",
    description: "Built and deployed a task management app. Learned the hard way that state management is its own discipline.",
  },
  {
    year: 2020,
    tag: "EDUCATION",
    title: "Started CS degree",
    description: "Enrolled in Computer Science. First encounter with algorithms, data structures, and the beauty of computational thinking.",
  },
];
