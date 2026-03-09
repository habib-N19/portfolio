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

const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    // Calculate how far to move the track
    // We want to translate it left by its total scrollWidth minus the viewport width
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 100);

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1, // Smooth cinematic scrub
      invalidateOnRefresh: true, // Recalculate if window resizes
    });
  }, { scope: containerRef });

  return (
    <section id="timeline" ref={containerRef} className="relative h-screen bg-background">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12 z-10">
        004
      </div>

      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 md:px-12 lg:px-20">
        <h2
          className="font-display mb-16 text-[clamp(40px,6vw,80px)] text-foreground"
        >
          TIMELINE
        </h2>

        {/* Horizontal scroll track */}
        <div className="relative">
          {/* Line */}
          <div className="timeline-line absolute left-0 right-0 top-8" />

          <div ref={trackRef} className="flex gap-0 w-max">
            {timelineData.map((node, i) => (
              <div
                key={i}
                className="relative min-w-[50vw] flex-shrink-0 pr-12 md:min-w-[35vw] md:pr-20"
              >
                {/* Dot on line */}
                <div className="absolute top-6 left-0 h-4 w-4 rounded-full border-2 border-surface-border bg-background">
                  <div className="absolute inset-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="pt-16">
                  <span className="font-display text-[clamp(48px,8vw,96px)] text-text-ghost">
                    {node.year}
                  </span>
                  <span className={`font-mono-label mt-2 block ${tagColors[node.tag] || "text-muted-foreground"}`}>
                    [{node.tag}]
                  </span>
                  <h3 className="font-display mt-2 text-2xl text-foreground md:text-3xl">
                    {node.title}
                  </h3>
                  <p className="font-editorial mt-3 max-w-xs text-sm text-muted-foreground">
                    {node.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
