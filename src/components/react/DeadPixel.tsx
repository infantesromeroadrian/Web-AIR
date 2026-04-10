import { useState, useEffect } from "react";

export default function DeadPixel() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Random micro-glitch every 3-8 seconds
    const tick = () => {
      const delay = 3000 + Math.random() * 5000;
      setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 120);
        tick();
      }, delay);
    };
    tick();
  }, []);

  return (
    <a
      href="/Web-AIR/l4tentnoise"
      className="group fixed z-30"
      style={{ top: "47%", right: "12px" }}
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* Dead pixel cluster - 2x2 pixels */}
      <span
        className="block transition-all duration-75"
        style={{
          width: glitch ? "3px" : "2px",
          height: glitch ? "3px" : "2px",
          backgroundColor: glitch
            ? `rgb(${Math.random() > 0.5 ? "6, 182, 212" : "239, 68, 68"})`
            : "rgba(6, 182, 212, 0.35)",
          boxShadow: glitch
            ? "0 0 4px rgba(6, 182, 212, 0.8), 1px 1px 0 rgba(239, 68, 68, 0.6)"
            : "none",
          imageRendering: "pixelated",
        }}
      />
      {/* Hover reveal - tiny hint that appears on very close inspection */}
      <span className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--color-accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        &gt;_
      </span>
    </a>
  );
}
