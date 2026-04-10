import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Finding {
  type: "critical" | "warning" | "info";
  label: string;
  detail: string;
}

interface AnalysisResult {
  score: number;
  verdict: "CLEAN" | "SUSPICIOUS" | "PHISHING" | "CRITICAL";
  findings: Finding[];
}

const URGENCY_WORDS = [
  "urgent", "immediately", "expire", "suspend", "verify your",
  "confirm your", "update your", "unusual activity", "unauthorized",
  "limited time", "act now", "account will be", "within 24 hours",
  "within 48 hours",
];

const FINANCIAL_WORDS = [
  "bank", "paypal", "credit card", "wire transfer", "bitcoin",
  "crypto", "invoice", "payment", "refund", "prize", "winner",
  "lottery", "million", "inheritance", "beneficiary",
];

const SOCIAL_ENGINEERING = [
  "click here", "click below", "click the link", "open the attachment",
  "download", "enable macros", "enable content", "log in",
  "sign in", "enter your password", "ssn", "social security",
  "date of birth",
];

const IMPERSONATION = [
  "dear customer", "dear user", "dear account holder", "dear sir",
  "valued customer", "official notice", "security team",
  "support team", "helpdesk", "it department",
];

function analyzeEmail(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const findings: Finding[] = [];
  let score = 0;

  // Urgency patterns
  const urgencyHits = URGENCY_WORDS.filter((w) => lower.includes(w));
  if (urgencyHits.length > 0) {
    score += urgencyHits.length * 12;
    findings.push({
      type: urgencyHits.length >= 2 ? "critical" : "warning",
      label: "Urgency manipulation",
      detail: `Detected: ${urgencyHits.slice(0, 3).join(", ")}`,
    });
  }

  // Financial bait
  const financialHits = FINANCIAL_WORDS.filter((w) => lower.includes(w));
  if (financialHits.length > 0) {
    score += financialHits.length * 10;
    findings.push({
      type: financialHits.length >= 2 ? "critical" : "warning",
      label: "Financial bait",
      detail: `Detected: ${financialHits.slice(0, 3).join(", ")}`,
    });
  }

  // Social engineering
  const socialHits = SOCIAL_ENGINEERING.filter((w) => lower.includes(w));
  if (socialHits.length > 0) {
    score += socialHits.length * 15;
    findings.push({
      type: "critical",
      label: "Social engineering",
      detail: `Detected: ${socialHits.slice(0, 3).join(", ")}`,
    });
  }

  // Impersonation
  const impersonationHits = IMPERSONATION.filter((w) => lower.includes(w));
  if (impersonationHits.length > 0) {
    score += impersonationHits.length * 8;
    findings.push({
      type: "warning",
      label: "Generic impersonation",
      detail: `Detected: ${impersonationHits.slice(0, 3).join(", ")}`,
    });
  }

  // URL patterns
  const urlMatch = text.match(/https?:\/\/[^\s]+/gi);
  if (urlMatch) {
    const suspicious = urlMatch.filter(
      (u) =>
        u.includes("bit.ly") ||
        u.includes("tinyurl") ||
        u.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/) ||
        u.includes("-login") ||
        u.includes("secure-") ||
        u.includes(".xyz") ||
        u.includes(".tk") ||
        u.includes(".ml")
    );
    if (suspicious.length > 0) {
      score += 25;
      findings.push({
        type: "critical",
        label: "Suspicious URLs",
        detail: `${suspicious.length} suspicious link(s) detected`,
      });
    } else if (urlMatch.length > 0) {
      findings.push({
        type: "info",
        label: "Links present",
        detail: `${urlMatch.length} URL(s) found — verify domain ownership`,
      });
    }
  }

  // ALL CAPS
  const capsWords = text.split(/\s+/).filter((w) => w.length > 3 && w === w.toUpperCase());
  if (capsWords.length >= 3) {
    score += 10;
    findings.push({
      type: "warning",
      label: "Excessive capitalization",
      detail: `${capsWords.length} words in ALL CAPS — pressure tactic`,
    });
  }

  // Spelling/grammar signals
  if (lower.match(/\b(kindly|humbly|revert back|do the needful|dearest)\b/)) {
    score += 15;
    findings.push({
      type: "warning",
      label: "Social engineering language",
      detail: "Formal/unusual phrasing common in phishing",
    });
  }

  if (findings.length === 0) {
    findings.push({
      type: "info",
      label: "No threats detected",
      detail: "No obvious phishing indicators found in this text",
    });
  }

  score = Math.min(score, 100);

  const verdict: AnalysisResult["verdict"] =
    score >= 70 ? "CRITICAL" : score >= 40 ? "PHISHING" : score >= 15 ? "SUSPICIOUS" : "CLEAN";

  return { score, verdict, findings };
}

const SAMPLE_PHISH = `URGENT: Your PayPal account has been suspended due to unusual activity.

Dear valued customer,

We detected unauthorized access to your account. To restore access, please verify your identity immediately by clicking the link below:

https://paypa1-secure-login.xyz/verify?id=38291

You must complete verification within 24 hours or your account will be permanently locked.

PayPal Security Team`;

const verdictColors: Record<string, string> = {
  CLEAN: "var(--color-accent-green)",
  SUSPICIOUS: "var(--color-accent-amber)",
  PHISHING: "var(--color-accent-red)",
  CRITICAL: "var(--color-accent-red)",
};

const findingColors: Record<string, string> = {
  critical: "var(--color-accent-red)",
  warning: "var(--color-accent-amber)",
  info: "var(--color-text-muted)",
};

export default function PhishingAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);
    // Simulate processing time for effect
    setTimeout(() => {
      setResult(analyzeEmail(input));
      setAnalyzing(false);
    }, 800);
  };

  const handleSample = () => {
    setInput(SAMPLE_PHISH);
    setResult(null);
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-sm text-[var(--color-accent)]">
          $ email_threat_analyzer --interactive
        </h3>
        <button
          onClick={handleSample}
          className="rounded border border-[var(--color-border)] px-3 py-1 font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)]"
        >
          Load sample phish
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a suspicious email here..."
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 font-mono text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/40 outline-none transition-colors focus:border-[var(--color-accent)]"
        rows={6}
        spellCheck={false}
      />

      <button
        onClick={handleAnalyze}
        disabled={!input.trim() || analyzing}
        className="mt-4 w-full rounded-lg bg-[var(--color-accent)] py-3 font-mono text-sm font-semibold text-[var(--color-bg-primary)] transition-all hover:bg-[var(--color-accent-glow)] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {analyzing ? "Analyzing threat vectors..." : "Analyze Email"}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4"
          >
            {/* Score + Verdict */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
              <div>
                <div className="text-xs text-[var(--color-text-muted)]">THREAT SCORE</div>
                <div
                  className="text-3xl font-bold font-mono"
                  style={{ color: verdictColors[result.verdict] }}
                >
                  {result.score}/100
                </div>
              </div>
              <div
                className="rounded border px-4 py-2 font-mono text-sm font-bold tracking-wider"
                style={{
                  color: verdictColors[result.verdict],
                  borderColor: verdictColors[result.verdict],
                  backgroundColor: `color-mix(in srgb, ${verdictColors[result.verdict]} 10%, transparent)`,
                  textShadow: result.verdict !== "CLEAN" ? `0 0 8px ${verdictColors[result.verdict]}` : "none",
                }}
              >
                {result.verdict}
              </div>
            </div>

            {/* Findings */}
            <div className="space-y-2">
              <div className="text-xs text-[var(--color-text-muted)] font-mono">FINDINGS</div>
              {result.findings.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded border border-[var(--color-border)]/50 bg-[var(--color-bg-primary)]/50 px-4 py-3 text-sm"
                >
                  <span
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: findingColors[f.type] }}
                  />
                  <div>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {f.label}
                    </span>
                    <span className="ml-2 text-[var(--color-text-muted)]">{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] text-[var(--color-text-muted)]/40 font-mono">
              Pattern-based heuristic analysis running entirely in your browser. No data leaves your device.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
