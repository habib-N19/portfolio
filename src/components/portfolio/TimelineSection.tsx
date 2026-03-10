import { useState, useRef, useEffect } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  // Autoplay functionality, pauses on hover
  useEffect(() => {
    if (isHovered) return;

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineData.length);
    }, 4500); // 4.5 seconds per slide is a good pacing for reading

    return () => clearInterval(intervalId);
  }, [isHovered]);

  useGSAP(
    () => {
      // Setup initial reveal
      gsap.from(".timeline-track", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".timeline-node", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.5)",
      });
    },
    { scope: containerRef }
  );

  // Animate content when activeIndex changes
  useGSAP(
    () => {
      if (contentRef.current && ghostRef.current) {
        // Subtle glitch/fade effect on the content card
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 15, rotateX: 5 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "transform",
          }
        );

        // Flash/blur effect on the massive background year
        gsap.fromTo(
          ghostRef.current,
          { opacity: 0, scale: 0.95, filter: "blur(10px)" },
          {
            opacity: 0.05,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "expo.out",
          }
        );
      }
    },
    { dependencies: [activeIndex], scope: containerRef }
  );

  const activeNode = timelineData[activeIndex];

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 py-24 md:px-12 lg:px-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Small Section Number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12" aria-hidden="true">
        004
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-display mb-12 text-[clamp(40px,6vw,80px)] text-foreground">
          TIMELINE
        </h2>

        {/* 1. The Interactive Track (Nodes/Years) */}
        <div className="timeline-track relative mb-16 md:mb-24 flex items-center justify-between border-surface-border">
          {/* Connecting Line behind the nodes */}
          <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-surface-border" />

          {/* Render individual nodes */}
          {timelineData.map((node, i) => {
            const isActive = i === activeIndex;

            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`timeline-node group relative z-10 flex flex-col items-center gap-4 transition-all duration-300 md:px-4 ${
                  isActive ? "scale-110" : "hover:scale-105"
                }`}
                aria-label={`View timeline details for ${node.year}`}
                aria-pressed={isActive}
              >
                {/* Year Label above dot (optional on small screens) */}
                <span
                  className={`font-mono-label absolute bottom-full mb-4 text-xs tracking-widest transition-colors duration-300 md:text-sm ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {node.year}
                </span>

                {/* The Dot */}
                <div
                  className={`relative flex h-4 w-4 items-center justify-center rounded-sm transition-all duration-300 md:h-5 md:w-5 ${
                    isActive
                      ? "bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                      : "bg-background border border-surface-border group-hover:border-muted-foreground group-hover:bg-muted-foreground/20"
                  }`}
                >
                  {/* Inner pulse ring for active */}
                  {isActive && (
                    <div className="absolute inset-0 animate-ping rounded-sm bg-primary/40" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. The Content Panel */}
        <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden">
          {/* Massive background year (Ghost) */}
          <div
            ref={ghostRef}
            className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
            aria-hidden="true"
          >
            <span className="font-display text-[clamp(150px,25vw,400px)] leading-none text-foreground opacity-[0.03]">
              {activeNode.year}
            </span>
          </div>

          {/* Content Card */}
          <div
            ref={contentRef}
            className="relative z-10 w-full max-w-3xl border border-surface-border bg-[hsl(var(--bg-surface)/0.5)] backdrop-blur-xl p-8 md:p-12 transition-all duration-300 hover:border-[hsl(var(--accent-signal)/0.3)] hover:bg-[hsl(var(--bg-surface)/0.8)]"
          >
            {/* Header info: Tag + Floating Year */}
            <div className="mb-6 flex items-start justify-between">
              <span
                className={`font-mono-label inline-block border px-3 py-1 text-sm tracking-wider ${
                  tagColors[activeNode.tag] || "text-muted-foreground"
                } ${tagBorderColors[activeNode.tag] || "border-surface-border"}`}
              >
                [{activeNode.tag}]
              </span>

              {/* Just to reinforce the year conceptually inside the card */}
              <span className="font-mono-label text-muted-foreground/50">
                {activeNode.year} // {timelineData.length - activeIndex}
              </span>
            </div>

            <h3 className="font-display mb-6 text-3xl leading-tight text-foreground md:text-5xl lg:text-6xl">
              {activeNode.title}
            </h3>

            <p className="font-editorial text-base leading-relaxed text-muted-foreground md:text-lg max-w-2xl">
              {activeNode.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
