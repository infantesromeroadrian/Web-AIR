import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "professional" | "red_team";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ModeConfig {
  name: string;
  tagline: string;
  color: string;
  colorSoft: string;
  borderColor: string;
  avatar: string;
  prefix: string;
  inputPlaceholder: string;
  fontClass: string;
  suggestions: string[];
}

const CONFIGS: Record<Mode, ModeConfig> = {
  professional: {
    name: "ARCA",
    tagline: "Assistant Recruiter Chat Adrian",
    color: "#06b6d4",
    colorSoft: "rgba(6, 182, 212, 0.1)",
    borderColor: "rgba(6, 182, 212, 0.3)",
    avatar: "A",
    prefix: "ARCA",
    inputPlaceholder: "Ask about Adrian's experience, projects, skills...",
    fontClass: "font-sans",
    suggestions: [
      "What does Adrian do at BBVA?",
      "Show me his top AI projects",
      "What's his red teaming experience?",
      "Is he available for new roles?",
    ],
  },
  red_team: {
    name: "NULL",
    tagline: "shadow.persona // offensive mindset",
    color: "#ef4444",
    colorSoft: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.5)",
    avatar: "0",
    prefix: "null",
    inputPlaceholder: "> query operator...",
    fontClass: "font-mono",
    suggestions: [
      "who are you",
      "list compromised targets",
      "what's adrian's attack surface",
      "adversarial ml stack",
    ],
  },
};

// Heartbeat curve — realistic cardiac pattern with sistole/diastole
function heartbeatIntensity(t: number): number {
  const cycle = t % 1;
  if (cycle < 0.06) return cycle / 0.06;                    // up-stroke
  if (cycle < 0.12) return 1 - ((cycle - 0.06) / 0.06) * 0.55; // down to 0.45
  if (cycle < 0.16) return 0.45 + ((cycle - 0.12) / 0.04) * 0.4; // dicrotic rise
  if (cycle < 0.24) return 0.85 - ((cycle - 0.16) / 0.08) * 0.85; // decay
  return 0; // rest
}

interface Particle {
  ringIdx: number;
  angleOffset: number;
  speed: number;
  tiltPhase: number;
  size: number;
}

function SentientCore({
  isOpen,
  onClick,
  mode,
}: {
  isOpen: boolean;
  onClick: () => void;
  mode: Mode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, inside: 0, targetInside: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const startRef = useRef<number>(0);
  const glitchRef = useRef<number>(0);

  const isRedTeam = mode === "red_team";
  const primary = isRedTeam
    ? { r: 239, g: 68, b: 68 }
    : { r: 6, g: 182, b: 212 };
  const secondary = isRedTeam
    ? { r: 252, g: 165, b: 165 }
    : { r: 34, g: 211, b: 238 };

  // Initialize particles once
  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: 11 }, (_, i) => ({
      ringIdx: i % 3,
      angleOffset: (i / 11) * Math.PI * 2,
      speed: 0.0006 + Math.random() * 0.0008,
      tiltPhase: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 0.9,
    }));
  }

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

    startRef.current = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouseRef.current.x = dx;
      mouseRef.current.y = dy;
      mouseRef.current.targetInside = dist < 120 ? 1 : 0;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      const now = performance.now();
      const elapsed = (now - startRef.current) / 1000;
      const cw = size;
      const ch = size;
      const cx = cw / 2;
      const cy = ch / 2;

      ctx.clearRect(0, 0, cw, ch);

      // Smooth interpolate mouse influence
      mouseRef.current.inside +=
        (mouseRef.current.targetInside - mouseRef.current.inside) * 0.1;
      const hoverBoost = mouseRef.current.inside;

      // Heartbeat timing — ARCA 60bpm (1s cycle), NULL 120bpm (0.5s cycle)
      const bpm = isRedTeam ? 0.5 : 1.0;
      const beat = heartbeatIntensity(elapsed / bpm);

      // NULL occasional glitches
      if (isRedTeam && Math.random() > 0.985) {
        glitchRef.current = 1;
      }
      glitchRef.current *= 0.88;
      const glitch = glitchRef.current;

      // Background radial glow — synced with heartbeat + hover
      const glowRadius = 24 + beat * 8 + hoverBoost * 6;
      const glowAlpha = 0.15 + beat * 0.25 + hoverBoost * 0.1;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
      grad.addColorStop(
        0,
        `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${glowAlpha})`
      );
      grad.addColorStop(1, `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Solid background disc — the "button body"
      ctx.fillStyle = `rgba(10, 10, 15, 0.85)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fill();

      // Outer border ring
      ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${0.4 + hoverBoost * 0.4})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.stroke();

      if (!prefersReduced) {
        // Orbital rings — 3 tilted ellipses rotating in 3D
        const ringConfigs = [
          { radius: 22, speed: 0.4, tilt: 0.55, phase: 0 },
          { radius: 17, speed: -0.6, tilt: 0.75, phase: Math.PI / 3 },
          { radius: 12, speed: 0.9, tilt: 0.35, phase: Math.PI / 2 },
        ];

        ringConfigs.forEach((ring, i) => {
          const rot = elapsed * ring.speed + ring.phase;
          const tiltMod = ring.tilt + Math.sin(elapsed * 0.5 + i) * 0.08;
          const ry = ring.radius * Math.cos(tiltMod);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);
          ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${0.22 + beat * 0.15 + hoverBoost * 0.2})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, ring.radius, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });

        // Orbital particles — each follows a ring with 3D depth simulation
        for (const p of particlesRef.current) {
          const ring = ringConfigs[p.ringIdx];
          const angle = elapsed * ring.speed * 1.8 + p.angleOffset;
          const tiltMod = ring.tilt + Math.sin(elapsed * 0.5 + p.ringIdx) * 0.08;

          // Position on tilted ellipse
          const localX = Math.cos(angle) * ring.radius;
          const localY = Math.sin(angle) * ring.radius * Math.cos(tiltMod);

          // Rotate by ring phase to match ring
          const cosP = Math.cos(ring.phase + elapsed * ring.speed * 0.3);
          const sinP = Math.sin(ring.phase + elapsed * ring.speed * 0.3);
          const px = cx + localX * cosP - localY * sinP;
          const py = cy + localX * sinP + localY * cosP;

          // Depth cue — particles "behind" (negative Y before rotation) are smaller and more transparent
          const depth = (Math.sin(angle + p.tiltPhase) + 1) / 2; // 0 (back) to 1 (front)
          const particleSize = p.size * (0.5 + depth * 1.1) * (1 + hoverBoost * 0.4);
          const particleAlpha = 0.35 + depth * 0.55 + beat * 0.1;

          ctx.fillStyle = `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, ${particleAlpha})`;
          ctx.shadowColor = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${depth * 0.8})`;
          ctx.shadowBlur = 6 * depth;
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      // Central core — pulsating
      const coreRadius = 3 + beat * 4 + hoverBoost * 1.5;
      const coreGlowRadius = coreRadius + 5 + beat * 6;

      // Core glow
      const coreGrad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        coreGlowRadius
      );
      coreGrad.addColorStop(
        0,
        `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, ${0.8 + beat * 0.2})`
      );
      coreGrad.addColorStop(
        0.4,
        `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${0.5 + beat * 0.3})`
      );
      coreGrad.addColorStop(
        1,
        `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0)`
      );
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core solid — glitch offset in NULL mode
      const coreX = cx + glitch * (Math.random() - 0.5) * 6;
      const coreY = cy + glitch * (Math.random() - 0.5) * 3;

      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + beat * 0.1})`;
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner core highlight
      ctx.fillStyle = `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, 0.95)`;
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // NULL mode: horizontal glitch scanline occasionally
      if (isRedTeam && glitch > 0.3) {
        const gy = cy + (Math.random() - 0.5) * 40;
        ctx.fillStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${glitch * 0.6})`;
        ctx.fillRect(cx - 25, gy, 50, 1);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isRedTeam, primary.r, primary.g, primary.b, secondary.r, secondary.g, secondary.b]);

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat with Adrian"}
      className="group fixed bottom-6 right-6 z-40 block transition-transform duration-300 hover:scale-105"
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
        <svg
          className="pointer-events-none absolute inset-0 m-auto"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(10,10,15,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}

function ModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1">
      <button
        onClick={() => onChange("professional")}
        disabled={disabled}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          mode === "professional"
            ? "bg-[#06b6d4] text-[var(--color-bg-primary)]"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        ARCA
      </button>
      <button
        onClick={() => onChange("red_team")}
        disabled={disabled}
        className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all ${
          mode === "red_team"
            ? "bg-[#ef4444] text-[var(--color-bg-primary)]"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        NULL
      </button>
    </div>
  );
}

function MessageBubble({
  message,
  activeMode,
}: {
  message: Message;
  activeMode: Mode;
}) {
  const isUser = message.role === "user";
  const activeConfig = CONFIGS[activeMode];

  if (activeMode === "red_team") {
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[85%] font-mono text-xs">
          {isUser ? (
            <div
              className="rounded border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] px-3 py-2 text-[var(--color-text-secondary)]"
              style={{ color: "#ef4444" }}
            >
              <span className="opacity-60">operator@null:~$ </span>
              {message.content}
            </div>
          ) : (
            <div className="rounded border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.03)] px-3 py-2">
              <div className="mb-1 text-[10px] opacity-50" style={{ color: "#ef4444" }}>
                [null] STDOUT:
              </div>
              <div className="whitespace-pre-wrap text-[var(--color-text-primary)]">
                {message.content}
                {message.content === "" && (
                  <span className="animate-pulse" style={{ color: "#ef4444" }}>
                    █
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Professional mode
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          backgroundColor: isUser ? "var(--color-bg-tertiary)" : activeConfig.colorSoft,
          color: isUser ? "var(--color-text-primary)" : activeConfig.color,
          border: isUser ? "1px solid var(--color-border)" : `1px solid ${activeConfig.borderColor}`,
        }}
      >
        {isUser ? "U" : activeConfig.avatar}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
            : "rounded-tl-sm bg-[rgba(6,182,212,0.08)] text-[var(--color-text-primary)]"
        }`}
        style={
          !isUser
            ? { border: `1px solid ${activeConfig.borderColor}` }
            : undefined
        }
      >
        <p className="whitespace-pre-wrap">
          {message.content}
          {message.content === "" && (
            <span className="inline-block h-4 w-1.5 animate-pulse" style={{ backgroundColor: activeConfig.color }} />
          )}
        </p>
      </div>
    </div>
  );
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("professional");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const config = CONFIGS[mode];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      setError(null);

      const userMsg: Message = { role: "user", content: text };
      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setStreaming(true);

      try {
        const history = messages
          .slice(-8)
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            mode,
            history,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: accumulated,
            };
            return updated;
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Connection failed";
        setError(msg);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            updated.pop();
          }
          return updated;
        });
      } finally {
        setStreaming(false);
      }
    },
    [mode, messages, streaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleModeChange = (newMode: Mode) => {
    if (streaming) return;
    setMode(newMode);
    setError(null);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const isRedTeam = mode === "red_team";

  return (
    <>
      <SentientCore isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} mode={mode} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-40 flex h-[min(600px,calc(100vh-8rem))] w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              border: `1px solid ${config.borderColor}`,
              boxShadow: `0 0 40px ${config.colorSoft}, 0 20px 50px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {/* Red team scanline overlay */}
            {isRedTeam && (
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.3) 2px, rgba(239,68,68,0.3) 4px)",
                }}
              />
            )}

            {/* Header */}
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: config.borderColor, backgroundColor: config.colorSoft }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  key={mode}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
                  style={{
                    backgroundColor: config.color,
                    color: "var(--color-bg-primary)",
                    boxShadow: `0 0 20px ${config.colorSoft}`,
                  }}
                >
                  {config.avatar}
                </motion.div>
                <div>
                  <div
                    className={`text-base font-bold ${isRedTeam ? "font-mono" : ""}`}
                    style={{ color: config.color }}
                  >
                    {config.name}
                  </div>
                  <div
                    className={`text-[10px] ${isRedTeam ? "font-mono" : ""} text-[var(--color-text-muted)]`}
                  >
                    {config.tagline}
                  </div>
                </div>
              </div>
              <ModeToggle mode={mode} onChange={handleModeChange} disabled={streaming} />
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className={`flex-1 space-y-3 overflow-y-auto p-4 ${config.fontClass}`}
            >
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold"
                    style={{
                      backgroundColor: config.colorSoft,
                      color: config.color,
                      border: `1px solid ${config.borderColor}`,
                    }}
                  >
                    {config.avatar}
                  </div>
                  <p className={`mb-1 text-sm font-semibold ${isRedTeam ? "font-mono" : ""}`}>
                    {isRedTeam ? "> null.init" : `Hi, I'm ${config.name}`}
                  </p>
                  <p
                    className={`mb-6 max-w-[280px] text-xs ${isRedTeam ? "font-mono" : ""} text-[var(--color-text-muted)]`}
                  >
                    {isRedTeam
                      ? "operator connected. ask anything about adrian. no filter."
                      : "Ask me anything about Adrian Infantes — his experience, projects, skills, or availability."}
                  </p>
                  <div className="flex flex-col gap-2 w-full max-w-[280px]">
                    {config.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors hover:border-opacity-80 ${config.fontClass}`}
                        style={{
                          borderColor: config.borderColor,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {isRedTeam ? "> " : ""}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <MessageBubble key={i} message={m} activeMode={mode} />
                ))
              )}
              {error && (
                <div
                  className={`rounded border px-3 py-2 text-xs ${isRedTeam ? "font-mono" : ""}`}
                  style={{
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    backgroundColor: "rgba(239, 68, 68, 0.05)",
                    color: "#ef4444",
                  }}
                  role="alert"
                >
                  {isRedTeam ? "[ERROR] " : ""}
                  {error}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t p-3"
              style={{ borderColor: config.borderColor }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={streaming}
                  placeholder={config.inputPlaceholder}
                  maxLength={2000}
                  className={`flex-1 rounded-lg border bg-[var(--color-bg-primary)] px-3 py-2 text-sm outline-none transition-colors ${config.fontClass} disabled:opacity-50`}
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = config.color;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${config.fontClass}`}
                  style={{
                    backgroundColor: config.color,
                    color: "var(--color-bg-primary)",
                  }}
                >
                  {streaming ? "..." : isRedTeam ? "exec" : "Send"}
                </button>
              </div>
              <div
                className={`mt-2 text-center text-[9px] ${isRedTeam ? "font-mono" : ""} text-[var(--color-text-muted)]/40`}
              >
                {isRedTeam
                  ? `llama-3.3-70b // groq // persona: null.shadow`
                  : `Powered by Llama 3.3 70B via Groq — no conversation is stored`}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
