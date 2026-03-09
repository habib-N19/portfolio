import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/** Isolated clock component — only this re-renders every second */
const LiveClock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short"
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return <>{time}</>;
};

const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray(".contact-reveal");

    elements.forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: i * 0.15,
      });
    });
  }, { scope: containerRef });

  return (
    <section id="contact" ref={containerRef} className="relative flex min-h-screen flex-col justify-center px-6 py-32 md:px-12 lg:px-20">
      {/* Ghost number */}
      <div className="section-ghost-number absolute right-4 top-8 md:right-12" aria-hidden="true">
        008
      </div>

      <div className="grid gap-16 lg:grid-cols-2">
        {/* Left: Statement */}
        <div className="contact-reveal">
          <h2 className="font-display text-[clamp(48px,8vw,120px)] leading-[0.92] text-foreground">
            LET'S BUILD
          </h2>
          <h2 className="font-display text-[clamp(48px,8vw,120px)] leading-[0.92] text-foreground">
            SOMETHING
          </h2>
          <h2 className="font-display text-[clamp(48px,8vw,120px)] leading-[0.92] text-foreground">
            WORTH SHIPPING.
          </h2>

          <p className="font-mono-data mt-8 text-muted-foreground">
            Open to: full-time roles · freelance projects · open source collabs
          </p>
        </div>

        {/* Right: Links */}
        <div className="contact-reveal flex flex-col justify-center space-y-6">
          {/* Status */}
          <div className="mb-8 flex items-center gap-3">
            <span className="accent-dot animate-pulse-glow" />
            <span className="font-mono-data text-primary">AVAILABLE FOR OPPORTUNITIES</span>
          </div>

          <a
            href="mailto:hello@yourname.dev"
            className="group flex items-center gap-4 border-b border-surface-border pb-4 transition-colors hover:border-primary"
          >
            <span className="font-mono-data text-muted-foreground">✉</span>
            <span className="font-mono-data text-foreground transition-colors group-hover:text-primary">
              hello@yourname.dev
            </span>
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="external"
            className="group flex items-center gap-4 border-b border-surface-border pb-4 transition-colors hover:border-primary"
          >
            <span className="font-mono-data text-muted-foreground">↗</span>
            <span className="font-mono-data text-foreground transition-colors group-hover:text-primary">
              github.com/yourhandle
            </span>
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="external"
            className="group flex items-center gap-4 border-b border-surface-border pb-4 transition-colors hover:border-primary"
          >
            <span className="font-mono-data text-muted-foreground">↗</span>
            <span className="font-mono-data text-foreground transition-colors group-hover:text-primary">
              linkedin.com/in/yourhandle
            </span>
          </a>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="external"
            className="group flex items-center gap-4 border-b border-surface-border pb-4 transition-colors hover:border-primary"
          >
            <span className="font-mono-data text-muted-foreground">↗</span>
            <span className="font-mono-data text-foreground transition-colors group-hover:text-primary">
              read.cv/yourhandle
            </span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-reveal mt-32 flex flex-wrap items-center justify-between gap-4 border-t border-surface-border pt-8">
        <div className="flex gap-8">
          <span className="font-mono-data text-text-ghost">
            © {new Date().getFullYear()} YOUR NAME
          </span>
          <span className="font-mono-data text-text-ghost" suppressHydrationWarning>
            LOCAL TIME: <LiveClock />
          </span>
        </div>
        <span className="font-mono-data text-text-ghost">
          SPEC v1.0
        </span>
      </footer>
    </section>
  );
};

export default ContactSection;

