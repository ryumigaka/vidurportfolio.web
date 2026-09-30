"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/src/lib/useMediaQuery";

/**
 * Reticle cursor. Only mounts on pointer-capable desktop; touch devices keep
 * their native behaviour entirely.
 */
export default function CursorLayer() {
  const reticleRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reduceMotion;

  useEffect(() => {
    if (!enabled) return;
    const reticle = reticleRef.current;
    const readout = readoutRef.current;
    if (!reticle || !readout) return;

    document.documentElement.classList.add("custom-cursor");

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let renderX = pointerX;
    let renderY = pointerY;
    let visible = false;
    let frame = 0;
    let last = performance.now();

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!visible) {
        visible = true;
        renderX = pointerX;
        renderY = pointerY;
        reticle.style.opacity = "1";
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

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
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
  );
}
