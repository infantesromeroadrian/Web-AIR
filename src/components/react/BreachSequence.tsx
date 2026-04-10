import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "$ nmap -sV --script=vuln 10.10.14.x", delay: 0, color: "cyan" },
  { text: "Starting Nmap 7.94 ( https://nmap.org )", delay: 400, color: "muted" },
  { text: "Discovered open port 443/tcp on 10.10.14.x", delay: 800, color: "muted" },
  { text: "Discovered open port 22/tcp on 10.10.14.x", delay: 1000, color: "muted" },
  { text: "", delay: 1200, color: "muted" },
  { text: "$ ssh -i id_rsa root@10.10.14.x", delay: 1400, color: "cyan" },
  { text: "Connection established.", delay: 1900, color: "green" },
  { text: "", delay: 2100, color: "muted" },
  { text: "[WARNING] Firewall bypass detected", delay: 2300, color: "red" },
  { text: "[WARNING] Unauthorized access to /classified/", delay: 2600, color: "red" },
  { text: "", delay: 2900, color: "muted" },
  { text: "Decrypting profile... ████████████████ 100%", delay: 3100, color: "green" },
  { text: "", delay: 3600, color: "muted" },
  { text: "ACCESS GRANTED — Welcome to L4tentNoise", delay: 3800, color: "accent" },
];

const DATA_CHARS = "01アイウエオカキクケコサシスセソ";

function DataRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const columns = Math.floor(canvas.width / 14);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
      ctx.font = "12px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = DATA_CHARS[Math.floor(Math.random() * DATA_CHARS.length)];
        ctx.fillText(char, i * 14, drops[i] * 14);
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-40"
      aria-hidden="true"
    />
  );
}

interface Props {
  onComplete: () => void;
}

export default function BreachSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });

    // Auto-complete after last line
    timers.push(
      setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, 800);
      }, BOOT_LINES[BOOT_LINES.length - 1].delay + 600)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    setDone(true);
    onComplete();
  };

  const colorMap: Record<string, string> = {
    cyan: "var(--color-accent)",
    muted: "var(--color-text-muted)",
    green: "var(--color-accent-green)",
    red: "var(--color-accent-red)",
    accent: "var(--color-accent)",
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--color-bg-primary)]"
          onClick={handleSkip}
        >
          <DataRain />

          <div className="relative z-10 w-full max-w-2xl px-6">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]/90 p-6 font-mono text-sm backdrop-blur-sm">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className="leading-relaxed"
                  style={{ color: colorMap[line.color] }}
                >
                  {line.text || "\u00A0"}
                </div>
              ))}
              {!done && visibleLines < BOOT_LINES.length && (
                <span
                  className="inline-block h-4 w-2 animate-pulse"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              )}
            </div>

            <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]/40">
              click anywhere to skip
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
