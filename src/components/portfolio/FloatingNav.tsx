import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Home,
  User,
  Briefcase,
  Clock,
  Github,
  FileText,
  PenTool,
  Mail,
  type LucideIcon,
} from "lucide-react";

const sections: { id: string; icon: LucideIcon; label: string }[] = [
  { id: "hero",     icon: Home,      label: "HOME"    },
  { id: "about",    icon: User,      label: "ABOUT"   },
  { id: "work",     icon: Briefcase, label: "WORK"    },
  { id: "timeline", icon: Clock,     label: "TIME"    },
  { id: "github",   icon: Github,    label: "GITHUB"  },
  { id: "resume",   icon: FileText,  label: "RESUME"  },
  { id: "blog",     icon: PenTool,   label: "BLOG"    },
  { id: "contact",  icon: Mail,      label: "CONTACT" },
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
          className="fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 rounded-full px-2 py-2 bg-[#0e0e0e]/85 backdrop-blur-[12px] border border-white/5"
          style={{ opacity: 0 }} // Hidden initially, GSAP will show it
        >
          <div className="flex items-center gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                onMouseEnter={() => setHoveredItem(section.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative flex items-center gap-2 rounded-full px-3 py-2 transition-colors duration-400"
              >
                <section.icon
                  size={18}
                  strokeWidth={1.8}
                  className={`relative z-10 transition-colors duration-200 ${
                    activeSection === section.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                
                <span
                  className="relative z-10 grid transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  style={{
                    gridTemplateColumns: hoveredItem === section.id ? "1fr" : "0fr",
                    opacity: hoveredItem === section.id ? 1 : 0,
                  }}
                >
                  <span className="overflow-hidden whitespace-nowrap font-mono text-[11px] tracking-widest text-foreground min-w-0">
                    {section.label}
                  </span>
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
