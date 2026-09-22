"use client";

import { portfolio } from "@/src/data/portfolio";
import { stagger } from "@/src/lib/stagger";
import { NODE_VIEWS, VIEW_META, type ActiveView } from "@/src/lib/views";
import Value from "@/src/components/ui/Value";
import ConnectorField, { type Anchor } from "./ConnectorField";
import NavNode from "./NavNode";
import PrimaryChannel from "./PrimaryChannel";

/** Node placement on desktop, as fractions of the viewport box. */
const ANCHORS: Anchor[] = [
  { x: 0.75, y: 0.24 },
  { x: 0.83, y: 0.5 },
  { x: 0.75, y: 0.76 },
];

interface HomeSectionProps {
  onNavigate: (view: ActiveView) => void;
}

function Identity({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "max-w-[38vw]"}>
      <p className="stagger-item label" style={stagger(0)}>
        Operator
      </p>
      <h1
        className={`stagger-item mt-3 font-display uppercase leading-[0.9] tracking-[0.01em] text-fg ${
          compact
            ? "text-[clamp(2.1rem,11vw,3.4rem)]"
            : "text-[clamp(2.4rem,5vw,4.75rem)]"
        }`}
        style={stagger(1)}
      >
        <Value>{portfolio.fullName}</Value>
      </h1>
      {portfolio.alias.trim().length > 0 && (
        <p
          className="stagger-item mt-2 font-mono text-[11px] uppercase tracking-widest2 text-dim"
          style={stagger(2)}
          data-testid="operator-alias"
        >
          aka <span className="text-muted">{portfolio.alias}</span>
        </p>
      )}
      <p
        className="stagger-item mt-4 font-mono text-xs text-muted sm:text-sm"
        style={stagger(3)}
      >
        <Value>{portfolio.primaryRole}</Value>
        <span className="mx-2 text-signal/50">{"//"}</span>
        <Value>{portfolio.secondaryRole}</Value>
      </p>
      <p
        className="stagger-item mt-2.5 font-mono text-[10px] uppercase tracking-widest2 text-dim"
        style={stagger(4)}
      >
        <Value>{portfolio.location}</Value>
        <span className="mx-2 text-hairlineBright">|</span>
        <Value>{portfolio.handle}</Value>
      </p>
      <div className="stagger-item mt-7" style={stagger(5)}>
        <PrimaryChannel />
      </div>
    </div>
  );
}

export default function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <div className="relative h-full w-full">
      {/* ---------- Desktop composition: type left, nodes orbiting right ---------- */}
      <div className="relative hidden h-full w-full md:block">
        <ConnectorField anchors={ANCHORS} />

        <div className="absolute left-10 top-1/2 -translate-y-1/2 lg:left-16">
          <Identity />
        </div>

        {NODE_VIEWS.map((id, index) => (
          <div
            key={id}
            className="stagger-item absolute w-[15rem] -translate-x-1/2 -translate-y-1/2 lg:w-[17rem]"
            style={{
              left: `${ANCHORS[index].x * 100}%`,
              top: `${ANCHORS[index].y * 100}%`,
              ...stagger(index + 6, 90),
            }}
          >
            <NavNode meta={VIEW_META[id]} onSelect={onNavigate} />
          </div>
        ))}

        <p
          className="stagger-item absolute bottom-16 left-10 font-mono text-[10px] uppercase tracking-widest2 text-dim lg:left-16"
          style={stagger(10)}
        >
          Select a node to route
        </p>
      </div>

      {/* ---------- Mobile composition: stacked spine ---------- */}
      <div className="scroll-region flex h-full w-full flex-col px-5 pb-16 pt-20 md:hidden">
        <Identity compact />

        <div className="relative mt-9 pl-6">
          {/* Vertical spine with branch stubs */}
          <svg
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-6"
            preserveAspectRatio="none"
          >
            <line
              x1="11"
              y1="0"
              x2="11"
              y2="100%"
              className="stroke-signal"
              style={{ strokeOpacity: "var(--op-medium)" }}
              strokeWidth="1"
            />
          </svg>

          <div className="flex flex-col gap-4">
            {NODE_VIEWS.map((id, index) => (
              <div
                key={id}
                className="stagger-item relative"
                style={stagger(index + 6, 90)}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-6 top-1/2 h-px w-6 bg-signal/25"
                />
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.6rem] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-signal/50 bg-void"
                />
                <NavNode meta={VIEW_META[id]} onSelect={onNavigate} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
