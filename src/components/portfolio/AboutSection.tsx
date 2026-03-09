import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const skills = {
  Languages: ["TypeScript", "Python", "GLSL", "HTML/CSS"],
  Frameworks: ["React", "Next.js", "Three.js", "Node.js"],
  Tools: ["GSAP", "Figma", "Docker", "Vite"],
  Concepts: ["WebGL", "Performance", "Accessibility", "Animation"],
};

const AboutSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Select all elements with the reveal attribute
    const elements = gsap.utils.toArray(".about-reveal");

    elements.forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: "top 85%", // Trigger when the top of the element hits 85% of viewport
          toggleActions: "play none none reverse", // Play on enter, reverse on exit
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: i * 0.1, // Stagger slightly based on DOM order
      });
    });
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12">
        002
      </div>

      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        {/* Portrait placeholder */}
        <div className="about-reveal">
          <div
            className="aspect-[3/4] w-full border border-surface-border"
            style={{
              background: "hsl(var(--bg-surface))",
              filter: "grayscale(100%) contrast(1.1)",
            }}
          >
            <div className="flex h-full items-center justify-center">
              <span className="font-mono-label text-text-ghost">[ YOUR PORTRAIT ]</span>
            </div>
          </div>
          <p className="font-mono-label mt-4 text-text-secondary">
            CREATIVE DEVELOPER — 2026
          </p>
        </div>

        {/* Bio + Skills */}
        <div>
          <div className="about-reveal">
            <h2 className="font-display mb-12 text-[clamp(40px,6vw,80px)] text-foreground">
              ABOUT
            </h2>
            <div className="content-width space-y-6 font-editorial text-base leading-[1.72] text-foreground">
              <p>
                I've been writing software for five years. Most of it is invisible
                infrastructure — the kind that works until it doesn't. I'm trying to
                make the invisible feel worth looking at.
              </p>
              <p className="italic text-muted-foreground">
                The intersection of engineering precision and creative expression is
                where I do my best work. I believe every pixel is a decision, and every
                animation is a conversation with the person experiencing it.
              </p>
            </div>
          </div>

          {/* Skills constellation */}
          <div className="about-reveal mt-16">
            <div className="space-y-8">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <span className="font-mono-label mb-3 block text-text-secondary">
                    {category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <div key={skill} className="skill-node font-mono-data text-foreground">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
