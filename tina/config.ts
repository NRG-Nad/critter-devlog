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
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'post',
        label: 'Devlog posts',
        path: 'src/content/posts',
        format: 'md',
        ui: {
          filename: {
            // Generated from title: "May 2026 — Devlog kickoff" → "may-2026-devlog-kickoff"
            // You can override before saving a brand-new post.
            slugify: (values) => {
              const title = (values?.title as string) || 'untitled';
              return title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            },
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            description: 'One sentence — shown on the index page and in the RSS feed.',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'datetime',
            name: 'pubDate',
            label: 'Publish date',
            required: true,
            ui: {
              dateFormat: 'YYYY-MM-DD',
            },
          },
          {
            type: 'image',
            name: 'cover',
            label: 'Cover image',
          },
          {
            type: 'string',
            name: 'coverAlt',
            label: 'Cover alt text',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
            ui: {
              component: 'tags',
            },
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description:
              'Drafts are excluded from the public index, post pages, and RSS feed.',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
            // Store as plain Markdown so files stay readable + diffable in git.
            parser: { type: 'markdown' },
          },
        ],
      },
    ],
  },
});
