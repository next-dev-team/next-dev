/**
 * @next-dev/json-render — Core render logic
 *
 * renderNode: recursively renders a DesignSpec element tree to React nodes.
 * renderOperations: renders a list of AI operations as a preview (for chat).
 * JsonRender: React component wrapper for renderNode.
 */

import type React from 'react';
import type { DesignSpec } from '@next-dev/editor-core';
import { renderers, type RenderContext } from './renderers.js';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface JsonRenderProps {
  /** The DesignSpec to render */
  spec: DesignSpec;
  /** Starting element ID (defaults to spec.root) */
  elementId?: string;
  /** Scale factor (1 = full, 0.55 = preview). Default: 1 */
  scale?: number;
  /** Whether this is interactive (canvas) or static (preview). Default: true */
  interactive?: boolean;
  /** Optional className for the wrapper */
  className?: string;
  /** Optional style */
  style?: React.CSSProperties;
}

/** Describes a pending AI operation for preview rendering */
export interface PreviewOperation {
  type: 'add' | 'remove' | 'move' | 'updateProps';
  parentId?: string;
  elementType?: string;
  props?: Record<string, unknown>;
  elementId?: string;
  newParentId?: string;
  updatedProps?: Record<string, unknown>;
  index?: number;
}

// ─── Core Render ────────────────────────────────────────────────────────────

/**
 * Recursively render a single element from the DesignSpec.
 */
export function renderNode(
  spec: DesignSpec,
  elementId: string,
  ctx: RenderContext,
): React.ReactNode {
  const element = spec.elements[elementId];
  if (!element) return null;

  // Check for hidden flag
  if (element.__editor?.hidden) return null;

  // Recursively render children
  const childNodes = element.children.map((childId: string) =>
    renderNode(spec, childId, ctx),
  );

  // Look up the renderer for this element type
  const renderer = renderers[element.type];
  if (renderer) {
    return renderer(element.props, childNodes, ctx);
  }

  // Fallback for unknown types
  return (
    <div
      style={{
        padding: `${Math.round(12 * ctx.scale)}px`,
        border: '1px dashed var(--color-border-default)',
        borderRadius: `${Math.round(6 * ctx.scale)}px`,
        fontSize: `${Math.round(12 * ctx.scale)}px`,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
      }}
    >
      {element.type}
      {childNodes}
    </div>
  );
}

// ─── Operation Preview ──────────────────────────────────────────────────────

/**
 * Render a list of AI operations as a preview.
 * Only "add" operations produce visible output.
 * Other operations are shown as status indicators.
 */
export function renderOperations(
  operations: PreviewOperation[],
  ctx: RenderContext = { scale: 0.55, interactive: false },
): React.ReactNode {
  return operations.map((op, i) => {
    if (op.type === 'add' && op.elementType) {
      const renderer = renderers[op.elementType];
      if (renderer) {
        return <div key={`add-${op.elementType}-${i}`}>{renderer(op.props ?? {}, [], ctx)}</div>;
      }
      // Fallback for unknown add
      return (
        <div
          key={`add-unknown-${i}`}
          style={{
            padding: `${Math.round(6 * ctx.scale)}px ${Math.round(12 * ctx.scale)}px`,
            border: '1px dashed var(--color-border-default)',
            borderRadius: `${Math.round(4 * ctx.scale)}px`,
            fontSize: `${Math.round(10 * ctx.scale)}px`,
            color: 'var(--color-text-muted)',
            textAlign: 'center',
          }}
        >
          + {op.elementType}
        </div>
      );
    }

    if (op.type === 'remove') {
      return (
        <div
          key={i}
          style={{
            padding: `${Math.round(4 * ctx.scale)}px ${Math.round(8 * ctx.scale)}px`,
            fontSize: `${Math.round(10 * ctx.scale)}px`,
            color: 'var(--color-error)',
            opacity: 0.7,
          }}
        >
          ✕ Remove {op.elementId ? `#${op.elementId.substring(0, 6)}` : 'element'}
        </div>
      );
    }

    if (op.type === 'updateProps') {
      const propKeys = op.updatedProps ? Object.keys(op.updatedProps).join(', ') : '';
      return (
        <div
          key={i}
          style={{
            padding: `${Math.round(4 * ctx.scale)}px ${Math.round(8 * ctx.scale)}px`,
            fontSize: `${Math.round(10 * ctx.scale)}px`,
            color: 'var(--color-chat-edit)',
            opacity: 0.8,
          }}
        >
          ✎ Update {propKeys}
        </div>
      );
    }

    if (op.type === 'move') {
      return (
        <div
          key={i}
          style={{
            padding: `${Math.round(4 * ctx.scale)}px ${Math.round(8 * ctx.scale)}px`,
            fontSize: `${Math.round(10 * ctx.scale)}px`,
            color: 'var(--color-chat-ask)',
          }}
        >
          ↕ Move element
        </div>
      );
    }

    return null;
  });
}

// ─── React Component ────────────────────────────────────────────────────────

/**
 * React component that renders a full DesignSpec tree.
 *
 * Usage:
 *   <JsonRender spec={mySpec} />                    — full canvas
 *   <JsonRender spec={mySpec} scale={0.55} />       — chat preview
 */
export function JsonRender({
  spec,
  elementId,
  scale = 1,
  interactive = true,
  className,
  style,
}: JsonRenderProps): React.ReactNode {
  const ctx: RenderContext = { scale, interactive };
  const rootId = elementId ?? spec.root;

  return (
    <div className={className} style={style}>
      {renderNode(spec, rootId, ctx)}
    </div>
  );
}
