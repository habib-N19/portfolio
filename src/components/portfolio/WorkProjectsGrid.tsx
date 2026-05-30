import type { Project } from "#/data/projects";

type WorkProjectsGridProps = {
	featured: Project | undefined;
	projects: Project[];
	selected?: Project[];
	onOpenProject: (project: Project) => void;
};

export function WorkProjectsGrid({
	featured,
	projects,
	selected = [],
	onOpenProject,
}: WorkProjectsGridProps) {
	return (
		<>
			{featured && (
				<button
					type="button"
					className="work-reveal relative z-10 project-card-hover mb-4 cursor-pointer border border-surface-border p-6 md:p-10 bg-background/50 backdrop-blur-md w-full text-left"
					onClick={() => onOpenProject(featured)}
					aria-label={`Open featured project ${featured.title}`}
				>
					<div className="flex items-start justify-between">
						<div>
							<span className="font-mono-label text-text-secondary">
								[{featured.number}] - FEATURED
								{featured.company ? ` - ${featured.company.toUpperCase()}` : ""}
							</span>
							<h3 className="font-display mt-2 text-[clamp(32px,5vw,64px)] text-foreground">
								{featured.title}
							</h3>
							{featured.subtitle && (
								<p className="font-mono-label mt-1 text-text-secondary">
									{featured.subtitle}
								</p>
							)}
							<p className="font-editorial mt-3 max-w-lg text-muted-foreground">
								{featured.shortDesc}
							</p>
						</div>
						<span className="font-mono-data hidden text-text-secondary md:block">
							{featured.year}
						</span>
					</div>
					<div className="mt-6 flex flex-wrap gap-2">
						{featured.tags.map((tag) => (
							<span
								key={tag}
								className="font-mono-data border border-surface-border px-3 py-1 text-muted-foreground"
							>
								{tag}
							</span>
						))}
					</div>
				</button>
			)}

			<div className="grid gap-4 md:grid-cols-2">
				{projects.map((project) => (
					<button
						type="button"
						key={project.id}
						className="work-reveal project-card-hover cursor-pointer border border-surface-border p-6 text-left"
						onClick={() => onOpenProject(project)}
						aria-label={`Open project ${project.title}`}
					>
						<span className="font-mono-label text-text-secondary">
							[{project.number}]
							{project.company ? ` - ${project.company.toUpperCase()}` : ""}
						</span>
						<h3 className="font-display mt-2 text-[clamp(24px,3vw,40px)] text-foreground">
							{project.title}
						</h3>
						{project.subtitle && (
							<p className="font-mono-label mt-1 text-text-secondary">
								{project.subtitle}
							</p>
						)}
						<p className="font-editorial mt-2 text-sm text-muted-foreground">
							{project.shortDesc}
						</p>
						<div className="mt-4 flex items-center justify-between">
							<div className="flex flex-wrap gap-1">
								{project.tags.slice(0, 3).map((tag, idx) => (
									<span
										key={tag}
										className="font-mono-data text-[11px] text-text-secondary"
									>
										{tag}
										{idx < Math.min(2, project.tags.length - 1) ? " ." : ""}
									</span>
								))}
							</div>
							<span className="font-mono-data text-text-secondary">
								{project.year}
							</span>
						</div>
					</button>
				))}
			</div>

			{selected.length > 0 && (
				<div className="work-reveal mt-20">
					<h3 className="font-mono-label text-text-secondary mb-6">
						ALSO SHIPPED
					</h3>
					<div className="grid gap-3 md:grid-cols-3">
						{selected.map((project) => (
							<button
								type="button"
								key={project.id}
								className="work-reveal project-card-hover cursor-pointer border border-surface-border p-4 text-left"
								onClick={() => onOpenProject(project)}
								aria-label={`Open project ${project.title}`}
							>
								<span className="font-mono-label text-[10px] text-text-secondary">
									[{project.number}]
									{project.company ? ` - ${project.company.toUpperCase()}` : ""}
								</span>
								<h4 className="font-display mt-2 text-xl text-foreground leading-tight">
									{project.title}
								</h4>
								{project.subtitle && (
									<p className="font-editorial text-xs text-muted-foreground mt-1">
										{project.subtitle}
									</p>
								)}
								<div className="mt-3 flex items-center justify-between">
									<div className="flex flex-wrap gap-1">
										{project.tags.slice(0, 2).map((tag, idx) => (
											<span
												key={tag}
												className="font-mono-data text-[10px] text-text-secondary"
											>
												{tag}
												{idx < Math.min(1, project.tags.length - 1) ? " ." : ""}
											</span>
										))}
									</div>
									<span className="font-mono-data text-[10px] text-text-secondary">
										{project.year}
									</span>
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</>
	);
}
