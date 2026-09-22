"use client";

import { useEffect, useRef } from "react";
import { readToken, type Theme } from "@/src/lib/theme";

const TILE = 128;

/**
 * Procedural film grain. A single noise tile is generated once and repeated as
 * a canvas pattern, so this costs one paint rather than a per-frame loop.
 */
export default function NoiseLayer({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // White grain over near-black, dark grain over white.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tile = document.createElement("canvas");
    tile.width = TILE;
    tile.height = TILE;
    const tileCtx = tile.getContext("2d");
    if (!tileCtx) return;

    const tone = Number.parseInt(readToken("--grain-tone", "255"), 10);
    const light = tone > 127;

    const image = tileCtx.createImageData(TILE, TILE);
    for (let i = 0; i < image.data.length; i += 4) {
      const value = light ? 120 + Math.random() * 135 : Math.random() * 90;
      image.data[i] = value;
      image.data[i + 1] = value;
      image.data[i + 2] = value;
      image.data[i + 3] = 10 + Math.random() * 12;
    }
    tileCtx.putImageData(image, 0, 0);

    let frame = 0;

    const paint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const pattern = ctx.createPattern(tile, "repeat");
      if (!pattern) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
    };

    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="noise-layer"
      style={{
        opacity: "var(--grain-opacity)",
        mixBlendMode:
          "var(--grain-blend)" as React.CSSProperties["mixBlendMode"],
      }}
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  );
}
