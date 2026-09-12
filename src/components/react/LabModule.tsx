import { useRef, useState, type ComponentType } from "react";
import type { Lang } from "../../i18n/translations";
import { ToolBoundary } from "./ToolDock";

type ModuleKind = "attacks" | "job-match" | "effects";
const loaders = {
  attacks: () => import("./AttackExplorer"),
  "job-match": () => import("./JobMatchPanel"),
  effects: () => import("./LabEffects"),
};

export default function LabModule({ kind, lang }: { kind: ModuleKind; lang: Lang }) {
  const [View, setView] = useState<ComponentType<{ lang?: Lang }> | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const es = lang === "es";
  const activate = async () => {
    setLoading(true);
    setFailed(false);
    try {
      if (!View) {
        const module = await loaders[kind]();
        setView(() => module.default);
      }
      setActive(true);
    } catch { setFailed(true); }
    finally { setLoading(false); }
  };
  return <div className="lab-stage">
    {active ? <button className="action" onClick={() => { setActive(false); requestAnimationFrame(() => trigger.current?.focus()); }}>{es ? "Cerrar demostración" : "Close demonstration"} ×</button> :
      <button ref={trigger} className="action action-primary" onClick={() => void activate()} disabled={loading}>{loading ? (es ? "Cargando…" : "Loading…") : (es ? "Abrir demostración" : "Open demonstration")} ↗</button>}
    {failed && <p role="alert">{es ? "No se ha podido cargar. Puedes volver a intentarlo." : "Could not load. You can try again."}</p>}
    {active && View && <div className="mt-6"><ToolBoundary lang={lang}><View lang={lang} /></ToolBoundary></div>}
  </div>;
}
