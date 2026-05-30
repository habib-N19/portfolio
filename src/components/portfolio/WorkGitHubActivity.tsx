import { githubData } from "#/data/github";

export function WorkGitHubActivity() {
	return (
		<div className="work-reveal mt-20 pt-16 border-t border-surface-border">
			<div className="flex items-center justify-between mb-8">
				<h3 className="font-mono-label text-text-secondary">
					OPEN SOURCE / GITHUB
				</h3>
				<a
					href={`https://github/${githubData.username}`}
					target="_blank"
					rel="noopener noreferrer"
					className="font-mono-data text-xs text-primary hover:underline"
				>
					@{githubData.username} {">"}
				</a>
			</div>

			<div className="feature-card border border-surface-border p-8 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div>
						<p className="font-mono-label text-text-secondary mb-1">
							CONTRIBUTIONS
						</p>
						<p className="font-display text-4xl text-foreground">
							{githubData.totalContributions}
						</p>
					</div>
					<div>
						<p className="font-mono-label text-text-secondary mb-1">
							REPOSITORIES
						</p>
						<p className="font-display text-4xl text-foreground">
							{githubData.reposCount}
						</p>
					</div>
					<div>
						<p className="font-mono-label text-text-secondary mb-1">
							COMMITS (YTD)
						</p>
						<p className="font-display text-4xl text-foreground">
							{githubData.commitsThisYear}
						</p>
					</div>
					<div>
						<p className="font-mono-label text-text-secondary mb-1">
							PRS MERGED
						</p>
						<p className="font-display text-4xl text-foreground">
							{githubData.prsMerged}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
