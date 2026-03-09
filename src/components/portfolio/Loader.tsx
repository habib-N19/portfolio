import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const [exit, setExit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for repeat visit
    const visited = sessionStorage.getItem("portfolio-visited");
    if (visited) {
      onComplete();
      return;
    }

    const duration = 1600;
    const interval = 16;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out curve for the counter
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.min(100, Math.round(eased * 100)));

      if (step >= steps) {
        clearInterval(timer);
        sessionStorage.setItem("portfolio-visited", "true");
        
        // GSAP animate out
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.6,
            ease: "power3.inOut",
            onComplete: () => {
              setExit(true);
              onComplete();
            }
          });
        } else {
          setExit(true);
          onComplete();
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Skip if repeat visit
  const visited = sessionStorage.getItem("portfolio-visited");
  if (visited) return null;

  if (exit) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <span className="font-mono text-[clamp(48px,10vw,120px)] font-light tracking-wider text-foreground tabular-nums">
        {String(count).padStart(3, "0")}
      </span>
    </div>
  );
};

export default Loader;
