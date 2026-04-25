import React, { type FC } from "react";
import type { EvolutionStage } from "../../../data/roadmap";
import type { AppState, RoadmapNode, TierLabel, TierStat } from "./types";
import { tSt } from "./state";

const PER_ROW = 7;

const SECTOR_BG: Record<number, string> = {
  1: "from-accent-green/[.03] to-blue-500/[.03]",
  2: "from-blue-500/[.03] to-accent/[.03]",
  3: "from-accent-red/[.05] to-accent-amber/[.03]",
  4: "from-purple-500/[.04] to-pink-500/[.03]",
};

const SECTOR_TEXT: Record<number, string> = {
  1: "text-accent-green/30",
  2: "text-accent/30",
  3: "text-accent-red/30",
  4: "text-purple-400/30",
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
  tierStats: Record<number, TierStat>;
  tierMeta: Record<number, TierLabel>;
  onNodeClick: (idx: number) => void;
}

const RoadmapMap: FC<Props> = ({
  nodes,
  state,
  currentIdx,
  evo,
  tierStats,
  tierMeta,
  onNodeClick,
}) => {
  const rows: RoadmapNode[][] = [];
  for (let i = 0; i < nodes.length; i += PER_ROW) rows.push(nodes.slice(i, i + PER_ROW));

  return (
    <div className="max-w-[1000px] mx-auto px-4 pb-8">
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
              <div className={`relative py-3 bg-gradient-to-b ${SECTOR_BG[firstTier]}`}>
                <div className="flex items-center justify-between px-4 gap-3">
                  <div className={`text-[10px] font-black tracking-[5px] uppercase ${SECTOR_TEXT[firstTier]}`}>
                    {tierLabel?.sub} // {tierLabel?.name}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono">
                    <span className={SECTOR_TEXT[firstTier].replace("/30", "/60")}>
                      {tierPhases} fases
                    </span>
                    <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${tierPct}%`, background: TIER_BAR_COLOR[firstTier] }}
                      />
                    </div>
                    <span
                      className={`font-black ${SECTOR_TEXT[firstTier].replace("/30", "")}`}
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

            <div className={`flex items-center justify-center gap-0 py-2 px-4 ${rtl ? "flex-row-reverse" : ""}`}>
              {displayRow.map((n, ni) => {
                const globalIdx = ri * PER_ROW + (rtl ? row.length - 1 - ni : ni);
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
                    <div
                      className="relative w-14 h-14 shrink-0 cursor-pointer transition-transform hover:scale-110 group"
                      onClick={() => onNodeClick(globalIdx)}
                    >
                      {n.h > 0 && (
                        <div className="absolute -top-1 -left-1 text-[7px] bg-black/70 text-text-muted px-1 rounded font-mono pointer-events-none z-10">
                          ~{n.h}h
                        </div>
                      )}
                      <div
                        className={`w-11 h-11 rounded-lg border-[2px] flex items-center justify-center text-[8px] font-bold text-center leading-tight m-1.5 transition-all ${borderStyle}`}
                      >
                        <span className="text-[10px]">{nodeIcon}</span>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] text-text-muted whitespace-nowrap max-w-[65px] truncate pointer-events-none text-center tracking-wider uppercase">
                        {n.name}
                      </div>
                      {isCurrent && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce">
                          <img
                            src="/roadmap/l4-base.png"
                            alt=""
                            className="w-8 h-8 rounded-md object-cover border border-accent"
                            style={{ boxShadow: `0 0 10px ${evo.glow}`, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}
                          />
                        </div>
                      )}
                    </div>
                    {ni < displayRow.length - 1 && (
                      <div className="flex-1 h-px min-w-2 max-w-14 border-t border-dashed border-border/20" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-lg border-2 border-accent-red inline-flex items-center justify-center text-xs font-black tracking-tighter text-accent-red bg-accent-red/10 shadow-[0_0_25px_rgba(239,68,68,.3)]">
          1%
        </div>
        <div className="text-[10px] font-mono font-bold text-accent-red mt-2 tracking-[3px]">TARGET ACQUIRED</div>
        <div className="text-[9px] text-text-muted mt-0.5">Anthropic // OpenAI // Microsoft // Google</div>
      </div>
    </div>
  );
};

export default RoadmapMap;
