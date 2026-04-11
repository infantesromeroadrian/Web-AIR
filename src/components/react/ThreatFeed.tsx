import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CVE {
  id: string;
  published: string;
  description: string;
  score: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  url: string;
}

interface ThreatFeedResponse {
  cves: CVE[];
  count: number;
  updated: string;
  source?: string;
  lookbackDays?: number;
  error?: string;
}

const severityStyle: Record<CVE["severity"], { color: string; glow: string }> = {
  CRITICAL: { color: "#ef4444", glow: "rgba(239, 68, 68, 0.3)" },
  HIGH: { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.3)" },
  MEDIUM: { color: "#06b6d4", glow: "rgba(6, 182, 212, 0.3)" },
  LOW: { color: "#a1a1aa", glow: "rgba(161, 161, 170, 0.3)" },
  NONE: { color: "#71717a", glow: "rgba(113, 113, 122, 0.2)" },
};

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m ago`;
}

function formatUpdated(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMin = Math.floor((now - then) / (1000 * 60));
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ago`;
}

export default function ThreatFeed() {
  const [data, setData] = useState<ThreatFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/api/threat-intel");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json: ThreatFeedResponse = await response.json();
        if (cancelled) return;
        if (json.error && json.cves.length === 0) {
          setError(json.error);
        } else {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch CVEs");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-6 text-center">
        <div className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-text-muted)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
          <span>Fetching latest CVEs from NVD...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--color-accent-red)]/30 bg-[var(--color-accent-red)]/5 p-6 text-center">
        <p className="font-mono text-sm text-[var(--color-accent-red)]">
          [ERROR] Threat feed unavailable: {error}
        </p>
      </div>
    );
  }

  if (!data || data.cves.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-6 text-center">
        <p className="font-mono text-sm text-[var(--color-text-muted)]">
          No critical CVEs in the last {data?.lookbackDays ?? 14} days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-red)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-red)]" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            LIVE FEED
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--color-text-muted)]">
          <span>
            <span className="text-[var(--color-accent-red)]">{data.count}</span> critical CVEs
          </span>
          <span className="text-[var(--color-border-hover)]">|</span>
          <span>last {data.lookbackDays ?? 14} days</span>
          <span className="text-[var(--color-border-hover)]">|</span>
          <span>updated {formatUpdated(data.updated)}</span>
        </div>
      </div>

      {/* CVE list */}
      <div className="space-y-2">
        {data.cves.map((cve, i) => {
          const style = severityStyle[cve.severity];
          const isExpanded = expanded === cve.id;
          return (
            <motion.div
              key={cve.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="group relative overflow-hidden rounded-lg border bg-[var(--color-bg-primary)]/60 transition-all duration-200"
              style={{
                borderColor: `${style.color}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = style.color;
                e.currentTarget.style.boxShadow = `0 0 20px ${style.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${style.color}33`;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : cve.id)}
                className="w-full px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider"
                    style={{
                      color: style.color,
                      backgroundColor: `${style.color}15`,
                      border: `1px solid ${style.color}40`,
                    }}
                  >
                    {cve.severity}
                  </span>
                  <span
                    className="shrink-0 font-mono text-[10px] font-bold"
                    style={{ color: style.color }}
                  >
                    {cve.score.toFixed(1)}
                  </span>
                  <span className="shrink-0 font-mono text-xs font-medium text-[var(--color-text-primary)]">
                    {cve.id}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[10px] text-[var(--color-text-muted)]">
                    {formatRelative(cve.published)}
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {cve.description}
                      </p>
                      <a
                        href={cve.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        view on nvd.nist.gov
                        <span>&rarr;</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-[var(--color-text-muted)]/40">
        <span>source: nvd.nist.gov</span>
        <span className="text-[var(--color-border-hover)]">|</span>
        <span>edge cached 1h, stale-while-revalidate 2h</span>
        <span className="text-[var(--color-border-hover)]">|</span>
        <a
          href="https://nvd.nist.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[var(--color-accent)]"
        >
          NVD
        </a>
      </div>
    </div>
  );
}
