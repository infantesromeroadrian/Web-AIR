import { useEffect, useRef, useCallback } from "react";

interface Node {
  id: string;
  label: string;
  group: "core" | "sector" | "skill" | "project";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Edge {
  from: string;
  to: string;
}

const NODES: Omit<Node, "x" | "y" | "vx" | "vy">[] = [
  // Core
  { id: "adrian", label: "Adrian Infantes", group: "core", radius: 22 },

  // Sectors
  { id: "defense", label: "Defense", group: "sector", radius: 16 },
  { id: "fintech", label: "FinTech", group: "sector", radius: 16 },
  { id: "healthcare", label: "Healthcare", group: "sector", radius: 16 },

  // Key skills
  { id: "redteam", label: "Red Teaming", group: "skill", radius: 11 },
  { id: "langgraph", label: "LangGraph", group: "skill", radius: 11 },
  { id: "pytorch", label: "PyTorch", group: "skill", radius: 10 },
  { id: "rag", label: "RAG", group: "skill", radius: 10 },
  { id: "nvidia", label: "NVIDIA", group: "skill", radius: 10 },
  { id: "k8s", label: "Kubernetes", group: "skill", radius: 9 },
  { id: "cv", label: "Computer Vision", group: "skill", radius: 10 },
  { id: "nlp", label: "NLP", group: "skill", radius: 10 },
  { id: "mlops", label: "MLOps", group: "skill", radius: 9 },

  // Projects
  { id: "spectra", label: "Spectra", group: "project", radius: 8 },
  { id: "fraudai", label: "FraudAI", group: "project", radius: 8 },
  { id: "hospital", label: "Hospital AI", group: "project", radius: 8 },
  { id: "drone", label: "Drone Geo", group: "project", radius: 8 },
  { id: "watchdogs", label: "WatchDogs", group: "project", radius: 8 },
];

const EDGES: Edge[] = [
  // Core -> Sectors
  { from: "adrian", to: "defense" },
  { from: "adrian", to: "fintech" },
  { from: "adrian", to: "healthcare" },

  // Sectors -> Skills
  { from: "defense", to: "redteam" },
  { from: "defense", to: "cv" },
  { from: "defense", to: "nlp" },
  { from: "fintech", to: "rag" },
  { from: "fintech", to: "langgraph" },
  { from: "healthcare", to: "langgraph" },
  { from: "healthcare", to: "nlp" },

  // Skills -> Skills
  { from: "redteam", to: "nvidia" },
  { from: "pytorch", to: "nvidia" },
  { from: "pytorch", to: "cv" },
  { from: "pytorch", to: "nlp" },
  { from: "rag", to: "langgraph" },
  { from: "k8s", to: "mlops" },
  { from: "mlops", to: "nvidia" },

  // Projects -> Skills
  { from: "spectra", to: "redteam" },
  { from: "spectra", to: "langgraph" },
  { from: "fraudai", to: "langgraph" },
  { from: "fraudai", to: "rag" },
  { from: "hospital", to: "langgraph" },
  { from: "hospital", to: "nlp" },
  { from: "drone", to: "cv" },
  { from: "drone", to: "nlp" },
  { from: "watchdogs", to: "cv" },
  { from: "watchdogs", to: "redteam" },

  // Projects -> Sectors
  { from: "spectra", to: "defense" },
  { from: "fraudai", to: "fintech" },
  { from: "hospital", to: "healthcare" },
  { from: "drone", to: "defense" },
  { from: "watchdogs", to: "defense" },
];

const GROUP_COLORS: Record<string, string> = {
  core: "#06b6d4",
  sector: "#10b981",
  skill: "#a1a1aa",
  project: "#f59e0b",
};

export default function SkillGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const hoveredRef = useRef<string | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const initNodes = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    nodesRef.current = NODES.map((n, i) => {
      const angle = (i / NODES.length) * Math.PI * 2;
      const dist = n.group === "core" ? 0 : n.group === "sector" ? 100 : n.group === "skill" ? 180 : 250;
      return {
        ...n,
        x: cx + Math.cos(angle) * dist + (Math.random() - 0.5) * 60,
        y: cy + Math.sin(angle) * dist + (Math.random() - 0.5) * 60,
        vx: 0,
        vy: 0,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      if (nodesRef.current.length === 0) initNodes(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // Check hover
      hoveredRef.current = null;
      for (const node of nodesRef.current) {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 5) {
          hoveredRef.current = node.id;
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouse);

    const animate = () => {
      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Force simulation
      for (const node of nodes) {
        // Center gravity
        const gcx = node.group === "core" ? 0.05 : 0.008;
        node.vx += (cx - node.x) * gcx;
        node.vy += (cy - node.y) * gcx;

        // Repulsion between all nodes
        for (const other of nodes) {
          if (node.id === other.id) continue;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const minDist = node.radius + other.radius + 20;
          if (dist < minDist) {
            const force = ((minDist - dist) / dist) * 0.5;
            node.vx += dx * force;
            node.vy += dy * force;
          }
        }
      }

      // Edge spring forces
      for (const edge of EDGES) {
        const a = nodes.find((n) => n.id === edge.from);
        const b = nodes.find((n) => n.id === edge.to);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetDist = 120;
        const force = (dist - targetDist) * 0.003;
        a.vx += (dx / dist) * force;
        a.vy += (dy / dist) * force;
        b.vx -= (dx / dist) * force;
        b.vy -= (dy / dist) * force;
      }

      // Apply velocity + damping
      for (const node of nodes) {
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(node.radius, Math.min(w - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(h - node.radius, node.y));
      }

      const hovered = hoveredRef.current;
      const connectedToHover = hovered
        ? new Set(
            EDGES.filter((e) => e.from === hovered || e.to === hovered)
              .flatMap((e) => [e.from, e.to])
          )
        : null;

      // Draw edges
      for (const edge of EDGES) {
        const a = nodes.find((n) => n.id === edge.from);
        const b = nodes.find((n) => n.id === edge.to);
        if (!a || !b) continue;

        const isHighlighted = connectedToHover?.has(a.id) && connectedToHover?.has(b.id);
        const alpha = hovered ? (isHighlighted ? 0.4 : 0.05) : 0.12;

        ctx.strokeStyle = isHighlighted
          ? `rgba(6, 182, 212, ${alpha})`
          : `rgba(161, 161, 170, ${alpha})`;
        ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const isHovered = node.id === hovered;
        const isConnected = connectedToHover?.has(node.id);
        const dimmed = hovered && !isConnected;
        const color = GROUP_COLORS[node.group];
        const alpha = dimmed ? 0.15 : 1;

        // Glow
        if (isHovered || (isConnected && hovered)) {
          ctx.shadowColor = color;
          ctx.shadowBlur = isHovered ? 16 : 8;
        }

        ctx.fillStyle = dimmed ? `rgba(161, 161, 170, 0.1)` : color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? node.radius * 1.2 : node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Label
        if (!dimmed) {
          ctx.fillStyle = isHovered ? "#ffffff" : "rgba(228, 228, 231, 0.7)";
          ctx.font = `${node.group === "core" ? "bold 11px" : node.group === "sector" ? "bold 10px" : "9px"} 'Inter Variable', sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y + node.radius + 14);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      animRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, [initNodes]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="h-[450px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30"
      />
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-text-muted)]">
        {Object.entries(GROUP_COLORS).map(([group, color]) => (
          <div key={group} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{group === "core" ? "Me" : group}</span>
          </div>
        ))}
        <span className="text-[var(--color-text-muted)]/40">Hover to explore connections</span>
      </div>
    </div>
  );
}
