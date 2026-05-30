import { createPortal } from "react-dom";
import type { Project, ProjectSection } from "#/data/projects";

type WorkProjectModalProps = {
	project: Project | null;
	onClose: () => void;
};

function CaseStudySection({
	label,
	section,
}: {
	label: string;
	section: ProjectSection;
}) {
	const hasIntro = !!section.intro;
	const hasGroups = !!section.groups && section.groups.length > 0;
	if (!hasIntro && !hasGroups) return null;

	const groups = section.groups ?? [];
	// 2+ groups → side-by-side columns on md+
	// 1 group → bullets in a 2-col grid on md+
	const multiGroup = groups.length > 1;

	return (
		<div>
			<span className="font-mono-label mb-3 block text-primary">{label}</span>
			{section.intro && (
				<p className="font-editorial text-base leading-relaxed text-foreground">
					{section.intro}
				</p>
			)}
			{hasGroups && (
				<div
					className={
						multiGroup
							? "mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2"
							: "mt-5"
					}
				>
					{groups.map((group, idx) => (
						<div key={group.label ?? `group-${idx}`}>
							{group.label && (
								<span className="font-mono-label mb-2 block text-[10px] text-text-secondary">
									{group.label}
								</span>
							)}
							<ul
								className={
									multiGroup
										? "space-y-1.5"
										: "grid gap-x-6 gap-y-1.5 md:grid-cols-2"
								}
							>
								{group.items.map((item) => (
									<li
										key={item}
										className="font-editorial text-sm leading-relaxed text-foreground flex gap-2"
									>
										<span
											aria-hidden="true"
											className="font-mono-data text-primary select-none pt-[3px] text-[10px]"
										>
											—
										</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export function WorkProjectModal({ project, onClose }: WorkProjectModalProps) {
	if (!project || typeof document === "undefined") return null;

	const roleLine = [project.role, project.company]
		.filter(Boolean)
		.join(project.company ? " @ " : "");

	return createPortal(
		<div className="portfolio-theme contents">
			<button
				type="button"
				className="project-modal-bg fixed inset-0 z-[95] bg-background/95 backdrop-blur-md"
				onClick={onClose}
				aria-label="Close project details"
			/>
			<div
				className="project-modal-panel fixed bottom-0 right-0 top-0 z-[96] w-full overflow-y-auto border-l border-surface-border bg-background p-8 md:w-[70vw] md:p-12 lg:p-16"
				style={{ overscrollBehavior: "contain" }}
				data-lenis-prevent="true"
			>
				<button
					type="button"
					onClick={onClose}
					className="font-mono-label mb-12 text-text-secondary transition-colors hover:text-foreground"
				>
					{"<-"} CLOSE
				</button>

				<span className="font-mono-label text-text-secondary">
					[{project.number}] - {project.year} - {roleLine}
				</span>
				<h2 className="font-display mt-2 text-[clamp(36px,5vw,72px)] text-foreground">
					{project.title}
				</h2>
				{project.subtitle && (
					<p className="font-editorial mt-2 text-lg text-muted-foreground">
						{project.subtitle}
					</p>
				)}

				{project.heroMedia && (
					<div className="mt-10 border border-surface-border overflow-hidden">
						{project.heroMedia.type === "image" ? (
							<img
								src={project.heroMedia.url}
								alt={`${project.title} hero`}
								className="h-auto w-full object-cover"
							/>
						) : (
							<video
								src={project.heroMedia.url}
								autoPlay
								muted
								loop
								playsInline
								className="h-auto w-full object-cover"
							/>
						)}
					</div>
				)}

				<div className="mt-12 space-y-8 max-w-4xl">
					<div>
						<span className="font-mono-label mb-3 block text-primary">
							PROBLEM
						</span>
						<p className="font-editorial text-base leading-relaxed text-foreground max-w-2xl">
							{project.problem}
						</p>
					</div>
					<CaseStudySection label="APPROACH" section={project.approach} />
					<CaseStudySection label="OUTCOME" section={project.outcome} />
				</div>

				{project.metrics && project.metrics.length > 0 && (
					<div className="mt-12">
						<span className="font-mono-label mb-3 block text-text-secondary">
							METRICS
						</span>
						<ul className="flex flex-wrap gap-2">
							{project.metrics.map((metric) => (
								<li
									key={metric}
									className="font-mono-data border border-surface-border px-3 py-1 text-foreground"
								>
									{metric}
								</li>
							))}
						</ul>
					</div>
				)}

				<div className="mt-12">
					<span className="font-mono-label mb-3 block text-text-secondary">
						TECH STACK
					</span>
					<div className="flex flex-wrap gap-2">
						{project.tags.map((tag) => (
							<span
								key={tag}
								className="font-mono-data border border-surface-border px-3 py-1 text-foreground"
							>
								{tag}
							</span>
						))}
					</div>
				</div>

				<div className="mt-12 flex gap-6">
					{project.liveUrl && (
						<a
							href={project.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							data-cursor="external"
							className="font-mono-data text-primary transition-opacity hover:opacity-70"
						>
							[UP-RIGHT LIVE SITE]
						</a>
					)}
					{project.githubUrl && (
						<a
							href={project.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							data-cursor="external"
							className="font-mono-data text-foreground transition-opacity hover:opacity-70"
						>
							[GITHUB]
						</a>
					)}
					{project.nda && (
						<span className="font-mono-label text-text-ghost">
							[NDA — DETAILS LIMITED]
						</span>
					)}
				</div>

				{project.media && project.media.length > 0 && (
					<div className="mt-20 border-t border-surface-border pt-12">
						<span className="font-mono-label mb-8 block text-primary">
							VISUALS
						</span>
						<div className="grid gap-8">
							{project.media.map((item) => (
								<figure
									key={item.url}
									className="project-media-reveal group relative overflow-hidden border border-surface-border"
								>
									{item.type === "image" ? (
										<img
											src={item.url}
											srcSet={`${item.url.replace(/w=\d+/, "w=640")} 640w, ${item.url.replace(/w=\d+/, "w=960")} 960w, ${item.url.replace(/w=\d+/, "w=1280")} 1280w, ${item.url} 1600w`}
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
											alt={item.caption || `${project.title} media`}
											width={1600}
											height={1000}
											loading="lazy"
											className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
										/>
									) : (
										<video
											src={item.url}
											autoPlay
											muted
											loop
											playsInline
											className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
										/>
									)}
									{item.caption && (
										<figcaption className="font-mono-data border-t border-surface-border bg-surface-strong px-4 py-3 text-[11px] text-muted-foreground">
											{item.caption}
										</figcaption>
									)}
								</figure>
							))}
						</div>
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
