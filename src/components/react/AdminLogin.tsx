import { useState, type FormEvent } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/analytics/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }

      // Success — reload to access dashboard with cookie
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-xl font-bold text-[var(--color-accent)]">
            A
          </div>
          <h1 className="font-mono text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
            // restricted access
          </h1>
          <p className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">
            Analytics Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]"
            >
              password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
              autoFocus
              autoComplete="current-password"
              maxLength={200}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2.5 font-mono text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)] disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="rounded-lg border border-[var(--color-accent-red)]/30 bg-[var(--color-accent-red)]/5 px-4 py-2.5 font-mono text-xs text-[var(--color-accent-red)]"
              role="alert"
            >
              [ERROR] {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!password || submitting}
            className="w-full rounded-lg bg-[var(--color-accent)] py-2.5 font-mono text-sm font-semibold text-[var(--color-bg-primary)] transition-all hover:bg-[var(--color-accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "authenticating..." : "authenticate"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] text-[var(--color-text-muted)]/40">
          session: 8 hours · cookie: httpOnly secure sameSite=strict
        </p>
      </div>
    </div>
  );
}
