import Link from "next/link";
import type { Project } from "@/content/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-border bg-surface p-4 transition-colors hover:border-accent sm:p-5"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        {project.tags.map((tag) => (
          <span key={tag} className="border border-border px-1.5 py-0.5">
            {tag}
          </span>
        ))}
        <span className="ml-auto">{project.period}</span>
      </div>
      <h3 className="text-base text-fg group-hover:text-accent sm:text-lg">
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-muted">{project.summary}</p>
      <p className="mt-3 text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
        cat {project.slug}.md -&gt;
      </p>
    </Link>
  );
}
