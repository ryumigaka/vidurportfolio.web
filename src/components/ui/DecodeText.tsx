"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#$%&01ABCDEF";

/** Long strings resolve faster per character so a paragraph does not crawl. */
function durationFor(length: number): number {
  return Math.min(1400, 260 + length * 26);
}

function scramble(length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

/**
 * Resolves text out of noise when it scrolls into view, left to right, with a
 * block cursor riding the resolve point.
 *
 * The server renders the finished string, so the content is present without
 * JavaScript and for crawlers; the scrambled state is swapped in before paint
 * on the client. Screen readers get the real text and never the noise.
 */
export default function DecodeText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [output, setOutput] = useState(text);
  const [running, setRunning] = useState(false);
  const startedRef = useRef(false);

  // Swap to noise before the browser paints, so the answer is never shown first.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (startedRef.current) return;
    setOutput(scramble(text.length));
  }, [text]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Under reduced motion the pre-paint swap never ran, so the finished text
    // is already on screen and there is nothing to animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let startTimer = 0;
    const total = durationFor(text.length);

    const run = () => {
      const began = performance.now();
      setRunning(true);

      const step = (now: number) => {
        const progress = Math.min(1, (now - began) / total);
        const locked = Math.floor(progress * text.length);
        if (progress >= 1) {
          setOutput(text);
          setRunning(false);
          return;
        }
        setOutput(text.slice(0, locked) + scramble(text.length - locked));
        frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || startedRef.current) continue;
          startedRef.current = true;
          observer.disconnect();
          startTimer = window.setTimeout(run, delay);
        }
      },
      // Ancestor scroll containers clip the intersection rect, so the viewport
      // root is correct even though sections scroll internally.
      { threshold: 0.15 },
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(startTimer);
    };
  }, [text, delay]);

  return (
    <span ref={hostRef} className={className} data-testid="decode-text">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
      {running && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[0.95em] w-[0.5ch] translate-y-[0.12em] bg-signal/70 align-baseline"
        />
      )}
    </span>
  );
}
