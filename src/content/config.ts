import { defineCollection, z } from 'astro:content';

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

// Monthly progress updates. Chronological, changelog-flavored.
const devlog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({ ...base({ image }) }),
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