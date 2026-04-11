import { useRef, useEffect } from "react";

interface Neuron {
  x: number;
  y: number;
  layer: number;
  pulse: number;
  corrupted: number;
  baseY: number;
}

interface Connection {
  from: number;
  to: number;
  signal: number;
}

const LAYERS = [5, 7, 7, 3];
const LAYER_COUNT = LAYERS.length;
const CYAN = "6, 182, 212";
const RED = "239, 68, 68";
const AMBER = "245, 158, 11";

type Phase = "idle" | "inference" | "injection" | "breach" | "compromised";

const PHASE_DURATIONS: Record<Phase, number> = {
  idle: 1500,
  inference: 2500,
  injection: 1200,
  breach: 2800,
  compromised: 2500,
};

export default function NeuralBreach() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const neuronsRef = useRef<Neuron[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const phaseStartRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const runningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buildNetwork = (w: number, h: number) => {
      const neurons: Neuron[] = [];
      const paddingX = 60;
      const usableW = w - paddingX * 2;
      let id = 0;
      LAYERS.forEach((count, layerIdx) => {
        const x = paddingX + (usableW * layerIdx) / (LAYER_COUNT - 1);
        const layerH = h * 0.8;
        const layerY0 = (h - layerH) / 2;
        for (let i = 0; i < count; i++) {
          const y = layerY0 + (layerH * (i + 0.5)) / count;
          neurons.push({
            x,
            y,
            baseY: y,
            layer: layerIdx,
            pulse: 0,
            corrupted: 0,
          });
          id++;
        }
      });

      const connections: Connection[] = [];
      let offsetA = 0;
      for (let l = 0; l < LAYER_COUNT - 1; l++) {
        const sizeA = LAYERS[l];
        const sizeB = LAYERS[l + 1];
        const offsetB = offsetA + sizeA;
        for (let a = 0; a < sizeA; a++) {
          for (let b = 0; b < sizeB; b++) {
            connections.push({
              from: offsetA + a,
              to: offsetB + b,
              signal: 0,
            });
          }
        }
        offsetA += sizeA;
      }

      neuronsRef.current = neurons;
      connectionsRef.current = connections;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      buildNetwork(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const setPhase = (p: Phase) => {
      phaseRef.current = p;
      phaseStartRef.current = performance.now();
      if (labelRef.current) {
        labelRef.current.dataset.phase = p;
      }
    };

    const advancePhase = () => {
      const order: Phase[] = [
        "idle",
        "inference",
        "injection",
        "breach",
        "compromised",
      ];
      const cur = phaseRef.current;
      const next = order[(order.indexOf(cur) + 1) % order.length];
      setPhase(next);
    };

    const drawFrame = (now: number) => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const phase = phaseRef.current;
      const elapsed = now - phaseStartRef.current;
      const duration = PHASE_DURATIONS[phase];
      const progress = Math.min(elapsed / duration, 1);

      if (elapsed >= duration) {
        advancePhase();
      }

      const neurons = neuronsRef.current;
      const connections = connectionsRef.current;

      // Determine max layer affected by breach wave
      let breachFront = -1;
      if (phase === "breach") {
        breachFront = progress * (LAYER_COUNT - 1);
      } else if (phase === "compromised") {
        breachFront = LAYER_COUNT - 1;
      }

      // Update neurons
      for (const n of neurons) {
        // Baseline idle pulse
        const idlePulse = 0.3 + 0.15 * Math.sin(now * 0.002 + n.x * 0.01);
        n.pulse += (idlePulse - n.pulse) * 0.08;

        // Inference wave traveling left to right
        if (phase === "inference") {
          const wavePos = progress * (LAYER_COUNT - 1);
          const dist = Math.abs(n.layer - wavePos);
          if (dist < 0.7) {
            n.pulse = Math.max(n.pulse, 1 - dist / 0.7);
          }
        }

        // Injection phase: input layer flickers red
        if (phase === "injection" && n.layer === 0) {
          n.corrupted = Math.min(1, n.corrupted + 0.04);
          const flick = Math.random() > 0.5 ? 1 : 0.4;
          n.pulse = Math.max(n.pulse, flick);
        }

        // Breach phase: red wave propagates forward
        if (phase === "breach") {
          if (n.layer <= breachFront) {
            n.corrupted += (1 - n.corrupted) * 0.12;
            n.pulse = Math.max(n.pulse, 1 - (breachFront - n.layer) * 0.3);
          }
        }

        // Compromised phase: hold red state
        if (phase === "compromised") {
          n.corrupted += (1 - n.corrupted) * 0.15;
          n.pulse = 0.8 + 0.2 * Math.sin(now * 0.01);
        }

        // Idle reset
        if (phase === "idle") {
          n.corrupted += (0 - n.corrupted) * 0.08;
        }
      }

      // Draw connections
      for (const c of connections) {
        const from = neurons[c.from];
        const to = neurons[c.to];
        if (!from || !to) continue;

        const avgCorrupted = (from.corrupted + to.corrupted) / 2;
        const avgPulse = (from.pulse + to.pulse) / 2;

        const color = avgCorrupted > 0.2 ? RED : CYAN;
        const alpha = Math.min(0.06 + avgPulse * 0.25, 0.5);
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = 0.6 + avgPulse * 0.8;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }

      // Draw neurons
      for (const n of neurons) {
        const r = 4 + n.pulse * 2.5;
        const color = n.corrupted > 0.2 ? RED : CYAN;

        // Glow
        ctx.shadowColor = `rgba(${color}, ${Math.min(n.pulse * 0.8, 1)})`;
        ctx.shadowBlur = 12 + n.pulse * 10;
        ctx.fillStyle = `rgba(${color}, ${0.6 + n.pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Layer labels
      const layerLabels = ["input", "hidden", "hidden", "output"];
      ctx.fillStyle = "rgba(161, 161, 170, 0.35)";
      ctx.font = "10px 'JetBrains Mono Variable', monospace";
      ctx.textAlign = "center";
      for (let l = 0; l < LAYER_COUNT; l++) {
        const paddingX = 60;
        const usableW = w - paddingX * 2;
        const x = paddingX + (usableW * l) / (LAYER_COUNT - 1);
        ctx.fillText(layerLabels[l], x, h - 8);
      }

      // Adversarial indicator at input during injection
      if (phase === "injection" || phase === "breach") {
        const arrowX = 20;
        const arrowY = h / 2;
        const pulse = Math.sin(now * 0.01) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(${AMBER}, ${0.4 + pulse * 0.4})`;
        ctx.font = "bold 11px 'JetBrains Mono Variable', monospace";
        ctx.textAlign = "left";
        ctx.fillText("adv →", arrowX, arrowY);
      }

      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !runningRef.current) {
            runningRef.current = true;
            setPhase("idle");
            rafRef.current = requestAnimationFrame(drawFrame);
          } else if (!entry.isIntersecting && runningRef.current) {
            runningRef.current = false;
            cancelAnimationFrame(rafRef.current);
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={labelRef}
        data-phase="idle"
        className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]"
      >
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          </span>
          model.live
        </span>
        <span className="phase-idle-hide font-mono text-[var(--color-text-muted)]">
          phase: <span data-phase-text className="text-[var(--color-accent)]" />
        </span>
        <span className="font-mono">status: <StatusIndicator /></span>
      </div>
      <div
        className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/40"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
        }}
      >
        <canvas
          ref={canvasRef}
          className="block h-72 w-full"
          style={{
            transform: "rotateX(6deg)",
            transformStyle: "preserve-3d",
          }}
          aria-label="Neural network breach visualization"
          role="img"
        />
      </div>
    </div>
  );
}

function StatusIndicator() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const phase =
        document
          .querySelector("[data-phase]")
          ?.getAttribute("data-phase") ?? "idle";
      if (phase === "compromised" || phase === "breach") {
        el.textContent = "COMPROMISED";
        el.style.color = "#ef4444";
        el.style.textShadow = "0 0 8px rgba(239,68,68,0.5)";
      } else {
        el.textContent = "SAFE";
        el.style.color = "#10b981";
        el.style.textShadow = "0 0 8px rgba(16,185,129,0.3)";
      }
    };

    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <span ref={ref} className="font-bold">
      SAFE
    </span>
  );
}
