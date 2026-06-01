# Devlog writing guide

The devlog runs over a multi-year dev cycle. Pure progress logs burn readers out; pure
deep-dives are too slow to keep momentum. The fix is **rotating categories** — each post
has exactly one `category` (the primary, filterable tag), and you deliberately vary which
one you reach for.

This guide is the reference for both hand-writing posts and for the `/devlog-draft` skill.

## The mix

Over time, aim for roughly:

| Share | Categories | Role |
|------:|------------|------|
| ~40% | Progress updates, Feature spotlights | The bulk — cadence + hype |
| ~25% | Art & audio, Technical breakdowns | The showy stuff that gets shared |
| ~20% | Design decisions, Postmortems | The depth that builds credibility |
| ~15% | Behind the scenes, Milestones, Community | The personality |

Don't force it post-by-post — force it *over a quarter*. If the last four posts were all
progress updates, the next one should be a spotlight, a breakdown, or a design piece.

## Tagging rules

- **One `category` per post.** It's the headline tag readers filter by and what colors the card.
- **`tags` are secondary** — freeform topics (`climbing`, `gas`, `netcode`, `ui`). 2–4 is plenty.
- Categories are a fixed set defined in `src/data/categories.ts`. Don't invent new ones in
  frontmatter — add them to the taxonomy first if you genuinely need one.

## Devlog vs. tutorials

A **technical breakdown** (devlog) is the *narrative* of solving a problem — dated, personal,
"here's how I got the rope sim to stop exploding." A **tutorial** is the *evergreen reference* —
"how to build a rope sim," written to be found via search a year later. When a breakdown has a
reusable how-to inside it, write the tutorial separately and link to it from the breakdown.

---

## The nine categories

### 📊 Progress update
The recurring "what happened" post — the backbone. Keeps cadence even when nothing dramatic shipped.
- **When:** monthly, on a schedule. This is what `/devlog-draft` generates from git.
- **Structure:** one-paragraph summary → headline accomplishments → blockers → what's next.
- **Do:** lead with the summary so skimmers get it. **Don't:** list every commit — curate.

### ✨ Feature spotlight
One new mechanic/system/content piece explained in depth — *what it does, not how it's coded*. The hype category.
- **When:** a feature is far enough along to look good in motion.
- **Structure:** what it is → why it matters to the player → how it feels (clips!) → what's next for it.
- **Do:** lead with a GIF. **Don't:** dive into implementation — that's a technical breakdown.

### ⚙️ Technical breakdown
The "how it was made" narrative — shaders, procgen, AI, netcode.
- **When:** you solved something non-obvious and other devs would learn from the story.
- **Structure:** the problem → the approach → gotchas & results → (link to the full tutorial if one exists).
- **Do:** show before/after. **Don't:** paste the whole file — narrate the interesting 20%.

### 🎨 Art & audio process
Concept → final. Animation breakdowns, music WIPs, sound experiments, UI iterations. Travels well on social.
- **When:** you have a visual/audio journey worth showing — especially iterations.
- **Structure:** the brief → process (sketches, WIPs, takes) → the final → what's next.
- **Do:** show the rough versions. **Don't:** only post the polished final — the journey is the content.

### 🧭 Design decision
Why you chose X over Y, why you cut something, why the curve looks the way it does. Builds credibility; sparks the best comment threads.
- **When:** you made a non-trivial call players who care about craft would find interesting.
- **Structure:** the decision → options considered → why this one → trade-offs you accept.
- **Do:** be concrete about what you gave up. **Don't:** rationalize after the fact — be honest about uncertainty.

### 🔍 Postmortem
Retrospective and honest. "I spent three weeks on X and threw it out."
- **When:** something failed, got cut, or taught you a lesson. Builds trust faster than marketing.
- **Structure:** what I set out to do → what happened → why it failed/changed → what I learned.
- **Do:** own the mistake plainly. **Don't:** bury the lesson under excuses.

### 🎬 Behind the scenes
Workflow, tools, plugins, day-in-the-life, the dumb bugs. Lower-stakes, more personal.
- **When:** between bigger posts, or when something funny/relatable happened.
- **Structure:** a hook → the thing (tool / workflow / bug) → a takeaway or laugh.
- **Do:** keep it loose and short. **Don't:** over-produce it — the charm is informality.

### 🚩 Milestone
The big, shareable ones: vertical slice, demo, Steam page, wishlist count, festival, release date, patch notes.
- **When:** something genuinely worth amplifying. These render as a **gold banner card** — use sparingly so they stay special.
- **Structure:** the announcement (lead with it) → what it means → how to get involved (CTA: wishlist, Discord, play).
- **Do:** add a banner cover image — these are the posts people share. **Don't:** dilute the tag on minor updates.

### 💬 Community
Q&A answers, fan art showcases, poll results, "you asked, we changed it." Use sparingly; pays back in loyalty.
- **When:** the community gave you something worth reflecting back.
- **Structure:** the prompt/context → the showcase or answers → what you changed because of it.
- **Do:** credit people. **Don't:** post these when engagement is thin — they look hollow.

---

## Drafting workflow

- **Progress updates:** `/devlog-draft 2026 6` — pulls the month's commits, groups them, fills the
  progress-update template with `category: progress-update`, `draft: true`.
- **Any other category:** `/devlog-draft <category>` (e.g. `/devlog-draft feature-spotlight`) —
  scaffolds that category's template from `templates/devlog/`, pre-fills frontmatter, and leaves the
  prose to you. See the skill for exact usage.
- Then polish in TinaCMS at `/admin`, add media, flip `draft: false`.