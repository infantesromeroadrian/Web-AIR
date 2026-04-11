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

interface GraphNode {
  baseAngle: number;
  baseRadius: number;
  jitterSeed: number;
  size: number;
  isActive: boolean;
  connections: number[];
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
  const mouseRef = useRef({ inside: 0, targetInside: 0 });
  const nodesRef = useRef<GraphNode[]>([]);
  const startRef = useRef<number>(0);

  const isRedTeam = mode === "red_team";
  const primary = isRedTeam
    ? { r: 239, g: 68, b: 68 }
    : { r: 6, g: 182, b: 212 };

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

      // Active nodes: triangle marker oriented outward, mode-colored
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
  }, [isRedTeam, primary.r, primary.g, primary.b]);

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
          stroke="rgba(245,248,252,0.95)"
          strokeWidth="2.5"
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
