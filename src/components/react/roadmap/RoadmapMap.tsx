import React, { type FC, useEffect, useState } from "react";
import type { EvolutionStage } from "../../../data/roadmap";
import type { AppState, Lang, RoadmapNode, TierLabel, TierStat } from "./types";
import { tSt } from "./state";

const PER_ROW_DESKTOP = 7;
const PER_ROW_MOBILE = 4;

const SECTOR_BG: Record<number, string> = {
  1: "from-accent-green/[.03] to-blue-500/[.03]",
  2: "from-blue-500/[.03] to-accent/[.03]",
  3: "from-accent-red/[.05] to-accent-amber/[.03]",
  4: "from-purple-500/[.04] to-pink-500/[.03]",
};

const SECTOR_TEXT: Record<number, string> = {
  1: "text-accent-green/70",
  2: "text-accent/70",
  3: "text-accent-red/70",
  4: "text-purple-400/70",
};

const TIER_BAR_COLOR: Record<number, string> = {
  1: "#10b981",
  2: "#06b6d4",
  3: "#ef4444",
  4: "#a855f7",
};

interface Props {
  nodes: RoadmapNode[];
  state: AppState;
  currentIdx: number;
  evo: EvolutionStage & { idx: number };
  lang: Lang;
  tierStats: Record<number, TierStat>;
  tierMeta: Record<number, TierLabel>;
  onNodeClick: (idx: number) => void;
}

const RoadmapMap: FC<Props> = ({
  nodes,
  state,
  currentIdx,
  evo,
  lang,
  tierStats,
  tierMeta,
  onNodeClick,
}) => {
  const [perRow, setPerRow] = useState(PER_ROW_MOBILE);

  useEffect(() => {
    const syncPerRow = () => {
      const width = window.innerWidth;
      setPerRow(width < 640 ? PER_ROW_MOBILE : width < 1024 ? 5 : PER_ROW_DESKTOP);
    };

    syncPerRow();
    window.addEventListener("resize", syncPerRow);
    return () => window.removeEventListener("resize", syncPerRow);
  }, []);

  const rows: RoadmapNode[][] = [];
  for (let i = 0; i < nodes.length; i += perRow) rows.push(nodes.slice(i, i + perRow));

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-8">
      {rows.map((row, ri) => {
        const rtl = ri % 2 === 1;
        const displayRow = rtl ? [...row].reverse() : row;
        const firstTier = row[0].tier;
        const prevTier = ri > 0 ? rows[ri - 1][0].tier : 0;
        const showSector = firstTier !== prevTier;

        const tierPct = tierStats[firstTier]?.pct ?? 0;
        const tierPhases = tierStats[firstTier]?.phases ?? 0;
        const tierLabel = tierMeta[firstTier];

        return (
          <div key={ri}>
            {showSector && (
              <div className={`relative rounded-sm py-3 bg-gradient-to-b ${SECTOR_BG[firstTier]}`}>
                <div className="flex items-center justify-between px-4 gap-3">
                  <div className={`text-[10px] font-black tracking-[4px] uppercase ${SECTOR_TEXT[firstTier]}`}>
                    {tierLabel?.sub} // {tierLabel?.name}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono">
                    <span className={SECTOR_TEXT[firstTier]}>
                      {tierPhases} {lang === "es" ? "fases" : "phases"}
                    </span>
                    <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${tierPct}%`, background: TIER_BAR_COLOR[firstTier] }}
                      />
                    </div>
                    <span
                      className={`font-black ${SECTOR_TEXT[firstTier]}`}
                      style={{ minWidth: "2.5em", textAlign: "right" }}
                    >
                      {tierPct}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {ri > 0 && (
              <div className={`flex ${rtl ? "justify-start" : "justify-end"} px-8 h-5`}>
                <div
                  className={`w-5 h-5 border border-dashed border-border/20 ${
                    rtl ? "rounded-bl-lg border-t-0 border-r-0" : "rounded-br-lg border-t-0 border-l-0"
                  }`}
                />
              </div>
            )}

            <div className={`flex items-center justify-center gap-0 px-4 py-4 ${rtl ? "flex-row-reverse" : ""}`}>
              {displayRow.map((n, ni) => {
                const globalIdx = ri * perRow + (rtl ? row.length - 1 - ni : ni);
                const st = tSt(state, n.pi, n.ti, n);
                const isCurrent = globalIdx === currentIdx;

                const nodeIcon = st === "done" ? "✓" : st === "prog" ? "◈" : n.boss ? "⚡" : "•";
                const borderStyle =
                  st === "done"
                    ? "border-accent-green bg-accent-green/10 shadow-[0_0_10px_rgba(16,185,129,.25)]"
                    : st === "prog"
                    ? "border-accent bg-accent/10 shadow-[0_0_10px_rgba(6,182,212,.2)]"
                    : n.st === "opt"
                    ? "border-purple-500/50 border-dashed bg-purple-500/5"
                    : "border-border bg-bg-tertiary/50";

                return (
                  <React.Fragment key={globalIdx}>
                    <button
                      type="button"
                      aria-label={n.name}
                      aria-haspopup="dialog"
                      className="group relative h-14 w-14 shrink-0 cursor-pointer transition-colors sm:h-16 sm:w-16"
                      onClick={() => onNodeClick(globalIdx)}
                    >
                      {n.h > 0 && (
                        <div className="absolute -top-1 -left-1 text-[7px] bg-black/70 text-text-muted px-1 rounded font-mono pointer-events-none z-10">
                          ~{n.h}h
                        </div>
                      )}
                      <div
                        className={`m-1.5 flex h-10 w-10 items-center justify-center rounded-lg border-[2px] text-center text-[8px] font-bold leading-tight transition-all sm:h-11 sm:w-11 ${borderStyle}`}
                      >
                        <span className="text-[10px]">{nodeIcon}</span>
                      </div>
                      <div className="pointer-events-none absolute -bottom-2 left-1/2 max-w-[56px] -translate-x-1/2 truncate whitespace-nowrap text-center text-[6px] uppercase tracking-wider text-text-muted sm:max-w-[70px] sm:text-[7px]">
                        {n.name}
                      </div>
                      {isCurrent && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none">
                          <img
                            src="/roadmap/roadmap-current.png"
                            alt=""
                            className="w-8 h-8 rounded-md object-cover border border-accent"
                            style={{ boxShadow: `0 0 10px ${evo.glow}`, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}
                          />
                        </div>
                      )}
                    </button>
                    {ni < displayRow.length - 1 && (
                      <div className="h-px min-w-2 flex-1 border-t border-dashed border-border/25 sm:max-w-14" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="py-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg border-2 border-accent-red bg-accent-red/10 text-xs font-black tracking-tighter text-accent-red shadow-[0_0_25px_rgba(239,68,68,.3)]">
          1%
        </div>
        <div className="mt-2 font-mono text-[10px] font-bold tracking-[3px] text-accent-red">TOP 1% TARGET</div>
        <div className="mt-0.5 text-[10px] text-text-muted">Anthropic // OpenAI // Microsoft // Google</div>
      </div>
    </div>
  );
};

export default RoadmapMap;
