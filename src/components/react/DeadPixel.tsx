import { useState, useEffect } from "react";

export default function DeadPixel() {
  const [glitch, setGlitch] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Micro-glitch every 2-5 seconds
    const tick = () => {
      const delay = 2000 + Math.random() * 3000;
      setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100 + Math.random() * 150);
        tick();
      }, delay);
    };
    tick();

    // Stronger flash every 8-15 seconds to catch attention
    const flashTick = () => {
      const delay = 8000 + Math.random() * 7000;
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
        flashTick();
      }, delay);
    };
    flashTick();
  }, []);

  return (
    <a
      href="/l4tentnoise"
      className="group fixed z-30 hidden md:block"
      style={{ top: "52%", right: "18px" }}
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* Dead pixel cluster */}
      <span
        className="block"
        style={{
          width: flash ? "6px" : glitch ? "4px" : "3px",
          height: flash ? "6px" : glitch ? "4px" : "3px",
          backgroundColor: flash
            ? "rgb(239, 68, 68)"
            : glitch
              ? "rgb(6, 182, 212)"
              : "rgba(6, 182, 212, 0.5)",
          boxShadow: flash
            ? "0 0 8px 2px rgba(239, 68, 68, 0.6), 0 0 2px rgba(6, 182, 212, 0.8)"
            : glitch
              ? "0 0 6px 1px rgba(6, 182, 212, 0.5)"
              : "0 0 3px rgba(6, 182, 212, 0.3)",
          transition: "all 50ms",
          imageRendering: "pixelated" as const,
        }}
      />
      {/* Second stuck pixel nearby */}
      <span
        className="absolute"
        style={{
          top: "5px",
          left: "-2px",
          width: "2px",
          height: "2px",
          backgroundColor: glitch
            ? "rgba(239, 68, 68, 0.7)"
            : "rgba(239, 68, 68, 0.25)",
          boxShadow: glitch ? "0 0 4px rgba(239, 68, 68, 0.4)" : "none",
          transition: "all 50ms",
        }}
      />
      {/* Hover hint */}
      <span className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-[var(--color-bg-tertiary)] px-2 py-1 font-mono text-[10px] text-[var(--color-accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-[var(--color-border)]">
        &gt;_
      </span>
    </a>
  );
}
