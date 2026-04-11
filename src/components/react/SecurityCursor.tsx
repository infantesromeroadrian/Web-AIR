import { useEffect, useRef } from "react";

// Throttled element detection (not every frame)
const HOVER_CHECK_INTERVAL_MS = 50;

function findInteractive(el: Element | null): HTMLElement | null {
  let cur: Element | null = el;
  while (cur && cur !== document.body) {
    const tag = cur.tagName;
    if (
      tag === "A" ||
      tag === "BUTTON" ||
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      tag === "LABEL"
    ) {
      return cur as HTMLElement;
    }
    if ((cur as HTMLElement).onclick) return cur as HTMLElement;
    const role = cur.getAttribute("role");
    if (role === "button" || role === "link" || role === "tab") {
      return cur as HTMLElement;
    }
    const cursor = window.getComputedStyle(cur).cursor;
    if (cursor === "pointer") return cur as HTMLElement;
    cur = cur.parentElement;
  }
  return null;
}

function describeElement(el: HTMLElement): string {
  const tag = el.tagName;

  // Text inputs: show type
  if (tag === "INPUT") {
    const type = (el as HTMLInputElement).type || "text";
    return `INPUT[${type}]`;
  }

  // Anchors: show hash or path last segment
  if (tag === "A") {
    const href = (el as HTMLAnchorElement).getAttribute("href") || "";
    if (href.startsWith("#")) return `A${href}`;
    if (href.startsWith("mailto:")) return "A[mail]";
    try {
      const url = new URL(href, window.location.href);
      const segs = url.pathname.split("/").filter(Boolean);
      const last = segs[segs.length - 1];
      return last ? `A/${last}` : "A[root]";
    } catch {
      return "A";
    }
  }

  // Has aria-label
  const aria = el.getAttribute("aria-label");
  if (aria) {
    const clean = aria.slice(0, 18).replace(/\s+/g, "_");
    return `${tag}[${clean}]`;
  }

  // Has ID
  if (el.id) return `${tag}#${el.id}`;

  // Button: try to get text content (short)
  if (tag === "BUTTON") {
    const text = (el.textContent || "").trim().slice(0, 14).replace(/\s+/g, "_");
    return text ? `BUTTON[${text}]` : "BUTTON";
  }

  return tag;
}

function isTextInputTarget(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT") {
    const type = (el as HTMLInputElement).type;
    return (
      type === "text" ||
      type === "email" ||
      type === "password" ||
      type === "search" ||
      type === "url" ||
      type === "tel"
    );
  }
  if (tag === "TEXTAREA") return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export default function SecurityCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastHoverCheckRef = useRef<number>(0);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const stateRef = useRef({
    label: "",
    hovered: false,
    scale: 1,
    targetScale: 1,
    visible: 0,
    targetVisible: 0,
    labelOpacity: 0,
  });

  useEffect(() => {
    // Desktop only
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!hasHover || isMobile) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Hide system cursor except on text inputs
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      html, body, a, button, [role="button"], [role="link"], [role="tab"], label, select {
        cursor: none !important;
      }
      input[type="text"], input[type="email"], input[type="password"],
      input[type="search"], input[type="url"], input[type="tel"],
      textarea, [contenteditable="true"] {
        cursor: text !important;
      }
    `;
    document.head.appendChild(styleEl);

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      stateRef.current.targetVisible = 1;
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && !(e as any).toElement) {
        stateRef.current.targetVisible = 0;
      }
    };

    const handleMouseEnter = () => {
      stateRef.current.targetVisible = 1;
    };

    const animate = () => {
      const now = performance.now();

      // Throttled hover detection
      if (now - lastHoverCheckRef.current > HOVER_CHECK_INTERVAL_MS) {
        lastHoverCheckRef.current = now;
        const el = document.elementFromPoint(
          targetRef.current.x,
          targetRef.current.y
        );

        if (isTextInputTarget(el)) {
          stateRef.current.hovered = false;
          stateRef.current.label = "";
          stateRef.current.targetVisible = 0;
        } else {
          stateRef.current.targetVisible = 1;
          const interactive = findInteractive(el);
          if (interactive) {
            stateRef.current.hovered = true;
            stateRef.current.label = describeElement(interactive);
          } else {
            stateRef.current.hovered = false;
            stateRef.current.label = "";
          }
        }
        stateRef.current.targetScale = stateRef.current.hovered ? 1.7 : 1;
      }

      // Spring interpolation
      const stiffness = prefersReduced ? 1 : 0.28;
      currentRef.current.x +=
        (targetRef.current.x - currentRef.current.x) * stiffness;
      currentRef.current.y +=
        (targetRef.current.y - currentRef.current.y) * stiffness;

      stateRef.current.scale +=
        (stateRef.current.targetScale - stateRef.current.scale) * 0.2;
      stateRef.current.visible +=
        (stateRef.current.targetVisible - stateRef.current.visible) * 0.2;

      const targetLabelOp = stateRef.current.hovered ? 1 : 0;
      stateRef.current.labelOpacity +=
        (targetLabelOp - stateRef.current.labelOpacity) * 0.3;

      // Write to DOM
      if (crosshairRef.current) {
        crosshairRef.current.style.transform = `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0) translate(-50%, -50%)`;
        crosshairRef.current.style.opacity = stateRef.current.visible.toFixed(3);
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) translate(-50%, -50%) scale(${stateRef.current.scale.toFixed(3)})`;
        ringRef.current.style.opacity = stateRef.current.visible.toFixed(3);
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y + 34}px, 0) translate(-50%, 0)`;
        labelRef.current.style.opacity = (
          stateRef.current.labelOpacity * stateRef.current.visible
        ).toFixed(3);
        if (stateRef.current.label && labelRef.current.dataset.text !== stateRef.current.label) {
          labelRef.current.textContent = `[SCAN: ${stateRef.current.label}]`;
          labelRef.current.dataset.text = stateRef.current.label;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseenter", handleMouseEnter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  return (
    <>
      {/* Crosshair — instant follow, exact cursor tip */}
      <div
        ref={crosshairRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          willChange: "transform, opacity",
          transform: "translate3d(-100px, -100px, 0)",
        }}
        aria-hidden="true"
      >
        {/* Horizontal line */}
        <span
          className="absolute left-1/2 top-1/2 block h-px"
          style={{
            width: "18px",
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--color-accent)",
            boxShadow: "0 0 4px rgba(6,182,212,0.6)",
          }}
        />
        {/* Vertical line */}
        <span
          className="absolute left-1/2 top-1/2 block w-px"
          style={{
            height: "18px",
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--color-accent)",
            boxShadow: "0 0 4px rgba(6,182,212,0.6)",
          }}
        />
        {/* Center dot */}
        <span
          className="absolute left-1/2 top-1/2 block"
          style={{
            width: "3px",
            height: "3px",
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--color-accent)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Ring with corner brackets — spring lagged */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{
          width: "34px",
          height: "34px",
          willChange: "transform, opacity",
          transform: "translate3d(-100px, -100px, 0)",
        }}
        aria-hidden="true"
      >
        {/* Top-left bracket */}
        <span
          className="absolute left-0 top-0"
          style={{
            width: "7px",
            height: "7px",
            borderLeft: "1px solid var(--color-accent)",
            borderTop: "1px solid var(--color-accent)",
            opacity: 0.85,
          }}
        />
        {/* Top-right bracket */}
        <span
          className="absolute right-0 top-0"
          style={{
            width: "7px",
            height: "7px",
            borderRight: "1px solid var(--color-accent)",
            borderTop: "1px solid var(--color-accent)",
            opacity: 0.85,
          }}
        />
        {/* Bottom-left bracket */}
        <span
          className="absolute bottom-0 left-0"
          style={{
            width: "7px",
            height: "7px",
            borderLeft: "1px solid var(--color-accent)",
            borderBottom: "1px solid var(--color-accent)",
            opacity: 0.85,
          }}
        />
        {/* Bottom-right bracket */}
        <span
          className="absolute bottom-0 right-0"
          style={{
            width: "7px",
            height: "7px",
            borderRight: "1px solid var(--color-accent)",
            borderBottom: "1px solid var(--color-accent)",
            opacity: 0.85,
          }}
        />
      </div>

      {/* Scan label — appears below ring on hover */}
      <div
        ref={labelRef}
        data-text=""
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          willChange: "transform, opacity",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.05em",
          color: "var(--color-accent)",
          backgroundColor: "rgba(10, 10, 15, 0.92)",
          border: "1px solid rgba(6, 182, 212, 0.35)",
          padding: "2px 6px",
          borderRadius: "3px",
          whiteSpace: "nowrap",
          textShadow: "0 0 4px rgba(6, 182, 212, 0.5)",
          transform: "translate3d(-100px, -100px, 0)",
          opacity: 0,
        }}
        aria-hidden="true"
      >
        [SCAN]
      </div>
    </>
  );
}
