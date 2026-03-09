import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
import { resumeData } from "#/data/resume";

const ResumeSection = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray(".resume-reveal");

    elements.forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: i * 0.1,
      });
    });
  }, { scope: containerRef });

  // Handle panel close animation
  const handleClose = () => {
    gsap.to(".resume-modal-bg", { opacity: 0, duration: 0.3 });
    gsap.to(".resume-modal-panel", { 
      y: "100%", 
      opacity: 0, 
      duration: 0.4, 
      ease: "power3.in",
      onComplete: () => setPanelOpen(false) 
    });
  };

  // Animate panel in
  useGSAP(() => {
    if (panelOpen) {
      gsap.fromTo(".resume-modal-bg", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(".resume-modal-panel", 
        { y: "100%", opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, { dependencies: [panelOpen], scope: containerRef });

  return (
    <section id="resume" ref={containerRef} className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12">
        005
      </div>

      <h2 className="resume-reveal font-display mb-16 text-[clamp(40px,6vw,80px)] text-foreground">
        RESUME
      </h2>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: CTA */}
        <div className="resume-reveal">
          <p className="font-editorial content-width text-foreground">
            A structured overview of my experience, education, and technical proficiencies.
            Available as a styled preview or downloadable document.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setPanelOpen(true)}
              className="font-mono-data border border-primary px-6 py-3 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              [PREVIEW RESUME]
            </button>
            <button
              className="font-mono-data border border-surface-border px-6 py-3 text-foreground transition-colors hover:border-foreground"
            >
              [↓ DOWNLOAD PDF]
            </button>
          </div>
        </div>

        {/* Right: inline summary */}
        <div className="resume-reveal space-y-8">
          {/* Experience */}
          <div>
            <span className="font-mono-label mb-4 block text-primary">EXPERIENCE</span>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="mb-6 border-l border-surface-border pl-4">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-display text-xl text-foreground">{exp.role}</h4>
                  <span className="font-mono-data text-text-secondary">{exp.period}</span>
                </div>
                <span className="font-mono-data text-text-secondary">{exp.company} — {exp.location}</span>
                <p className="font-editorial mt-2 text-sm text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <span className="font-mono-label mb-4 block text-primary">EDUCATION</span>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="border-l border-surface-border pl-4">
                <h4 className="font-display text-xl text-foreground">{edu.degree}</h4>
                <span className="font-mono-data text-text-secondary">{edu.institution} — {edu.year}</span>
              </div>
            ))}
          </div>

          {/* Skills summary */}
          <div>
            <span className="font-mono-label mb-4 block text-primary">SKILLS</span>
            <div className="flex flex-wrap gap-2">
              {[...resumeData.skills.languages, ...resumeData.skills.frameworks, ...resumeData.skills.tools].map((skill) => (
                <span key={skill} className="font-mono-data border border-surface-border px-2 py-1 text-[11px] text-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview Panel */}
      {panelOpen && (
        <>
          <div
            className="resume-modal-bg fixed inset-0 z-[95] bg-background/80"
            onClick={handleClose}
          />
          <div
            className="resume-modal-panel resume-panel fixed inset-4 z-[96] overflow-y-auto rounded-sm p-8 md:inset-12 md:p-16"
          >
            <button
              onClick={handleClose}
              className="font-mono-label mb-8 text-neutral-500 transition-colors hover:text-neutral-900"
            >
                ← CLOSE
              </button>

              <div className="mx-auto max-w-2xl">
                <h1 className="font-display text-5xl text-neutral-900">{resumeData.name}</h1>
                <p className="font-mono-data mt-2 text-neutral-500">
                  {resumeData.title} · {resumeData.location} · {resumeData.email}
                </p>

                <div className="mt-12 space-y-10">
                  <div>
                    <h2 className="font-mono-label mb-4 text-neutral-400">EXPERIENCE</h2>
                    {resumeData.experience.map((exp, i) => (
                      <div key={i} className="mb-6">
                        <div className="flex items-baseline justify-between">
                          <strong className="font-editorial text-neutral-900">{exp.role}</strong>
                          <span className="font-mono-data text-xs text-neutral-400">{exp.period}</span>
                        </div>
                        <span className="font-mono-data text-xs text-neutral-500">{exp.company}</span>
                        <p className="font-editorial mt-1 text-sm text-neutral-600">{exp.description}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="font-mono-label mb-4 text-neutral-400">EDUCATION</h2>
                    {resumeData.education.map((edu, i) => (
                      <div key={i}>
                        <strong className="font-editorial text-neutral-900">{edu.degree}</strong>
                        <span className="font-mono-data ml-2 text-xs text-neutral-500">{edu.institution} — {edu.year}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="font-mono-label mb-4 text-neutral-400">SKILLS</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {Object.entries(resumeData.skills).map(([cat, items]) => (
                        <div key={cat}>
                          <span className="font-mono-data text-[10px] uppercase text-neutral-400">{cat}</span>
                          <div className="mt-1 space-y-0.5">
                            {items.map((s) => (
                              <div key={s} className="font-mono-data text-xs text-neutral-700">{s}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ResumeSection;
