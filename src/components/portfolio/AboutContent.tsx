import { identity } from "#/data/identity";
import { type TimelineNode, timelineData } from "#/data/timeline";

const skills = {
	Languages: ["TypeScript", "JavaScript", "Python", "HTML/CSS"],
	Frameworks: ["React", "Next.js", "TanStack", "Node.js", "Express"],
	Data: ["MongoDB", "PostgreSQL", "Prisma", "Mongoose", "Redis"],
	Tooling: ["Docker", "Bun", "Vite", "GraphQL", "CI/CD", "AWS"],
};

function formatYear(node: TimelineNode): string {
	if (node.ongoing) return `${node.startYear}–ongoing`;
	if (node.endYear && node.endYear !== node.startYear) {
		return `${node.startYear}–${node.endYear}`;
	}
	return String(node.startYear);
}

type AboutContentProps = {
	onOpenResume: () => void;
};

export function AboutContent({ onOpenResume }: AboutContentProps) {
	return (
		<div>
			<div className="about-reveal">
				<h2 className="font-display mb-12 text-[clamp(40px,6vw,80px)] text-foreground">
					ABOUT
				</h2>
				<div className="content-width space-y-6 font-editorial text-base leading-[1.72] text-foreground">
					<p>{identity.tagline}</p>
					<p className="text-muted-foreground">{identity.originNote}</p>
					<p className="italic text-muted-foreground">
						I care about the parts of software people actually touch — what they
						see, what they wait for, what frustrates them. The rest is in service
						of that.
					</p>

					<div className="pt-6 flex flex-wrap gap-4">
						<button
							type="button"
							onClick={onOpenResume}
							className="inline-block border border-surface-border bg-background px-6 py-3 font-mono-label text-foreground transition-colors hover:border-primary hover:text-primary"
						>
							[EYE] PREVIEW RESUME
						</button>
						<a
							href="/resume.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block border border-transparent px-6 py-3 font-mono-label text-text-secondary transition-colors hover:text-foreground"
						>
							[DOWN] DOWNLOAD
						</a>
					</div>
				</div>
			</div>

			<div className="about-reveal mt-16">
				<div className="space-y-8">
					{Object.entries(skills).map(([category, items]) => (
						<div key={category}>
							<span className="font-mono-label mb-3 block text-text-secondary">
								{category}
							</span>
							<div className="flex flex-wrap gap-2">
								{items.map((skill) => (
									<div
										key={skill}
										className="skill-node font-mono-data text-foreground"
									>
										{skill}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="about-reveal mt-20 pt-16 border-t border-surface-border">
				<h3 className="font-mono-label text-text-secondary mb-8">
					JOURNEY / MILESTONES
				</h3>
				<div className="space-y-6">
					{timelineData.map((node) => (
						<div
							key={node.id}
							className="grid grid-cols-[100px_1fr] items-start gap-4"
						>
							<div className="font-mono-data text-muted-foreground pt-1 text-xs">
								{formatYear(node)}
							</div>
							<div>
								<span className="font-mono-label text-[10px] text-text-secondary uppercase">
									{node.tag}
									{node.company ? ` · ${node.company}` : ""}
								</span>
								<h4 className="font-display text-2xl text-foreground tracking-wide leading-none mt-1">
									{node.title}
								</h4>
								<p className="font-editorial text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
									{node.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
