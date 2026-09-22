"use client";

import { useEffect, useRef, useState } from "react";

export interface Anchor {
  /** Fractions of the container box, 0-1. */
  x: number;
  y: number;
}

/**
 * Thin connector lines drawn from the core to each navigation node. Measured in
 * pixel space rather than a stretched viewBox so strokes stay hairline-thin and
 * the travelling packets stay circular at any aspect ratio.
 */
export default function ConnectorField({ anchors }: { anchors: Anchor[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const originX = box.width / 2;
  const originY = box.height / 2;

  return (
    <div ref={hostRef} aria-hidden="true" className="absolute inset-0">
      {box.width > 0 && (
        <svg
          width={box.width}
          height={box.height}
          className="absolute inset-0"
          data-testid="connector-field"
        >
          <g>
            {anchors.map((anchor, index) => {
              const x = anchor.x * box.width;
              const y = anchor.y * box.height;
              return (
                <g key={`${anchor.x}-${anchor.y}`}>
                  <line
                    x1={originX}
                    y1={originY}
                    x2={x}
                    y2={y}
                    className="stroke-signal"
                    style={{ strokeOpacity: "var(--op-soft)" }}
                    strokeWidth="1"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    className="fill-void stroke-signal"
                    style={{ strokeOpacity: "var(--op-strong)" }}
                    strokeWidth="1"
                  />
                  <circle
                    cx={originX}
                    cy={originY}
                    r="2"
                    className="packet fill-signal"
                    style={
                      {
                        fillOpacity: "var(--op-strong)",
                        "--dx": `${x - originX}px`,
                        "--dy": `${y - originY}px`,
                        "--packet-delay": `${index * 1200}ms`,
                      } as React.CSSProperties
                    }
                  />
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
