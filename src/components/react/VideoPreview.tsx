import { useState } from "react";
import type { Lang } from "../../i18n/translations";
interface Props { src: string; title: string; lang?: Lang; }
export default function VideoPreview({ src, title, lang = "en" }: Props) {
  const [active, setActive] = useState(false);
  return <div>
    <button type="button" className="action" aria-expanded={active} onClick={() => setActive((value) => !value)}>{lang === "es" ? (active ? "Cerrar vídeo" : "Ver vídeo") : (active ? "Close video" : "Watch video")}</button>
    {active && <video className="mt-3 w-full rounded-lg" src={src} controls playsInline preload="metadata" aria-label={title} />}
  </div>;
}
