import { Component, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import type { Lang } from "../../i18n/translations";

type Tool = "chat" | "terminal";
type ToolView = ComponentType<{ lang?: Lang; onClose?: () => void }>;
const loaders = {
  chat: () => import("./AIChat"),
  terminal: () => import("./MiniTerminal"),
};

export class ToolBoundary extends Component<{ children: ReactNode; lang: Lang }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div role="alert" className="dialog-body"><p>{this.props.lang === "es" ? "No se ha podido mostrar esta herramienta." : "This tool could not be displayed."}</p><button className="action mt-4" onClick={() => this.setState({ failed: false })}>{this.props.lang === "es" ? "Reintentar" : "Try again"}</button></div>
      : this.props.children;
  }
}

export default function ToolDock({ lang }: { lang: Lang }) {
  const es = lang === "es";
  const [active, setActive] = useState<Tool | null>(null);
  const [views, setViews] = useState<Partial<Record<Tool, ToolView>>>({});
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const terminalTrigger = useRef<HTMLButtonElement>(null);

  const open = (tool: Tool) => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFailed(false);
    setActive(tool);
    if (!views[tool]) {
      void loaders[tool]().then((module) => setViews((current) => ({ ...current, [tool]: module.default }))).catch(() => setFailed(true));
    }
  };

  useEffect(() => {
    if (active && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [active]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) dialogRef.current.close();
        else terminalTrigger.current?.click();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const close = () => dialogRef.current?.close();
  return <>
    <div className="tool-dock" aria-label={es ? "Herramientas del perfil" : "Profile tools"}>
      <button className="action" onClick={() => open("chat")} aria-haspopup="dialog">ARCA · AI</button>
      <button ref={terminalTrigger} className="action" onClick={() => open("terminal")} aria-haspopup="dialog">&gt;_ Terminal</button>
    </div>
    <dialog ref={dialogRef} className="tool-dialog" aria-labelledby="profile-tool-title" onClose={() => {
      setActive(null);
      returnFocusRef.current?.focus();
    }}>
      <div className="dialog-heading">
        <h2 id="profile-tool-title">{active === "chat" ? (es ? "ARCA · Asistente de IA" : "ARCA · AI assistant") : "AIR Terminal"}</h2>
        <button className="action" onClick={close}>{es ? "Cerrar" : "Close"} ×</button>
      </div>
      {failed && <p className="dialog-body" role="alert">{es ? "No se ha podido cargar. Cierra y vuelve a intentarlo." : "Could not load. Close and try again."}</p>}
      {active && !views[active] && !failed && <p className="dialog-body" role="status">{es ? "Cargando…" : "Loading…"}</p>}
      {(["chat", "terminal"] as const).map((tool) => {
        const View = views[tool];
        return View && <div key={tool} hidden={active !== tool}><ToolBoundary lang={lang}><View lang={lang} onClose={close} /></ToolBoundary></div>;
      })}
    </dialog>
  </>;
}
