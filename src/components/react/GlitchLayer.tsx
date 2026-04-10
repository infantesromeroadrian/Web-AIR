import { useState, useEffect, useRef } from "react";

const DATA_CHARS = "01アイウエオカキクケコサシスセソタチツテト";

const WARNINGS = [
  "TRACE DETECTED — REROUTING...",
  "CONNECTION UNSTABLE",
  "INTRUDER ALERT: UNAUTHORIZED SESSION",
  "ENCRYPTING CHANNEL...",
  "SIGNAL DEGRADATION: 23%",
  "PROXY CHAIN: 4 HOPS ACTIVE",
];

function DataRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const columns = Math.floor(canvas.width / 16);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "13px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = DATA_CHARS[Math.floor(Math.random() * DATA_CHARS.length)];
        const brightness = Math.random();
        ctx.fillStyle = brightness > 0.95
          ? "rgba(34, 211, 238, 0.5)"
          : brightness > 0.8
            ? "rgba(6, 182, 212, 0.2)"
            : "rgba(6, 182, 212, 0.08)";
        ctx.fillText(char, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}

export default function GlitchLayer() {
  const [warning, setWarning] = useState<string | null>(null);
  const [screenGlitch, setScreenGlitch] = useState(false);

  useEffect(() => {
    // Random warnings
    const warnTick = () => {
      const delay = 6000 + Math.random() * 12000;
      setTimeout(() => {
        const msg = WARNINGS[Math.floor(Math.random() * WARNINGS.length)];
        setWarning(msg);
        setTimeout(() => setWarning(null), 2500 + Math.random() * 1500);
        warnTick();
      }, delay);
    };
    warnTick();

    // Random screen glitch
    const glitchTick = () => {
      const delay = 4000 + Math.random() * 8000;
      setTimeout(() => {
        setScreenGlitch(true);
        setTimeout(() => setScreenGlitch(false), 80 + Math.random() * 120);
        glitchTick();
      }, delay);
    };
    glitchTick();
  }, []);

  return (
    <>
      <DataRainCanvas />

      {/* Screen glitch */}
      {screenGlitch && (
        <div
          className="pointer-events-none fixed inset-0 z-[55]"
          style={{
            background: `linear-gradient(${Math.random() * 180}deg, transparent 40%, rgba(6,182,212,0.03) 50%, transparent 60%)`,
            transform: `translateX(${(Math.random() - 0.5) * 6}px)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Warning popup */}
      {warning && (
        <div className="fixed top-4 left-1/2 z-[56] -translate-x-1/2 animate-pulse">
          <div className="rounded border border-[var(--color-accent-red)]/40 bg-[var(--color-bg-primary)]/90 px-4 py-2 font-mono text-xs text-[var(--color-accent-red)] backdrop-blur-sm"
            style={{ textShadow: "0 0 8px rgba(239,68,68,0.5)" }}>
            [{new Date().toLocaleTimeString("en-GB")}] {warning}
          </div>
        </div>
      )}
    </>
  );
}
