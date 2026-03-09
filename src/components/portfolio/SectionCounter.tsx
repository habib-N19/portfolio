import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const sectionNames: Record<string, string> = {
  hero: "HOME",
  about: "ABOUT",
  work: "WORK",
  timeline: "TIMELINE",
  github: "ACTIVITY",
  resume: "RESUME",
  blog: "BLOG",
  contact: "CONTACT",
};

const sectionNumbers: Record<string, string> = {
  hero: "001",
  about: "002",
  work: "003",
  timeline: "004",
  github: "005",
  resume: "006",
  blog: "007",
  contact: "008",
};

const SectionCounter = ({ activeSection }: { activeSection: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -5 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, { dependencies: [activeSection] });

  return (
    <div className="fixed right-8 top-8 z-[80] hidden md:block" ref={containerRef}>
      <div className="font-mono text-[11px] tracking-[0.15em] text-text-ghost">
        [{sectionNumbers[activeSection] || "001"} / {sectionNames[activeSection] || "HOME"}]
      </div>
    </div>
  );
};

export default SectionCounter;
