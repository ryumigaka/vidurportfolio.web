/**
 * The single source of content for the entire site.
 *
 * Every string below is a placeholder. Replace the bracketed tokens with real
 * values — nothing else in the codebase needs to change. No personal data is
 * hardcoded anywhere else; components read only from this file.
 *
 * Tip: search the repo for "[" to confirm nothing was missed before launch.
 */

export interface Project {
  /** Short name shown in the operations list. */
  title: string;
  /** One or two sentences on what it is and what you did. */
  description: string;
  /** Stack / tooling, rendered as individual tags. */
  technologies: string[];
  /** Live deployment. Leave as an empty string to hide the link. */
  url: string;
  /** Source repository. Leave as an empty string to hide the link. */
  repository: string;
  /** Optional freeform status, e.g. "shipped", "in progress", "archived". */
  status: string;
  /** Optional year or range, shown right-aligned in the list. */
  period: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  /** What you did there, in your own words. */
  summary: string;
}

export interface PortfolioData {
  /** The name shown large on the core view. */
  fullName: string;
  /** Optional civilian name, rendered as "aka …". Leave blank to hide. */
  alias: string;
  handle: string;
  primaryRole: string;
  secondaryRole: string;
  shortBio: string;
  location: string;
  email: string;
  resumePath: string;
  profileImagePath: string;
  githubUrl: string;
  linkedinUrl: string;
  xUrl: string;
  instagramUrl: string;
  /** Short lines rendered as a capability/credential readout on Identity. */
  focusAreas: string[];
  projects: Project[];
  experience: Experience[];
}

export const portfolio: PortfolioData = {
  fullName: "Vidur",
  alias: "Ryumigaka",
  handle: "ryumigaka",
  primaryRole: "Innovator",
  secondaryRole: "[SECONDARY_ROLE]",
  shortBio:
    "I love music and playing guitar. I play all sports and I\u2019m best at badminton. Above all I\u2019m driven by innovating and building things that help others and are genuinely useful.",
  location: "Earth",
  email: "vidursharma25.08.08@gmail.com",
  resumePath: "[RESUME_PATH]",
  profileImagePath: "[PROFILE_IMAGE_PATH]",
  githubUrl: "https://github.com/ryumigaka",
  linkedinUrl: "https://www.linkedin.com/in/vidursharma25kagehiko/",
  xUrl: "[X_URL]",
  instagramUrl: "https://www.instagram.com/ryumigakaplays/",

  focusAreas: [
    "[FOCUS_AREA_1]",
    "[FOCUS_AREA_2]",
    "[FOCUS_AREA_3]",
    "[FOCUS_AREA_4]",
  ],

  experience: [
    {
      company: "Veda Biosciences",
      role: "Design Intern",
      period: "90 days",
      summary:
        "Worked closely with different brands to help them build trust and improve customer retention, and helped the founder gain traction in the company\u2019s early days.",
    },
    {
      company: "Aeyron Health",
      role: "Intern",
      period: "90 days",
      summary: "[EXPERIENCE_SUMMARY]",
    },
  ],

  projects: [
    {
      title: "Wingmate",
      description:
        "AI study-abroad guide for students from India and South Asia: a programme directory across seven countries with dated tuition figures, a budget calculator in rupees, document tracking and application checklists.",
      technologies: ["[PROJECT_TECHNOLOGIES]"],
      url: "https://wingmate.online/",
      repository: "[PROJECT_REPOSITORY]",
      status: "early access",
      period: "",
    },
    {
      title: "Amruta",
      description:
        "Online therapy service for the UK that matches each person to a therapist.",
      technologies: ["[PROJECT_TECHNOLOGIES]"],
      url: "https://amruta-web-theta.vercel.app/",
      repository: "[PROJECT_REPOSITORY]",
      status: "[PROJECT_STATUS]",
      period: "July 2025",
    },
    {
      title: "[PROJECT_TITLE]",
      description: "[PROJECT_DESCRIPTION]",
      technologies: ["[PROJECT_TECHNOLOGIES]"],
      url: "[PROJECT_URL]",
      repository: "[PROJECT_REPOSITORY]",
      status: "[PROJECT_STATUS]",
      period: "[PROJECT_PERIOD]",
    },
    {
      title: "[PROJECT_TITLE]",
      description: "[PROJECT_DESCRIPTION]",
      technologies: ["[PROJECT_TECHNOLOGIES]"],
      url: "[PROJECT_URL]",
      repository: "[PROJECT_REPOSITORY]",
      status: "[PROJECT_STATUS]",
      period: "[PROJECT_PERIOD]",
    },
  ],
};

/** True while a field still holds an unreplaced `[TOKEN]` placeholder. */
export function isPlaceholder(value: string): boolean {
  return /^\[[A-Z0-9_]+\]$/.test(value.trim());
}

/** Links are only rendered once they point somewhere real. */
export function isResolvedLink(value: string): boolean {
  return value.trim().length > 0 && !isPlaceholder(value);
}
