import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  value: string;
  label: string;
}

function parseNumericPart(value: string): { prefix: string; number: number; suffix: string } {
  const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: value };
  return {
    prefix: match[1],
    number: parseFloat(match[2]),
    suffix: match[3],
  };
}

export default function AnimatedCounter({ value, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(value);
  const parsed = useRef(parseNumericPart(value));
  const { prefix, number, suffix } = parsed.current;

  useEffect(() => {
    if (!isInView || number === 0) return;

    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * number);
      setDisplay(`${prefix}${current}${suffix}`);

      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value, prefix, number, suffix]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-4 text-center transition-colors duration-200 hover:border-[var(--color-border-hover)]"
    >
      <div className="text-2xl font-bold text-[var(--color-accent)]">
        {display}
      </div>
      <div className="mt-1 text-xs text-[var(--color-text-muted)]">{label}</div>
    </motion.div>
  );
}
