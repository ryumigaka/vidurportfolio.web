export type ActiveView = "home" | "identity" | "operations" | "signal";

export const VIEWS: readonly ActiveView[] = [
  "home",
  "identity",
  "operations",
  "signal",
] as const;

/** The three nodes reachable from the core. Home is the core itself. */
export const NODE_VIEWS: readonly Exclude<ActiveView, "home">[] = [
  "identity",
  "operations",
  "signal",
] as const;

export interface ViewMeta {
  id: ActiveView;
  /** Two-digit index rendered beside nav nodes. */
  code: string;
  label: string;
  /** Sub-label describing what the node exposes. */
  caption: string;
}

export const VIEW_META: Record<ActiveView, ViewMeta> = {
  home: {
    id: "home",
    code: "00",
    label: "Core",
    caption: "System idle",
  },
  identity: {
    id: "identity",
    code: "01",
    label: "Identity",
    caption: "Operator profile",
  },
  operations: {
    id: "operations",
    code: "02",
    label: "Operations",
    caption: "Deployed work",
  },
  signal: {
    id: "signal",
    code: "03",
    label: "Signal",
    caption: "Open channels",
  },
};

function isActiveView(value: string): value is ActiveView {
  return (VIEWS as readonly string[]).includes(value);
}

/**
 * Maps a location hash to a view. Anything unrecognised falls back to home,
 * so a stale or hand-edited URL never renders an empty shell.
 */
export function viewFromHash(hash: string): ActiveView {
  const normalized = hash.replace(/^#/, "").trim().toLowerCase();
  if (normalized.length === 0) return "home";
  return isActiveView(normalized) ? normalized : "home";
}

/** The URL a view should produce. Home clears the hash entirely. */
export function hashForView(view: ActiveView): string {
  return view === "home" ? "/" : `/#${view}`;
}

/** Document title per view, per spec. */
export function titleForView(view: ActiveView, fullName: string): string {
  if (view === "home") return `${fullName} — Portfolio`;
  return `${VIEW_META[view].label} — ${fullName}`;
}
