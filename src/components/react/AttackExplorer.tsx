import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
const LatentSpaceGlobe = lazy(() => import("./LatentSpaceGlobe"));
const NeuralBreach = lazy(() => import("./NeuralBreach"));
const PhishingAnalyzer = lazy(() => import("./PhishingAnalyzer"));
import type { Lang } from "../../i18n/translations";

type Tab = "space" | "breach" | "detect";

interface TabConfig {
  id: Tab;
  label: string;
  sub: string;
  command: string;
}

const TABS: TabConfig[] = [
  {
    id: "space",
    label: "The Space",
    sub: "where attacks live",
    command: "$ visualize latent_manifold",
  },
  {
    id: "breach",
    label: "The Breach",
    sub: "how attacks propagate",
    command: "$ trace adversarial_pathway",
  },
  {
    id: "detect",
    label: "The Defense",
    sub: "catch threats live",
    command: "$ email_threat_analyzer --llm",
  },
];

const DESCRIPTIONS: Record<Tab, { intro: string; bullets: { num: string; title: string; body: string; accent: string }[] }> = {
  space: {
    intro:
      "Every Foundation Model encodes its knowledge as points in a high-dimensional space. Attacks don't target text -- they target the manifold.",
    bullets: [
      {
        num: "01",
        title: "Cluster topology",
        body: "Skills and concepts group into semantic regions. NLP, CV, RAG, Agents, Safety -- each is its own neighborhood in the embedding space.",
        accent: "var(--color-accent)",
      },
      {
        num: "02",
        title: "Adversarial perturbation",
        body: "A crafted input moves by a vector humans can't perceive, but lands it in a region the model classifies completely differently.",
        accent: "var(--color-accent-amber)",
      },
      {
        num: "03",
        title: "Manifold corruption",
        body: "Click 'inject attack' to watch the pulse propagate through the cluster topology. This is how jailbreaks, prompt injection, and evasion attacks work at the geometric level.",
        accent: "var(--color-accent-red)",
      },
    ],
  },
  breach: {
    intro:
      "Once an adversarial input enters, it cascades through the network's layers. You can watch the corruption propagate forward in real time.",
    bullets: [
      {
        num: "01",
        title: "Inference path",
        body: "A request enters the network. Signals propagate through hidden layers. The model outputs a confident prediction -- this is the happy path.",
        accent: "var(--color-accent)",
      },
      {
        num: "02",
        title: "Adversarial injection",
        body: "I craft a perturbation so subtle the model can't tell it apart from valid input. Prompt injection for LLMs, FGSM / PGD for vision, imperceptible to humans, surgical to the model.",
        accent: "var(--color-accent-amber)",
      },
      {
        num: "03",
        title: "Breach propagation",
        body: "The adversarial signal cascades layer by layer, corrupting activations. The final output flips from SAFE to COMPROMISED -- exactly what I document before it ships to production at BBVA.",
        accent: "var(--color-accent-red)",
      },
    ],
  },
  detect: {
    intro:
      "Paste a suspicious email and watch the LLM dissect it in real time -- urgency triggers, credential harvesting, spoofed domains, social engineering. This is the defense side of the equation.",
    bullets: [
      {
        num: "01",
        title: "Threat classification",
        body: "Llama 3.3 70B analyzes the email for phishing indicators: urgency manipulation, financial bait, authority impersonation, suspicious URLs.",
        accent: "var(--color-accent)",
      },
      {
        num: "02",
        title: "Structured verdict",
        body: "Each threat gets a score (0-100), severity level (CLEAN to CRITICAL), and specific findings with evidence extracted from the text.",
        accent: "var(--color-accent-amber)",
      },
      {
        num: "03",
        title: "Local fallback",
        body: "If the LLM is unavailable, a client-side heuristic engine kicks in -- pattern matching on known phishing indicators, running entirely in your browser.",
        accent: "var(--color-accent-red)",
      },
    ],
  },
};

export default function AttackExplorer({ lang = "en" }: { lang?: Lang }) {
  const [active, setActive] = useState<Tab>("space");
  const activeDesc = DESCRIPTIONS[active];

  return (
    <div>
      {/* Tab selector */}
      <div className="mb-8 flex justify-center">
        <div className="grid w-full grid-cols-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)]/60 p-1.5 backdrop-blur-sm">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`relative flex flex-col items-center rounded-lg min-h-14 min-w-0 px-2 py-2.5 text-center transition-colors ${
                  isActive
                    ? "bg-[var(--color-accent)]/10"
                    : "hover:bg-[var(--color-bg-secondary)]/40"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`font-mono text-sm font-semibold ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {lang === "es" ? ({ space: "Espacio", breach: "Propagación", detect: "Análisis" })[tab.id] : tab.label}
                </span>
                <span className="mt-0.5 hidden sm:block font-mono text-xs text-[var(--color-text-muted)]">
                  {tab.sub}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[var(--color-accent)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Command bar */}
      <div className="mb-6 text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="inline-block font-mono text-xs text-[var(--color-text-muted)]"
          >
            <span className="text-[var(--color-accent)]">
              {TABS.find((t) => t.id === active)?.command}
            </span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Content */}
      {active === "detect" ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="detect"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start"
          >
            <Suspense fallback={<p role="status">{lang === "es" ? "Cargando…" : "Loading…"}</p>}><PhishingAnalyzer /></Suspense>
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {activeDesc.intro}
              </p>
              <div className="space-y-5">
                {activeDesc.bullets.map((b) => (
                  <div key={b.num} className="flex items-start gap-4">
                    <div
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs"
                      style={{
                        color: b.accent,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: `${b.accent}33`,
                        backgroundColor: `${b.accent}0D`,
                      }}
                    >
                      {b.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)]">{b.title}</h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{b.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: active === "space" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: active === "space" ? 20 : -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={<p role="status">{lang === "es" ? "Cargando…" : "Loading…"}</p>}>{active === "space" ? <LatentSpaceGlobe /> : <NeuralBreach />}</Suspense>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {activeDesc.intro}
              </p>

              <div className="space-y-5">
                {activeDesc.bullets.map((b) => (
                  <div key={b.num} className="flex items-start gap-4">
                    <div
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs"
                      style={{
                        color: b.accent,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: `${b.accent}33`,
                        backgroundColor: `${b.accent}0D`,
                      }}
                    >
                      {b.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)]">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {b.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
