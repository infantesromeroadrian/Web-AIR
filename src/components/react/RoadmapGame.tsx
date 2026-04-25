import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
} from "react";
import { ROADMAP } from "../../data/roadmap";
import PinGate from "./roadmap/PinGate";
import RoadmapHud from "./roadmap/RoadmapHud";
import EvolutionCard from "./roadmap/EvolutionCard";
import RoadmapMap from "./roadmap/RoadmapMap";
import MissionBriefingModal from "./roadmap/MissionBriefingModal";
import { seedIfEmpty } from "./roadmap/seed";
import {
  KEY,
  comp1,
  emptyState,
  flattenNodes,
  getEvo,
  getState,
  iSt,
  isClient,
  parseState,
  saveState,
  tSt,
} from "./roadmap/state";
import type { AppState, Lang, TierLabel, TierStat } from "./roadmap/types";

const RoadmapGame: FC<{ lang: Lang }> = ({ lang }) => {
  const [state, setState] = useState<AppState>(() => {
    if (!isClient) return emptyState();
    seedIfEmpty();
    return getState();
  });
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  const nodes = useMemo(() => flattenNodes(), []);

  useEffect(() => {
    if (!isClient) return;
    seedIfEmpty();
    setState(getState());
  }, []);

  const refresh = useCallback(() => setState(getState()), []);

  const recordActivity = (s: AppState) => {
    const t = new Date().toISOString().slice(0, 10);
    if (!s.activity.includes(t)) s.activity.push(t);
  };

  const toggleItem = useCallback((pi: number, ti: number, ii: number) => {
    const s = getState();
    const k = `${pi}-${ti}-${ii}`;
    s.items[k] = ((s.items[k] || 0) + 1) % 3;
    recordActivity(s);
    saveState(s);
    refresh();
  }, [refresh]);

  const toggleCycle = useCallback((pi: number, ti: number, ci: number) => {
    const s = getState();
    const k = `${pi}-${ti}`;
    const c = s.cycle[k] || [0, 0, 0, 0];
    c[ci] = c[ci] ? 0 : 1;
    s.cycle[k] = c;
    recordActivity(s);
    saveState(s);
    refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    let doneC = 0, progC = 0, pendC = 0, certC = 0, pi = 0;
    ROADMAP.forEach((t) =>
      t.phases.forEach((ph) => {
        ph.topics.forEach((t2, i) => {
          const st = tSt(state, pi, i, t2);
          if (st === "done") doneC++;
          else if (st === "prog") progC++;
          else pendC++;
          (t2.tags || []).forEach((tg) => {
            if (tg.t === "cert") certC++;
          });
        });
        pi++;
      })
    );
    return { doneC, progC, pendC, certC };
  }, [state]);

  const streak = useMemo(() => {
    const days = [...state.activity].sort().reverse();
    if (!days.length) return 0;
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const ds = d.toISOString().slice(0, 10);
      if (days.includes(ds)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else if (i === 0) {
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [state.activity]);

  const pct = useMemo(() => comp1(state), [state]);
  const evo = useMemo(() => getEvo(pct), [pct]);

  const currentIdx = useMemo(() => {
    const idx = nodes.findIndex((n) => tSt(state, n.pi, n.ti, n) !== "done");
    return idx === -1 ? nodes.length - 1 : idx;
  }, [nodes, state]);

  const tierStats = useMemo(() => {
    const out: Record<number, TierStat> = {};
    ROADMAP.forEach((t) => {
      let total = 0, pts = 0, pi = 0;
      ROADMAP.forEach((t2) =>
        t2.phases.forEach((ph) => {
          if (t2.tier === t.tier) {
            ph.topics.forEach((tp2, i2) => {
              const items2 = tp2.items || [];
              if (items2.length) {
                items2.forEach((_, j2) => {
                  total++;
                  const v = iSt(state, pi, i2, j2);
                  if (v === 2) pts += 1;
                  else if (v === 1) pts += 0.5;
                });
              } else {
                total++;
                const stx = tSt(state, pi, i2, tp2);
                if (stx === "done") pts += 1;
                else if (stx === "prog") pts += 0.5;
              }
            });
          }
          pi++;
        })
      );
      out[t.tier] = { pct: total ? Math.round((pts / total) * 100) : 0, phases: t.phases.length };
    });
    return out;
  }, [state]);

  const tierMeta = useMemo(() => {
    const out: Record<number, TierLabel> = {};
    ROADMAP.forEach((t) => {
      out[t.tier] = { sub: t.sub, name: t.name };
    });
    return out;
  }, []);

  const exportState = useCallback(() => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `l4tentnoise-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }, []);

  const importState = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 256 * 1024) {
      alert("Import rejected: file exceeds 256 KB.");
      e.target.value = "";
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      try {
        const validated = parseState(JSON.parse(r.result as string));
        saveState(validated);
        location.reload();
      } catch {
        alert("Import rejected: invalid JSON or schema.");
      }
    };
    r.readAsText(f);
  }, []);

  const purgeState = useCallback(() => {
    if (!confirm("PURGE ALL DATA?")) return;
    localStorage.removeItem(KEY);
    location.reload();
  }, []);

  const modalNode = modalIdx !== null ? nodes[modalIdx] : null;

  return (
    <PinGate>
      <div className="relative font-mono" style={{ fontSize: "103%" }}>
        <div className="relative h-48 overflow-hidden">
          <img
            src="/roadmap/l4-real.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/60 to-bg-primary" />
          <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4">
            <div className="text-[10px] tracking-[6px] text-accent/60 font-mono uppercase">
              Operational Dashboard
            </div>
            <h1 className="text-2xl font-mono font-black tracking-tight text-text-primary mt-1">
              L4tentNoise
            </h1>
            <p className="text-[10px] text-text-muted font-mono tracking-wider mt-0.5">
              AI Security Engineer Roadmap // {lang === "es" ? "Clasificado" : "Classified"}
            </p>
          </div>
        </div>

        <RoadmapHud
          lang={lang}
          evo={evo}
          pct={pct}
          doneCount={stats.doneC}
          progCount={stats.progC}
          pendCount={stats.pendC}
          certCount={stats.certC}
          streak={streak}
          onExport={exportState}
          onImport={importState}
          onPurge={purgeState}
        />

        <EvolutionCard lang={lang} evo={evo} />

        <RoadmapMap
          nodes={nodes}
          state={state}
          currentIdx={currentIdx}
          evo={evo}
          tierStats={tierStats}
          tierMeta={tierMeta}
          onNodeClick={setModalIdx}
        />

        {modalNode && (
          <MissionBriefingModal
            node={modalNode}
            state={state}
            onClose={() => setModalIdx(null)}
            onToggleItem={toggleItem}
            onToggleCycle={toggleCycle}
          />
        )}
      </div>
    </PinGate>
  );
};

export default RoadmapGame;
