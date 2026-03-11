import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "./SplitText";

const HeroSection = () => {
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 50) setShowScroll(false);
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const containerRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(null);

  useGSAP(() => {
    // Cinematic entrance timeline
    const tl = gsap.timeline({ delay: 0.2 });
    tlRef.current = tl;

    // 1. Reveal the large text character by character
    tl.from(".hero-line .split-char", {
      y: 150, // Move from below
      opacity: 0,
      duration: 1.2,
      stagger: 0.04, // 40ms between each character
      ease: "power4.out",
    });

    // 2. Fade in the meta info
    tl.from(
      ".hero-meta",
      {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.6" // Start before the text finish
    );

    // 3. Fade in the scroll indicator
    tl.from(
      ".hero-scroll",
      {
        opacity: 0,
        duration: 1,
      },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section id="hero" ref={containerRef} className="relative flex min-h-screen flex-col justify-end px-6 pb-16 md:px-12 lg:px-20">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12" aria-hidden="true">
        001
      </div>

      <div className="mb-16 md:mb-24">
        {/* Display lines */}
        <h1>
        <div className="overflow-hidden">
          <SplitText 
            text="BUILDING" 
            className="hero-line font-display text-[clamp(60px,15vw,220px)] leading-[0.92] text-foreground" 
          />
        </div>
        <div className="overflow-hidden">
          <SplitText 
            text="INTERFACES THAT" 
            className="hero-line font-display text-[clamp(60px,15vw,220px)] leading-[0.92] text-foreground" 
          />
        </div>
        <div className="overflow-hidden">
          <SplitText 
            text="FEEL ALIVE." 
            className="hero-line font-display text-[clamp(60px,15vw,220px)] leading-[0.92] text-foreground" 
          />
        </div>
        </h1>

        {/* Meta info */}
        <div className="hero-meta mt-8 space-y-1">
          <p className="font-mono-data text-muted-foreground">
            Habiboulaye · Full-Stack Developer
          </p>
          <p className="font-mono-data text-muted-foreground">
            Specializing in <span className="text-primary">React · WebGL · Motion Design</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
