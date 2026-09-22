"use client";

import { useEffect, useRef } from "react";
import { readAlpha, readToken, rgba, type Theme } from "@/src/lib/theme";
import { useMediaQuery } from "@/src/lib/useMediaQuery";

interface Particle {
  x: number;
  y: number;
  life: number;
  size: number;
  drift: number;
}

const MAX_PARTICLES = 64;

/**
 * Reticle cursor plus a decaying particle trail. Only mounts on pointer-capable
 * desktop; touch devices keep their native behaviour entirely.
 */
export default function CursorLayer({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reduceMotion;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const reticle = reticleRef.current;
    const readout = readoutRef.current;
    if (!canvas || !reticle || !readout) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.documentElement.classList.add("custom-cursor");

    const signal = readToken("--signal", "47 243 200");
    const trailAlpha = readAlpha("--op-trail", 0.4);

    const particles: Particle[] = [];
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let renderX = pointerX;
    let renderY = pointerY;
    let visible = false;
    let frame = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!visible) {
        visible = true;
        renderX = pointerX;
        renderY = pointerY;
        reticle.style.opacity = "1";
      }
      if (particles.length < MAX_PARTICLES) {
        particles.push({
          x: pointerX + (Math.random() - 0.5) * 6,
          y: pointerY + (Math.random() - 0.5) * 6,
          life: 1,
          size: 1 + Math.random() * 2,
          drift: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const onPointerLeave = () => {
      visible = false;
      reticle.style.opacity = "0";
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest?.(
        "a, button, [data-cursor-target]",
      ) as Element | null;
      reticle.dataset.locked = interactive ? "true" : "false";
    };

    const draw = (now: number) => {
      const delta = Math.min(now - last, 64);
      last = now;

      // Reticle tracks the pointer closely; just enough lag to read as weight.
      const follow = Math.min(1, delta / 22);
      renderX += (pointerX - renderX) * follow;
      renderY += (pointerY - renderY) * follow;
      reticle.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%)`;
      readout.textContent = `${String(Math.round(pointerX)).padStart(4, "0")} ${String(
        Math.round(pointerY),
      ).padStart(4, "0")}`;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.life -= delta / 620;
        particle.y += particle.drift;
        particle.x += particle.drift;
        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = rgba(signal, particle.life * trailAlpha);
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size,
        );
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [enabled, theme]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-testid="cursor-trail"
        className="pointer-events-none fixed inset-0 z-[60]"
      />
      <div
        ref={reticleRef}
        aria-hidden="true"
        data-testid="cursor-reticle"
        data-locked="false"
        className="group pointer-events-none fixed left-0 top-0 z-[61] opacity-0 transition-opacity duration-200"
      >
        <div className="relative h-10 w-10 transition-transform duration-200 ease-out group-data-[locked=true]:scale-[1.35]">
          {/* Corner brackets */}
          <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-signal/70" />
          <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-signal/70" />
          <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-signal/70" />
          <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-signal/70" />
          {/* Crosshair */}
          <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-signal/50" />
          <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-signal/50" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
        </div>
        <span
          ref={readoutRef}
          className="absolute left-12 top-6 whitespace-nowrap font-mono text-[9px] tracking-widest text-signal/45"
        />
      </div>
    </>
  );
}
