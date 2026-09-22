"use client";

import { portfolio } from "@/src/data/portfolio";
import type { Theme } from "@/src/lib/theme";
import { NODE_VIEWS, VIEW_META, type ActiveView } from "@/src/lib/views";
import ThemeToggle from "./ThemeToggle";

interface ShellHeaderProps {
  view: ActiveView;
  onNavigate: (view: ActiveView) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function ShellHeader({
  view,
  onNavigate,
  theme,
  onToggleTheme,
}: ShellHeaderProps) {
  const inSection = view !== "home";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
      <button
        type="button"
        onClick={() => onNavigate("home")}
        data-cursor-target
        data-testid="core-return"
        aria-label="Return to core"
        className="group pointer-events-auto flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest2 text-muted transition-colors hover:text-signal"
      >
        <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
          <polygon
            points="8,1 15,5 15,13 8,17 1,13 1,5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="8" cy="9" r="2" fill="currentColor" />
        </svg>
        <span>{portfolio.handle}</span>
      </button>

      <div className="flex items-start gap-2 sm:gap-3">
        <nav
          data-testid="shell-nav"
          aria-label="Sections"
          className={`pointer-events-auto flex items-center gap-1 transition-opacity duration-500 sm:gap-2 ${
            inSection ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {NODE_VIEWS.map((id) => {
            const meta = VIEW_META[id];
            const active = view === id;
            return (
              <button
                key={id}
                type="button"
                data-cursor-target
                data-active={active ? "true" : "false"}
                onClick={() => onNavigate(id)}
                aria-label={meta.label}
                aria-current={active ? "page" : undefined}
                className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition-colors sm:px-3 ${
                  active
                    ? "border-signal/50 text-signal"
                    : "border-hairline text-dim hover:border-hairlineBright hover:text-muted"
                }`}
              >
                <span className="text-[9px] opacity-60">{meta.code}</span>
                <span className="ml-1.5 hidden sm:inline">{meta.label}</span>
              </button>
            );
          })}
          <span className="ml-2 hidden font-mono text-[9px] uppercase tracking-widest2 text-dim lg:inline">
            esc ↩ core
          </span>
        </nav>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
