# Critter Devlog

Monthly progress posts for [Critter](https://github.com/NRG-Nad/Critter) — a multiplayer climbing exploration game built on Unreal Engine 5 + Lyra.

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

The deployed site has a `/admin` route powered by [TinaCMS](https://tina.io). Sign in with GitHub, edit a post (rich-text editor with image upload, drag-drop, formatting), hit **Save** — Tina commits the change to `main`, which triggers a redeploy. Set `draft: true` to hide a post from the index/RSS while you work on it.

### Tina Cloud setup (one-time)

1. Sign up at [app.tina.io](https://app.tina.io) (free for solo).
2. Create a project, point it at this repo, set the production branch to `main`.
3. Copy the **Client ID** and a **Read-only token** from the project settings.
4. Add them as secrets on the host:
   - **GitHub Pages**: repo Settings → Secrets and variables → Actions → add `TINA_CLIENT_ID` and `TINA_TOKEN`.
   - **Cloudflare Pages / Vercel / Netlify**: project env vars → `PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`.
5. For local dev, copy `.env.example` to `.env` and fill in the same values (only needed if you want to test the production admin flow locally).

## Authoring workflow

- **Draft from git** — invoke `/devlog-draft 2026 5` in Claude Code (engine workspace). Pulls last month's commits from `Critter/`, writes a populated `src/content/posts/YYYY-MM-month.md` with `draft: true`.
- **Commit + push** the draft.
- **Polish in the browser** — open `https://your-site/admin/`, find the draft, add screenshots/clips, fix prose, flip `draft: false`.
- **Save** — Tina commits, deploy runs, post is live.

## Writing a post

Posts live at `src/content/posts/YYYY-MM-month.md`. Frontmatter schema is defined in `src/content/config.ts`.

The fastest way to start a new monthly post is to invoke the `/devlog-draft` skill from Claude Code in the engine workspace — it pulls the previous month's git activity from `Critter/` and `Critter/Plugins/Monolith/`, groups commits, and writes a populated draft into this repo.

```
/devlog-draft 2026 5
```

## Stack

- [Astro](https://astro.build) 5 with the MDX integration
- Static deploy to GitHub Pages via `.github/workflows/deploy.yml`
- Content collections for type-safe post frontmatter