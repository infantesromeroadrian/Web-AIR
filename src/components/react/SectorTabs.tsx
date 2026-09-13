import { useState } from "react";
import type { Sector } from "../../data/projects";
import type { Lang } from "../../i18n/translations";
import VideoPreview from "./VideoPreview";

interface Props { sectors: Sector[]; lang: Lang; }

export default function SectorTabs({ sectors, lang }: Props) {
  const [active, setActive] = useState("all");
  const es = lang === "es";
  const featured = sectors.map((sector) => sector.projects.find((project) => project.slug) || sector.projects[0]).filter(Boolean);
  const entries = sectors.flatMap((sector) => sector.projects.map((project) => ({ project, sector })));
  const visible = entries.filter(({ project, sector }) => active === "all" || (active === "featured" ? featured.includes(project) : sector.id === active));
  const filters = [{ id: "featured", name: es ? "Selección" : "Selected" }, { id: "all", name: es ? "Todos" : "All projects" }, ...sectors.map((sector) => ({ id: sector.id, name: sector.name }))];
  return <div>
    <div className="catalog-filters" role="group" aria-label={es ? "Filtrar proyectos" : "Filter projects"}>
      {filters.map((filter) => <button type="button" key={filter.id} className="action" aria-pressed={active === filter.id} onClick={() => setActive(filter.id)}>{filter.name}</button>)}
    </div>
    <p className="text-sm text-text-secondary mb-5" role="status">{es ? `${visible.length} de ${entries.length} proyectos` : `${visible.length} of ${entries.length} projects`}</p>
    <div className="project-grid">{visible.map(({ project, sector }) => <article className="project-card" key={project.title}>
      <div className="project-cover">{project.screenshots?.[0] ? <img src={project.screenshots[0].src} alt={project.screenshots[0].alt} loading="lazy" width="480" height="270" /> : <span>{sector.name}<br /><span className="text-3xl" aria-hidden="true">⌘</span></span>}</div>
      <div className="project-card-content"><h2>{project.title}</h2><p className="font-medium">{project.headline}</p><p>{project.description}</p>
        <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        {project.videoSrc && <VideoPreview src={project.videoSrc} title={project.title} lang={lang} />}
        <div className="link-row">{project.slug && <a href={`${es ? "/es" : ""}/projects/${project.slug}`} className="action">{es ? "Ver caso" : "View case"} ↗</a>}<a className="action" href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a></div>
      </div>
    </article>)}</div>
  </div>;
}
