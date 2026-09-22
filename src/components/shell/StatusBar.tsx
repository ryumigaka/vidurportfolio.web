"use client";

import { useEffect, useState } from "react";
import { VIEW_META, type ActiveView } from "@/src/lib/views";

function formatUptime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export default function StatusBar({ view }: { view: ActiveView }) {
  const [uptime, setUptime] = useState(0);
  const [viewport, setViewport] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setUptime((v) => v + 1), 1000);
    const onResize = () =>
      setViewport(`${window.innerWidth}×${window.innerHeight}`);
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const meta = VIEW_META[view];

  return (
    <footer
      data-testid="status-bar"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-hairline bg-void/70 px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-dim backdrop-blur-sm sm:px-6"
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1.5 text-signal/70">
          <span className="h-1.5 w-1.5 animate-nodePulse rounded-full bg-signal" />
          Core
        </span>
        <span className="hidden text-muted sm:inline">
          {meta.code} / {meta.label}
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <span className="hidden md:inline">UP {formatUptime(uptime)}</span>
        <span className="hidden lg:inline">{viewport ?? "----×----"}</span>
        <span className="text-muted/70">
          Link <span className="text-signal/60">secure</span>
        </span>
        <span className="h-3 w-1.5 animate-blink bg-signal/60" />
      </div>
    </footer>
  );
}
