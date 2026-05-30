import { createPortal } from "react-dom";
import { resumeData } from "#/data/resume";

type ResumeExperience = (typeof resumeData.experience)[number];
type ResumeEducation = (typeof resumeData.education)[number];

type AboutResumeModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function AboutResumeModal({ isOpen, onClose }: AboutResumeModalProps) {
	if (!isOpen || typeof document === "undefined") return null;

	return createPortal(
		<div className="portfolio-theme contents">
			<button
				type="button"
				className="resume-modal-bg fixed inset-0 z-[95] bg-background/90 backdrop-blur-sm"
				onClick={onClose}
				aria-label="Close resume preview"
			/>
			<div
				className="resume-modal-panel resume-panel fixed bottom-0 left-0 right-0 z-[96] h-[90vh] overflow-y-auto rounded-t-2xl border-t border-surface-border p-8 md:p-12 lg:p-16"
				style={{ overscrollBehavior: "contain" }}
				data-lenis-prevent="true"
			>
				<div className="mx-auto max-w-3xl pb-24">
					<div className="flex items-start justify-between">
						<button
							type="button"
							onClick={onClose}
							className="font-mono-label text-text-secondary transition-colors hover:text-foreground"
						>
							↓ CLOSE
						</button>
						<a
							href="/resume.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="font-mono-label text-primary transition-colors hover:opacity-70"
						>
							[DOWNLOAD PDF]
						</a>
					</div>

					<div className="mt-16 text-center">
						<h2 className="font-display text-5xl md:text-7xl">
							{resumeData.name}
						</h2>
						<p className="font-mono-data mt-4">{resumeData.title}</p>
					</div>

					<div className="mt-16 space-y-16">
						<div className="flex justify-center gap-6">
							<a
								href={`mailto:${resumeData.email}`}
								className="font-mono-data hover:underline"
							>
								{resumeData.email}
							</a>
							<a
								href={`https://${resumeData.site}`}
								target="_blank"
								rel="noopener noreferrer"
								className="font-mono-data hover:underline"
							>
								{resumeData.site}
							</a>
							<span className="font-mono-data text-muted-foreground">
								{resumeData.location}
							</span>
						</div>

						<div className="border-t border-black/10 pt-12">
							<h3 className="font-mono-label mb-8 tracking-widest text-black/40">
								EXPERIENCE
							</h3>
							<div className="space-y-12">
								{resumeData.experience.map((exp: ResumeExperience) => (
									<div key={`${exp.role}-${exp.company}-${exp.period}`}>
										<div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
											<h4 className="font-display text-2xl">{exp.role}</h4>
											<span className="font-mono-data text-sm opacity-60">
												{exp.period}
											</span>
										</div>
										<p className="font-mono-data mt-1 text-sm opacity-80">
											{exp.company}
										</p>
										<p className="font-editorial mt-4 leading-relaxed opacity-90">
											{exp.description}
										</p>
									</div>
								))}
							</div>
						</div>

						<div className="border-t border-black/10 pt-12">
							<h3 className="font-mono-label mb-8 tracking-widest text-black/40">
								EDUCATION
							</h3>
							{resumeData.education.map((edu: ResumeEducation) => (
								<div
									key={`${edu.degree}-${edu.institution}-${edu.year}`}
									className="mb-6"
								>
									<div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
										<h4 className="font-display text-xl">{edu.degree}</h4>
										<span className="font-mono-data text-sm opacity-60">
											{edu.year}
										</span>
									</div>
									<p className="font-mono-data mt-1 text-sm opacity-80">
										{edu.institution}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}
