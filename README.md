# Portfolio — system console

A single-screen personal portfolio built as an interactive systems console:
one persistent full-screen visual world (radar bezel, iris aperture, network
topology, circuit traces), three diagram-like navigation nodes wired to the
core by thin SVG connectors, and animated transitions between full-screen
sections.

The aesthetic is security-research console rather than sci-fi pastiche — a
Kali/Ubuntu-leaning dark palette, monospace readouts, and restrained motion.
No Matrix rain, no glitch loops, no fake shell prompts.

## Fill in your content first

**Everything on the site comes from one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).**

Every value there is a placeholder token such as `[FULL_NAME]`, `[HANDLE]`,
`[SHORT_BIO]`, `[GITHUB_URL]`, `[PROJECT_TITLE]`. Replace the tokens and the
whole site updates — no component needs editing. Unreplaced tokens render
dimmed on purpose, and links stay inert until their value is real, so nothing
ships as a dead link.

```
src/data/portfolio.ts
├── identity     fullName, handle, primaryRole, secondaryRole, shortBio,
│                location, email, resumePath, profileImagePath
├── links        githubUrl, linkedinUrl, xUrl
├── focusAreas   short capability lines shown on Identity
└── projects[]   title, description, technologies[], url, repository,
                 status, period
```

Add or remove entries in `projects` freely — the Operations list is generated
from the array.

## Architecture

Four application states drive one persistent shell:

| View       | URL            | Document title             |
| ---------- | -------------- | -------------------------- |
| Home       | `/`            | `[FULL_NAME] — Portfolio`  |
| Identity   | `/#identity`   | `Identity — [FULL_NAME]`   |
| Operations | `/#operations` | `Operations — [FULL_NAME]` |
| Signal     | `/#signal`     | `Signal — [FULL_NAME]`     |

Browser back/forward restore the active section, deep links land directly on
it, and `Escape` returns to the core.

```
app/
  layout.tsx                fonts, viewport, global styles
  page.tsx                  renders the shell
src/
  data/portfolio.ts         ← all content lives here
  lib/views.ts              view model: hashes, titles, metadata
  lib/useMediaQuery.ts      external-store media queries
  lib/stagger.ts            reveal delays
  components/shell/
    AppShell.tsx            view state machine, hash sync, transitions
    SystemCore.tsx          SVG geometry + canvas radar sweep
    GridTraces.tsx          grid and circuit runs
    NoiseLayer.tsx          procedural film grain (canvas)
    CursorLayer.tsx         reticle cursor + particle trail (desktop only)
    ShellHeader.tsx         core return + section rail
    StatusBar.tsx           system status readout
  components/sections/      Home (nodes + connectors), Identity,
                            Operations, Signal
  components/ui/            SectionFrame, Value
tests/
  unit/                     Vitest + Testing Library
  e2e/                      Playwright (desktop + mobile projects)
```

### Notable implementation details

- **The core is persistent.** It never unmounts between views; it translates,
  scales and dims, so navigation reads as one continuous world.
- **The title is owned by React**, not written imperatively. Next's static
  metadata would otherwise re-apply itself over a deep-linked title after
  hydration.
- **Connectors are measured in pixel space** rather than a stretched viewBox,
  which keeps strokes hairline-thin and travelling packets circular at any
  aspect ratio.
- **Desktop and mobile are different compositions**, not one reflowed layout:
  the desktop orbits nodes around the core, mobile stacks them along a spine.
- **Motion respects `prefers-reduced-motion`** — the sweep, trail and reveals
  stand down, and the custom cursor never mounts.
- Animation is CSS keyframes and Canvas 2D only. No animation libraries.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the build

npm test             # Vitest unit tests
npm run test:watch
npm run test:e2e     # Playwright, builds and serves automatically
npm run lint
npm run format
npm run typecheck
```

Playwright needs browsers once: `npx playwright install chromium`. If your
environment already ships one, point at it with
`PLAYWRIGHT_CHROMIUM_PATH=/path/to/chromium npm run test:e2e`.

## Deploying

Standard Next.js App Router project — import the repo at
[vercel.com/new](https://vercel.com/new) and deploy with the defaults.
