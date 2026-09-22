"use client";

import { useEffect, useRef } from "react";

const TILE = 128;

/**
 * Procedural film grain. A single noise tile is generated once and repeated as
 * a canvas pattern, so this costs one paint rather than a per-frame loop.
 */
export default function NoiseLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const image = tileCtx.createImageData(TILE, TILE);
    for (let i = 0; i < image.data.length; i += 4) {
      const value = 120 + Math.random() * 135;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="noise-layer"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full opacity-60 mix-blend-soft-light"
    />
  );
}
