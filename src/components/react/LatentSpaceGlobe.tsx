import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import * as THREE from "three";

const POINT_COUNT = 1800;
const RADIUS = 2.5;
const CLUSTERS = [
  { label: "NLP", hue: 0.52, center: [1.0, 1.0, 0.5] },
  { label: "CV", hue: 0.02, center: [-1.0, 0.8, -0.8] },
  { label: "RAG", hue: 0.75, center: [0.6, -1.2, 1.0] },
  { label: "Agents", hue: 0.12, center: [-1.2, -0.5, -0.5] },
  { label: "Safety", hue: 0.65, center: [0.0, 1.3, -1.2] },
];

interface GlobeProps {
  attackPulse: number;
  onPulseComplete: () => void;
}

function Points({ attackPulse, onPulseComplete }: GlobeProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const pulseStartRef = useRef<number | null>(null);
  const pulseTRef = useRef(0);

  // Generate positions, colors, offsets once
  const { positions, origPositions, colors, sizes, clusterIds } = useMemo(() => {
    const positions = new Float32Array(POINT_COUNT * 3);
    const origPositions = new Float32Array(POINT_COUNT * 3);
    const colors = new Float32Array(POINT_COUNT * 3);
    const sizes = new Float32Array(POINT_COUNT);
    const clusterIds = new Float32Array(POINT_COUNT);

    const color = new THREE.Color();

    for (let i = 0; i < POINT_COUNT; i++) {
      // Fibonacci-ish sphere distribution with cluster bias
      const useCluster = Math.random() < 0.7;
      let x: number, y: number, z: number;

      if (useCluster) {
        const cluster = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
        const clusterIdx = CLUSTERS.indexOf(cluster);
        clusterIds[i] = clusterIdx;
        const [cx, cy, cz] = cluster.center;

        const spread = 0.7;
        const rx = (Math.random() - 0.5) * spread;
        const ry = (Math.random() - 0.5) * spread;
        const rz = (Math.random() - 0.5) * spread;

        const dir = new THREE.Vector3(cx + rx, cy + ry, cz + rz).normalize();
        const radius = RADIUS + (Math.random() - 0.5) * 0.15;
        x = dir.x * radius;
        y = dir.y * radius;
        z = dir.z * radius;

        color.setHSL(cluster.hue, 0.7, 0.55 + Math.random() * 0.2);
      } else {
        // Uniform sphere for noise
        clusterIds[i] = -1;
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = RADIUS + (Math.random() - 0.5) * 0.2;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);

        color.setHSL(0.52, 0.4, 0.35 + Math.random() * 0.15);
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      origPositions[i * 3] = x;
      origPositions[i * 3 + 1] = y;
      origPositions[i * 3 + 2] = z;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.025 + Math.random() * 0.02;
    }

    return { positions, origPositions, colors, sizes, clusterIds };
  }, []);

  // Trigger pulse when attackPulse prop changes
  useEffect(() => {
    if (attackPulse > 0) {
      pulseStartRef.current = performance.now();
      pulseTRef.current = 0;
    }
  }, [attackPulse]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const geom = points.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = geom.getAttribute("color") as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const colArray = colAttr.array as Float32Array;

    const time = state.clock.elapsedTime;

    // Rotate the entire cloud slowly
    points.rotation.y = time * 0.08;
    points.rotation.x = Math.sin(time * 0.15) * 0.1;

    // Pulse state
    let pulseT = 0;
    if (pulseStartRef.current !== null) {
      const elapsed = (performance.now() - pulseStartRef.current) / 1000;
      const duration = 2.2;
      pulseT = Math.min(elapsed / duration, 1);
      pulseTRef.current = pulseT;

      if (pulseT >= 1) {
        pulseStartRef.current = null;
        onPulseComplete();
      }
    }

    // Animate positions
    const redColor = new THREE.Color(0.94, 0.27, 0.27);
    const tmpColor = new THREE.Color();

    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3;
      const ox = origPositions[i3];
      const oy = origPositions[i3 + 1];
      const oz = origPositions[i3 + 2];

      // Breathing motion
      const breath = 1 + Math.sin(time * 0.6 + i * 0.01) * 0.015;

      // Per-point noise oscillation
      const nx = Math.sin(time * 0.8 + i * 0.3) * 0.02;
      const ny = Math.cos(time * 0.7 + i * 0.5) * 0.02;
      const nz = Math.sin(time * 0.9 + i * 0.7) * 0.02;

      let x = ox * breath + nx;
      let y = oy * breath + ny;
      let z = oz * breath + nz;

      // Pulse distortion
      if (pulseT > 0 && pulseT < 1) {
        const wave = Math.sin(pulseT * Math.PI);
        const dir = new THREE.Vector3(ox, oy, oz).normalize();
        const pushStrength = wave * (0.4 + Math.random() * 0.3);
        const seed = (i * 0.017) % 1;
        const chaos = (Math.sin(time * 10 + i) + 1) * 0.5;

        x += dir.x * pushStrength * (0.5 + seed);
        y += dir.y * pushStrength * (0.5 + seed);
        z += dir.z * pushStrength * (0.5 + seed);

        x += (Math.random() - 0.5) * wave * 0.15;
        y += (Math.random() - 0.5) * wave * 0.15;
        z += (Math.random() - 0.5) * wave * 0.15;

        // Color shift to red during attack peak
        const r = colors[i3];
        const g = colors[i3 + 1];
        const b = colors[i3 + 2];
        tmpColor.setRGB(r, g, b).lerp(redColor, wave * 0.7 * chaos);
        colArray[i3] = tmpColor.r;
        colArray[i3 + 1] = tmpColor.g;
        colArray[i3 + 2] = tmpColor.b;
      } else if (pulseT >= 1 || pulseT === 0) {
        // Ensure colors restore smoothly
        colArray[i3] += (colors[i3] - colArray[i3]) * 0.1;
        colArray[i3 + 1] += (colors[i3 + 1] - colArray[i3 + 1]) * 0.1;
        colArray[i3 + 2] += (colors[i3 + 2] - colArray[i3 + 2]) * 0.1;
      }

      posArray[i3] = x;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = z;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={POINT_COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={POINT_COUNT}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef as any}
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({ attackPulse, onPulseComplete }: GlobeProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#06b6d4" />
      <Points attackPulse={attackPulse} onPulseComplete={onPulseComplete} />
    </>
  );
}

export default function LatentSpaceGlobe() {
  const [attackCount, setAttackCount] = useState(0);
  const [pulsing, setPulsing] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Lazy-activate only if desktop + not reduced motion + viewport intersection
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (prefersReduced || isMobile) {
      setEnabled(false);
      return;
    }

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

  const triggerAttack = useCallback(() => {
    if (pulsing) return;
    setPulsing(true);
    setAttackCount((c) => c + 1);
  }, [pulsing]);

  const handlePulseComplete = useCallback(() => {
    setPulsing(false);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          </span>
          latent_space.vec[1800]
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
            attacks logged: <span className="text-[var(--color-accent-red)]">{attackCount}</span>
          </span>
          <button
            onClick={triggerAttack}
            disabled={pulsing || !enabled}
            className="rounded border border-[var(--color-accent-red)]/40 bg-[var(--color-accent-red)]/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent-red)] transition-all hover:border-[var(--color-accent-red)] hover:bg-[var(--color-accent-red)]/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pulsing ? "injecting..." : "inject attack"}
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/60 sm:aspect-[16/10]">
        {enabled ? (
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene
              attackPulse={attackCount}
              onPulseComplete={handlePulseComplete}
            />
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-xs text-[var(--color-text-muted)]">
                desktop only
              </div>
              <div className="mt-1 text-[10px] text-[var(--color-text-muted)]/60">
                interactive 3D visualization
              </div>
            </div>
          </div>
        )}

        {/* Cluster legend overlay */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-[var(--color-text-muted)]">
          {CLUSTERS.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: `hsl(${c.hue * 360}, 70%, 55%)`,
                }}
              />
              {c.label}
            </span>
          ))}
        </div>

        {/* Coordinates overlay */}
        <div className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-[var(--color-text-muted)]/60">
          dim: 1800 &middot; proj: 3D
        </div>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] text-[var(--color-text-muted)]/50">
        point cloud projection of skill embeddings. click "inject attack" to watch the adversarial pulse corrupt the manifold.
      </p>
    </div>
  );
}
