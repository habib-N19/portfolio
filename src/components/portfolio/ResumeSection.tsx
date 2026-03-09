import { useRef, useState, useEffect } from "react";
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

  // Lock scroll when panel is open — disable ScrollTrigger to prevent background movement
  useEffect(() => {
    if (panelOpen) {
      document.body.style.overflow = "hidden";
      // Disable all ScrollTrigger instances to prevent background scroll
      ScrollTrigger.getAll().forEach((t) => t.disable(false));
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      // Re-enable all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((t) => t.enable());
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => {
      // Cleanup: ensure ScrollTriggers are re-enabled if component unmounts while open
      document.body.style.overflow = "";
      if (panelOpen) {
        ScrollTrigger.getAll().forEach((t) => t.enable());
        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.start();
        }
      }
    };
  }, [panelOpen]);

  return (
    <section id="resume" ref={containerRef} className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12" aria-hidden="true">
        006
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
              onClick={() => window.open("/resume.pdf", "_blank")}
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
            className="resume-modal-bg fixed inset-0 z-[95] bg-background/90 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div
            className="resume-modal-panel resume-panel fixed inset-4 z-[96] overflow-y-auto rounded-sm bg-white p-8 md:inset-12 md:p-16"
            style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
            data-lenis-prevent="true"
          >
            <div className="flex items-center justify-between mb-8 mx-auto max-w-2xl">
              <button
                onClick={handleClose}
                className="font-mono-label text-neutral-500 transition-colors hover:text-neutral-900"
              >
                  ← CLOSE
              </button>
              <button
                onClick={() => window.open("/resume.pdf", "_blank")}
                className="font-mono-label text-primary transition-colors hover:text-black"
              >
                  ↓ DOWNLOAD PDF
              </button>
            </div>
 
               <div className="mx-auto max-w-2xl">
                 <h1 className="font-display text-5xl text-black uppercase tracking-tight">{resumeData.name}</h1>
                 <p className="font-mono-data mt-2 text-neutral-500 uppercase tracking-widest text-[11px]">
                   {resumeData.title} · {resumeData.location} · {resumeData.email}
                 </p>

                <div className="mt-12 space-y-10">
                  <div>
                    <h2 className="font-mono-label mb-6 text-neutral-400 border-b border-neutral-200 pb-2 uppercase tracking-widest text-[11px]">EXPERIENCE</h2>
                    {resumeData.experience.map((exp, i) => (
                      <div key={i} className="mb-8">
                        <div className="flex items-baseline justify-between mb-1">
                          <strong className="font-display text-xl text-black">{exp.role}</strong>
                          <span className="font-mono-data text-[11px] uppercase tracking-widest text-neutral-500">{exp.period}</span>
                        </div>
                        <span className="font-mono-data text-[11px] uppercase tracking-widest text-neutral-500">{exp.company}</span>
                        <p className="font-editorial mt-3 text-sm leading-relaxed text-neutral-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="font-mono-label mb-6 text-neutral-400 border-b border-neutral-200 pb-2 uppercase tracking-widest text-[11px]">EDUCATION</h2>
                    {resumeData.education.map((edu, i) => (
                      <div key={i} className="mb-4">
                        <strong className="font-display text-xl text-black">{edu.degree}</strong>
                        <span className="font-mono-data ml-3 text-[11px] uppercase tracking-widest text-neutral-500">{edu.institution} — {edu.year}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="font-mono-label mb-6 text-neutral-400 border-b border-neutral-200 pb-2 uppercase tracking-widest text-[11px]">SKILLS</h2>
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                      {Object.entries(resumeData.skills).map(([cat, items]) => (
                        <div key={cat}>
                          <span className="font-mono-data text-[10px] uppercase tracking-widest text-neutral-400">{cat}</span>
                          <div className="mt-3 space-y-2">
                            {items.map((s) => (
                              <div key={s} className="font-mono-data text-[11px] tracking-widest uppercase text-neutral-800">{s}</div>
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
