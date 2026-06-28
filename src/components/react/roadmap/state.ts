import {
  EVOLUTIONS,
  PHASE_WEIGHTS,
  ROADMAP,
  type Topic,
} from "../../../data/roadmap";
import type { AppState, RoadmapNode } from "./types";

export const KEY = "air-roadmap";
export const isClient = typeof window !== "undefined";

export const emptyState = (): AppState => ({ items: {}, cycle: {}, activity: [] });

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function sanitizeItems(raw: unknown): Record<string, number> {
  if (!isPlainObject(raw)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof k !== "string" || k.length > 32) continue;
    const n = typeof v === "number" ? Math.trunc(v) : NaN;
    if (n === 0 || n === 1 || n === 2) out[k] = n;
  }
  return out;
}

function sanitizeCycle(raw: unknown): Record<string, number[]> {
  if (!isPlainObject(raw)) return {};
  const out: Record<string, number[]> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof k !== "string" || k.length > 32) continue;
    if (!Array.isArray(v) || v.length !== 4) continue;
    const arr = v.map((x) => (x === 1 ? 1 : 0));
    out[k] = arr;
  }
  return out;
}

function sanitizeActivity(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of raw) {
    if (typeof v !== "string" || !ISO_DATE.test(v) || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
    if (out.length >= 730) break;
  }
  return out;
}

export function parseState(raw: unknown): AppState {
  if (!isPlainObject(raw)) return emptyState();
  return {
    items: sanitizeItems(raw.items),
    cycle: sanitizeCycle(raw.cycle),
    activity: sanitizeActivity(raw.activity),
  };
}

export const loadState = (): AppState => {
  if (!isClient) return emptyState();
  const raw = localStorage.getItem(KEY);
  if (!raw) return emptyState();
  try {
    return parseState(JSON.parse(raw));
  } catch {
    return emptyState();
  }
};

export const saveState = (s: AppState) => {
  if (isClient) localStorage.setItem(KEY, JSON.stringify(s));
};

export const getState = (): AppState => loadState();

export const iSt = (s: AppState, p: number, t: number, i: number) =>
  s.items[`${p}-${t}-${i}`] || 0;

export const cSt = (s: AppState, p: number, t: number) =>
  s.cycle[`${p}-${t}`] || [0, 0, 0, 0];

export function tSt(s: AppState, p: number, t: number, tp: Topic): string {
  const it = tp.items || [];
  if (!it.length) return tp.st;
  let d = 0, pr = 0;
  it.forEach((_, i) => {
    const v = iSt(s, p, t, i);
    if (v === 2) d++;
    else if (v === 1) pr++;
  });
  if (d === it.length) return "done";
  if (d > 0 || pr > 0) return "prog";
  return tp.st;
}

export function comp1(s: AppState): number {
  let sc = 0, pi = 0;
  ROADMAP.forEach((t) =>
    t.phases.forEach((ph) => {
      const w = PHASE_WEIGHTS[ph.id] || 0;
      let ti = 0, pts = 0;
      ph.topics.forEach((t2, i) => {
        const it = t2.items || [];
        if (it.length) {
          it.forEach((_, j) => {
            ti++;
            const v = iSt(s, pi, i, j);
            if (v === 2) pts += 1;
            else if (v === 1) pts += 0.5;
          });
        } else {
          ti++;
          const st = tSt(s, pi, i, t2);
          if (st === "done") pts += 1;
          else if (st === "prog") pts += 0.5;
        }
      });
      if (ti) sc += (pts / ti) * w;
      pi++;
    })
  );
  return Math.round(sc);
}

export function flattenNodes(): RoadmapNode[] {
  const nodes: RoadmapNode[] = [];
  let pi = 0;
  ROADMAP.forEach((tier) =>
    tier.phases.forEach((ph) => {
      ph.topics.forEach((tp, ti) => {
        nodes.push({
          ...tp,
          pi,
          ti,
          phId: ph.id,
          phName: ph.name,
          tier: tier.tier,
          tierName: tier.name,
        });
      });
      pi++;
    })
  );
  return nodes;
}

export const getEvo = (p: number) => {
  for (let i = EVOLUTIONS.length - 1; i >= 0; i--) {
    if (p >= EVOLUTIONS[i].min) return { ...EVOLUTIONS[i], idx: i };
  }
  return { ...EVOLUTIONS[0], idx: 0 };
};
