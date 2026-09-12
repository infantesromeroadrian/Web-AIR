import { useState, useRef, useEffect } from "react";
import type { Lang } from "../../i18n/translations";
import { securityCaseStudies, securityCaseStudyText } from "../../data/security-case-studies";
import { htbRanking } from "../../data/achievements";
import { COAE_CERTIFICATION } from "../../data/education";

interface TerminalLine {
  type: "input" | "output";
  text: string;
}

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  about     - Who is Adrian Infantes
  skills    - Core technical skills
  exp       - Work experience summary
  projects  - Featured projects
  security  - Enterprise AI security case studies
  htb       - Hack The Box ranking and certification
  contact   - Get in touch
  kaggle    - Kaggle profile
  languages - Spoken languages
  clear     - Clear terminal
  exit      - Close terminal`,

  about: `Adrian Infantes — AI Security Engineer

I contribute to enterprise AI engineering at
Verisure. +6 years at the intersection of
AI Engineering × Offensive Security.

Secure design and adversarial evaluation of LLMs,
RAG pipelines and AI agents.

${htbRanking.title.en} — ${htbRanking.subtitle.en}
${COAE_CERTIFICATION} — completed.`,

  security: securityCaseStudies.map((study) => securityCaseStudyText(study, "en")).join("\n\n"),

  htb: `${htbRanking.title.en} — ${htbRanking.subtitle.en}\n${COAE_CERTIFICATION} — completed.`,

  skills: `Core Stack:
  Security : MITRE ATLAS, OWASP LLMs, PyRIT, Garak
  AI/ML    : PyTorch, Transformers, Deep Learning
  Agents   : LangGraph, LangChain, RAG, GraphRAG
  NVIDIA   : DGX, TensorRT-LLM, Triton, CUDA
  Infra    : Kubernetes, Docker, AWS, Azure, GCP
  Code     : Python, C++, CUDA, TypeScript`,

  exp: `2026-now  AI Security Architect @ BBVA Technology
         → AI Safety, Red Teaming, MLSecOps

2024-26  AI/ML Engineer @ BBVA Technology
         → LLMs, RAG, Fraud Detection, NLP
         → +15% retrieval, +22% AUC-ROC

2020-24  ML Engineer @ Ecoembes
         → Computer Vision, Edge AI, IoT
         → 45K imgs/h, <100ms latency

2019-20  Data Scientist @ Capgemini
         → AWS, ETL, Forecasting, BI`,

  projects: `Featured projects (github.com/infantesromeroadrian):

  FraudAI-Agent
    → Multi-agent fraud detection + AI red teaming

  LangGraph-Agents-HospitalCenter
    → 9 AI specialists triaging emergency patients

  Drone-GeoAnalysis-LLMs
    → LLM-powered geospatial intelligence

  Spectra-LangGraph-AI-Red-Teaming-Orchestration
    → Attack surface recon with Neo4j + AI analyst

  SIEM-Anomaly-Detector-ML
    → ML anomaly detection on SIEM data`,

  contact: `Email    : infantesromeroadrian@gmail.com
LinkedIn : linkedin.com/in/adrianinfantes
GitHub   : github.com/infantesromeroadrian
Location : Madrid, Spain`,

  kaggle: `Kaggle Master
Profile: kaggle.com/adrininfantesromero
Rank: Top-tier competitive ML`,

  languages: `Spanish  : Native
English  : Full Professional
Italian  : Full Professional
Chinese  : Limited Working`,
};

export default function MiniTerminal({ lang = "en", onClose = () => {} }: { lang?: Lang; onClose?: () => void }) {
  const es = lang === "es";
  const [lines, setLines] = useState<TerminalLine[]>([{ type: "output", text: es ? 'Terminal AIR. Escribe "help" para ver los comandos.' : 'AIR Terminal. Type "help" for available commands.' }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [lines]);

  const executeCommand = (command: string) => {
    const trimmed = command.trim().toLowerCase();
    setInput("");
    setHistoryIndex(-1);
    if (trimmed === "clear") { setLines([]); return; }
    if (trimmed === "exit") { onClose(); return; }
    if (!trimmed) return;
    const output = trimmed === "security"
      ? securityCaseStudies.map((study) => securityCaseStudyText(study, lang)).join("\n\n")
      : trimmed === "htb"
        ? `${htbRanking.title[lang]} — ${htbRanking.subtitle[lang]}\n${COAE_CERTIFICATION} — ${es ? "completada" : "completed"}.`
        : COMMANDS[trimmed];
    setLines((current) => [...current, { type: "input", text: command }, { type: "output", text: output || (es ? `Comando desconocido: ${trimmed}. Escribe "help".` : `Command not found: ${trimmed}. Type "help".`) }]);
    setHistory((current) => [command, ...current]);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") { event.preventDefault(); executeCommand(input); }
    else if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      if (next >= 0) setInput(history[next]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = Math.max(-1, historyIndex - 1);
      setHistoryIndex(next);
      setInput(next < 0 ? "" : history[next]);
    }
  };
  return <div className="dialog-body">
    <div ref={scrollRef} className="terminal-output" role="log" aria-live="polite" aria-label={es ? "Salida del terminal" : "Terminal output"}>
      {lines.map((line, index) => <pre key={index} className={line.type === "input" ? "text-accent" : ""}>{line.type === "input" ? `$ ${line.text}` : line.text}</pre>)}
    </div>
    <label className="block font-mono text-sm mt-4" htmlFor="terminal-command">{es ? "Comando" : "Command"}</label>
    <input id="terminal-command" className="terminal-input" autoComplete="off" spellCheck={false} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} />
  </div>;
}
