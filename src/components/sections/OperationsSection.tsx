import { portfolio, isResolvedLink } from "@/src/data/portfolio";
import { stagger } from "@/src/lib/stagger";
import SectionFrame from "@/src/components/ui/SectionFrame";
import Value from "@/src/components/ui/Value";

export default function OperationsSection() {
  return (
    <SectionFrame view="operations">
      <ol className="flex flex-col pb-10">
        {portfolio.projects.map((project, index) => {
          const liveReady = isResolvedLink(project.url);
          const repoReady = isResolvedLink(project.repository);

          return (
            <li
              key={`${project.title}-${index}`}
              data-testid="operation-entry"
              className="stagger-item group relative border-b border-hairline py-5 first:border-t"
              style={stagger(index + 1)}
            >
              {/* Left accent grows on hover */}
              <span
                aria-hidden="true"
                className="absolute -left-3 top-5 h-[calc(100%-2.5rem)] w-px origin-top scale-y-0 bg-signal/60 transition-transform duration-300 group-hover:scale-y-100"
              />

              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] tracking-widest2 text-signal/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-sm uppercase tracking-[0.18em] text-fg transition-colors duration-300 group-hover:text-signal sm:text-base">
                    <Value>{project.title}</Value>
                  </h2>
                </div>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest2 text-dim">
                  <Value>{project.period}</Value>
                </span>
              </div>

              <p className="mt-2.5 max-w-[60ch] text-sm leading-relaxed text-muted">
                <Value>{project.description}</Value>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={`${tech}-${techIndex}`}
                    className="border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest2 text-dim"
                  >
                    <Value>{tech}</Value>
                  </span>
                ))}
                <span className="ml-auto font-mono text-[9px] uppercase tracking-widest2 text-dim/80">
                  <Value>{project.status}</Value>
                </span>
              </div>

              {(liveReady || repoReady) && (
                <div className="mt-3 flex items-center gap-4">
                  {liveReady && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-target
                      className="font-mono text-[10px] uppercase tracking-widest2 text-muted transition-colors hover:text-signal"
                    >
                      Live ↗
                    </a>
                  )}
                  {repoReady && (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-target
                      className="font-mono text-[10px] uppercase tracking-widest2 text-muted transition-colors hover:text-signal"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </SectionFrame>
  );
}
