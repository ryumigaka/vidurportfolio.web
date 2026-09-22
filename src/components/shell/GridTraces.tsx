"use client";

import type { ActiveView } from "@/src/lib/views";

/** Right-angle circuit runs. Drawn in a 1600x900 field, scaled to cover. */
const TRACES: string[] = [
  "M-40 150 H220 L300 230 H520",
  "M-40 700 H180 L260 620 H470",
  "M1640 220 H1420 L1340 300 H1120",
  "M1640 760 H1380 L1300 680 H1110",
  "M300 -40 V120 L380 200 V330",
  "M1290 940 V760 L1210 680 V560",
  "M-40 430 H140 L200 430",
  "M1640 470 H1460 L1400 470",
];

/** Small square pads sitting at the end of some runs. */
const PADS: Array<{ x: number; y: number }> = [
  { x: 520, y: 230 },
  { x: 470, y: 620 },
  { x: 1120, y: 300 },
  { x: 1110, y: 680 },
  { x: 380, y: 330 },
  { x: 1210, y: 560 },
];

export default function GridTraces({ view }: { view: ActiveView }) {
  const dimmed = view !== "home";

  return (
    <div
      aria-hidden="true"
      data-testid="grid-traces"
      className={`pointer-events-none fixed inset-0 z-[1] transition-opacity duration-[1200ms] ${
        dimmed ? "opacity-40" : "opacity-100"
      }`}
    >
      {/* Grid: no viewBox, so cells stay square at any aspect ratio. */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern
            id="grid-fine"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M48 0H0V48"
              fill="none"
              stroke="#2ff3c8"
              strokeOpacity="0.035"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="grid-coarse"
            width="240"
            height="240"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M240 0H0V240"
              fill="none"
              stroke="#4a90f0"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="grid-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor="#020403" stopOpacity="0" />
            <stop offset="100%" stopColor="#020403" stopOpacity="0.92" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-fine)" />
        <rect width="100%" height="100%" fill="url(#grid-coarse)" />
        <rect width="100%" height="100%" fill="url(#grid-vignette)" />
      </svg>

      {/* Circuit runs: proportional, cropped rather than stretched. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#2ff3c8" fill="none" strokeWidth="1">
          {TRACES.map((d, index) => (
            <g key={d}>
              <path d={d} strokeOpacity="0.09" />
              <path
                d={d}
                strokeOpacity="0.5"
                strokeDasharray="6 234"
                className="animate-traceFlow"
                style={{ animationDelay: `${index * -1.75}s` }}
              />
            </g>
          ))}
        </g>
        <g fill="none" stroke="#2ff3c8" strokeOpacity="0.16">
          {PADS.map((pad) => (
            <rect
              key={`${pad.x}-${pad.y}`}
              x={pad.x - 4}
              y={pad.y - 4}
              width="8"
              height="8"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
