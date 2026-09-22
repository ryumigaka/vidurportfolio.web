import type { ActiveView, ViewMeta } from "@/src/lib/views";

interface NavNodeProps {
  meta: ViewMeta;
  onSelect: (view: ActiveView) => void;
}

export default function NavNode({ meta, onSelect }: NavNodeProps) {
  return (
    <button
      type="button"
      data-cursor-target
      data-testid={`node-${meta.id}`}
      onClick={() => onSelect(meta.id)}
      aria-label={`${meta.label} — ${meta.caption}`}
      className="group relative block w-full text-left"
    >
      {/* Corner brackets ease outward on hover. */}
      <span className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-signal/30 transition-all duration-300 group-hover:-left-2 group-hover:-top-2 group-hover:border-signal/80" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 border-r border-t border-signal/30 transition-all duration-300 group-hover:-right-2 group-hover:-top-2 group-hover:border-signal/80" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-2.5 w-2.5 border-b border-l border-signal/30 transition-all duration-300 group-hover:-bottom-2 group-hover:-left-2 group-hover:border-signal/80" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-signal/30 transition-all duration-300 group-hover:-bottom-2 group-hover:-right-2 group-hover:border-signal/80" />

      <div className="border border-hairline bg-void/80 px-4 py-3.5 backdrop-blur-[2px] transition-colors duration-300 group-hover:border-signal/45 group-hover:bg-panel/80">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-widest2 text-signal/60">
            {meta.code}
          </span>
          <span className="h-1.5 w-1.5 animate-nodePulse rounded-full bg-signal/50 transition-colors group-hover:bg-signal" />
        </div>
        <div className="mt-2.5 font-display text-base uppercase tracking-[0.22em] text-fg transition-colors duration-300 group-hover:text-signal sm:text-lg">
          {meta.label}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-dim transition-colors duration-300 group-hover:text-muted">
          {meta.caption}
        </div>
      </div>
    </button>
  );
}
