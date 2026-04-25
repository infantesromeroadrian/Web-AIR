import { useState, type FC, type ReactNode } from "react";
import { isClient } from "./state";

const TOKEN_KEY = "rmv5_auth_token";

export function isTokenValid(raw: string | null): boolean {
  if (!raw) return false;
  const dot = raw.indexOf(".");
  if (dot <= 0 || dot === raw.length - 1) return false;
  const exp = Number(raw.slice(0, dot));
  if (!Number.isFinite(exp)) return false;
  return exp > Date.now();
}

interface Props {
  children: ReactNode;
}

const PinGate: FC<Props> = ({ children }) => {
  const [authed, setAuthed] = useState(
    () => isClient && isTokenValid(sessionStorage.getItem(TOKEN_KEY))
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (authed) return <>{children}</>;

  const check = async () => {
    if (busy) return;
    if (!input.trim()) {
      setError("ACCESS DENIED");
      setTimeout(() => setError(null), 1500);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/l4-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: input }),
      });
      if (res.status === 200) {
        const data = await res.json();
        if (typeof data.token === "string" && isTokenValid(data.token)) {
          sessionStorage.setItem(TOKEN_KEY, data.token);
          setAuthed(true);
          return;
        }
        setError("ACCESS DENIED");
      } else if (res.status === 429) {
        setError("RATE LIMITED");
      } else if (res.status === 503) {
        setError("GATE OFFLINE");
      } else {
        setError("ACCESS DENIED");
      }
    } catch {
      setError("NETWORK ERROR");
    } finally {
      setBusy(false);
      setInput("");
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-xs">
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden border border-border opacity-80">
          <img src="/roadmap/l4-real.png" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-2 left-0 right-0 text-center font-mono text-accent text-xs tracking-[4px]">[&gt;_]</div>
        </div>
        <h2 className="text-lg font-mono font-bold text-text-primary mb-1 tracking-wider">CLASSIFIED ACCESS</h2>
        <p className="text-xs text-text-muted mb-4 font-mono">Enter clearance code</p>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="..."
          autoFocus
          disabled={busy}
          className={`w-full px-4 py-2 rounded bg-bg-tertiary border ${error ? "border-accent-red" : "border-border"} text-text-primary text-center font-mono text-lg tracking-[.3em] focus:outline-none focus:border-accent transition-colors disabled:opacity-50`}
        />
        <button
          onClick={check}
          disabled={busy}
          className="mt-3 px-6 py-2 rounded bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold hover:bg-accent/20 transition-colors tracking-wider disabled:opacity-50"
        >
          {busy ? "VERIFYING..." : "ACCESS"}
        </button>
        {error && <p className="text-accent-red text-xs mt-2 font-mono">{error}</p>}
      </div>
    </div>
  );
};

export default PinGate;
