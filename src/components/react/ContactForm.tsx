import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FORMSUBMIT_ENDPOINT =
  "https://formsubmit.co/ajax/infantesromeroadrian@gmail.com";

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const initialData: FormData = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export interface ContactFormLabels {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  company: string;
  companyOptional: string;
  companyPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  success: string;
  successDetail: string;
  again: string;
  privacy: string;
  errorName: string;
  errorEmail: string;
  errorMessage: string;
}

const DEFAULT_LABELS: ContactFormLabels = {
  name: "Name *",
  namePlaceholder: "Jane Doe",
  email: "Email *",
  emailPlaceholder: "jane@company.com",
  company: "Company",
  companyOptional: "(optional)",
  companyPlaceholder: "Acme Corp",
  message: "Message *",
  messagePlaceholder: "Looking for an AI Security Engineer to...",
  send: "Send Message",
  sending: "Sending...",
  success: "Message received",
  successDetail: "I'll get back to you at the email you provided. Usually within 24-48 hours.",
  again: "< send another",
  privacy: "Your message is sent via Formsubmit. No tracking, no spam.",
  errorName: "Name is required",
  errorEmail: "Valid email is required",
  errorMessage: "Message must be at least 10 characters",
};

interface Props {
  labels?: Partial<ContactFormLabels>;
}

export default function ContactForm({ labels: labelsProp }: Props = {}) {
  const labels: ContactFormLabels = { ...DEFAULT_LABELS, ...labelsProp };
  const [data, setData] = useState<FormData>(initialData);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (status === "error") setStatus("idle");
  };

  const validate = (): string | null => {
    if (data.name.trim().length < 2) return labels.errorName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return labels.errorEmail;
    if (data.message.trim().length < 10) return labels.errorMessage;
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("_honey") as HTMLInputElement)?.value;
    if (honeypot) {
      setStatus("success");
      setData(initialData);
      return;
    }

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company || "(not provided)",
          message: data.message,
          _subject: `Portfolio contact from ${data.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      if (result.success === "true" || result.success === true) {
        setStatus("success");
        setData(initialData);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error. Try again");
      setStatus("error");
    }
  };

  const disabled = status === "submitting" || status === "success";

  return (
    <div className="mx-auto max-w-xl">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-[var(--color-accent-green)]/30 bg-[var(--color-accent-green)]/5 p-8 text-center"
          >
            <div className="mb-3 font-mono text-xs tracking-wider text-[var(--color-accent-green)]">
              $ send_message --status ok
            </div>
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">
              {labels.success}
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              {labels.successDetail}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {labels.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            {/* Honeypot - hidden from humans */}
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] opacity-0"
              aria-hidden="true"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  {labels.name}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  disabled={disabled}
                  required
                  autoComplete="name"
                  maxLength={100}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/40 outline-none transition-colors focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={labels.namePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                  {labels.email}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  disabled={disabled}
                  required
                  autoComplete="email"
                  maxLength={150}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/40 outline-none transition-colors focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={labels.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                {labels.company} <span className="normal-case text-[var(--color-text-muted)]/50">{labels.companyOptional}</span>
              </label>
              <input
                id="company"
                type="text"
                name="company"
                value={data.company}
                onChange={handleChange}
                disabled={disabled}
                autoComplete="organization"
                maxLength={100}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/40 outline-none transition-colors focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={labels.companyPlaceholder}
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                {labels.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={data.message}
                onChange={handleChange}
                disabled={disabled}
                required
                rows={5}
                maxLength={2000}
                className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]/40 outline-none transition-colors focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={labels.messagePlaceholder}
              />
              <div className="mt-1 text-right font-mono text-[10px] text-[var(--color-text-muted)]/50">
                {data.message.length}/2000
              </div>
            </div>

            {status === "error" && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-[var(--color-accent-red)]/30 bg-[var(--color-accent-red)]/5 px-4 py-2.5 text-sm text-[var(--color-accent-red)]"
                role="alert"
              >
                <span className="font-mono text-xs">[ERROR]</span> {errorMsg}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={disabled}
              className="w-full rounded-lg bg-[var(--color-accent)] px-6 py-3.5 font-mono text-sm font-semibold text-[var(--color-bg-primary)] transition-all hover:bg-[var(--color-accent-glow)] hover:shadow-lg hover:shadow-[var(--color-accent)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? labels.sending : labels.send}
            </button>

            <p className="text-center font-mono text-[10px] text-[var(--color-text-muted)]/40">
              {labels.privacy}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
