"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { portfolio } from "@/src/data/portfolio";
import { useTheme } from "@/src/lib/theme";
import {
  hashForView,
  titleForView,
  viewFromHash,
  type ActiveView,
} from "@/src/lib/views";
import CursorLayer from "./CursorLayer";
import GridTraces from "./GridTraces";
import NoiseLayer from "./NoiseLayer";
import ShellHeader from "./ShellHeader";
import StatusBar from "./StatusBar";
import SystemCore from "./SystemCore";
import HomeSection from "@/src/components/sections/HomeSection";
import IdentitySection from "@/src/components/sections/IdentitySection";
import OperationsSection from "@/src/components/sections/OperationsSection";
import SignalSection from "@/src/components/sections/SignalSection";

const EXIT_MS = 300;

export default function AppShell() {
  const [view, setView] = useState<ActiveView>("home");
  const [exiting, setExiting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const timeoutRef = useRef<number | null>(null);
  const viewRef = useRef<ActiveView>("home");

  const clearPending = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const commit = useCallback((next: ActiveView) => {
    viewRef.current = next;
    setView(next);
  }, []);

  /** Runs the exit animation, then commits the new view. */
  const transitionTo = useCallback(
    (next: ActiveView) => {
      if (viewRef.current === next) return;
      clearPending();
      setExiting(true);
      timeoutRef.current = window.setTimeout(() => {
        commit(next);
        setExiting(false);
        timeoutRef.current = null;
      }, EXIT_MS);
    },
    [clearPending, commit],
  );

  /** User-initiated navigation: pushes history so back/forward work. */
  const navigate = useCallback(
    (next: ActiveView) => {
      if (typeof window !== "undefined") {
        const target = hashForView(next);
        if (window.location.hash !== (next === "home" ? "" : `#${next}`)) {
          window.history.pushState(null, "", target);
        }
      }
      transitionTo(next);
    },
    [transitionTo],
  );

  // Deep links land directly, without playing an exit animation first. The hash
  // never reaches the server, so the first client render must match the static
  // "home" markup and only then correct itself — hence setState in an effect.
  useEffect(() => {
    const initial = viewFromHash(window.location.hash);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe URL sync
    if (initial !== "home") commit(initial);
  }, [commit]);

  // Back/forward and manual hash edits.
  useEffect(() => {
    const sync = () => transitionTo(viewFromHash(window.location.hash));
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [transitionTo]);

  useEffect(() => clearPending, [clearPending]);

  // Marks the shell interactive; by definition this can only be known post-mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration flag
  useEffect(() => setHydrated(true), []);

  // Escape returns to the core from any section.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && view !== "home") navigate("home");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, view]);

  const title = titleForView(view, portfolio.fullName);

  return (
    <div
      className="relative h-[100dvh] w-screen overflow-hidden bg-void"
      data-testid="shell-root"
      data-hydrated={hydrated ? "true" : "false"}
      data-theme-state={theme}
    >
      {/* React owns the title so it tracks the active view on deep links too. */}
      <title>{title}</title>
      <NoiseLayer theme={theme} />
      <GridTraces view={view} />
      <SystemCore view={view} theme={theme} />
      <CursorLayer theme={theme} />
      <ShellHeader
        view={view}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main
        key={view}
        data-testid="view-root"
        data-view={view}
        data-exiting={exiting ? "true" : "false"}
        className={`relative z-30 h-[100dvh] transition-[opacity,transform,filter] duration-300 ease-out ${
          exiting
            ? "translate-y-2 opacity-0 blur-[3px]"
            : "translate-y-0 opacity-100 blur-0"
        }`}
      >
        {view === "home" && <HomeSection onNavigate={navigate} />}
        {view === "identity" && <IdentitySection />}
        {view === "operations" && <OperationsSection />}
        {view === "signal" && <SignalSection />}
      </main>

      <p className="sr-only" aria-live="polite">
        {titleForView(view, portfolio.fullName)}
      </p>

      <StatusBar view={view} />
    </div>
  );
}
