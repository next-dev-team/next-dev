/**
 * DnD Context — Wraps the entire editor with @dnd-kit drag-and-drop support
 *
 * Handles two drag sources:
 * 1. Palette items → dropped onto canvas/layer targets to add new elements
 * 2. Layer items → reordered/reparented within the layer tree
 */

import {
  DndContext as DndKitContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type CollisionDetection,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { catalog, type ComponentType, type CatalogEntry } from '@next-dev/catalog';
import { findParent, type DesignSpec } from '@next-dev/editor-core';
import React, { useCallback, useState } from 'react';
import { useEditorStore } from '@/store';

// ─── Drag Data Types ─────────────────────────────────────────────────────────

export interface PaletteDragData {
  source: 'palette';
  type: ComponentType;
  entry: CatalogEntry;
}

export interface LayerDragData {
  source: 'layer';
  elementId: string;
}

export type DragData = PaletteDragData | LayerDragData;

export interface DropTargetData {
  target: 'canvas-element' | 'layer-item' | 'layer-gap';
  elementId: string;
  /** For layer-gap: the index within the parent where item should be inserted */
  index?: number;
  acceptsChildren?: boolean;
}

// ─── Active Drag State ───────────────────────────────────────────────────────

interface ActiveDrag {
  id: UniqueIdentifier;
  data: DragData;
}

// ─── Collision Detection ─────────────────────────────────────────────────────

/**
 * Custom collision detection that prefers pointerWithin for precise targeting,
 * falling back to rectIntersection when no pointerWithin match is found.
 */
const customCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check if an element is a descendant of another element */
function isDescendant(spec: DesignSpec, ancestorId: string, descendantId: string): boolean {
  const ancestor = spec.elements[ancestorId];
  if (!ancestor) return false;
  for (const childId of ancestor.children) {
    if (childId === descendantId) return true;
    if (isDescendant(spec, childId, descendantId)) return true;
  }
  return false;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EditorDndContext({ children }: { children: React.ReactNode }) {
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before starting drag
      },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData;
    if (!data) return;

    setActiveDrag({ id: event.active.id, data });
    useEditorStore.getState().setDragging(true);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over?.id ?? null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);
    setOverId(null);
    useEditorStore.getState().setDragging(false);

    if (!over) return;

    const dragData = active.data.current as DragData;
    const dropData = over.data.current as DropTargetData | undefined;
    if (!dragData || !dropData) return;

    const store = useEditorStore.getState();
    const spec = store.spec;

    // ─── Palette → Canvas/Layer ────────────────────────────────────────
    if (dragData.source === 'palette') {
      const entry = catalog[dragData.type];
      if (!entry) return;

      let targetParentId: string;
      let insertIndex: number | undefined;

      if (dropData.target === 'layer-gap') {
        // Dropping between layer items — insert at the gap's parent + index
        targetParentId = dropData.elementId;
        insertIndex = dropData.index;
      } else if (dropData.acceptsChildren) {
        // Dropping onto an element that accepts children — add inside it
        targetParentId = dropData.elementId;
      } else {
        // Dropping onto a leaf element — add as sibling (after it)
        const parent = findParent(spec, dropData.elementId);
        if (parent) {
          targetParentId = parent.parentId;
          insertIndex = parent.index + 1;
        } else {
          targetParentId = spec.root;
        }
      }

      store.addElement(
        targetParentId,
        {
          type: dragData.type,
          props: { ...entry.meta.defaultProps },
          __editor: { name: dragData.type },
        },
        insertIndex,
      );
      return;
    }

    // ─── Layer → Layer (Reorder / Reparent) ────────────────────────────
    if (dragData.source === 'layer') {
      const elementId = dragData.elementId;

      // Don't drop onto self
      if (dropData.elementId === elementId) return;

      // Don't drop onto a descendant (would create cycle)
      if (isDescendant(spec, elementId, dropData.elementId)) return;

      let targetParentId: string;
      let insertIndex: number;

      if (dropData.target === 'layer-gap') {
        targetParentId = dropData.elementId;
        insertIndex = dropData.index ?? 0;
      } else if (dropData.acceptsChildren) {
        // Drop into container — append at end
        targetParentId = dropData.elementId;
        const targetElement = spec.elements[targetParentId];
        insertIndex = targetElement ? targetElement.children.length : 0;
      } else {
        // Drop onto leaf — insert as sibling after it
        const parent = findParent(spec, dropData.elementId);
        if (!parent) return;
        targetParentId = parent.parentId;
        insertIndex = parent.index + 1;
      }

      // If moving within the same parent, adjust index for the removal
      const currentParent = findParent(spec, elementId);
      if (currentParent && currentParent.parentId === targetParentId) {
        if (currentParent.index < insertIndex) {
          insertIndex -= 1;
        }
      }

      store.moveElement(elementId, targetParentId, insertIndex);
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null);
    setOverId(null);
    useEditorStore.getState().setDragging(false);
  }, []);

  return (
    <DndKitContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeDrag ? (
          <DragOverlayContent drag={activeDrag} />
        ) : null}
      </DragOverlay>
    </DndKitContext>
  );
}

// ─── Drag Overlay Content ────────────────────────────────────────────────────

function DragOverlayContent({ drag }: { drag: ActiveDrag }) {
  if (drag.data.source === 'palette') {
    return (
      <div
        style={{
          padding: '8px 12px',
          background: 'var(--color-panel-bg, #1e1e2e)',
          border: '1px solid var(--color-accent, #7c3aed)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--color-text-primary, #cdd6f4)',
          boxShadow: '0 8px 24px oklch(0 0 0 / 0.3)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {drag.data.type}
      </div>
    );
  }

  if (drag.data.source === 'layer') {
    const spec = useEditorStore.getState().spec;
    const element = spec.elements[drag.data.elementId];
    const displayName = element?.__editor?.name ?? element?.type ?? 'Element';

    return (
      <div
        style={{
          padding: '4px 12px',
          background: 'var(--color-panel-bg, #1e1e2e)',
          border: '1px solid var(--color-accent, #7c3aed)',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--color-text-primary, #cdd6f4)',
          boxShadow: '0 8px 24px oklch(0 0 0 / 0.3)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      >
        {displayName}
      </div>
    );
  }

  return null;
}
