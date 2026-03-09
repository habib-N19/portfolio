import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const [cursorState, setCursorState] = useState<"default" | "link" | "text" | "external">("default");
  const mouse = useRef({ x: -100, y: -100 });
  const positions = useRef(Array.from({ length: 5 }, () => ({ x: -100, y: -100 })));

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest("a, button, [data-cursor]");
      if (!el) {
        setCursorState("default");
        return;
      }
      const cursorAttr = el.getAttribute("data-cursor");
      if (cursorAttr === "text") setCursorState("text");
      else if (el.getAttribute("target") === "_blank" || cursorAttr === "external") setCursorState("external");
      else setCursorState("link");
    };

    let raf: number;
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }
      // Trail with lerp delay
      for (let i = 0; i < positions.current.length; i++) {
        const target = i === 0 ? mouse.current : positions.current[i - 1];
        const lerp = 0.15 - i * 0.02;
        positions.current[i].x += (target.x - positions.current[i].x) * lerp;
        positions.current[i].y += (target.y - positions.current[i].y) * lerp;
        if (trailRefs.current[i]) {
          trailRefs.current[i].style.transform = `translate(${positions.current[i].x}px, ${positions.current[i].y}px)`;
        }
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const dotSize = cursorState === "link" ? 44 : cursorState === "text" ? 2 : 8;
  const isRing = cursorState === "link" || cursorState === "external";

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]">
      {/* Trail dots */}
      {positions.current.map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 4,
            height: 4,
            background: `hsl(68 100% 64% / ${0.15 - i * 0.025})`,
            top: 0,
            left: 0,
          }}
        />
      ))}
      {/* Main dot */}
      <div
        ref={dotRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,border] duration-200 ease-out flex items-center justify-center"
        style={{
          width: dotSize,
          height: cursorState === "text" ? 24 : dotSize,
          background: isRing ? "transparent" : "hsl(68 100% 64%)",
          border: isRing ? "1.5px solid hsl(68 100% 64%)" : "none",
          borderRadius: cursorState === "text" ? 1 : "50%",
          top: 0,
          left: 0,
        }}
      >
        {cursorState === "external" && (
          <span className="font-mono text-[10px] text-primary">↗</span>
        )}
      </div>
    </div>
  );
};

export default CustomCursor;
