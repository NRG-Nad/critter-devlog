import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  PRIORITY_ORDER,
  PRIORITY_META,
  TYPE_COLOR,
  type BoardColumn,
  type BoardMechanic,
  type Priority,
} from '../data/roadmap-board';

// ---- layout geometry (px, in flow coordinates) ----------------------------
const COL_W = 300;
const COL_GAP = 52;
const CARD_W = 270;
const CARD_H = 132;
const CARD_GAP = 11;
const HEADER_H = 62;
const HEADER_GAP = 24;
const FEATURE_H = 28;
const FEATURE_GAP_TOP = 16;
const FEATURE_GAP_BOTTOM = 8;

// ---- custom node renderers -------------------------------------------------
function ColHeaderNode({ data }: NodeProps) {
  const label = data.label as string;
  const count = data.count as number;
  const kind = data.kind as string;
  return (
    <div className={`rmc-col-header ${kind === 'content' ? 'is-content' : ''}`}>
      <div className="rmc-col-title">{label}</div>
      <div className="rmc-col-meta">
        <span className="rmc-kind">{kind === 'content' ? 'CONTENT' : 'SYSTEM'}</span>
        <span className="rmc-col-count">{count}</span>
      </div>
    </div>
  );
}

function FeatureNode({ data }: NodeProps) {
  const name = data.name as string;
  const count = data.count as number;
  return (
    <div className="rmc-feature">
      <span className="rmc-feature-name">{name}</span>
      <span className="rmc-feature-count">{count}</span>
    </div>
  );
}

function MechanicNode({ data }: NodeProps) {
  const item = data.item as BoardMechanic;
  const pc = PRIORITY_META[item.priority].color;
  return (
    <div className="rmc-card" style={{ borderLeftColor: pc }}>
      <div className="rmc-card-head">
        <span className="rmc-chip" style={{ background: pc }}>{item.priority}</span>
        {item.type && (
          <span className="rmc-type" style={{ color: TYPE_COLOR[item.type], borderColor: TYPE_COLOR[item.type] }}>
            {item.type}
          </span>
        )}
      </div>
      <div className="rmc-title">{item.title}</div>
      {item.description && <div className="rmc-desc">{item.description}</div>}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  colHeader: ColHeaderNode,
  feature: FeatureNode,
  mechanic: MechanicNode,
};

// ---- node generation -------------------------------------------------------
function buildNodes(board: BoardColumn[]): Node[] {
  const nodes: Node[] = [];
  const byPriority = (a: BoardMechanic, b: BoardMechanic) =>
    PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);

  board.forEach((col, c) => {
    const colX = c * (COL_W + COL_GAP);
    const cardX = colX + (COL_W - CARD_W) / 2;
    const total = col.features.reduce((n, f) => n + f.mechanics.length, 0);

    nodes.push({
      id: `h-${col.id}`,
      type: 'colHeader',
      position: { x: colX, y: 0 },
      data: { label: col.label, count: total, kind: col.kind },
      width: COL_W,
      height: HEADER_H,
      draggable: false,
      selectable: false,
    });

    let y = HEADER_H + HEADER_GAP;

    col.features.forEach((feature, fi) => {
      if (fi > 0) y += FEATURE_GAP_TOP;
      nodes.push({
        id: `feat-${col.id}-${fi}`,
        type: 'feature',
        position: { x: colX, y },
        data: { name: feature.name, count: feature.mechanics.length },
        width: COL_W,
        height: FEATURE_H,
        draggable: false,
        selectable: false,
      });
      y += FEATURE_H + FEATURE_GAP_BOTTOM;

      [...feature.mechanics].sort(byPriority).forEach((item, mi) => {
        nodes.push({
          id: `m-${col.id}-${fi}-${mi}`,
          type: 'mechanic',
          position: { x: cardX, y },
          data: { item },
          width: CARD_W,
          height: CARD_H,
          draggable: false,
        });
        y += CARD_H + CARD_GAP;
      });
    });
  });

  return nodes;
}

const minimapColor = (n: Node): string => {
  if (n.type === 'mechanic') return PRIORITY_META[(n.data.item as BoardMechanic).priority].color;
  if (n.type === 'colHeader') return '#3a4757';
  return '#28323f';
};

export default function RoadmapCanvas({ board }: { board: BoardColumn[] }) {
  const nodes = useMemo(() => buildNodes(board), [board]);

  return (
    <div className="rmc-root">
      <style>{CSS}</style>
      <ReactFlow
        nodes={nodes}
        edges={[]}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.12}
        maxZoom={1.75}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#1c2533" />
        <Controls showInteractive={false} />
        <MiniMap nodeColor={minimapColor} maskColor="rgba(10,13,18,0.7)" pannable zoomable />
        <Panel position="top-left">
          <div className="rmc-legend">
            <strong>Priority</strong>
            {PRIORITY_ORDER.map((p) => (
              <span key={p} className="rmc-legend-row">
                <span className="rmc-legend-dot" style={{ background: PRIORITY_META[p].color }} />
                {PRIORITY_META[p].label}
              </span>
            ))}
            <span className="rmc-legend-note">Columns: systems (left) → content / biomes (right)</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Scoped styles. Kept here so the prototype is self-contained (no edits to global.css).
const CSS = `
.rmc-root { width: 100%; height: 100%; }
.rmc-root .react-flow { background: transparent; }
.rmc-root .react-flow__controls,
.rmc-root .react-flow__minimap {
  background: var(--surface, #1a2230);
  border: 1px solid var(--border, #28323f);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.35);
}
.rmc-root .react-flow__controls-button {
  background: var(--surface, #1a2230);
  border-bottom: 1px solid var(--border, #28323f);
  fill: var(--text-dim, #aab4c4);
}
.rmc-root .react-flow__controls-button:hover { background: var(--surface-2, #212b3b); }

.rmc-col-header {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; justify-content: center;
  gap: 4px; padding: 0 16px;
  background: linear-gradient(180deg, var(--surface-2, #212b3b), var(--surface, #1a2230));
  border: 1px solid var(--border-bright, #3a4757);
  border-top: 3px solid var(--text-muted, #6f7a8b);
  border-radius: 12px;
}
.rmc-col-header.is-content { border-top-color: var(--biome, #3fd9b3); }
.rmc-col-title {
  font-family: var(--font-display, sans-serif);
  font-weight: 600; font-size: 15px; letter-spacing: -0.01em;
  color: var(--text, #eef2f7);
}
.rmc-col-meta { display: flex; align-items: center; gap: 8px; }
.rmc-kind {
  font-size: 9px; font-weight: 800; letter-spacing: 0.08em;
  color: var(--text-muted, #6f7a8b);
}
.rmc-col-header.is-content .rmc-kind { color: var(--biome, #3fd9b3); }
.rmc-col-count {
  font-size: 11px; font-weight: 600; color: var(--text-muted, #6f7a8b);
  background: var(--bg-2, #0e131b); border-radius: 999px; padding: 1px 8px;
}

.rmc-feature {
  width: 100%; height: 100%;
  display: flex; align-items: center; gap: 8px;
  padding: 0 4px;
  border-bottom: 1px solid var(--border, #28323f);
}
.rmc-feature-name {
  font-family: var(--font-display, sans-serif);
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--text-dim, #aab4c4);
}
.rmc-feature-count {
  font-size: 10px; font-weight: 600; color: var(--text-muted, #6f7a8b);
}

.rmc-card {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; gap: 6px;
  padding: 10px 12px;
  background: var(--surface, #1a2230);
  border: 1px solid var(--border, #28323f);
  border-left: 3px solid var(--border-bright, #3a4757);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.25);
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}
.rmc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  border-color: var(--border-bright, #3a4757);
}
.rmc-card-head { display: flex; align-items: center; gap: 7px; }
.rmc-chip {
  font-size: 10px; font-weight: 800; letter-spacing: 0.03em;
  color: #0a0d12; border-radius: 5px; padding: 2px 6px;
}
.rmc-type {
  font-size: 10px; font-weight: 600;
  border: 1px solid currentColor; border-radius: 5px; padding: 1px 6px;
  opacity: 0.9;
}
.rmc-title {
  font-family: var(--font-display, sans-serif);
  font-weight: 600; font-size: 14px; line-height: 1.25;
  color: var(--text, #eef2f7);
}
.rmc-desc {
  font-size: 12px; line-height: 1.4; color: var(--text-dim, #aab4c4);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

.rmc-legend {
  display: flex; flex-direction: column; gap: 6px;
  background: var(--surface, #1a2230);
  border: 1px solid var(--border, #28323f);
  border-radius: 10px; padding: 10px 12px;
  font-size: 12px; color: var(--text-dim, #aab4c4);
  box-shadow: 0 6px 20px rgba(0,0,0,0.35);
}
.rmc-legend strong { color: var(--text, #eef2f7); font-family: var(--font-display, sans-serif); font-size: 12px; }
.rmc-legend-row { display: flex; align-items: center; gap: 7px; }
.rmc-legend-dot { width: 9px; height: 9px; border-radius: 999px; }
.rmc-legend-note { margin-top: 4px; font-size: 10px; color: var(--text-muted, #6f7a8b); max-width: 180px; line-height: 1.35; }
`;