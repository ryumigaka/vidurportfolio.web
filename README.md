# vidur.dev (working title)

A personal portfolio site built with Next.js (App Router), TypeScript, and
Tailwind CSS, styled as a terminal / hacker aesthetic — monospace type,
dark background, `$`-prompt section headers, and a typing-animation hero.

Every project is an equal-weight card generated from a single content file,
so adding, editing, or removing a project never touches layout code.

## Before you deploy

**Read [`NEEDS_FROM_YOU.md`](./NEEDS_FROM_YOU.md).** The site builds and
runs today, but a lot of the project detail and every social link is a
placeholder marked `[ADD: ...]` or `todo: true` — that file is the full
checklist of what to fill in before this goes live.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, static generation)
- TypeScript
- Tailwind CSS v3
- [`lucide-react`](https://lucide.dev/) for the couple of generic (non-brand)
  icons used in the UI

No backend, database, or API routes — every project page is statically
generated at build time from `content/projects.ts`.

## Project structure

```
app/
  layout.tsx              root layout, font loading, nav/footer
  page.tsx                homepage: hero, about, project grid, connect
  globals.css              theme tokens + terminal effects
  projects/[slug]/page.tsx  individual project case-study pages
  not-found.tsx            404 page
content/
  site.ts                  your name, tagline, bio, social links
  projects.ts               every project card + case study, one array
components/
  Terminal.tsx              typing-animation hero
  Nav.tsx / Footer.tsx
  ProjectsExplorer.tsx       tag filter + grid (client component)
  ProjectCard.tsx
  SocialLinks.tsx
```

To edit content, you only ever need to touch the two files in `content/`.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Building

```bash
npm run build
npm run start
```

## Deploying

This is a stock Next.js App Router project, so it deploys to
[Vercel](https://vercel.com/new) with zero configuration: import the GitHub
repo, leave the defaults, deploy. (Vercel account creation and the actual
import step need to happen on your end — this repo doesn't include any
deploy credentials.)

If you'd rather use GitHub Pages or another static host instead, the site
would need `output: "export"` added to `next.config.mjs` — ask and I can
wire that up, but note it would remove any future use of Next.js features
that require a server (there aren't any today, so it's a safe switch if you
want it).
