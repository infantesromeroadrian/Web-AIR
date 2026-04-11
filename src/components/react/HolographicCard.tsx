import { useRef, useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MAX_TILT_DEG = 4;
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
        cur.active * 0.06
      ).toFixed(3)}) 0%, rgba(6,182,212,${(
        cur.active * 0.04
      ).toFixed(3)}) 25%, transparent 60%)`;

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

        {/* Status tag — top-right */}
        <div
          className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-accent)]"
          style={{ transform: "translateZ(30px)" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            style={{ animation: "holo-pulse 1.6s ease-in-out infinite" }}
          />
          inference: active
        </div>

        {/* Uptime — top-left */}
        <div
          className="pointer-events-none absolute left-4 top-4 font-mono text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]/70"
          style={{ transform: "translateZ(30px)" }}
        >
          uptime: 6.2y
        </div>

        {/* Content (lifted on Z axis for parallax depth) */}
        <div
          className="relative"
          style={{ transform: "translateZ(40px)" }}
        >
          {children}
        </div>

        {/* Soft cyan glow — replaces the rainbow foil */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, transparent 65%)",
          }}
        />

        {/* Dynamic glare — mouse-tracked radial highlight */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{ mixBlendMode: "plus-lighter" }}
        />

        <style>{`
          @keyframes holo-pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(6,182,212,0.5); }
            50% { opacity: 0.5; box-shadow: 0 0 0 3px rgba(6,182,212,0); }
          }
        `}</style>
      </div>
    </div>
  );
}
