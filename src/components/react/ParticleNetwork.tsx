import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
}

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 160;
const MOUSE_RADIUS = 200;
const PARTICLE_COLOR = "6, 182, 212";
const GLOW_COLOR = "34, 211, 238";
const SPEED = 0.25;
const MOUSE_REPEL_FORCE = 0.8;

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const sizeRef = useRef({ w: 0, h: 0 });

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const r = Math.random() * 1.8 + 0.5;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        radius: r,
        baseRadius: r,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Listen on window so mouse works even with content on top
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < MOUSE_RADIUS && mdist > 0) {
          const force = (1 - mdist / MOUSE_RADIUS) * MOUSE_REPEL_FORCE;
          p.vx += (mdx / mdist) * force;
          p.vy += (mdy / mdist) * force;
          // Grow particles near mouse
          p.radius = p.baseRadius + (1 - mdist / MOUSE_RADIUS) * 2;
        } else {
          p.radius += (p.baseRadius - p.radius) * 0.1;
        }

        // Dampen velocity
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Minimum speed so particles don't stop
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < SPEED * 0.3) {
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.18;
            ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Mouse connections - brighter, thicker
        const mdx2 = particles[i].x - mouse.x;
        const mdy2 = particles[i].y - mouse.y;
        const mdist2 = Math.sqrt(mdx2 * mdx2 + mdy2 * mdy2);
        if (mdist2 < MOUSE_RADIUS) {
          const alpha = (1 - mdist2 / MOUSE_RADIUS) * 0.5;
          ctx.strokeStyle = `rgba(${GLOW_COLOR}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw particles with glow
      for (const p of particles) {
        const mdx3 = p.x - mouse.x;
        const mdy3 = p.y - mouse.y;
        const mdist3 = Math.sqrt(mdx3 * mdx3 + mdy3 * mdy3);
        const nearMouse = mdist3 < MOUSE_RADIUS;

        if (nearMouse) {
          // Glow effect for particles near mouse
          const glowAlpha = (1 - mdist3 / MOUSE_RADIUS) * 0.4;
          ctx.shadowColor = `rgba(${GLOW_COLOR}, ${glowAlpha})`;
          ctx.shadowBlur = 12;
          ctx.fillStyle = `rgba(${GLOW_COLOR}, ${0.6 + glowAlpha})`;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(${PARTICLE_COLOR}, 0.5)`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      initParticles(sizeRef.current.w, sizeRef.current.h);
      for (const p of particlesRef.current) {
        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, 0.4)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
