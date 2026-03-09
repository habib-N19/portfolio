import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
import { timelineData } from "#/data/timeline";

const tagColors: Record<string, string> = {
  EDUCATION: "text-muted-foreground",
  PROJECT: "text-primary",
  LEARNING: "text-muted-foreground",
  WORK: "text-primary",
  SHIPPED: "text-primary",
  LAUNCH: "text-primary",
};

const tagBorderColors: Record<string, string> = {
  EDUCATION: "border-muted-foreground/30",
  PROJECT: "border-primary/40",
  LEARNING: "border-muted-foreground/30",
  WORK: "border-primary/40",
  SHIPPED: "border-primary/40",
  LAUNCH: "border-primary/60",
};

const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<SVGLineElement>(null);

  useGSAP(() => {
    // Animate the vertical spine line drawing in
    if (spineRef.current) {
      const lineLength = spineRef.current.getTotalLength();
      gsap.set(spineRef.current, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
      });

      gsap.to(spineRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.5,
        },
      });
    }

    // Animate each timeline card
    const cards = gsap.utils.toArray(".timeline-card");
    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      const isLeft = i % 2 === 0;

      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        x: isLeft ? -60 : 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.1,
      });
    });

    // Animate the dots on the spine
    const dots = gsap.utils.toArray(".timeline-dot");
    dots.forEach((dot) => {
      gsap.from(dot as HTMLElement, {
        scrollTrigger: {
          trigger: dot as HTMLElement,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        scale: 0,
        duration: 0.5,
        ease: "back.out(2)",
      });
    });
  }, { scope: containerRef });

  return (
    <section id="timeline" ref={containerRef} className="relative px-6 py-32 md:px-12 lg:px-20">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12">
        004
      </div>

      <h2 className="font-display mb-20 text-[clamp(40px,6vw,80px)] text-foreground">
        TIMELINE
      </h2>

      {/* Timeline container with center spine */}
      <div className="relative mx-auto max-w-5xl">
        {/* Vertical spine SVG */}
        <svg
          className="timeline-spine absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            ref={spineRef}
            x1="1" y1="0" x2="1" y2="100%"
            stroke="hsl(var(--bg-border))"
            strokeWidth="2"
          />
        </svg>

        {/* Timeline nodes */}
        <div className="relative space-y-16 md:space-y-24">
          {timelineData.map((node, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                className={`timeline-card relative flex items-start gap-8 md:gap-12 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div
                  className={`relative w-full md:w-[calc(50%-2rem)] ${
                    isLeft ? "md:text-right" : "md:text-left"
                  }`}
                >
                  {/* Year as ghost background */}
                  <span
                    className={`font-display absolute -top-8 text-[clamp(64px,10vw,120px)] text-text-ghost leading-none select-none pointer-events-none ${
                      isLeft ? "md:right-0" : "md:left-0"
                    } left-0`}
                  >
                    {node.year}
                  </span>

                  {/* Card content */}
                  <div
                    className={`timeline-card-inner relative border border-surface-border bg-[hsl(var(--bg-surface)/0.6)] p-6 md:p-8 transition-all duration-300 hover:border-[hsl(var(--accent-signal)/0.3)] hover:bg-[hsl(var(--bg-surface)/0.9)]`}
                  >
                    <span
                      className={`font-mono-label mb-3 inline-block border px-2 py-0.5 ${
                        tagColors[node.tag] || "text-muted-foreground"
                      } ${tagBorderColors[node.tag] || "border-surface-border"}`}
                    >
                      [{node.tag}]
                    </span>

                    <h3 className="font-display mt-2 text-2xl text-foreground md:text-3xl">
                      {node.title}
                    </h3>

                    <p className="font-editorial mt-3 text-sm text-muted-foreground max-w-sm"
                      style={isLeft ? { marginLeft: "auto" } : {}}
                    >
                      {node.description}
                    </p>
                  </div>
                </div>

                {/* Center dot on spine */}
                <div className="timeline-dot absolute left-1/2 top-8 z-10 -translate-x-1/2 hidden md:flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-surface-border bg-background">
                    <div className="absolute inset-[3px] rounded-full bg-primary opacity-60" />
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
