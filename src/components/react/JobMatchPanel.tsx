import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { JobMatchResponse, RequirementMatch } from "../../lib/job-match-types";

const SAMPLE_JD = `Senior AI Security Engineer

Requirements:
- 5+ years of experience in AI/ML engineering or security
- Deep knowledge of adversarial machine learning and LLM red teaming
- Experience with MITRE ATLAS, OWASP Top 10 for LLMs
- Production deployment of ML models in regulated industries (banking, finance)
- Proficiency in Python, PyTorch, and LangGraph/LangChain
- Experience with NVIDIA infrastructure (DGX, TensorRT, Triton)
- Kubernetes and Docker orchestration for ML workloads
- Strong background in cybersecurity (pentesting, threat modeling)
- Kaggle or competitive ML experience preferred
- Bachelor's in Computer Science, Mathematics, or related field`;

const tierConfig = {
  strong: { color: "var(--color-accent-green)", label: "STRONG FIT" },
  good: { color: "var(--color-accent)", label: "GOOD FIT" },
  partial: { color: "var(--color-accent-amber)", label: "PARTIAL FIT" },
  low: { color: "var(--color-accent-red)", label: "LOW FIT" },
};

const statusConfig: Record<RequirementMatch["status"], { color: string; dot: string }> = {
  met: { color: "var(--color-accent-green)", dot: "bg-[var(--color-accent-green)]" },
  partial: { color: "var(--color-accent-amber)", dot: "bg-[var(--color-accent-amber)]" },
  gap: { color: "var(--color-accent-red)", dot: "bg-[var(--color-accent-red)]" },
};

interface Props {
  lang?: "en" | "es";
}

export default function JobMatchPanel({ lang = "en" }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JobMatchResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCitations, setShowCitations] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: input, lang }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const data: JobMatchResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSample = () => {
    setInput(SAMPLE_JD);
    setResult(null);
    setError(null);
  };

  const labels = lang === "es"
    ? {
        title: "$ job_match --analyze",
        sample: "Cargar ejemplo",
        placeholder: "Pega la descripcion del puesto aqui...",
        button: "Analizar Encaje",
        buttonLoading: "Analizando con Llama 3.3 70B...",
        requirements: "REQUISITOS",
        edge: "VENTAJA DIFERENCIAL",
        questions: "PREGUNTAS SUGERIDAS",
        citations: "fuentes del perfil",
        contact: "Contactar a Adrian",
        footer: "Analisis via serverless function. No se almacena ningun dato.",
      }
    : {
        title: "$ job_match --analyze",
        sample: "Load sample JD",
        placeholder: "Paste the job description here...",
        button: "Analyze Fit",
        buttonLoading: "Analyzing with Llama 3.3 70B...",
        requirements: "REQUIREMENTS",
        edge: "ADRIAN'S EDGE",
        questions: "SUGGESTED QUESTIONS",
        citations: "profile sources",
        contact: "Contact Adrian",
        footer: "Analysis via serverless function. No data stored.",
      };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-sm text-[var(--color-accent)]">
          {labels.title}
        </h3>
        <button
          onClick={handleSample}
          className="rounded border border-[var(--color-border)] px-3 py-1 font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          {labels.sample}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={labels.placeholder}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 font-mono text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/40 outline-none transition-colors focus:border-[var(--color-accent)]"
        rows={6}
        maxLength={6000}
        spellCheck={false}
      />
      <div className="mt-1 text-right font-mono text-[10px] text-[var(--color-text-muted)]/40">
        {input.length}/6000
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!input.trim() || analyzing}
        className="mt-2 w-full rounded-lg bg-[var(--color-accent)] py-3 font-mono text-sm font-semibold text-[var(--color-bg-primary)] transition-all hover:bg-[var(--color-accent-glow)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {analyzing ? labels.buttonLoading : labels.button}
      </button>

      {error && (
        <div className="mt-4 rounded-lg border border-[var(--color-accent-red)]/30 bg-[var(--color-accent-red)]/5 px-4 py-2 text-xs text-[var(--color-accent-red)]">
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-5"
          >
            {/* Match score + tier */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-5">
              <div>
                <div className="text-xs text-[var(--color-text-muted)]">MATCH SCORE</div>
                <div
                  className="font-mono text-4xl font-bold"
                  style={{ color: tierConfig[result.match_tier]?.color }}
                >
                  {result.overall_match}%
                </div>
              </div>
              <div
                className="rounded border px-4 py-2 font-mono text-sm font-bold tracking-wider"
                style={{
                  color: tierConfig[result.match_tier]?.color,
                  borderColor: tierConfig[result.match_tier]?.color,
                  backgroundColor: `color-mix(in srgb, ${tierConfig[result.match_tier]?.color} 10%, transparent)`,
                }}
              >
                {tierConfig[result.match_tier]?.label}
              </div>
            </div>

            {/* Summary */}
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {result.summary}
            </p>

            {/* Match bar */}
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.overall_match}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: tierConfig[result.match_tier]?.color }}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <div className="font-mono text-xs text-[var(--color-text-muted)]">
                {labels.requirements}
              </div>
              {result.requirements.map((req, i) => {
                const cfg = statusConfig[req.status];
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded border border-[var(--color-border)]/50 bg-[var(--color-bg-primary)]/50 px-4 py-3 text-sm"
                  >
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {req.requirement}
                        </span>
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                          style={{ color: cfg.color, backgroundColor: `color-mix(in srgb, ${cfg.color} 12%, transparent)` }}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[var(--color-text-muted)]">
                        {req.evidence}
                        {req.source && (
                          <span className="ml-1 text-[var(--color-accent)]">{req.source}</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Adrian's Edge */}
            {result.unique_edge && (
              <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-4">
                <div className="mb-2 font-mono text-xs text-[var(--color-accent)]">
                  {labels.edge}
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {result.unique_edge}
                </p>
              </div>
            )}

            {/* Suggested questions */}
            {result.suggested_questions?.length > 0 && (
              <div>
                <div className="mb-2 font-mono text-xs text-[var(--color-text-muted)]">
                  {labels.questions}
                </div>
                <ul className="space-y-1">
                  {result.suggested_questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="mt-0.5 text-[var(--color-accent)]">&#8250;</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citations */}
            {result.citations?.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCitations(!showCitations)}
                  className="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {showCitations ? "\u25BC" : "\u25B6"} {labels.citations} ({result.citations.length})
                </button>
                <AnimatePresence>
                  {showCitations && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {result.citations.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                          <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
                          {c.title}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* CTA */}
            <a
              href="#contact"
              className="mt-2 block w-full rounded-lg border border-[var(--color-accent)] py-3 text-center font-mono text-sm font-semibold text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)]"
            >
              {labels.contact} &rarr;
            </a>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-green)]" />
                <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                  {result.model} via {result.provider}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[var(--color-text-muted)]/40">
                {labels.footer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
