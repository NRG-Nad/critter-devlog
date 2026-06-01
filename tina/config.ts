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
        name: 'roadmap',
        label: 'Roadmap',
        path: 'src/content/roadmap',
        format: 'md',
        ui: {
          filename: {
            slugify: (values) =>
              ((values?.title as string) || 'feature')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Feature', isTitle: true, required: true },
          {
            type: 'string',
            name: 'status',
            label: 'Status',
            options: ['planned', 'in-progress', 'shipped'],
            required: true,
          },
          { type: 'string', name: 'area', label: 'Area', description: 'e.g. Climbing, Progression, Online', required: true },
          { type: 'datetime', name: 'date', label: 'Date', description: 'Shipped date, or target.', ui: { dateFormat: 'YYYY-MM-DD' } },
          { type: 'number', name: 'order', label: 'Sort order (lower = first)' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Description', isBody: true, parser: { type: 'markdown' } },
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

  return { name, label, path, format: 'md', ui: { filename: { slugify } }, fields };
}
