import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Sector } from "../../data/projects";
import VideoPreview from "./VideoPreview";

const sectorIcons: Record<string, string> = {
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  banknote: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`,
  "heart-pulse": `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
};

interface Props {
  sectors: Sector[];
}

export default function SectorTabs({ sectors }: Props) {
  const [active, setActive] = useState(0);
  const sector = sectors[active];

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {sectors.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all duration-200 ${
              active === i
                ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30"
                : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span
              dangerouslySetInnerHTML={{ __html: sectorIcons[s.icon] || "" }}
            />
            {s.name}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                active === i
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]"
              }`}
            >
              {s.projects.length}
            </span>
          </button>
        ))}
      </div>

      {/* Sector description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sector.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
              {sector.headline}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {sector.description}
            </p>
          </div>

          {/* Project grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sector.projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 transition-all duration-300 hover:border-[var(--color-accent)]/30 hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
              >
                {/* Video / Placeholder */}
                {project.videoSrc ? (
                  <VideoPreview src={project.videoSrc} title={project.title} />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-[var(--color-bg-tertiary)]">
                    <span className="font-mono text-4xl text-[var(--color-accent)]/20">
                      &gt;_
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h4 className="text-lg font-bold text-[var(--color-text-primary)]">
                    {project.title}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--color-accent)]">
                    {project.headline}
                  </p>
                  <p className="mt-3 flex-1 text-sm text-[var(--color-text-secondary)] line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="rounded bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Link */}
                  <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      GitHub
                      <span className="inline-block transition-transform group-hover:translate-x-0.5">
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
