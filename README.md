# Critter

Marketing + devlog site for [Critter](https://github.com/NRG-Nad/Critter) — a co-op climbing exploration game built on Unreal Engine 5 + Lyra.

Three content types, three audiences:

- **Devlog** (`src/content/devlog/`) — monthly progress, drawn from git history. For followers tracking the project.
- **Tutorials** (`src/content/tutorials/`) — evergreen technical deep dives (Lyra, GAS, materials, engine tech). For the UE dev community; supports multi-part series, difficulty, and engine-version metadata.
- **Roadmap** (`src/content/roadmap/`) — one entry per core feature, each with a `status` (planned / in-progress / shipped) that moves over time. Rendered as a progress tracker at `/roadmap`.

The landing page (`/`) is a media-forward hero that sells the game; the feeds live at `/devlog`, `/tutorials`, and `/roadmap`.

Live site: https://nrg-nad.github.io/critter-devlog/

## Local development

```sh
npm install
npm run dev      # Tina + Astro at http://localhost:4321 (admin at /admin)
npm run build    # tinacms build → astro build → ./dist
npm run preview  # serve ./dist locally
```

Requires Node.js 20+.

In `npm run dev`, Tina edits files on disk directly — no commits. The web admin at `/admin` is for production use.

## Editing posts in the browser

The deployed site has a `/admin` route powered by [TinaCMS](https://tina.io). Sign in with GitHub, edit a post (rich-text editor with image upload, drag-drop, formatting), hit **Save** — Tina commits the change to `main`, which triggers a redeploy. Set `draft: true` to hide a post from the index while you work on it.

### Tina Cloud setup (one-time)

1. Sign up at [app.tina.io](https://app.tina.io) (free for solo).
2. Create a project, point it at this repo, set the production branch to `main`.
3. Copy the **Client ID** and a **Read-only token** from the project settings.
4. Add them as secrets on the host:
   - **GitHub Pages**: repo Settings → Secrets and variables → Actions → add `TINA_CLIENT_ID` and `TINA_TOKEN`.
   - **Cloudflare Pages / Vercel / Netlify**: project env vars → `PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`.
5. For local dev, copy `.env.example` to `.env` and fill in the same values (only needed if you want to test the production admin flow locally).

## Authoring workflow

- **Draft from git** — invoke `/devlog-draft 2026 5` in Claude Code (engine workspace). Pulls last month's commits from `Critter/`, writes a populated `src/content/devlog/YYYY-MM-month.md` with `draft: true`.
- **Commit + push** the draft.
- **Polish in the browser** — open `https://your-site/admin/`, find the draft, add screenshots/clips, fix prose, flip `draft: false`.
- **Save** — Tina commits, deploy runs, post is live.

## Writing a post

Content lives in collections under `src/content/` — `devlog/`, `tutorials/`, and `roadmap/`. Frontmatter schemas are defined in `src/content/config.ts`. The example files marked `EXAMPLE TEMPLATE` (in `devlog/` and `tutorials/`, all `draft: true`) show the shape of each — copy, fill in, flip `draft: false`, or delete them. The `roadmap/` entries are real feature stubs; edit their `status`/`date` as the project moves.

Tutorials support extra frontmatter: `difficulty` (beginner/intermediate/advanced), `engineVersion`, `series` + `seriesOrder` (groups multi-part tutorials and renders a series-nav box), and `prerequisites`.

The fastest way to start a new monthly **devlog** post is to invoke the `/devlog-draft` skill from Claude Code in the engine workspace — it pulls the previous month's git activity from `Critter/`, groups commits, and writes a populated draft into `src/content/devlog/`.

### Adding images

Cover images use Astro's `image()` schema — drop a file next to the post (or in `src/assets/`) and reference it in the `cover:` frontmatter field. Posts with no cover get a section-tinted placeholder card automatically, so the site looks intentional before screenshots exist.

```
/devlog-draft 2026 5
```

## Comments

Devlog and tutorial posts support comments via [giscus](https://giscus.app) (GitHub Discussions). It's **disabled until configured** — no broken widget shows up. To turn it on:

1. Make a **public** GitHub repo (giscus can't use a private one — point it at the site repo, not the game).
2. Enable **Discussions** on that repo and install the [giscus app](https://github.com/apps/giscus).
3. Run the configurator at [giscus.app](https://giscus.app) to get your `repoId` and `categoryId`.
4. Fill in the `GISCUS` object in `src/consts.ts`. Leave `repo` empty to disable.

If a public repo isn't an option, swap the `Comments.astro` component for a hosted alternative like Cusdis or Disqus.

## External links

Discord and Steam URLs are stubs in `src/consts.ts` (`DISCORD_URL`, `STEAM_URL`) — replace them with real links. Falsy values hide their buttons automatically.

## Stack

- [Astro](https://astro.build) 5 with the MDX integration
- Static deploy to GitHub Pages via `.github/workflows/deploy.yml`
- Content collections for type-safe post frontmatter
- [giscus](https://giscus.app) for post comments (opt-in)