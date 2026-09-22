"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "portfolio-theme";

/** Dark is the shell's canonical mode; light is an explicit choice. */
export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/** Browser chrome should match the shell, not sit in the opposite mode. */
const BROWSER_CHROME: Record<Theme, string> = {
  dark: "#020403",
  light: "#fdfcfc",
};

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", BROWSER_CHROME[theme]);
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    // Private mode or blocked storage: fall back to the default silently.
    return null;
  }
}

function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Persistence is a nicety; the session still works without it.
  }
}

/**
 * The pre-paint script. Runs before first paint so a stored light theme never
 * flashes the dark shell first. Kept as a string because it must be inlined in
 * <head> ahead of hydration.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="dark"&&t!=="light"){t=${JSON.stringify(
  DEFAULT_THEME,
)};}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme=${JSON.stringify(
  DEFAULT_THEME,
)};}document.documentElement.classList.add("theme-booting");})();`;

/**
 * Canvas cannot read CSS variables directly, so the drawing layers resolve
 * them at paint time. Values are stored as raw RGB channels ("47 243 200").
 */
export function readToken(token: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value || fallback;
}

export function rgba(channels: string, alpha: number): string {
  const [r, g, b] = channels.split(/[\s,]+/);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function readAlpha(token: string, fallback: number): number {
  const parsed = Number.parseFloat(readToken(token, String(fallback)));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  // Matches the server-rendered markup; the boot script has already set the
  // attribute, and the effect below reconciles state with it after mount.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const themeRef = useRef<Theme>(DEFAULT_THEME);

  const commit = useCallback((next: Theme, persist: boolean) => {
    themeRef.current = next;
    setTheme(next);
    applyTheme(next);
    if (persist) storeTheme(next);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- storage is only readable post-mount
    commit(readStoredTheme() ?? DEFAULT_THEME, false);
    // Re-enable colour transitions once the boot theme is settled.
    document.documentElement.classList.remove("theme-booting");
  }, [commit]);

  const toggle = useCallback(() => {
    commit(themeRef.current === "dark" ? "light" : "dark", true);
  }, [commit]);

  return { theme, toggle };
}
