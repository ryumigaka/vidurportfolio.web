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

export interface PortfolioData {
  fullName: string;
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
  /** Short lines rendered as a capability/credential readout on Identity. */
  focusAreas: string[];
  projects: Project[];
}

export const portfolio: PortfolioData = {
  fullName: "[FULL_NAME]",
  handle: "[HANDLE]",
  primaryRole: "[PRIMARY_ROLE]",
  secondaryRole: "[SECONDARY_ROLE]",
  shortBio: "[SHORT_BIO]",
  location: "[LOCATION]",
  email: "vidursharma25.08.08@gmail.com",
  resumePath: "[RESUME_PATH]",
  profileImagePath: "[PROFILE_IMAGE_PATH]",
  githubUrl: "[GITHUB_URL]",
  linkedinUrl: "[LINKEDIN_URL]",
  xUrl: "[X_URL]",

  focusAreas: [
    "[FOCUS_AREA_1]",
    "[FOCUS_AREA_2]",
    "[FOCUS_AREA_3]",
    "[FOCUS_AREA_4]",
  ],

  projects: [
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
