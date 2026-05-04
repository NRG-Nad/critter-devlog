# Critter Devlog

Monthly progress posts for [Critter](https://github.com/NRG-Nad/Critter) — a multiplayer climbing exploration game built on Unreal Engine 5 + Lyra.

Live site: https://nrg-nad.github.io/critter-devlog/

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site → ./dist
npm run preview  # serve ./dist locally
```

Requires Node.js 20+.

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