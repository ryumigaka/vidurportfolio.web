import { portfolio, isResolvedLink } from "@/src/data/portfolio";
import { stagger } from "@/src/lib/stagger";
import SectionFrame from "@/src/components/ui/SectionFrame";
import Value from "@/src/components/ui/Value";

interface Channel {
  code: string;
  label: string;
  value: string;
  href: string;
}

const channels: Channel[] = [
  {
    code: "CH-01",
    label: "Direct",
    value: portfolio.email,
    href: isResolvedLink(portfolio.email) ? `mailto:${portfolio.email}` : "",
  },
  {
    code: "CH-02",
    label: "Repositories",
    value: portfolio.githubUrl,
    href: portfolio.githubUrl,
  },
  {
    code: "CH-03",
    label: "Network",
    value: portfolio.linkedinUrl,
    href: portfolio.linkedinUrl,
  },
  {
    code: "CH-04",
    label: "Feed",
    value: portfolio.xUrl,
    href: portfolio.xUrl,
  },
];

export default function SignalSection() {
  return (
    <SectionFrame view="signal">
      <ul className="flex flex-col pb-10">
        {channels.map((channel, index) => {
          const ready = isResolvedLink(channel.href);

          const inner = (
            <>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-widest2 text-signal/60">
                  {channel.code}
                </span>
                <span className="font-display text-sm uppercase tracking-[0.18em] text-fg transition-colors duration-300 group-hover:text-signal">
                  {channel.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="max-w-[14rem] truncate font-mono text-[11px] text-muted sm:max-w-[22rem]">
                  <Value>{channel.value}</Value>
                </span>
                <span
                  aria-hidden="true"
                  className={`font-mono text-xs transition-transform duration-300 ${
                    ready
                      ? "text-signal/70 group-hover:translate-x-1"
                      : "text-dim/50"
                  }`}
                >
                  {ready ? "↗" : "—"}
                </span>
              </div>
            </>
          );

          return (
            <li
              key={channel.code}
              data-testid="signal-channel"
              className="stagger-item"
              style={stagger(index + 1)}
            >
              {ready ? (
                <a
                  href={channel.href}
                  target={
                    channel.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noreferrer"
                  data-cursor-target
                  className="group flex items-center justify-between gap-4 border-b border-hairline py-4 transition-colors hover:border-signal/30"
                >
                  {inner}
                </a>
              ) : (
                <div
                  aria-disabled="true"
                  className="group flex items-center justify-between gap-4 border-b border-hairline py-4 opacity-70"
                >
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p
        className="stagger-item pb-10 font-mono text-[10px] uppercase leading-relaxed tracking-widest2 text-dim"
        style={stagger(6)}
      >
        Channels resolve once the corresponding value is set in
        <span className="text-muted"> src/data/portfolio.ts</span>
      </p>
    </SectionFrame>
  );
}
