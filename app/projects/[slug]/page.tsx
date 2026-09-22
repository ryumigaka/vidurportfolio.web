import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-8">
      <h2 className="mb-2 text-sm text-muted">
        <span className="text-accent2">##</span> {label}
      </h2>
      <p className="max-w-2xl whitespace-pre-wrap leading-relaxed text-fg">
        {value}
      </p>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="py-10 sm:py-16">
      <Link
        href="/#projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft size={14} /> cd ../projects
      </Link>

      <div className="mb-8 border border-border bg-surface p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-border px-1.5 py-0.5">
              {tag}
            </span>
          ))}
          <span className="ml-auto">{project.period}</span>
        </div>
        <h1 className="text-xl text-fg sm:text-2xl">{project.title}</h1>
        <p className="mt-3 text-sm text-muted sm:text-base">{project.summary}</p>
      </div>

      <Field label="what i built" value={project.built} />
      <Field label="challenges" value={project.challenges} />
      <Field label="what i learned" value={project.learned} />
      <Field label="results & traction" value={project.results} />

      {project.links.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-2 text-sm text-muted">
            <span className="text-accent2">##</span> links
          </h2>
          <ul className="space-y-1">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent hover:underline"
                >
                  {link.label} <ExternalLink size={13} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
