import type { FC } from "react";
import { EVOLUTIONS, type EvolutionStage } from "../../../data/roadmap";
import type { Lang } from "./types";

interface Props {
  lang: Lang;
  evo: EvolutionStage & { idx: number };
}

const EvolutionCard: FC<Props> = ({ lang, evo }) => (
  <div className="mx-auto max-w-3xl px-4 py-6">
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary/60 p-4 shadow-[0_18px_60px_rgba(0,0,0,.18)] sm:flex-row sm:items-center sm:gap-5">
      <img
        src={evo.img}
        alt={evo.name}
        className="h-20 w-20 shrink-0 rounded-lg border-2 object-cover"
        style={{ borderColor: evo.color, boxShadow: `0 0 20px ${evo.glow}` }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-[4px]" style={{ color: evo.color }}>
          {evo.name} // {evo.title}
        </div>
        <div className="mt-1 text-sm leading-relaxed text-text-secondary">{evo.desc[lang]}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EVOLUTIONS.map((e, i) => {
            const cls =
              i < evo.idx
                ? "border-accent-green/30 text-accent-green bg-accent-green/10"
                : i === evo.idx
                ? "bg-opacity-20 text-white"
                : "border-border text-text-muted";
            const inlineStyle =
              i === evo.idx
                ? { borderColor: e.color, color: e.color, background: `${e.color}20` }
                : undefined;
            return (
              <div
                key={i}
                className={`rounded border px-2 py-1 text-[9px] font-bold tracking-wider ${cls}`}
                style={inlineStyle}
              >
                {e.min}% {e.tag}:{e.title.split(" ")[0]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default EvolutionCard;
