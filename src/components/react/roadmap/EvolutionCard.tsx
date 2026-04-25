import type { FC } from "react";
import { EVOLUTIONS, type EvolutionStage } from "../../../data/roadmap";
import type { Lang } from "./types";

interface Props {
  lang: Lang;
  evo: EvolutionStage & { idx: number };
}

const EvolutionCard: FC<Props> = ({ lang, evo }) => (
  <div className="max-w-2xl mx-auto px-4 py-6">
    <div className="border border-border rounded-lg p-4 bg-bg-secondary/50 flex items-center gap-5">
      <img
        src={evo.img}
        alt={evo.name}
        className="w-20 h-20 rounded-lg object-cover border-2 shrink-0"
        style={{ borderColor: evo.color, boxShadow: `0 0 20px ${evo.glow}` }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs tracking-[4px] uppercase" style={{ color: evo.color }}>
          {evo.name} // {evo.title}
        </div>
        <div className="text-text-muted text-[10px] mt-0.5 italic">{evo.desc[lang]}</div>
        <div className="flex gap-1.5 mt-2">
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
                className={`text-[8px] px-2 py-0.5 rounded border tracking-wider font-bold ${cls}`}
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
