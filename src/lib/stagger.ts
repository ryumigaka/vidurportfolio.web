import type { CSSProperties } from "react";

/** Inline delay for `.stagger-item`, so reveals cascade in reading order. */
export function stagger(index: number, step = 70, base = 90): CSSProperties {
  return { "--stagger": `${base + index * step}ms` } as CSSProperties;
}
