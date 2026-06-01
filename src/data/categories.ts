// The devlog category taxonomy — the primary, filterable tag for every devlog post.
// Single source of truth: the schema enum (src/content/config.ts), the filter bar,
// the card badges, the Tina dropdown, and the writing guide all derive from this.
// Exactly one category per post; freeform `tags` carry secondary topics.

export interface CategoryMeta {
  label: string;
  glyph: string;
  color: string; // badge color
  blurb: string; // one-liner, shown in the writing guide + as a filter tooltip
}

export const CATEGORIES = {
  'progress-update': {
    label: 'Progress Update',
    glyph: '📊',
    color: '#6ea8fe',
    blurb: 'What happened this month — headline wins, blockers, and what\'s next.',
  },
  'feature-spotlight': {
    label: 'Feature Spotlight',
    glyph: '✨',
    color: '#ff7a45',
    blurb: 'One new mechanic or system, shown in depth. Heavy on clips — the hype category.',
  },
  'technical-breakdown': {
    label: 'Technical Breakdown',
    glyph: '⚙️',
    color: '#3fd9b3',
    blurb: 'How it was made — the narrative behind a shader, system, or netcode problem.',
  },
  'art-audio': {
    label: 'Art & Audio',
    glyph: '🎨',
    color: '#f871a0',
    blurb: 'Concept to final: art, animation breakdowns, music WIPs, sound design.',
  },
  'design-decision': {
    label: 'Design Decision',
    glyph: '🧭',
    color: '#9d8cff',
    blurb: 'Why a choice was made — the craft players who care will respect.',
  },
  postmortem: {
    label: 'Postmortem',
    glyph: '🔍',
    color: '#e0a458',
    blurb: 'Retrospective and honest: what I tried, why it failed, what I learned.',
  },
  'behind-the-scenes': {
    label: 'Behind the Scenes',
    glyph: '🎬',
    color: '#98c379',
    blurb: 'Workflow, tools, day-in-the-life, the dumb bugs. Humanizes the project.',
  },
  milestone: {
    label: 'Milestone',
    glyph: '🚩',
    color: '#ffcf5c',
    blurb: 'The big, shareable ones: demo out, Steam page live, release date, patch notes.',
  },
  community: {
    label: 'Community',
    glyph: '💬',
    color: '#56c8d8',
    blurb: 'Q&A answers, fan art, poll results, "you asked, we changed it."',
  },
} as const satisfies Record<string, CategoryMeta>;

export type CategoryId = keyof typeof CATEGORIES;

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export const isMilestone = (id?: string): boolean => id === 'milestone';

// Safe lookup — falls back to progress-update if an unknown id slips through.
export const categoryMeta = (id?: string): CategoryMeta =>
  (id && id in CATEGORIES ? CATEGORIES[id as CategoryId] : CATEGORIES['progress-update']);