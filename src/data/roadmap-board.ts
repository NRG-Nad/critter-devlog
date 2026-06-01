// Presentation metadata for the roadmap canvas (colors, labels, ordering).
// Board CONTENT lives in the Tina-managed `roadmap` collection
// (src/content/roadmap/*.json), read by the page — not from here.
//
// Hierarchy: Column (category) → Feature → Mechanic (prioritized).

export type Priority = 'P0' | 'P1' | 'P2' | 'TBD';

// "Systems" are reusable mechanics; "content" columns (biomes) consume them.
export type ColumnKind = 'system' | 'content';

// Secondary classification tag — the "why this matters" lens.
export type FeatureType =
  | 'Core mechanic'
  | 'Skill expression'
  | 'Progression'
  | 'Immersion'
  | 'Comedy'
  | 'Social Interaction';

export interface BoardMechanic {
  priority: Priority;
  title: string;
  description?: string;
  type?: FeatureType;
}

export interface BoardFeature {
  name: string;
  mechanics: BoardMechanic[];
}

export interface BoardColumn {
  id: string;
  label: string;
  kind: ColumnKind;
  features: BoardFeature[];
}

// Priority = how badly we need it.
export const PRIORITY_ORDER: Priority[] = ['P0', 'P1', 'P2', 'TBD'];

export const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  P0: { label: 'P0 · Must-have', color: '#ff6b6b' },
  P1: { label: 'P1 · Really want', color: '#ff9f45' },
  P2: { label: 'P2 · Nice-to-have', color: '#6ea8fe' },
  TBD: { label: 'TBD · Icebox', color: '#6f7a8b' },
};

export const TYPE_COLOR: Record<FeatureType, string> = {
  'Core mechanic': '#3fd9b3',
  'Skill expression': '#ff7a45',
  Progression: '#ffcf5c',
  Immersion: '#9d8cff',
  Comedy: '#f871a0',
  'Social Interaction': '#56c8d8',
};

// Fixed option lists shared by the Astro schema + Tina config so the canvas,
// the content schema, and the admin dropdowns never drift apart.
export const PRIORITY_OPTIONS = PRIORITY_ORDER;
export const TYPE_OPTIONS = Object.keys(TYPE_COLOR) as FeatureType[];
export const KIND_OPTIONS: ColumnKind[] = ['system', 'content'];