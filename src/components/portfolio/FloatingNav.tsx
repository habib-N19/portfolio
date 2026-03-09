import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const sections = [
  { id: "hero", icon: "◉", label: "Home" },
  { id: "about", icon: "≡", label: "About" },
  { id: "work", icon: "▣", label: "Work" },
  { id: "timeline", icon: "—", label: "Timeline" },
  { id: "resume", icon: "📄", label: "Resume" },
  { id: "blog", icon: "✎", label: "Blog" },
  { id: "contact", icon: "✉", label: "Contact" },
];

const FloatingNav = ({ activeSection }: { activeSection: string }) => {
  const [visible, setVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useGSAP(() => {
    if (visible && navRef.current) {
      gsap.fromTo(
        navRef.current,
        { scale: 0.8, opacity: 0, filter: "blur(10px)" },
        { scale: scrolled ? 0.85 : 1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
      );
    }
  }, { dependencies: [visible], scope: navRef });

  // Update scale on scroll smoothly via GSAP
  useGSAP(() => {
    if (visible && navRef.current) {
      gsap.to(navRef.current, { scale: scrolled ? 0.85 : 1, duration: 0.3, ease: "power2.out" });
    }
  }, { dependencies: [scrolled], scope: navRef });

  return (
    <>
      {visible && (
        <nav
          ref={navRef}
          className="glass-surface fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 rounded-full px-2 py-2"
          style={{ opacity: 0 }} // Hidden initially, GSAP will show it
        >
          <div className="flex items-center gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                onMouseEnter={() => setHoveredItem(section.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative flex items-center gap-2 rounded-full px-3 py-2 transition-colors duration-200"
              >
                <span
                  className={`relative z-10 text-sm transition-colors duration-200 ${
                    activeSection === section.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {section.icon}
                </span>
                
                <span
                  className="relative z-10 overflow-hidden whitespace-nowrap font-mono text-[11px] tracking-widest text-foreground transition-all duration-300 ease-out"
                  style={{
                    maxWidth: hoveredItem === section.id ? 100 : 0,
                    opacity: hoveredItem === section.id ? 1 : 0,
                  }}
                >
                  {section.label}
                </span>

                {activeSection === section.id && (
                  <div
                    className="absolute inset-0 z-0 rounded-full transition-opacity duration-300"
                    style={{ background: "hsl(68 100% 64% / 0.06)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

export default FloatingNav;
