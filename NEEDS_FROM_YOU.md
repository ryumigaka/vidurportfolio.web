# What this site still needs from you

The site is fully built and deploys as-is, but a lot of the actual content
is a placeholder. Nothing was invented — where I only had a label (like
"Aeyron Health" or "MUN and debate") and no specifics, I left an explicit
`[ADD: ...]` marker instead of guessing, because this is a factual account
of your work and it's going in front of an admissions program. Everything
below is a to-do list, roughly in priority order.

Search the repo for `[ADD` and `todo: true` to find every instance — that's
literally every placeholder in the codebase, nothing is hidden elsewhere.

## 1. Identity — `content/site.ts`

- **Name**: I used "Vidur" (from the repo name) as a first-name-only
  placeholder. Tell me if you want a full name, a different handle, or
  "Vidur" is genuinely fine as-is.
- **Bio**: I wrote a short paragraph from what you told me in chat. Read it
  and tell me if the tone is right — right now it reads as fairly
  matter-of-fact/technical, which fit the terminal aesthetic, but I can
  make it warmer or punchier.
- **Social links**: all three (GitHub, LinkedIn, Instagram) currently point
  at bare `https://github.com/` etc. and are rendered dimmed with a
  `[todo]` tag on the live site. I need the real profile URLs. Also tell me
  if you want Twitter/X or YouTube added — the component supports any
  label, I just didn't add rows without a handle to put in them.

## 2. Every project — `content/projects.ts`

You gave me a list of things you've done; I turned each into a card with
Overview / What I Built / Challenges / What I Learned / Results & Traction
sections. For most of them I only had the label, so most of the body text
is a placeholder. For each project below, the fastest way to fill this in
is to just reply in chat with a paragraph or two per project — I'll turn it
into the right prose and push it.

- **Aeyron Health (internship)** — dates, what you actually built/shipped,
  a challenge, what you learned, any measurable outcome.
- **Veda Biosciences** — dates, the actual retention mechanisms you built
  and how you helped the founder get traction (channels, tactics), any
  numbers.
- **DNA data storage research** — what form the research took (lit review?
  a designed encoding scheme? simulations? under a mentor/program?), and a
  link to any write-up if one exists.
- **Dating app like-signal reverse engineering** — the real method (what
  you inspected, what AI tooling you used), and what you found. **Also
  worth a decision**: this is a great "hacker" story but touches
  scraping/reverse-engineering a third-party platform's private data —
  want me to frame it carefully (e.g. emphasize it was your own account's
  data, or keep detail high-level) so it reads as clever/technical rather
  than raising eyebrows in an application context? Your call, I can adjust
  the tone either way.
- **Guitar / Instagram content** — your Instagram handle/link, how long
  you've been posting, what kind of content.
- **Nonprofit work (Kathuria Foundation, etc.)** — your specific role,
  what you personally organized or ran, any numbers (funds raised, people
  helped), a link to the foundation if it has one.
- **Scaler School of Tech** — I guessed the program name as "Young
  Innovators" from "young inn" in your message. Please confirm the exact
  name, and what you built/learned there.
- **Hackathons & Codaethon** — name the other hackathons, what you built at
  each, team size, stack, and whether you won/placed/shipped anything.
- **MUN & debate** — which conferences/formats, your role, any awards.
- **Badminton** — level, how long you've played, any results.
- **Singing** — genre/context, any performances.
- **Art** — medium, and a link if you have a separate portfolio for it.

If any of these should actually be cut, merged, or split into more than one
card, say so — the grid isn't locked to exactly 12.

## 3. Design decisions already made (flagging in case you want to revisit)

These came from your earlier answers — just noting them here so they're not
buried in chat history:

- **Stack**: Next.js + TypeScript + Tailwind, deploy target Vercel.
- **Visual direction**: terminal/monospace hacker aesthetic (dark, green +
  amber accents, `$`-prompt headers, typing-animation hero).
- **Project framing**: every project — technical work and hobbies alike —
  gets equal visual weight as a card, filterable by tag
  (technical/leadership/creative/sports).
- **Contact**: social links only, no public email address, no contact form.

## 4. Deployment

I can't create a Vercel account or a custom domain on your behalf. When
you're ready:

1. Go to https://vercel.com/new and import this GitHub repo.
2. Leave build settings on their Next.js defaults — nothing custom is
   needed.
3. If you have a domain you want to point at it (e.g. something to put on
   the Academy application instead of a `vercel.app` URL), add it under the
   Vercel project's Domains settings once the first deploy is live.

## 5. Optional — a photo

The terminal aesthetic currently has no headshot anywhere (fits the "cd
into someone's machine" feel). If you'd rather have a photo somewhere —
e.g. in the hero, or on an about section — say so and I'll design a spot
for it that still fits the theme.
