import { isResolvedLink, portfolio } from "@/src/data/portfolio";

/**
 * The landing screen's one call to action. Styled as a console affordance
 * rather than a conventional button so it does not break the shell's language,
 * and inert until an address is actually set in the data file.
 */
export default function PrimaryChannel() {
  const ready = isResolvedLink(portfolio.email);

  const body = (
    <>
      <span className="flex items-center gap-2.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-nodePulse rounded-full bg-signal" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal/70" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-signal/80">
          Open channel
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] text-signal/60 transition-transform duration-300 group-hover:translate-x-1"
        >
          ▸
        </span>
      </span>
      <span className="mt-1.5 block break-all font-mono text-xs text-muted transition-colors duration-300 group-hover:text-fg">
        {portfolio.email}
      </span>
    </>
  );

  if (!ready) {
    return (
      <span
        data-testid="primary-channel"
        aria-disabled="true"
        className="group inline-block border-l border-hairline py-1 pl-3 opacity-60"
      >
        {body}
      </span>
    );
  }

  return (
    <a
      href={`mailto:${portfolio.email}`}
      data-cursor-target
      data-testid="primary-channel"
      className="group inline-block border-l border-signal/40 py-1 pl-3 transition-colors duration-300 hover:border-signal"
    >
      {body}
    </a>
  );
}
