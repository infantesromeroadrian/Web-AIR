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

function ChatButton({
  isOpen,
  onClick,
  mode,
}: {
  isOpen: boolean;
  onClick: () => void;
  mode: Mode;
}) {
  const config = CONFIGS[mode];

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat with Adrian"}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: config.color,
        boxShadow: `0 0 30px ${config.colorSoft}, 0 10px 40px rgba(0, 0, 0, 0.4)`,
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.svg
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0a0a0f"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </motion.svg>
        ) : (
          <motion.svg
            key="chat"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0a0a0f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </motion.svg>
        )}
      </AnimatePresence>
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
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} mode={mode} />

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
