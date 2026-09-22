// Every project card on the site is generated from this file.
// Lines wrapped in [ADD: ...] are placeholders — search for "[ADD" to find
// everything that still needs real detail from you. Nothing here is invented;
// where I didn't have specifics, I left an explicit placeholder instead of
// guessing, because this is a factual account of your work.

export type Tag = "technical" | "leadership" | "creative" | "sports";

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  tags: Tag[];
  period: string;
  summary: string;
  built: string;
  challenges: string;
  learned: string;
  results: string;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "aeyron-health",
    title: "Aeyron Health — Internship",
    tags: ["technical"],
    period: "[ADD: internship dates]",
    summary:
      "Interned at Aeyron Health, a health-tech company. [ADD: one line on the team/product you worked on.]",
    built:
      "[ADD: the specific features, systems, or workflows you personally built or shipped at Aeyron Health — be concrete: what did you write code for, design, or ship end-to-end?]",
    challenges:
      "[ADD: a specific technical or organizational challenge you ran into — e.g. an unfamiliar stack, ambiguous requirements, a tight deadline, a bug that took real digging.]",
    learned:
      "[ADD: what this taught you — about health-tech specifically, about working inside a real product team, about your own process.]",
    results:
      "[ADD: any measurable outcome — did it ship, how many users/clinicians touched it, did it move a metric, what feedback did you get.]",
    links: [],
  },
  {
    slug: "veda-biosciences",
    title: "Veda Biosciences — Brand Growth & Early Traction",
    tags: ["technical", "leadership"],
    period: "[ADD: dates]",
    summary:
      "Worked with early-stage brands under Veda Biosciences to build retention through customer trust, and worked alongside the founder to help generate traction in the company's early days.",
    built:
      "Worked directly with multiple brand partners on retention strategy centered on trust. [ADD: the actual mechanisms you built or ran — e.g. specific retention flows, customer touchpoints, content systems, outreach processes, or tools — and what you did hands-on to help the founder land early traction, such as specific channels, partnerships, or campaigns.]",
    challenges:
      "[ADD: what made retention/trust hard to build for these brands, or what was hardest about generating traction with limited resources/time.]",
    learned:
      "[ADD: what working this closely with a founder and multiple brands taught you about growth, trust, or early-stage business.]",
    results:
      "[ADD: numbers if you have them — retention lift, number of brands worked with, traction metrics like signups, revenue, or partnerships secured.]",
    links: [],
  },
  {
    slug: "dna-storage-research",
    title: "DNA Data Storage Research",
    tags: ["technical"],
    period: "[ADD: dates]",
    summary:
      "Independent research into DNA-based data storage as a potential successor to traditional RAM/volatile memory.",
    built:
      "[ADD: what the research actually consisted of — a literature review, an encoding scheme you designed, simulations you ran, a mentor/lab/program this was done under, or a written report/paper.]",
    challenges:
      "[ADD: the hardest part of this research — e.g. the gap between theoretical DNA storage and real hardware constraints, lack of accessible tooling, or the depth of biology/CS crossover knowledge required.]",
    learned:
      "[ADD: what you now understand about DNA storage, memory systems, or how you'd approach open-ended research differently.]",
    results:
      "[ADD: a write-up, findings, or conclusions — and a link to the paper/report if one exists.]",
    links: [
      // [ADD: link to your write-up, paper, or slides if you have one]
    ],
  },
  {
    slug: "dating-app-like-analysis",
    title: "Reverse-Engineering Dating App Like Signals",
    tags: ["technical"],
    period: "[ADD: dates]",
    summary:
      "Used AI tools to reverse-engineer how dating apps surface and rank likes, in order to work out how many likes a profile had actually received.",
    built:
      "[ADD: the real method — what you inspected (app traffic, API responses), what AI tools/models you used to help analyze it, and what you actually built (a script, a small tool, a notebook) to estimate like counts.]",
    challenges:
      "[ADD: e.g. working with an undocumented/obfuscated API, rate limits, or making sure your approach stayed within reasonable and ethical bounds.]",
    learned:
      "[ADD: what you learned about app internals, growth/engagement mechanics dating apps use, or about using AI tools for reverse engineering.]",
    results:
      "[ADD: what you actually found — was your estimate validated, how accurate was it, anything surprising about how these apps rank visibility.]",
    links: [],
  },
  {
    slug: "guitar-content",
    title: "Guitar — Self-Taught & Instagram Content",
    tags: ["creative"],
    period: "[ADD: dates / how long you've been posting]",
    summary:
      "Taught myself guitar from scratch and started posting the process on Instagram — crossed 20,000+ views in a single month as a beginner.",
    built:
      "Self-taught guitar and started documenting the process publicly. [ADD: what kind of content — covers, practice logs, tutorials — and how consistently you post.]",
    challenges:
      "[ADD: what was hardest about learning in public — technique, consistency, editing/production, or just posting as a beginner.]",
    learned:
      "[ADD: what creating content taught you about audience, consistency, or your own learning process.]",
    results:
      "Reached 20,000+ views in a single month on Instagram as a beginner guitarist. [ADD: current follower/view numbers if you want to update this.]",
    links: [
      // [ADD: link to your Instagram]
    ],
  },
  {
    slug: "nonprofit-work",
    title: "Nonprofit Work — Kathuria Foundation & Community Rallies",
    tags: ["leadership"],
    period: "[ADD: dates]",
    summary:
      "Worked with foundations including the Kathuria Foundation, and organized or took part in rallies supporting underprivileged students and animal welfare.",
    built:
      "Collaborated with the Kathuria Foundation and other organizations on initiatives supporting underprivileged students and animals. [ADD: your specific role — organizer, volunteer, fundraiser — and what you personally ran: an event, a fundraising drive, a specific program.]",
    challenges: "[ADD: a real obstacle you hit organizing or fundraising.]",
    learned:
      "[ADD: what this work taught you about organizing, leadership, or the causes themselves.]",
    results:
      "[ADD: numbers if you have them — funds raised, people or animals helped, number of events or rallies.]",
    links: [
      // [ADD: link to Kathuria Foundation or other org if public]
    ],
  },
  {
    slug: "scaler-school-of-tech",
    title: "Scaler School of Tech — Young Innovators",
    tags: ["technical"],
    period: "[ADD: dates/cohort]",
    summary:
      "[ADD: confirm exact program name and describe the program in one line — this is currently a guess at 'Young Innovators.']",
    built:
      "[ADD: what you built, shipped, or learned through this program — specific projects or coursework.]",
    challenges: "[ADD]",
    learned: "[ADD]",
    results: "[ADD]",
    links: [],
  },
  {
    slug: "hackathons",
    title: "Hackathons & Codaethon",
    tags: ["technical"],
    period: "[ADD: dates]",
    summary:
      "Built and shipped projects at hackathons, including Codaethon. [ADD: name the other hackathons you've done.]",
    built:
      "[ADD: for each hackathon — what you built, your role, team size, and tech stack.]",
    challenges: "[ADD: the hardest technical problem you solved under time pressure.]",
    learned: "[ADD: what shipping under a hackathon deadline taught you.]",
    results: "[ADD: did you place, win, or ship something people used — any awards.]",
    links: [
      // [ADD: Devpost/GitHub links for your hackathon projects]
    ],
  },
  {
    slug: "mun-debate",
    title: "Model United Nations & Debate",
    tags: ["leadership"],
    period: "[ADD: dates]",
    summary: "Competed in Model United Nations conferences and competitive debate.",
    built:
      "[ADD: which MUN conferences and committees/roles — delegate, chair — and which debate formats you competed in.]",
    challenges: "[ADD: a tough round, committee, or position you had to argue.]",
    learned: "[ADD: what MUN/debate taught you about argument, persuasion, or thinking on your feet.]",
    results: "[ADD: awards, best delegate honors, break rounds, rankings.]",
    links: [],
  },
  {
    slug: "badminton",
    title: "Badminton",
    tags: ["sports"],
    period: "[ADD: how long you've played]",
    summary: "Competitive badminton player.",
    built: "[ADD: level — school/district/state, singles or doubles, training routine.]",
    challenges: "[ADD]",
    learned: "[ADD: what competitive sport has taught you — discipline, focus under pressure, etc.]",
    results: "[ADD: tournaments, ranks, notable wins.]",
    links: [],
  },
  {
    slug: "singing",
    title: "Singing",
    tags: ["creative"],
    period: "[ADD: how long]",
    summary: "[ADD: genre/style and context — solo, choir, band?]",
    built: "[ADD]",
    challenges: "[ADD]",
    learned: "[ADD]",
    results: "[ADD: performances, competitions, recordings.]",
    links: [],
  },
  {
    slug: "art",
    title: "Art",
    tags: ["creative"],
    period: "[ADD: how long]",
    summary: "[ADD: medium — drawing, painting, digital art?]",
    built: "[ADD]",
    challenges: "[ADD]",
    learned: "[ADD]",
    results: "[ADD: exhibitions, commissions, a portfolio link.]",
    links: [
      // [ADD: link to your art portfolio/Instagram if separate from guitar content]
    ],
  },
];

export const tagLabels: Record<Tag, string> = {
  technical: "technical",
  leadership: "leadership",
  creative: "creative",
  sports: "sports",
};
