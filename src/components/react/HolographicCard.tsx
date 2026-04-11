import { useRef, useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MAX_TILT_DEG = 8;
const PERSPECTIVE = 1200;
const GLARE_SIZE = 500;
const SPRING_STIFFNESS = 0.15;

export default function HolographicCard({ children }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, active: 0 });
  const currentRef = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, active: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // Freeze rotation when hovering interactive children — otherwise the
      // card keeps moving between mousedown and mouseup and the click is lost.
      const target = e.target as HTMLElement | null;
      const onInteractive = !!target?.closest("a, button, input, textarea, select, [role='button']");

      if (onInteractive) {
        targetRef.current.rx = 0;
        targetRef.current.ry = 0;
      } else {
        targetRef.current.ry = dx * MAX_TILT_DEG;
        targetRef.current.rx = -dy * MAX_TILT_DEG;
      }

      const localX = ((e.clientX - rect.left) / rect.width) * 100;
      const localY = ((e.clientY - rect.top) / rect.height) * 100;
      targetRef.current.gx = Math.max(0, Math.min(100, localX));
      targetRef.current.gy = Math.max(0, Math.min(100, localY));

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      targetRef.current.active = inside ? 1 : 0.15;
    };

    const handleMouseLeave = () => {
      targetRef.current.rx = 0;
      targetRef.current.ry = 0;
      targetRef.current.gx = 50;
      targetRef.current.gy = 50;
      targetRef.current.active = 0;
    };

    const animate = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.rx += (tgt.rx - cur.rx) * SPRING_STIFFNESS;
      cur.ry += (tgt.ry - cur.ry) * SPRING_STIFFNESS;
      cur.gx += (tgt.gx - cur.gx) * SPRING_STIFFNESS;
      cur.gy += (tgt.gy - cur.gy) * SPRING_STIFFNESS;
      cur.active += (tgt.active - cur.active) * SPRING_STIFFNESS;

      card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${cur.rx.toFixed(
        2
      )}deg) rotateY(${cur.ry.toFixed(2)}deg)`;

      glare.style.background = `radial-gradient(${GLARE_SIZE}px circle at ${cur.gx.toFixed(
        1
      )}% ${cur.gy.toFixed(1)}%, rgba(255,255,255,${(
        cur.active * 0.08
      ).toFixed(3)}) 0%, rgba(6,182,212,${(
        cur.active * 0.05
      ).toFixed(3)}) 25%, transparent 60%)`;

      const holoEl = card.querySelector<HTMLDivElement>(
        "[data-holo-foil]"
      );
      if (holoEl) {
        holoEl.style.opacity = (cur.active * 0.35).toFixed(3);
        holoEl.style.backgroundPosition = `${cur.gx.toFixed(
          1
        )}% ${cur.gy.toFixed(1)}%`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="relative"
      style={{
        perspective: `${PERSPECTIVE}px`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-bg-secondary)]/80 via-[var(--color-bg-primary)]/60 to-[var(--color-bg-secondary)]/80 px-8 py-12 backdrop-blur-sm transition-shadow duration-500 sm:px-12 sm:py-14"
        style={{
          transformStyle: "preserve-3d",
          willChange: mounted ? "transform" : "auto",
          boxShadow:
            "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.08) inset",
        }}
      >
        {/* Grid background (decorative depth layer) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />

        {/* Rarity tag — top-right corner */}
        <div
          className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-accent)]"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-accent)]" />
          Rare Card
        </div>

        {/* Edition number — top-left corner */}
        <div
          className="pointer-events-none absolute left-4 top-4 font-mono text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]/60"
          style={{ transform: "translateZ(30px)" }}
        >
          001/001
        </div>

        {/* Corner brackets */}
        <div
          className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[var(--color-accent)]/40"
          style={{ transform: "translateZ(20px)" }}
        />
        <div
          className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[var(--color-accent)]/40"
          style={{ transform: "translateZ(20px)" }}
        />

        {/* Content (lifted on Z axis for parallax depth) */}
        <div
          className="relative"
          style={{ transform: "translateZ(40px)" }}
        >
          {children}
        </div>

        {/* Holographic foil layer — animated conic gradient */}
        <div
          data-holo-foil
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 mix-blend-color-dodge"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg at var(--bg-x, 50%) var(--bg-y, 50%), #ef4444 0%, #f59e0b 14%, #10b981 28%, #06b6d4 42%, #3b82f6 56%, #8b5cf6 70%, #ec4899 84%, #ef4444 100%)",
            backgroundSize: "200% 200%",
            filter: "blur(20px) saturate(140%)",
          }}
        />

        {/* Scanline effect — very subtle */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)",
          }}
        />

        {/* Dynamic glare — mouse-tracked radial highlight */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{ mixBlendMode: "plus-lighter" }}
        />
      </div>
    </div>
  );
}
