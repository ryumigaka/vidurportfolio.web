"use client";

import type { Theme } from "@/src/lib/theme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

/**
 * A two-position console switch rather than a sun/moon icon: the active mode is
 * lit, the other is dim, and the whole control reads as instrumentation.
 */
export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-cursor-target
      data-testid="theme-toggle"
      data-theme-state={theme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="group pointer-events-auto flex items-center gap-2 border border-hairline px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest2 transition-colors hover:border-signal/50 sm:gap-2.5 sm:px-3"
    >
      <span
        className={
          theme === "dark" ? "text-signal" : "text-dim group-hover:text-muted"
        }
      >
        Dark
      </span>

      {/* Switch track */}
      <span
        aria-hidden="true"
        className="relative inline-flex h-3 w-6 shrink-0 items-center border border-hairlineBright px-[2px]"
      >
        <span
          className={`h-1.5 w-1.5 bg-signal transition-transform duration-300 ease-out ${
            theme === "light" ? "translate-x-[11px]" : "translate-x-0"
          }`}
        />
      </span>

      <span
        className={
          theme === "light" ? "text-signal" : "text-dim group-hover:text-muted"
        }
      >
        Light
      </span>
    </button>
  );
}
