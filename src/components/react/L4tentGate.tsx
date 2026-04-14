import { useState, useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

const STORAGE_KEY = "l4tent_access";
const HASH = "a7f3b2c1d4e5"; // not the real check, just a marker

export default function L4tentGate({ children }: Props) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === HASH) {
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (!authorized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [authorized]);

  const verify = (code: string): boolean => {
    const expected = [76,52,116,101,110,116,78,111,105,115,101,55,49,51,52];
    if (code.length !== expected.length) return false;
    let match = true;
    for (let i = 0; i < expected.length; i++) {
      if (code.charCodeAt(i) !== expected[i]) match = false;
    }
    return match;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verify(input)) {
      sessionStorage.setItem(STORAGE_KEY, HASH);
      setAuthorized(true);
    } else {
      setError(true);
      setAttempts(a => a + 1);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  };

  if (authorized) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ width: "100%", maxWidth: 440, padding: "0 1.5rem" }}>
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          background: "rgba(18,18,26,0.9)",
          padding: "2rem",
        }}>
          <div style={{
            fontSize: "0.6rem", letterSpacing: "0.3em",
            color: "#ef4444", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#ef4444",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            RESTRICTED ACCESS
          </div>

          <div style={{
            fontSize: "0.75rem", color: "#71717a",
            marginBottom: "0.5rem", lineHeight: 1.6,
          }}>
            <span style={{ color: "#06b6d4" }}>$</span> ssh root@l4tentnoise.local<br />
            <span style={{ color: "#10b981" }}>Connection established.</span><br />
            <span style={{ color: "#71717a" }}>Enter access code to continue:</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: "1rem",
            }}>
              <span style={{ color: "#06b6d4", fontSize: "0.8rem" }}>{">"}</span>
              <input
                ref={inputRef}
                type="password"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="access_code"
                autoComplete="off"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: error ? "#ef4444" : "#e4e4e7",
                  fontFamily: "inherit",
                  fontSize: "0.85rem",
                  caretColor: "#06b6d4",
                }}
              />
            </div>
            <div style={{
              height: 1,
              background: error
                ? "#ef4444"
                : "rgba(255,255,255,0.08)",
              marginTop: 4,
              transition: "background 0.3s",
            }} />
          </form>

          {error && (
            <div style={{
              marginTop: "0.75rem",
              fontSize: "0.65rem",
              color: "#ef4444",
              letterSpacing: "0.1em",
            }}>
              ACCESS DENIED {attempts > 2 ? "— intrusion logged" : ""}
            </div>
          )}

          <div style={{
            marginTop: "1.5rem",
            fontSize: "0.55rem",
            color: "rgba(113,113,122,0.4)",
            textAlign: "center",
          }}>
            This session is monitored.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
