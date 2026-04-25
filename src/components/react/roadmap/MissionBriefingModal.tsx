import type { FC } from "react";
import type { AppState, RoadmapNode } from "./types";
import { cSt, iSt, tSt } from "./state";

const ICONS = ["•", "◈", "✓"];
const ICON_CLS = ["text-text-muted", "text-accent", "text-accent-green"];
const CYCLE_LBL = ["R", "E", "V", "D"];
const CYCLE_TIP = ["Recon", "Execute", "Verify", "Debrief"];
const CYCLE_CLS = ["bg-blue-500", "bg-purple-500", "bg-accent", "bg-accent-green"];

interface Props {
  node: RoadmapNode;
  state: AppState;
  onClose: () => void;
  onToggleItem: (pi: number, ti: number, ii: number) => void;
  onToggleCycle: (pi: number, ti: number, ci: number) => void;
}

const MissionBriefingModal: FC<Props> = ({
  node,
  state,
  onClose,
  onToggleItem,
  onToggleCycle,
}) => {
  const status = tSt(state, node.pi, node.ti, node);
  const dotCls =
    status === "done" ? "bg-accent-green" : status === "prog" ? "bg-accent" : "bg-text-muted";
  const c = cSt(state, node.pi, node.ti);
  const showHandlerNote = node.items.some((i) => /ejercicio|proyecto|explicar/i.test(i));

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary border border-border rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp .25s ease" }}
      >
        <div className="border-b border-border px-5 py-3 flex items-center justify-between">
          <div className="text-[10px] tracking-[4px] text-accent font-bold">CLASSIFIED // MISSION BRIEFING</div>
          <button
            className="text-text-muted hover:text-text-primary text-lg leading-none"
            onClick={onClose}
            aria-label="Close briefing"
          >
            &times;
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-sm ${dotCls}`} />
            <span className="text-lg font-bold tracking-tight">
              {node.phId} // {node.name}
            </span>
          </div>

          <div className="mt-2 text-[10px] tracking-[2px] text-text-muted uppercase">OBJECTIVE</div>
          <p className="text-sm text-text-secondary">{node.detail}</p>

          {node.res && (
            <>
              <div className="mt-2 text-[10px] tracking-[2px] text-text-muted uppercase">RESOURCES</div>
              <p className="text-xs text-text-muted italic">{node.res}</p>
            </>
          )}

          <div className="flex gap-1 mt-2">
            {(node.tags || []).map((tg, i) => (
              <span
                key={i}
                className={`text-[8px] px-1.5 py-0.5 rounded font-bold tracking-wider uppercase ${
                  tg.t === "cert"
                    ? "bg-accent-green/15 text-accent-green border border-accent-green/20"
                    : tg.t === "v5"
                    ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                    : "bg-accent/15 text-accent border border-accent/20"
                }`}
              >
                {tg.l}
              </span>
            ))}
          </div>

          <div className="mt-4 text-[10px] tracking-[2px] text-text-muted uppercase">OPERATIONAL PROTOCOL</div>
          <div className="flex gap-1 mt-1">
            {CYCLE_LBL.map((l, i) => (
              <button
                key={i}
                onClick={() => onToggleCycle(node.pi, node.ti, i)}
                title={CYCLE_TIP[i]}
                className={`w-8 h-6 rounded text-[9px] font-bold flex items-center justify-center transition-all hover:scale-110 border ${
                  c[i] ? `${CYCLE_CLS[i]} text-white border-transparent` : "bg-bg-tertiary text-text-muted border-border"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="mt-4 text-[10px] tracking-[2px] text-text-muted uppercase">SUBTASKS</div>
          <div className="mt-1 border-t border-border/50 pt-2 space-y-0.5">
            {node.items.map((item, i) => {
              const v = iSt(state, node.pi, node.ti, i);
              return (
                <div
                  key={i}
                  onClick={() => onToggleItem(node.pi, node.ti, i)}
                  className="flex items-start gap-2 px-1.5 py-1 rounded cursor-pointer hover:bg-white/[.03] transition-colors select-none group"
                >
                  <span className={`w-4 text-center text-sm shrink-0 ${ICON_CLS[v]} group-hover:opacity-70`}>
                    {ICONS[v]}
                  </span>
                  <span
                    className={`text-sm leading-snug ${
                      v === 2 ? "text-text-muted line-through" : "text-text-secondary"
                    }`}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>

          {showHandlerNote && (
            <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded text-[10px] text-accent tracking-wider uppercase text-center">
              HANDLER NOTE: Debrief with ARCA before proceeding
            </div>
          )}

          {node.h > 0 && (
            <div className="text-right text-[9px] text-text-muted mt-3 tracking-wider">EST. {node.h}h</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionBriefingModal;
