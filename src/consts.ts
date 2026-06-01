export const SITE_TITLE = 'Critter';
export const SITE_TAGLINE = 'A co-op climbing exploration game built on Unreal Engine 5.';
export const SITE_DESCRIPTION =
  'Devlog and developer tutorials for Critter — a co-op climbing exploration game built on Unreal Engine 5 + Lyra.';
export const AUTHOR = 'NRG-Nad';

// Outbound links. Replace the stubs with real URLs as channels go live.
// Falsy values hide the corresponding button in the UI.
export const DISCORD_URL = 'https://discord.gg/your-invite'; // TODO: real Discord invite
export const STEAM_URL = 'https://store.steampowered.com/app/0000000/Critter/'; // TODO: real Steam page

// Section metadata — drives nav, badges, and accent colors. The `accent` keys map
// to CSS custom properties defined in global.css (--rift / --biome).
export const SECTIONS = {
  devlog: {
    label: 'Devlog',
    href: '/devlog',
    accent: 'rift',
    blurb: 'Monthly progress, drawn straight from the commit history.',
  },
  tutorials: {
    label: 'Tutorials',
    href: '/tutorials',
    accent: 'biome',
    blurb: 'Deep dives on Lyra, GAS, materials, and engine tech.',
  },
} as const;

export type SectionKey = keyof typeof SECTIONS;

// giscus comments (https://giscus.app). Requires a PUBLIC GitHub repo with
// Discussions enabled + the giscus app installed. Fill these in and comments
// appear automatically on every devlog/tutorial post. Leave `repo` empty to
// disable comments entirely.
export const GISCUS = {
  repo: 'NRG-Nad/critter-devlog',
  repoId: 'R_kgDOST4oCw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOST4oC84C-Q-s',
  theme: 'dark_dimmed',
};
