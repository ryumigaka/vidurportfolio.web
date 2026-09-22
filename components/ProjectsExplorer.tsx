"use client";

import { useMemo, useState } from "react";
import type { Project, Tag } from "@/content/projects";
import { tagLabels } from "@/content/projects";
import ProjectCard from "./ProjectCard";

const tags: (Tag | "all")[] = ["all", "technical", "leadership", "creative", "sports"];

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Tag | "all">("all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((p) => p.tags.includes(active)),
    [active, projects]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`border px-2.5 py-1 transition-colors ${
              active === tag
                ? "border-accent text-accent"
                : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            --{tag === "all" ? "all" : tagLabels[tag]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-muted">no results for this filter.</p>
      )}
    </div>
  );
}
