import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
import { projects, type Project } from "#/data/projects";

const WorkSection = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selected) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  // Lock scroll when project panel is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selected]);

  const openProject = (project: Project) => {
    setSelected(project);
    window.history.pushState({}, '', `?project=${project.id}`);
  };

  useGSAP(() => {
    const elements = gsap.utils.toArray(".work-reveal");

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

  const handleClose = () => {
    // Manually animate out before unmounting
    gsap.to(".project-modal-bg", { opacity: 0, duration: 0.3 });
    gsap.to(".project-modal-panel", { 
      x: "100%", 
      duration: 0.4, 
      ease: "power3.in",
      onComplete: () => {
        setSelected(null);
        window.history.pushState({}, '', window.location.pathname);
      } 
    });
  };

  // Animate modal in when selected changes
  useGSAP(() => {
    if (selected) {
      gsap.fromTo(".project-modal-bg", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(".project-modal-panel", 
        { x: "100%" }, 
        { x: 0, duration: 0.5, ease: "power3.out" }
      );

      // Trigger media reveal animations
      setTimeout(() => {
        const mediaElements = gsap.utils.toArray(".project-media-reveal");
        mediaElements.forEach((el, i) => {
          gsap.fromTo(el as HTMLElement,
            { y: 40, opacity: 0 },
            {
              scrollTrigger: {
                trigger: el as HTMLElement,
                scroller: ".project-modal-panel", // use the modal panel as the scroller
                start: "top 95%",
                toggleActions: "play none none reverse",
              },
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              delay: i * 0.1,
            }
          );
        });
      }, 400); // slight delay to wait for panel slide
    }
  }, { dependencies: [selected] }); // Removed scope: containerRef because modal is portaled to document.body

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      <section id="work" ref={containerRef} className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20">
        {/* Ghost number */}
        <div className="section-ghost-number absolute right-4 top-8 md:right-12">
          003
        </div>

        <h2 className="work-reveal font-display mb-16 text-[clamp(40px,6vw,80px)] text-foreground">
          SELECTED WORK
        </h2>

        {/* Featured project */}
        {featured && (
          <div
            className="work-reveal project-card-hover mb-4 cursor-pointer border border-surface-border p-6 md:p-10"
            onClick={() => openProject(featured)}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-label text-text-secondary">[{featured.number}] — FEATURED</span>
                <h3 className="font-display mt-2 text-[clamp(32px,5vw,64px)] text-foreground">
                  {featured.title}
                </h3>
                <p className="font-editorial mt-2 max-w-lg text-muted-foreground">
                  {featured.shortDesc}
                </p>
              </div>
              <span className="font-mono-data hidden text-text-secondary md:block">
                {featured.year}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <span key={tag} className="font-mono-data border border-surface-border px-3 py-1 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((project) => (
            <div
              key={project.id}
              className="work-reveal project-card-hover cursor-pointer border border-surface-border p-6"
              onClick={() => openProject(project)}
            >
              <span className="font-mono-label text-text-secondary">[{project.number}]</span>
              <h3 className="font-display mt-2 text-[clamp(24px,3vw,40px)] text-foreground">
                {project.title}
              </h3>
              <p className="font-editorial mt-2 text-sm text-muted-foreground">
                {project.shortDesc}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="font-mono-data text-[11px] text-text-secondary">
                      {tag}{project.tags.indexOf(tag) < Math.min(2, project.tags.length - 1) ? " ·" : ""}
                    </span>
                  ))}
                </div>
                <span className="font-mono-data text-text-secondary">{project.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expanded Panel — portaled to body to escape stacking context */}
      {selected && typeof document !== 'undefined' && createPortal(
        <div className="portfolio-theme contents">
          <div
            className="project-modal-bg fixed inset-0 z-[95] bg-background/80"
            onClick={handleClose}
          />
          <div
            className="project-modal-panel fixed bottom-0 right-0 top-0 z-[96] w-full overflow-y-auto border-l border-surface-border bg-background p-8 md:w-[70vw] md:p-12 lg:p-16"
            data-lenis-prevent="true"
          >
            <button
              onClick={handleClose}
              className="font-mono-label mb-12 text-text-secondary transition-colors hover:text-foreground"
            >
              ← CLOSE
            </button>

            <span className="font-mono-label text-text-secondary">
              [{selected.number}] — {selected.year} — {selected.role}
            </span>
            <h2 className="font-display mt-2 text-[clamp(36px,5vw,72px)] text-foreground">
              {selected.title}
            </h2>

            <div className="mt-12 grid gap-12 md:grid-cols-3">
              <div>
                <span className="font-mono-label mb-3 block text-primary">PROBLEM</span>
                <p className="font-editorial text-sm text-foreground">{selected.problem}</p>
              </div>
              <div>
                <span className="font-mono-label mb-3 block text-primary">APPROACH</span>
                <p className="font-editorial text-sm text-foreground">{selected.approach}</p>
              </div>
              <div>
                <span className="font-mono-label mb-3 block text-primary">OUTCOME</span>
                <p className="font-editorial text-sm text-foreground">{selected.outcome}</p>
              </div>
            </div>

            <div className="mt-12">
              <span className="font-mono-label mb-3 block text-text-secondary">TECH STACK</span>
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag: string) => (
                  <span key={tag} className="font-mono-data border border-surface-border px-3 py-1 text-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 flex gap-6">
              {selected.liveUrl && (
                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  className="font-mono-data text-primary transition-opacity hover:opacity-70"
                >
                  [↗ LIVE SITE]
                </a>
              )}
              {selected.githubUrl && (
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="external"
                  className="font-mono-data text-foreground transition-opacity hover:opacity-70"
                >
                  [⌥ GITHUB]
                </a>
              )}
            </div>

            {/* Media Gallery */}
            {selected.media && selected.media.length > 0 && (
              <div className="mt-20 border-t border-surface-border pt-12">
                <span className="font-mono-label mb-8 block text-primary">VISUALS</span>
                <div className="grid gap-8">
                  {selected.media.map((item, idx) => (
                    <figure key={idx} className="project-media-reveal group relative overflow-hidden border border-surface-border">
                      {item.type === "image" ? (
                        <img 
                          src={item.url} 
                          alt={item.caption || `${selected.title} media`} 
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
        document.body
      )}
    </>
  );
};

export default WorkSection;
