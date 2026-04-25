import type { ChangeEvent, FC } from "react";
import type { EvolutionStage } from "../../../data/roadmap";
import type { Lang } from "./types";

interface Props {
  lang: Lang;
  evo: EvolutionStage & { idx: number };
  pct: number;
  doneCount: number;
  progCount: number;
  pendCount: number;
  certCount: number;
  streak: number;
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
  onPurge: () => void;
}

const RoadmapHud: FC<Props> = ({
  lang,
  evo,
  pct,
  doneCount,
  progCount,
  pendCount,
  certCount,
  streak,
  onExport,
  onImport,
  onPurge,
}) => (
  <div className="sticky top-16 z-40 flex items-center justify-between px-4 py-2.5 bg-bg-primary/90 backdrop-blur-md border-b border-border">
    <div className="flex items-center gap-3">
      <img
        src={evo.img}
        alt={evo.name}
        className="w-11 h-11 rounded-lg object-cover border-2"
        style={{ borderColor: evo.color, boxShadow: `0 0 12px ${evo.glow}` }}
      />
      <div>
        <div className="text-[10px] tracking-[3px] uppercase" style={{ color: evo.color }}>{evo.title}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black" style={{ color: evo.color }}>{pct}%</span>
          <span className="text-[9px] text-text-muted tracking-wider">
            {lang === "es" ? "HACIA EL 1%" : "TO THE 1%"}
          </span>
        </div>
      </div>
    </div>

    <div className="flex gap-5 text-[10px] tracking-wider">
      <div className="text-center">
        <div className="font-black text-accent-green text-base">{doneCount}</div>
        <div className="text-text-muted">{lang === "es" ? "COMPLETADAS" : "COMPLETE"}</div>
      </div>
      <div className="text-center">
        <div className="font-black text-accent text-base">{progCount}</div>
        <div className="text-text-muted">IN PROGRESS</div>
      </div>
      <div className="text-center">
        <div className="font-black text-text-secondary text-base">{pendCount}</div>
        <div className="text-text-muted">{lang === "es" ? "PENDIENTE" : "PENDING"}</div>
      </div>
      <div className="text-center">
        <div className="font-black text-text-primary text-base">{certCount}</div>
        <div className="text-text-muted">CREDENTIALS</div>
      </div>
      <div className="text-center">
        <div className="font-black text-accent-red text-base">{streak}d</div>
        <div className="text-text-muted">OP DAYS</div>
      </div>
    </div>

    <div className="flex gap-1">
      <button
        onClick={onExport}
        className="px-2 py-1 rounded text-[9px] bg-bg-secondary border border-border text-text-muted hover:text-accent transition-colors tracking-wider"
      >
        EXPORT
      </button>
      <label className="px-2 py-1 rounded text-[9px] bg-bg-secondary border border-border text-text-muted hover:text-accent transition-colors cursor-pointer tracking-wider">
        IMPORT
        <input type="file" accept=".json" className="hidden" onChange={onImport} />
      </label>
      <button
        onClick={onPurge}
        className="px-2 py-1 rounded text-[9px] bg-bg-secondary border border-border text-accent-red hover:text-red-300 transition-colors tracking-wider"
      >
        PURGE
      </button>
    </div>
  </div>
);

export default RoadmapHud;
