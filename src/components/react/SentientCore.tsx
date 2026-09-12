import { useRef, useEffect } from "react";
import { X } from "lucide-react";

interface GraphNode {
  baseAngle: number;
  baseRadius: number;
  jitterSeed: number;
  size: number;
  isActive: boolean;
  connections: number[];
}

export default function SentientCore({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ inside: 0, targetInside: 0 });
  const nodesRef = useRef<GraphNode[]>([]);
  const startRef = useRef<number>(0);

  const primary = { r: 6, g: 182, b: 212 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dpr = window.devicePixelRatio || 1;
    const size = 72;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const RING_INNER = 15;
    const RING_OUTER = 30;
    const CONNECT_DIST = 9;

    // Build ring graph: nodes scattered across a thick annulus
    const NODE_COUNT = prefersReduced ? 0 : 44;
    const nodes: GraphNode[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        baseAngle: Math.random() * Math.PI * 2,
        baseRadius: RING_INNER + Math.random() * (RING_OUTER - RING_INNER),
        jitterSeed: Math.random() * 1000,
        size: 0.7 + Math.random() * 0.9,
        isActive: Math.random() < 0.18,
        connections: [],
      });
    }
    // Precompute connections at initial positions
    const initPos = nodes.map((n) => ({
      x: Math.cos(n.baseAngle) * n.baseRadius,
      y: Math.sin(n.baseAngle) * n.baseRadius,
    }));
    for (let i = 0; i < nodes.length; i++) {
      const dists: { idx: number; d: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = initPos[i].x - initPos[j].x;
        const dy = initPos[i].y - initPos[j].y;
        dists.push({ idx: j, d: Math.sqrt(dx * dx + dy * dy) });
      }
      dists.sort((a, b) => a.d - b.d);
      nodes[i].connections = dists
        .slice(0, 3)
        .filter((d) => d.d < CONNECT_DIST)
        .map((d) => d.idx);
    }
    nodesRef.current = nodes;

    startRef.current = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const hx = rect.left + rect.width / 2;
      const hy = rect.top + rect.height / 2;
      const dx = e.clientX - hx;
      const dy = e.clientY - hy;
      mouseRef.current.targetInside =
        Math.sqrt(dx * dx + dy * dy) < 120 ? 1 : 0;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const positions: { x: number; y: number }[] = new Array(NODE_COUNT);

    const draw = () => {
      const now = performance.now();
      const elapsed = (now - startRef.current) / 1000;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, size, size);

      mouseRef.current.inside +=
        (mouseRef.current.targetInside - mouseRef.current.inside) * 0.1;
      const hover = mouseRef.current.inside;

      // Soft outer glow — hints at the cluster's presence without framing it
      const breath = 0.5 + 0.5 * Math.sin(elapsed * 1.2);
      const glowR = 34 + breath * 2 + hover * 4;
      const glowA = 0.06 + breath * 0.04 + hover * 0.08;
      const bgGrad = ctx.createRadialGradient(cx, cy, 14, cx, cy, glowR);
      bgGrad.addColorStop(
        0,
        `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${glowA})`
      );
      bgGrad.addColorStop(
        1,
        `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0)`
      );
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      if (NODE_COUNT === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Global slow rotation + per-node oscillation
      const globalRot = elapsed * 0.06 + hover * 0.15;
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        const angle = n.baseAngle + globalRot;
        const r =
          n.baseRadius + Math.sin(elapsed * 0.5 + n.jitterSeed) * 0.7;
        positions[i] = {
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
        };
      }

      // Edges: fine white lines between nearest neighbors
      ctx.strokeStyle = `rgba(235, 240, 245, ${0.28 + hover * 0.22})`;
      ctx.lineWidth = 0.45;
      ctx.beginPath();
      for (let i = 0; i < NODE_COUNT; i++) {
        const conns = nodes[i].connections;
        for (let k = 0; k < conns.length; k++) {
          const j = conns[k];
          if (j <= i) continue;
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
        }
      }
      ctx.stroke();

      // Nodes: small white dots
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        const p = positions[i];
        ctx.fillStyle = `rgba(245, 248, 252, ${0.78 + hover * 0.18})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Active nodes: triangle marker oriented outward.
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        if (!n.isActive) continue;
        const angle = n.baseAngle + globalRot;
        const p = positions[i];
        const tSize = 2.2;
        const a1 = angle;
        const a2 = angle + (Math.PI * 2) / 3;
        const a3 = angle + (Math.PI * 4) / 3;
        ctx.fillStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${0.85 + hover * 0.15})`;
        ctx.beginPath();
        ctx.moveTo(p.x + Math.cos(a1) * tSize, p.y + Math.sin(a1) * tSize);
        ctx.lineTo(p.x + Math.cos(a2) * tSize, p.y + Math.sin(a2) * tSize);
        ctx.lineTo(p.x + Math.cos(a3) * tSize, p.y + Math.sin(a3) * tSize);
        ctx.closePath();
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [primary.r, primary.g, primary.b]);

  return (
    <button
      onClick={onClick}
      aria-label="ARCA"
      className="relative block"
      style={{ width: 72, height: 72 }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          width: 72,
          height: 72,
          filter: isOpen ? "brightness(1.2)" : undefined,
        }}
      />
      {/* Overlay X when open */}
      {isOpen && (
        <X
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto"
          size={16}
          strokeWidth={2.5}
          color="rgba(245,248,252,0.95)"
        />
      )}
    </button>
  );
}
