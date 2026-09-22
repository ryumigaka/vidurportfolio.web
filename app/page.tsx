import Terminal from "@/components/Terminal";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import SocialLinks from "@/components/SocialLinks";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

export default function Home() {
  const blocks = [
    { prompt: "whoami", output: `${site.name} — ${site.role}` },
    { prompt: "cat mission.txt", output: site.tagline },
  ];

  return (
    <div className="py-10 sm:py-16">
      <section className="mb-16">
        <Terminal blocks={blocks} />
      </section>

      <section id="about" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-sm text-muted">
          <span className="text-accent2">$</span> cat about.md
        </h2>
        <p className="max-w-2xl leading-relaxed text-fg">{site.bio}</p>
      </section>

      <section id="projects" className="mb-16 scroll-mt-20">
        <h2 className="mb-4 text-sm text-muted">
          <span className="text-accent2">$</span> ls -la ./projects
        </h2>
        <ProjectsExplorer projects={projects} />
      </section>

      <section id="connect" className="mb-6 scroll-mt-20">
        <h2 className="mb-4 text-sm text-muted">
          <span className="text-accent2">$</span> cat connect.txt
        </h2>
        <SocialLinks />
      </section>
    </div>
  );
}
