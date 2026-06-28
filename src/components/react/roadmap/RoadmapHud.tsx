import type { ChangeEvent, FC } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
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
  <div className="sticky top-16 z-40 border-b border-border bg-bg-primary/95 px-4 py-3 backdrop-blur-md">
    <div className="mx-auto flex max-w-[1180px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex min-w-0 items-center gap-3">
      <img
        src={evo.img}
        alt={evo.name}
        className="h-11 w-11 shrink-0 rounded-lg border-2 object-cover"
        style={{ borderColor: evo.color, boxShadow: `0 0 12px ${evo.glow}` }}
      />
      <div className="min-w-0">
        <div className="truncate text-[10px] uppercase tracking-[3px]" style={{ color: evo.color }}>{evo.title}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-black" style={{ color: evo.color }}>{pct}%</span>
          <span className="text-[9px] text-text-muted tracking-wider">
            {lang === "es" ? "HACIA EL 1%" : "TO THE 1%"}
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-5 gap-2 text-[10px] tracking-wider sm:gap-4 lg:flex lg:gap-5">
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
        <div className="text-text-muted">{lang === "es" ? "CREDENCIALES" : "CREDENTIALS"}</div>
      </div>
      <div className="text-center">
        <div className="font-black text-accent-red text-base">{streak}d</div>
        <div className="text-text-muted">{lang === "es" ? "RACHA" : "STREAK"}</div>
      </div>
    </div>

    <div className="flex gap-1.5">
      <button
        onClick={onExport}
        className="inline-flex h-8 items-center gap-1.5 rounded border border-border bg-bg-secondary px-2 text-[10px] tracking-wider text-text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <Download aria-hidden="true" size={13} />
        <span className="hidden sm:inline">{lang === "es" ? "GUARDAR" : "SAVE"}</span>
      </button>
      <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded border border-border bg-bg-secondary px-2 text-[10px] tracking-wider text-text-muted transition-colors hover:border-accent hover:text-accent">
        <Upload aria-hidden="true" size={13} />
        <span className="hidden sm:inline">{lang === "es" ? "CARGAR" : "LOAD"}</span>
        <input type="file" accept=".json" className="hidden" onChange={onImport} />
      </label>
      <button
        onClick={onPurge}
        className="inline-flex h-8 items-center gap-1.5 rounded border border-border bg-bg-secondary px-2 text-[10px] tracking-wider text-accent-red transition-colors hover:border-accent-red/50 hover:text-red-300"
      >
        <RotateCcw aria-hidden="true" size={13} />
        <span className="hidden sm:inline">{lang === "es" ? "RESET" : "RESET"}</span>
      </button>
    </div>
    </div>
  </div>
);

export default RoadmapHud;
