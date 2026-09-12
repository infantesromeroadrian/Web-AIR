import { useEffect, useState } from "react";
import ParticleNetwork from "./ParticleNetwork";
import SecurityCursor from "./SecurityCursor";
import SentientCore from "./SentientCore";
import TypewriterText from "./TypewriterText";
import type { Lang } from "../../i18n/translations";

export default function LabEffects({ lang = "en" }: { lang?: Lang }) {
  const [playing, setPlaying] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const es = lang === "es";
  useEffect(() => {
    const media = matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => { setCanAnimate(media.matches); if (!media.matches) setPlaying(false); };
    update();
    media.addEventListener("change", update);
    const pause = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", pause);
    return () => { media.removeEventListener("change", update); document.removeEventListener("visibilitychange", pause); };
  }, []);
  return <div className="lab-effects">
    {playing && <><ParticleNetwork /><SecurityCursor /></>}
    <div className="lab-effects-content">
      <p className="eyebrow">VISUAL SYSTEM / AIR</p>
      <h3 className="text-3xl my-4">{es ? "El lenguaje del laboratorio" : "The language of the laboratory"}</h3>
      <p className="mb-6 text-text-secondary">{es ? "Partículas, cursor y núcleo visual del portfolio original. Una exploración gráfica, sin datos operativos." : "Particles, cursor and visual core from the original portfolio. A graphic exploration without operational data."}</p>
      {playing ? <><SentientCore isOpen={false} onClick={() => setPlaying(false)} /><TypewriterText phrases={["LLM · RAG · Agents", "AI Security Architecture", "Adversarial evaluation"]} /></> : <p className="font-mono text-accent my-6">LLM · RAG · Agents</p>}
      {canAnimate ? <button className="action mt-6" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>{playing ? (es ? "Pausar efectos" : "Pause effects") : (es ? "Activar efectos" : "Activate effects")}</button> : <p className="text-sm text-text-muted">{es ? "Vista estática en móvil o con movimiento reducido." : "Static view on mobile or with reduced motion."}</p>}
    </div>
  </div>;
}
