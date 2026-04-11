import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  contact   - Get in touch
  kaggle    - Kaggle profile
  htb       - HackTheBox stats
  languages - Spoken languages
  clear     - Clear terminal
  exit      - Close terminal`,

  about: `Adrian Infantes — AI Security Engineer

I build and break AI systems for one of Europe's
largest banks. +6 years at the intersection of
AI Engineering × Offensive Security.

Specialized in Financial Crime: AML, Sanctions,
KYC/KYB, Transaction Monitoring.

206+ attacks against Foundation Models.
7 critical findings remediated pre-deploy.`,

  skills: `Core Stack:
  Security : MITRE ATLAS, OWASP LLMs, PyRIT, Garak
  AI/ML    : PyTorch, Transformers, Deep Learning
  Agents   : LangGraph, LangChain, RAG, GraphRAG
  NVIDIA   : DGX, TensorRT-LLM, Triton, CUDA
  Infra    : Kubernetes, Docker, AWS, Azure, GCP
  Code     : Python, C++, CUDA, TypeScript`,

  exp: `2026-now  AI Security Architect @ BBVA Technology
         → AI Safety, Red Teaming, MLSecOps
         → -20% latency, -35% costs

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

  htb: `HackTheBox — L4tentNoise
Global Rank: Top 800
Focus: AI/ML challenges, penetration testing`,

  languages: `Spanish  : Native
English  : Full Professional
Italian  : Full Professional
Chinese  : Limited Working`,
};

export default function MiniTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: 'Welcome to AIR Terminal v1.0\nType "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: TerminalLine[] = [
      ...lines,
      { type: "input", text: cmd },
    ];

    if (trimmed === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    if (trimmed === "exit") {
      setIsOpen(false);
      setInput("");
      return;
    }

    if (trimmed === "") {
      setLines(newLines);
      setInput("");
      return;
    }

    const output = COMMANDS[trimmed];
    if (output) {
      newLines.push({ type: "output", text: output });
    } else {
      newLines.push({
        type: "output",
        text: `Command not found: ${trimmed}\nType "help" for available commands.`,
      });
    }

    setLines(newLines);
    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[10%] z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--color-border)] shadow-2xl shadow-black/50"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between bg-[var(--color-bg-tertiary)] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-3 w-3 rounded-full bg-red-500/80 transition-colors hover:bg-red-500"
                    aria-label="Close terminal"
                  />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-2 font-mono text-xs text-[var(--color-text-muted)]">
                  air@portfolio ~ %
                </span>
              </div>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                ESC to close
              </span>
            </div>

            {/* Terminal body */}
            <div
              ref={scrollRef}
              className="h-[400px] overflow-y-auto bg-[var(--color-bg-primary)] p-4 font-mono text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i} className="mb-1">
                  {line.type === "input" ? (
                    <div>
                      <span className="text-[var(--color-accent-green)]">
                        &gt;{" "}
                      </span>
                      <span className="text-[var(--color-text-primary)]">
                        {line.text}
                      </span>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-[var(--color-text-secondary)]">
                      {line.text}
                    </pre>
                  )}
                </div>
              ))}

              {/* Input line */}
              <div className="flex items-center">
                <span className="text-[var(--color-accent-green)]">
                  &gt;{" "}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border-none bg-transparent text-[var(--color-text-primary)] outline-none caret-[var(--color-accent)]"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
