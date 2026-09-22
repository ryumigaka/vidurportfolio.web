"use client";

import { useEffect, useRef } from "react";
import type { ActiveView } from "@/src/lib/views";

const CENTER = 500;
const SWEEP_RADIUS = 470;
const SWEEP_PERIOD_MS = 9000;

function polar(radius: number, degrees: number): { x: number; y: number } {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

/** Bezel ticks: long every 30 degrees, short otherwise. */
const TICKS = Array.from({ length: 96 }, (_, index) => {
  const angle = index * 3.75;
  const long = index % 8 === 0;
  const outer = 468;
  const inner = long ? 446 : 458;
  return {
    angle,
    from: polar(inner, angle),
    to: polar(outer, angle),
    long,
  };
});

const OUTER_NODE_ANGLES = [18, 57, 96, 140, 187, 231, 274, 318];
const INNER_NODE_ANGLES = [35, 108, 176, 250, 305];

const OUTER_NODES = OUTER_NODE_ANGLES.map((angle) => ({
  angle,
  ...polar(312, angle),
}));
const INNER_NODES = INNER_NODE_ANGLES.map((angle) => ({
  angle,
  ...polar(196, angle),
}));
const ALL_NODES = [...OUTER_NODES, ...INNER_NODES];

/** Topology edges, chosen by hand so the graph reads as a network, not a wheel. */
const EDGES: Array<[{ x: number; y: number }, { x: number; y: number }]> = [
  [OUTER_NODES[0], INNER_NODES[0]],
  [OUTER_NODES[1], INNER_NODES[1]],
  [OUTER_NODES[2], INNER_NODES[1]],
  [OUTER_NODES[3], INNER_NODES[2]],
  [OUTER_NODES[4], INNER_NODES[2]],
  [OUTER_NODES[5], INNER_NODES[3]],
  [OUTER_NODES[6], INNER_NODES[3]],
  [OUTER_NODES[7], INNER_NODES[4]],
  [OUTER_NODES[0], OUTER_NODES[1]],
  [OUTER_NODES[3], OUTER_NODES[4]],
  [OUTER_NODES[6], OUTER_NODES[7]],
  [INNER_NODES[0], INNER_NODES[4]],
  [INNER_NODES[1], INNER_NODES[2]],
];

/** Six overlapping iris blades: arc out, curve back through an inner control. */
const BLADES = Array.from({ length: 6 }, (_, index) => {
  const start = index * 60;
  const end = start + 60;
  const a = polar(150, start);
  const b = polar(150, end);
  const control = polar(62, start + 30);
  return `M ${a.x} ${a.y} A 150 150 0 0 1 ${b.x} ${b.y} Q ${control.x} ${control.y} ${a.x} ${a.y} Z`;
});

const HEX = Array.from({ length: 6 }, (_, index) => polar(58, index * 60 - 90))
  .map((point) => `${point.x},${point.y}`)
  .join(" ");

/** Right-angle service runs leaving the core toward the bezel. */
const SPOKES = [
  "M 500 350 V 250 H 620 V 150",
  "M 650 500 H 760 V 400 H 880",
  "M 500 650 V 750 H 380 V 850",
  "M 350 500 H 240 V 600 H 120",
  "M 606 394 L 700 300 V 210",
  "M 394 606 L 300 700 V 790",
];

export default function SystemCore({ view }: { view: ActiveView }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let size = 0;
    let frame = 0;
    let last = performance.now();
    let angle = -Math.PI / 2;
    const blips = new Float32Array(ALL_NODES.length);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.max(rect.width, 1);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const delta = Math.min(now - last, 64);
      last = now;

      const scale = size / 1000;
      const cx = size / 2;
      const cy = size / 2;
      const radius = SWEEP_RADIUS * scale;

      const previous = angle;
      angle += (delta / SWEEP_PERIOD_MS) * Math.PI * 2;
      if (angle > Math.PI * 2) angle -= Math.PI * 2;

      ctx.clearRect(0, 0, size, size);

      // Sweep wedge
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      if (typeof ctx.createConicGradient === "function") {
        const gradient = ctx.createConicGradient(0, 0, 0);
        gradient.addColorStop(0, "rgba(47, 243, 200, 0.14)");
        gradient.addColorStop(0.04, "rgba(47, 243, 200, 0.06)");
        gradient.addColorStop(0.16, "rgba(47, 243, 200, 0)");
        gradient.addColorStop(1, "rgba(47, 243, 200, 0)");
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = "rgba(47, 243, 200, 0.06)";
      }
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(47, 243, 200, 0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.stroke();
      ctx.restore();

      // Blips light as the sweep crosses each node, then decay.
      for (let i = 0; i < ALL_NODES.length; i += 1) {
        const node = ALL_NODES[i];
        const nodeAngle = ((node.angle % 360) * Math.PI) / 180;
        const crossed =
          previous <= angle
            ? nodeAngle > previous && nodeAngle <= angle
            : nodeAngle > previous || nodeAngle <= angle;
        if (crossed) blips[i] = 1;
        if (blips[i] > 0) {
          blips[i] = Math.max(0, blips[i] - delta / 1400);
          const x = node.x * scale;
          const y = node.y * scale;
          ctx.beginPath();
          ctx.fillStyle = `rgba(47, 243, 200, ${blips[i] * 0.85})`;
          ctx.arc(x, y, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.strokeStyle = `rgba(47, 243, 200, ${blips[i] * 0.3})`;
          ctx.arc(x, y, 3.2 + (1 - blips[i]) * 16, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };

    const stop = () => cancelAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduceMotion) start();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      // Draw nothing animated; the SVG geometry still carries the composition.
      ctx.clearRect(0, 0, size, size);
    } else {
      start();
    }

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const placement =
    view === "home"
      ? "-translate-x-1/2 -translate-y-1/2 scale-100 opacity-95"
      : "-translate-x-1/2 -translate-y-1/2 scale-[1.18] opacity-[0.13] md:-translate-x-[8%] md:scale-[0.74] md:opacity-45";

  return (
    <div
      aria-hidden="true"
      data-testid="system-core"
      data-view={view}
      className={`pointer-events-none fixed left-1/2 top-1/2 z-[2] h-[min(94vw,94vh)] w-[min(94vw,94vh)] transition-[transform,opacity] duration-[1600ms] ease-[cubic-bezier(0.16,0.84,0.44,1)] ${placement}`}
    >
      <div className="relative h-full w-full animate-driftY">
        <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2ff3c8" stopOpacity="0.16" />
              <stop offset="45%" stopColor="#2ff3c8" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#2ff3c8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="iris-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2ff3c8" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#2ff3c8" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#2ff3c8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={CENTER} cy={CENTER} r="470" fill="url(#core-glow)" />

          {/* Bezel with ticks */}
          <g
            className="animate-coreSpin"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r="468"
              fill="none"
              stroke="#1f3a32"
              strokeWidth="1"
            />
            {TICKS.map((tick) => (
              <line
                key={tick.angle}
                x1={tick.from.x}
                y1={tick.from.y}
                x2={tick.to.x}
                y2={tick.to.y}
                stroke={tick.long ? "#2ff3c8" : "#1f3a32"}
                strokeOpacity={tick.long ? 0.42 : 0.7}
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Counter-rotating dashed ring */}
          <g
            className="animate-coreSpinReverse"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r="432"
              fill="none"
              stroke="#4a90f0"
              strokeOpacity="0.22"
              strokeWidth="1"
              strokeDasharray="2 14"
            />
          </g>

          {/* Segment arcs */}
          <g
            className="animate-coreSpinSlow"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r="392"
              fill="none"
              stroke="#2ff3c8"
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeDasharray="410 205"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r="368"
              fill="none"
              stroke="#1f3a32"
              strokeWidth="1"
              strokeDasharray="60 30"
            />
          </g>

          {/* Service runs */}
          <g stroke="#2ff3c8" strokeOpacity="0.14" fill="none" strokeWidth="1">
            {SPOKES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>

          {/* Network topology */}
          <g
            className="animate-coreSpinReverse"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
          >
            <g stroke="#4a90f0" strokeOpacity="0.2" strokeWidth="1">
              {EDGES.map(([a, b]) => (
                <line
                  key={`${a.x}-${a.y}-${b.x}-${b.y}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
              ))}
            </g>
            {OUTER_NODES.map((node) => (
              <g key={`outer-${node.angle}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill="#020403"
                  stroke="#2ff3c8"
                  strokeOpacity="0.55"
                />
              </g>
            ))}
            {INNER_NODES.map((node) => (
              <circle
                key={`inner-${node.angle}`}
                cx={node.x}
                cy={node.y}
                r="2.5"
                fill="#4a90f0"
                fillOpacity="0.5"
              />
            ))}
          </g>

          {/* Aperture */}
          <g
            className="animate-coreSpin"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
          >
            {BLADES.map((d, index) => (
              <path
                key={d}
                d={d}
                fill="#2ff3c8"
                fillOpacity={index % 2 === 0 ? 0.035 : 0.02}
                stroke="#2ff3c8"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Secure node at the centre */}
          <circle cx={CENTER} cy={CENTER} r="96" fill="url(#iris-glow)" />
          <polygon
            points={HEX}
            fill="#020403"
            stroke="#2ff3c8"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r="6"
            fill="#2ff3c8"
            className="animate-blink"
          />
        </svg>

        <canvas
          ref={canvasRef}
          data-testid="core-sweep"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
