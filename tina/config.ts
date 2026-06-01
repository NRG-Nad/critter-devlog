import { defineConfig } from 'tinacms';

// Tina Cloud project credentials.
// In production these come from env vars set on the host (Cloudflare/Vercel/GH Actions).
// In local dev (`npm run dev`), Tina edits files on disk and these values are not required.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

const clientId = process.env.PUBLIC_TINA_CLIENT_ID || '';
const token = process.env.TINA_TOKEN || '';

export default defineConfig({
  branch,
  clientId,
  token,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
    // GitHub Pages serves the site at /critter-devlog/ — Tina's admin SPA
    // needs to know that prefix or its asset URLs 404.
    basePath: 'critter-devlog',
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      buildCollection('devlog', 'Devlog', 'src/content/devlog', { category: true }),
      buildCollection('tutorials', 'Tutorials', 'src/content/tutorials', { tutorial: true }),
      {
        // Roadmap board — one document per column (category). Hierarchy:
        // Column → Feature → Mechanic. Powers /roadmap; replaced the old md tracker.
        name: 'roadmap',
        label: 'Roadmap',
        path: 'src/content/roadmap',
        format: 'json',
        fields: [
          { type: 'string', name: 'label', label: 'Column / Category', isTitle: true, required: true },
          { type: 'number', name: 'order', label: 'Column order (left → right)' },
          {
            type: 'string',
            name: 'kind',
            label: 'Kind',
            description: 'System = reusable mechanics · Content = a biome that consumes systems.',
            options: [
              { value: 'system', label: 'System' },
              { value: 'content', label: 'Content (biome)' },
            ],
          },
          {
            type: 'object',
            name: 'features',
            label: 'Features',
            list: true,
            ui: {
              itemProps: (feature) => ({
                label: `${feature?.name || 'New feature'}${feature?.mechanics?.length ? ` (${feature.mechanics.length})` : ''}`,
              }),
              defaultItem: () => ({ name: 'New feature', mechanics: [] }),
            },
            fields: [
              { type: 'string', name: 'name', label: 'Feature name', isTitle: true, required: true },
              {
                type: 'object',
                name: 'mechanics',
                label: 'Mechanics',
                list: true,
                ui: {
                  itemProps: (m) => ({
                    label: `${m?.priority ? `[${m.priority}] ` : ''}${m?.title || 'New mechanic'}`,
                  }),
                  defaultItem: () => ({ priority: 'TBD', title: 'New mechanic' }),
                },
                fields: [
                  {
                    type: 'string',
                    name: 'priority',
                    label: 'Priority',
                    description: 'P0 must-have · P1 really want · P2 nice-to-have · TBD icebox',
                    required: true,
                    options: [
                      { value: 'P0', label: 'P0 · Must-have' },
                      { value: 'P1', label: 'P1 · Really want' },
                      { value: 'P2', label: 'P2 · Nice-to-have' },
                      { value: 'TBD', label: 'TBD · Icebox' },
                    ],
                  },
                  { type: 'string', name: 'title', label: 'Title', required: true },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  {
                    type: 'string',
                    name: 'type',
                    label: 'Type (optional)',
                    options: [
                      'Core mechanic',
                      'Skill expression',
                      'Progression',
                      'Immersion',
                      'Comedy',
                      'Social Interaction',
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});

// Shared collection factory. Options:
//   tutorial — adds difficulty / engine version / series / prerequisites
//   category — adds the devlog category dropdown (the primary tag)
function buildCollection(name, label, path, opts = {}) {
  const { tutorial = false, category = false } = opts;
  const slugify = (values) => {
    const title = (values?.title as string) || 'untitled';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const common = [
    { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
    {
      type: 'string',
      name: 'description',
      label: 'Description',
      description: 'One sentence — shown on cards and in the RSS feed.',
      required: true,
      ui: { component: 'textarea' },
    },
    {
      type: 'datetime',
      name: 'pubDate',
      label: 'Publish date',
      required: true,
      ui: { dateFormat: 'YYYY-MM-DD' },
    },
    { type: 'datetime', name: 'updatedDate', label: 'Last updated', ui: { dateFormat: 'YYYY-MM-DD' } },
    { type: 'image', name: 'cover', label: 'Cover image' },
    { type: 'string', name: 'coverAlt', label: 'Cover alt text' },
    { type: 'string', name: 'tags', label: 'Tags', list: true, ui: { component: 'tags' } },
    {
      type: 'boolean',
      name: 'featured',
      label: 'Featured',
      description: 'Surface this post more prominently on the landing page.',
    },
    {
      type: 'boolean',
      name: 'draft',
      label: 'Draft',
      description: 'Drafts are excluded from the public index, post pages, and RSS feed.',
    },
  ];

  const categoryField = {
    type: 'string',
    name: 'category',
    label: 'Category',
    description: 'The primary tag — drives filtering and card color. Exactly one.',
    options: [
      { value: 'progress-update', label: '📊 Progress Update' },
      { value: 'feature-spotlight', label: '✨ Feature Spotlight' },
      { value: 'technical-breakdown', label: '⚙️ Technical Breakdown' },
      { value: 'art-audio', label: '🎨 Art & Audio' },
      { value: 'design-decision', label: '🧭 Design Decision' },
      { value: 'postmortem', label: '🔍 Postmortem' },
      { value: 'behind-the-scenes', label: '🎬 Behind the Scenes' },
      { value: 'milestone', label: '🚩 Milestone' },
      { value: 'community', label: '💬 Community' },
    ],
  };

  const tutorialFields = [
    {
      type: 'string',
      name: 'difficulty',
      label: 'Difficulty',
      options: ['beginner', 'intermediate', 'advanced'],
    },
    { type: 'string', name: 'engineVersion', label: 'Engine version', description: 'e.g. "UE 5.7"' },
    { type: 'string', name: 'series', label: 'Series name', description: 'Group multi-part tutorials together.' },
    { type: 'number', name: 'seriesOrder', label: 'Order within series' },
    { type: 'string', name: 'prerequisites', label: 'Prerequisites', list: true },
  ];

  const body = {
    type: 'rich-text',
    name: 'body',
    label: 'Body',
    isBody: true,
    parser: { type: 'markdown' },
  };

  // Compose fields: title, description, [category], pubDate…, [tutorial fields], body.
  const fields = [...common];
  if (category) fields.splice(2, 0, categoryField);
  if (tutorial) fields.push(...tutorialFields);
  fields.push(body);

  // Defaults applied when you click "Create New" in the Tina admin — so a new
  // post opens pre-filled (draft, today's date, a starter category + body skeleton)
  // instead of blank. Per-category skeletons live in /templates and the
  // /devlog-draft skill; this covers the common case in-browser.
  const today = () => new Date().toISOString().slice(0, 10);
  let defaultItem;
  if (category) {
    defaultItem = () => ({
      draft: true,
      pubDate: today(),
      category: 'progress-update',
      body: "\n## Headlines\n\n- \n\n## Blockers\n\n- \n\n## What's next\n\n- \n",
    });
  } else if (tutorial) {
    defaultItem = () => ({ draft: true, pubDate: today(), difficulty: 'intermediate' });
  }

  const ui = defaultItem ? { filename: { slugify }, defaultItem } : { filename: { slugify } };
  return { name, label, path, format: 'md', ui, fields };
}
