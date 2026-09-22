// Central place for your identity + links.
// Search this repo for "TODO" to find everything that still needs your input.

export type SocialLink = {
  label: string;
  href: string;
  /** true = placeholder, not a real link yet */
  todo: boolean;
};

export const site = {
  // TODO: confirm how you want your name displayed (full name vs. just first name / a handle).
  name: "Vidur",
  role: "Builder",
  tagline: "I build things, break things, and figure out how they work.",
  bio:
    "I move between software, biology, business, and the stage. I've interned at " +
    "health-tech and biosciences startups, researched DNA as a data storage medium, " +
    "reverse-engineered how dating apps rank likes using AI tooling, and shipped " +
    "projects at hackathons. Outside of that: competitive badminton, debate and MUN, " +
    "guitar and singing, art, and organizing for causes I care about.",
  location: "", // TODO: add city/region if you want it shown, or leave blank to omit.

  // TODO: replace every href below with your real profile URL, then flip todo to false.
  social: [
    {
      label: "GitHub",
      href: "https://github.com/",
      todo: true,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/",
      todo: true,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/",
      todo: true,
    },
  ] satisfies SocialLink[],
};
