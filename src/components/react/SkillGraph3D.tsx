import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import * as THREE from "three";

type Group = "core" | "sector" | "skill" | "project";

interface RawNode {
  id: string;
  label: string;
  group: Group;
}

interface Edge {
  from: string;
  to: string;
}

const RAW_NODES: RawNode[] = [
  { id: "adrian", label: "Adrian Infantes", group: "core" },
  { id: "defense", label: "Defense", group: "sector" },
  { id: "fintech", label: "FinTech", group: "sector" },
  { id: "healthcare", label: "Healthcare", group: "sector" },
  { id: "redteam", label: "Red Teaming", group: "skill" },
  { id: "langgraph", label: "LangGraph", group: "skill" },
  { id: "pytorch", label: "PyTorch", group: "skill" },
  { id: "rag", label: "RAG", group: "skill" },
  { id: "nvidia", label: "NVIDIA", group: "skill" },
  { id: "k8s", label: "Kubernetes", group: "skill" },
  { id: "cv", label: "Computer Vision", group: "skill" },
  { id: "nlp", label: "NLP", group: "skill" },
  { id: "mlops", label: "MLOps", group: "skill" },
  { id: "spectra", label: "Spectra", group: "project" },
  { id: "fraudai", label: "FraudAI", group: "project" },
  { id: "hospital", label: "Hospital AI", group: "project" },
  { id: "drone", label: "Drone Geo", group: "project" },
  { id: "watchdogs", label: "WatchDogs", group: "project" },
];

const EDGES: Edge[] = [
  { from: "adrian", to: "defense" },
  { from: "adrian", to: "fintech" },
  { from: "adrian", to: "healthcare" },
  { from: "defense", to: "redteam" },
  { from: "defense", to: "cv" },
  { from: "defense", to: "nlp" },
  { from: "fintech", to: "rag" },
  { from: "fintech", to: "langgraph" },
  { from: "healthcare", to: "langgraph" },
  { from: "healthcare", to: "nlp" },
  { from: "redteam", to: "nvidia" },
  { from: "pytorch", to: "nvidia" },
  { from: "pytorch", to: "cv" },
  { from: "pytorch", to: "nlp" },
  { from: "rag", to: "langgraph" },
  { from: "k8s", to: "mlops" },
  { from: "mlops", to: "nvidia" },
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
  { from: "spectra", to: "defense" },
  { from: "fraudai", to: "fintech" },
  { from: "hospital", to: "healthcare" },
  { from: "drone", to: "defense" },
  { from: "watchdogs", to: "defense" },
];

const GROUP_COLORS: Record<Group, string> = {
  core: "#06b6d4",
  sector: "#10b981",
  skill: "#a1a1aa",
  project: "#f59e0b",
};

const GROUP_RADII: Record<Group, number> = {
  core: 0.35,
  sector: 0.22,
  skill: 0.15,
  project: 0.13,
};

// Distance from center by group
const GROUP_DISTANCE: Record<Group, number> = {
  core: 0,
  sector: 1.6,
  skill: 2.6,
  project: 3.6,
};

interface PositionedNode extends RawNode {
  pos: THREE.Vector3;
  color: string;
  radius: number;
}

// Fibonacci sphere distribution for even spacing
function distributeSpherical(count: number, radius: number, offset = 0) {
  const points: THREE.Vector3[] = [];
  if (count === 0) return points;
  if (count === 1) {
    points.push(new THREE.Vector3(radius, 0, 0));
    return points;
  }
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * (i + offset);
    points.push(
      new THREE.Vector3(
        radius * Math.cos(theta) * radiusAtY,
        radius * y,
        radius * Math.sin(theta) * radiusAtY
      )
    );
  }
  return points;
}

function computePositions(): PositionedNode[] {
  const grouped: Record<Group, RawNode[]> = {
    core: [],
    sector: [],
    skill: [],
    project: [],
  };
  for (const n of RAW_NODES) grouped[n.group].push(n);

  const positioned: PositionedNode[] = [];

  (["core", "sector", "skill", "project"] as Group[]).forEach((g, gi) => {
    const nodes = grouped[g];
    const positions = distributeSpherical(
      nodes.length,
      GROUP_DISTANCE[g],
      gi * 0.3
    );
    nodes.forEach((n, i) => {
      positioned.push({
        ...n,
        pos: positions[i],
        color: GROUP_COLORS[n.group],
        radius: GROUP_RADII[n.group],
      });
    });
  });

  return positioned;
}

interface GraphProps {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

function Graph({ hoveredId, setHoveredId }: GraphProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => computePositions(), []);
  const nodeById = useMemo(() => {
    const m = new Map<string, PositionedNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  const connectedSet = useMemo(() => {
    if (!hoveredId) return null;
    const set = new Set<string>([hoveredId]);
    for (const e of EDGES) {
      if (e.from === hoveredId) set.add(e.to);
      if (e.to === hoveredId) set.add(e.from);
    }
    return set;
  }, [hoveredId]);

  // Edge positions as flat Float32Array for a single BufferGeometry
  const edgePositions = useMemo(() => {
    const arr = new Float32Array(EDGES.length * 2 * 3);
    EDGES.forEach((e, i) => {
      const a = nodeById.get(e.from);
      const b = nodeById.get(e.to);
      if (!a || !b) return;
      arr[i * 6] = a.pos.x;
      arr[i * 6 + 1] = a.pos.y;
      arr[i * 6 + 2] = a.pos.z;
      arr[i * 6 + 3] = b.pos.x;
      arr[i * 6 + 4] = b.pos.y;
      arr[i * 6 + 5] = b.pos.z;
    });
    return arr;
  }, [nodeById]);

  const edgeColors = useMemo(() => {
    const arr = new Float32Array(EDGES.length * 2 * 3);
    const cyan = new THREE.Color("#06b6d4");
    const dim = new THREE.Color("#3f3f46");
    EDGES.forEach((e, i) => {
      let color = dim;
      if (connectedSet) {
        const highlight = connectedSet.has(e.from) && connectedSet.has(e.to);
        color = highlight ? cyan : new THREE.Color("#27272a");
      } else {
        color = new THREE.Color("#1f2937");
      }
      for (let k = 0; k < 2; k++) {
        arr[i * 6 + k * 3] = color.r;
        arr[i * 6 + k * 3 + 1] = color.g;
        arr[i * 6 + k * 3 + 2] = color.b;
      }
    });
    return arr;
  }, [connectedSet]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = hoveredId ? 0.05 : 0.15;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={EDGES.length * 2}
            array={edgePositions}
            itemSize={3}
            args={[edgePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={EDGES.length * 2}
            array={edgeColors}
            itemSize={3}
            args={[edgeColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={hoveredId ? 0.9 : 0.4}
        />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((n) => {
        const dimmed =
          connectedSet !== null && !connectedSet.has(n.id);
        const isHovered = hoveredId === n.id;
        const scale = isHovered ? 1.35 : 1;
        return (
          <mesh
            key={n.id}
            position={n.pos}
            scale={scale}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredId(n.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHoveredId(null);
              document.body.style.cursor = "";
            }}
          >
            <sphereGeometry args={[n.radius, 24, 24]} />
            <meshStandardMaterial
              color={n.color}
              emissive={n.color}
              emissiveIntensity={isHovered ? 1.2 : dimmed ? 0.1 : 0.5}
              roughness={0.4}
              metalness={0.3}
              transparent
              opacity={dimmed ? 0.25 : 1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function NodeLabel({
  hoveredId,
}: {
  hoveredId: string | null;
}) {
  const node = useMemo(
    () => RAW_NODES.find((n) => n.id === hoveredId),
    [hoveredId]
  );
  if (!node) return null;
  const groupLabel =
    node.group === "core"
      ? "operator"
      : node.group === "sector"
        ? "industry"
        : node.group === "skill"
          ? "skill"
          : "project";
  return (
    <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded border border-[var(--color-accent)]/30 bg-[var(--color-bg-primary)]/90 px-3 py-1.5 font-mono text-xs backdrop-blur-sm">
      <span className="text-[var(--color-text-muted)]">{groupLabel}:</span>{" "}
      <span
        className="font-semibold"
        style={{ color: GROUP_COLORS[node.group] }}
      >
        {node.label}
      </span>
    </div>
  );
}

export default function SkillGraph3D() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isMobile || prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSetHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/60 sm:aspect-[16/10]"
      >
        {enabled ? (
          <>
            <Canvas
              camera={{ position: [0, 0, 9], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1.1} color="#06b6d4" />
              <pointLight position={[-5, -3, 4]} intensity={0.5} color="#f59e0b" />
              <Graph hoveredId={hoveredId} setHoveredId={handleSetHover} />
            </Canvas>
            <NodeLabel hoveredId={hoveredId} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-xs text-[var(--color-text-muted)]">
                desktop only
              </div>
              <div className="mt-1 text-[10px] text-[var(--color-text-muted)]/60">
                interactive 3D graph
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] text-[var(--color-text-muted)]">
        {(["core", "sector", "skill", "project"] as Group[]).map((g) => (
          <div key={g} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: GROUP_COLORS[g] }}
            />
            <span>{g === "core" ? "me" : g}</span>
          </div>
        ))}
        <span className="text-[var(--color-text-muted)]/50">
          hover a node to trace connections
        </span>
      </div>
    </div>
  );
}
