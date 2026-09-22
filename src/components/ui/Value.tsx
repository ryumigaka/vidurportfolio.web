import { isPlaceholder } from "@/src/data/portfolio";

/**
 * Renders a data value, visibly marking anything still holding a `[TOKEN]`
 * placeholder so unfilled content is obvious rather than silently shipped.
 */
export default function Value({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const pending = isPlaceholder(children);
  return (
    <span
      data-placeholder={pending ? "true" : "false"}
      className={`${
        pending ? "text-dim/80 [font-variant-ligatures:none]" : ""
      } ${className}`}
    >
      {children}
    </span>
  );
}
