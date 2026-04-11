import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Snapshot {
  total: number;
  paths: Array<{ path: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  referrers: Array<{ referrer: string; count: number }>;
  dailyVisits: Array<{ day: string; count: number }>;
  firstVisit: string | null;
  lastVisit: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "never";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function percentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2 || code === "unknown") return "🌐";
  const offset = 127397;
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => c.charCodeAt(0) + offset)
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-5">
      <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold text-[var(--color-accent)]">{value}</div>
      {sub && <div className="mt-1 text-xs text-[var(--color-text-muted)]">{sub}</div>}
    </div>
  );
}

function BarRow({
  label,
  count,
  total,
  maxBarWidth = 100,
}: {
  label: string;
  count: number;
  total: number;
  maxBarWidth?: number;
}) {
  const pct = total > 0 ? (count / total) * maxBarWidth : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-32 shrink-0 truncate font-mono text-xs text-[var(--color-text-secondary)]">
        {label}
      </div>
      <div className="flex-1 overflow-hidden rounded-full bg-[var(--color-bg-primary)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-2 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)]"
        />
      </div>
      <div className="w-16 shrink-0 text-right font-mono text-xs text-[var(--color-text-muted)]">
        {count} <span className="opacity-50">({percentage(count, total)}%)</span>
      </div>
    </div>
  );
}

function DailyChart({ data }: { data: Array<{ day: string; count: number }> }) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 p-6 text-center text-xs font-mono text-[var(--color-text-muted)]">
        No daily data yet
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/50 p-4">
      <div className="flex h-32 items-end gap-1">
        {data.map((d) => {
          const height = (d.count / max) * 100;
          return (
            <div
              key={d.day}
              className="group relative flex flex-1 flex-col items-center justify-end"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-t bg-[var(--color-accent)]/70 transition-colors hover:bg-[var(--color-accent)]"
                style={{ minHeight: d.count > 0 ? "2px" : "0" }}
              />
              <div className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-[var(--color-bg-secondary)] px-2 py-1 font-mono text-[10px] text-[var(--color-text-primary)] opacity-0 shadow-lg group-hover:opacity-100">
                {d.day}: {d.count}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-[var(--color-text-muted)]">
        <span>{data[0]?.day ?? ""}</span>
        <span>{data[data.length - 1]?.day ?? ""}</span>
      </div>
    </div>
  );
}

interface Props {
  initialData: Snapshot;
}

export default function AnalyticsDashboard({ initialData }: Props) {
  const [data, setData] = useState<Snapshot>(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/analytics/data");
      if (res.ok) {
        const json: Snapshot = await res.json();
        setData(json);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const logout = async () => {
    await fetch("/api/analytics/logout", { method: "POST" });
    window.location.href = "/admin/analytics";
  };

  useEffect(() => {
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, []);

  const topPath = data.paths[0];
  const topCountry = data.countries[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Analytics</h1>
          <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">
            privacy-first // no PII // edge aggregated // auto-refresh 30s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={refreshing}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 font-mono text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
          >
            {refreshing ? "refreshing..." : "refresh"}
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 font-mono text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
          >
            logout
          </button>
        </div>
      </div>

      {/* Top-level stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total visits" value={data.total} />
        <StatCard
          label="Top path"
          value={topPath?.path ?? "—"}
          sub={topPath ? `${topPath.count} visits` : undefined}
        />
        <StatCard
          label="Top country"
          value={topCountry ? `${countryFlag(topCountry.country)} ${topCountry.country.toUpperCase()}` : "—"}
          sub={topCountry ? `${topCountry.count} visits` : undefined}
        />
        <StatCard
          label="Last visit"
          value={data.lastVisit ? formatDate(data.lastVisit).split(",")[0] : "—"}
          sub={data.lastVisit ? formatDate(data.lastVisit).split(",")[1]?.trim() : undefined}
        />
      </div>

      {/* Daily chart */}
      <div>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          daily visits (last 30 days)
        </h2>
        <DailyChart data={data.dailyVisits} />
      </div>

      {/* Grids */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Paths */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-5">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            top paths
          </h2>
          <div className="space-y-2">
            {data.paths.length === 0 ? (
              <p className="font-mono text-xs text-[var(--color-text-muted)]/50">
                no data yet
              </p>
            ) : (
              data.paths.map((p) => (
                <BarRow
                  key={p.path}
                  label={p.path}
                  count={p.count}
                  total={data.total}
                />
              ))
            )}
          </div>
        </div>

        {/* Countries */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-5">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            top countries
          </h2>
          <div className="space-y-2">
            {data.countries.length === 0 ? (
              <p className="font-mono text-xs text-[var(--color-text-muted)]/50">
                no data yet
              </p>
            ) : (
              data.countries.map((c) => (
                <BarRow
                  key={c.country}
                  label={`${countryFlag(c.country)} ${c.country.toUpperCase()}`}
                  count={c.count}
                  total={data.total}
                />
              ))
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-5">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            devices
          </h2>
          <div className="space-y-2">
            {data.devices.length === 0 ? (
              <p className="font-mono text-xs text-[var(--color-text-muted)]/50">
                no data yet
              </p>
            ) : (
              data.devices.map((d) => (
                <BarRow
                  key={d.device}
                  label={d.device}
                  count={d.count}
                  total={data.total}
                />
              ))
            )}
          </div>
        </div>

        {/* Referrers */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-5">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            top referrers
          </h2>
          <div className="space-y-2">
            {data.referrers.length === 0 ? (
              <p className="font-mono text-xs text-[var(--color-text-muted)]/50">
                no data yet
              </p>
            ) : (
              data.referrers.map((r) => (
                <BarRow
                  key={r.referrer}
                  label={r.referrer}
                  count={r.count}
                  total={data.total}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-[var(--color-text-muted)]/40">
        <span>tracking: no cookies · no fingerprinting · no PII</span>
        <span className="text-[var(--color-border-hover)]">|</span>
        <span>storage: upstash redis</span>
        <span className="text-[var(--color-border-hover)]">|</span>
        <span>first visit: {formatDate(data.firstVisit)}</span>
      </div>
    </div>
  );
}
