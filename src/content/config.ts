import { defineCollection, z } from 'astro:content';
import { CATEGORIES } from '../data/categories';

// Category enum derived from the taxonomy — single source of truth in data/categories.ts.
const categoryIds = Object.keys(CATEGORIES) as [string, ...string[]];

// Shared frontmatter across every content type.
const base = ({ image }: { image: () => any }) => ({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  cover: image().optional(),
  coverAlt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// Devlog posts. `category` is the primary, filterable taxonomy (see data/categories.ts);
// `tags` carry secondary topics. Defaults to a progress update — the recurring backbone.
const devlog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      ...base({ image }),
      category: z.enum(categoryIds).default('progress-update'),
    }),
});

// Evergreen technical deep-dives for the dev community. Support grouping into a
// named series, plus difficulty + engine-version metadata that the index filters on.
const tutorials = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      ...base({ image }),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
      engineVersion: z.string().optional(), // e.g. "UE 5.7"
      series: z.string().optional(), // e.g. "Extending Lyra's item system"
      seriesOrder: z.number().optional(),
      prerequisites: z.array(z.string()).default([]),
    }),
});

// Roadmap / progress tracker. One entry per core feature, with a status that
// moves planned → in-progress → shipped over time.
const roadmap = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      status: z.enum(['planned', 'in-progress', 'shipped']).default('planned'),
      area: z.string(), // e.g. "Climbing", "Progression", "Online"
      date: z.coerce.date().optional(), // shipped date, or target
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { devlog, tutorials, roadmap };