import type { ReactNode } from "react";
import { stagger } from "@/src/lib/stagger";
import { VIEW_META, type ActiveView } from "@/src/lib/views";

interface SectionFrameProps {
  view: Exclude<ActiveView, "home">;
  children: ReactNode;
}

export default function SectionFrame({ view, children }: SectionFrameProps) {
  const meta = VIEW_META[view];

  return (
    <section
      aria-labelledby={`${view}-heading`}
      className="absolute inset-0 flex flex-col px-4 pb-12 pt-20 sm:px-6 sm:pb-14 sm:pt-24 md:px-10 lg:px-16"
    >
      <div className="flex h-full w-full flex-col md:max-w-[56%] lg:max-w-[44rem]">
        <header className="stagger-item shrink-0" style={stagger(0)}>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] tracking-widest2 text-signal/70">
              {meta.code}
            </span>
            <h1
              id={`${view}-heading`}
              className="font-display text-2xl uppercase tracking-[0.18em] text-fg sm:text-3xl"
            >
              {meta.label}
            </h1>
          </div>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest2 text-dim">
            {meta.caption}
          </p>
          <div className="hairline-x mt-4 h-px w-full" />
        </header>

        <div className="scroll-region mt-6 flex-1 pr-3">{children}</div>
      </div>
    </section>
  );
}
