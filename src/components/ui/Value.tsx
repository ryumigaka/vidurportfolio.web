import { isPlaceholder } from "@/src/data/portfolio";
import DecodeText from "./DecodeText";

/**
 * Renders a data value, visibly marking anything still holding a `[TOKEN]`
 * placeholder so unfilled content is obvious rather than silently shipped.
 * Content resolves out of noise as it scrolls into view.
 */
export default function Value({
  children,
  className = "",
  decode = true,
  delay = 0,
}: {
  children: string;
  className?: string;
  /** Opt out where the resolve would fight the layout, e.g. inline runs. */
  decode?: boolean;
  /** Staggers rows so a list resolves in sequence rather than all at once. */
  delay?: number;
}) {
  const pending = isPlaceholder(children);
  const tone = pending ? "text-dim/80 [font-variant-ligatures:none]" : "";

  return (
    <span
      data-placeholder={pending ? "true" : "false"}
      className={`${tone} ${className}`}
    >
      {decode ? <DecodeText text={children} delay={delay} /> : children}
    </span>
  );
}
