import { portfolio, isResolvedLink } from "@/src/data/portfolio";
import { stagger } from "@/src/lib/stagger";
import SectionFrame from "@/src/components/ui/SectionFrame";
import Value from "@/src/components/ui/Value";

function ProfileFrame() {
  const resolved = isResolvedLink(portfolio.profileImagePath);

  return (
    <div className="relative h-32 w-24 shrink-0 border border-hairline bg-panel sm:h-40 sm:w-32">
      <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-signal/50" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-signal/50" />
      {resolved ? (
        // Plain img: the path is user-supplied at runtime and may be remote,
        // which next/image would require host allowlisting for.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={portfolio.profileImagePath}
          alt={portfolio.fullName}
          className="h-full w-full object-cover contrast-125 grayscale"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-2 text-center">
          <span className="font-mono text-[9px] uppercase tracking-widest2 text-dim">
            No feed
          </span>
          <span className="h-px w-8 bg-signal/30" />
          <span className="break-all font-mono text-[8px] leading-tight text-dim/70">
            {portfolio.profileImagePath}
          </span>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-hairline pl-3">
      <p className="label">{label}</p>
      <p className="mt-1 font-mono text-xs text-muted">
        <Value>{value}</Value>
      </p>
    </div>
  );
}

export default function IdentitySection() {
  const resumeReady = isResolvedLink(portfolio.resumePath);

  return (
    <SectionFrame view="identity">
      <div className="flex flex-col gap-8 pb-10">
        <div className="stagger-item flex gap-5" style={stagger(1)}>
          <ProfileFrame />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest2 text-dim">
              {portfolio.fullName}
              {portfolio.alias.trim().length > 0 && (
                <>
                  {" "}
                  aka <span className="text-muted">{portfolio.alias}</span>
                </>
              )}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              <Value>{portfolio.shortBio}</Value>
            </p>
          </div>
        </div>

        <div
          className="stagger-item grid grid-cols-1 gap-4 sm:grid-cols-3"
          style={stagger(2)}
        >
          <Field label="Primary" value={portfolio.primaryRole} />
          <Field label="Secondary" value={portfolio.secondaryRole} />
          <Field label="Location" value={portfolio.location} />
        </div>

        <div className="stagger-item" style={stagger(3)}>
          <p className="label">Focus</p>
          <ul className="mt-3 flex flex-col gap-2">
            {portfolio.focusAreas.map((area, index) => (
              <li
                key={`${area}-${index}`}
                className="flex items-center gap-3 font-mono text-xs text-muted"
              >
                <span className="h-px w-4 bg-signal/40" />
                <Value>{area}</Value>
              </li>
            ))}
          </ul>
        </div>

        <div className="stagger-item" style={stagger(4)}>
          <p className="label">Dossier</p>
          {resumeReady ? (
            <a
              href={portfolio.resumePath}
              data-cursor-target
              className="mt-3 inline-flex items-center gap-2 border border-hairline px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-muted transition-colors hover:border-signal/50 hover:text-signal"
            >
              Download resume
              <span aria-hidden="true">↓</span>
            </a>
          ) : (
            <p className="mt-3 inline-flex items-center gap-2 border border-dashed border-hairline px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-dim">
              <Value>{portfolio.resumePath}</Value>
            </p>
          )}
        </div>
      </div>
    </SectionFrame>
  );
}
