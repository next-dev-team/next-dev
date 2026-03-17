/**
 * Spec Operations
 *
 * Every mutation returns RFC 6902 patches (forward + reverse).
 * The caller pushes these to History for undo/redo.
 *
 * Design decisions:
 * - All operations are pure functions (spec in → patches out)
 * - No side effects — the caller applies patches and manages state
 * - Flat element map enables O(1) lookups and shallow patch paths
 * - nanoid generates collision-resistant 21-char IDs
 */

import { compare } from 'fast-json-patch';
import { nanoid } from 'nanoid';
import type { DesignSpec, Element, PatchOperation } from './types.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Generate a new element ID */
export function generateId(): string {
  return nanoid(12);
}

/** Deep clone a value (structuredClone where available, fallback to JSON) */
function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

/**
 * Compute RFC 6902 patches between two spec states.
 * Returns [forward, reverse] patch pairs.
 */
function diffSpec(
  before: DesignSpec,
  after: DesignSpec,
): [PatchOperation[], PatchOperation[]] {
  const forward = compare(before, after) as PatchOperation[];
  const reverse = compare(after, before) as PatchOperation[];
  return [forward, reverse];
}

/** Find the parent of an element by searching children arrays */
export function findParent(
  spec: DesignSpec,
  elementId: string,
): { parentId: string; index: number } | null {
  for (const [id, element] of Object.entries(spec.elements)) {
    const idx = element.children.indexOf(elementId);
    if (idx !== -1) {
      return { parentId: id, index: idx };
    }
  }
  return null;
}

/** Collect all descendant IDs (recursive) */
function collectDescendants(spec: DesignSpec, elementId: string): string[] {
  const result: string[] = [];
  const element = spec.elements[elementId];
  if (!element) return result;
  for (const childId of element.children) {
    result.push(childId);
    result.push(...collectDescendants(spec, childId));
  }
  return result;
}

// ─── Create Empty Spec ──────────────────────────────────────────────────────

/** Create a new empty design spec with a root container */
export function createEmptySpec(): DesignSpec {
  const rootId = generateId();
  return {
    version: 1,
    root: rootId,
    elements: {
      [rootId]: {
        type: 'Stack',
        props: {
          className: 'flex-1 p-4 gap-4',
          direction: 'vertical',
        },
        children: [],
        __editor: {
          name: 'Page',
          locked: false,
          hidden: false,
          collapsed: false,
        },
      },
    },
    state: {},
  };
}

// ─── Spec Operations ────────────────────────────────────────────────────────

/**
 * Add an element to a parent.
 * Returns [forward, reverse] patches.
 */
export function addElement(
  spec: DesignSpec,
  parentId: string,
  element: Omit<Element, 'children'> & { children?: string[] },
  index?: number,
): [PatchOperation[], PatchOperation[]] {
  const parent = spec.elements[parentId];
  if (!parent) throw new Error(`Parent element "${parentId}" not found`);

  const id = generateId();
  const after = clone(spec);

  // Add the element to the elements map
  after.elements[id] = {
    ...element,
    children: element.children ?? [],
  };

  // Insert into parent's children
  const insertIdx = index ?? parent.children.length;
  after.elements[parentId].children.splice(insertIdx, 0, id);

  return diffSpec(spec, after);
}

/**
 * Remove an element and all its descendants.
 * Returns [forward, reverse] patches.
 */
export function removeElement(
  spec: DesignSpec,
  elementId: string,
): [PatchOperation[], PatchOperation[]] {
  if (elementId === spec.root) {
    throw new Error('Cannot remove the root element');
  }

  const element = spec.elements[elementId];
  if (!element) throw new Error(`Element "${elementId}" not found`);

  const after = clone(spec);

  // Remove from parent's children
  const parentInfo = findParent(after, elementId);
  if (parentInfo) {
    after.elements[parentInfo.parentId].children.splice(parentInfo.index, 1);
  }

  // Remove element and all descendants
  const toRemove = [elementId, ...collectDescendants(spec, elementId)];
  for (const id of toRemove) {
    delete after.elements[id];
  }

  return diffSpec(spec, after);
}

/**
 * Move an element to a new parent at a given index.
 * Returns [forward, reverse] patches.
 */
export function moveElement(
  spec: DesignSpec,
  elementId: string,
  newParentId: string,
  index: number,
): [PatchOperation[], PatchOperation[]] {
  if (elementId === spec.root) {
    throw new Error('Cannot move the root element');
  }

  const element = spec.elements[elementId];
  if (!element) throw new Error(`Element "${elementId}" not found`);

  const newParent = spec.elements[newParentId];
  if (!newParent) throw new Error(`Target parent "${newParentId}" not found`);

  // Prevent moving into own descendants
  const descendants = collectDescendants(spec, elementId);
  if (descendants.includes(newParentId)) {
    throw new Error('Cannot move an element into its own descendant');
  }

  const after = clone(spec);

  // Remove from old parent
  const oldParentInfo = findParent(after, elementId);
  if (oldParentInfo) {
    after.elements[oldParentInfo.parentId].children.splice(oldParentInfo.index, 1);
  }

  // Insert into new parent
  const clampedIndex = Math.min(index, after.elements[newParentId].children.length);
  after.elements[newParentId].children.splice(clampedIndex, 0, elementId);

  return diffSpec(spec, after);
}

/**
 * Update props on an element (shallow merge).
 * Returns [forward, reverse] patches.
 */
export function updateProps(
  spec: DesignSpec,
  elementId: string,
  props: Record<string, unknown>,
): [PatchOperation[], PatchOperation[]] {
  const element = spec.elements[elementId];
  if (!element) throw new Error(`Element "${elementId}" not found`);

  const after = clone(spec);
  after.elements[elementId].props = {
    ...after.elements[elementId].props,
    ...props,
  };

  return diffSpec(spec, after);
}

/**
 * Update editor metadata on an element.
 * Returns [forward, reverse] patches.
 */
export function updateEditorMeta(
  spec: DesignSpec,
  elementId: string,
  meta: Partial<Element['__editor']>,
): [PatchOperation[], PatchOperation[]] {
  const element = spec.elements[elementId];
  if (!element) throw new Error(`Element "${elementId}" not found`);

  const after = clone(spec);
  after.elements[elementId].__editor = {
    ...after.elements[elementId].__editor,
    ...meta,
  };

  return diffSpec(spec, after);
}

/**
 * Group selected elements into a new Stack container.
 * Elements must share the same parent.
 * Returns [forward, reverse] patches.
 */
export function groupElements(
  spec: DesignSpec,
  elementIds: string[],
): [PatchOperation[], PatchOperation[]] {
  if (elementIds.length === 0) {
    throw new Error('No elements to group');
  }

  // Validate all elements exist and share the same parent
  const parents = new Set<string>();
  for (const id of elementIds) {
    if (!spec.elements[id]) throw new Error(`Element "${id}" not found`);
    const parentInfo = findParent(spec, id);
    if (parentInfo) parents.add(parentInfo.parentId);
  }

  if (parents.size !== 1) {
    throw new Error('All elements must share the same parent to group');
  }

  const parentId = [...parents][0];
  const parent = spec.elements[parentId];

  // Find the insertion index (position of the first selected element)
  const indices = elementIds.map((id) => parent.children.indexOf(id)).sort((a, b) => a - b);
  const insertIdx = indices[0];

  const after = clone(spec);
  const groupId = generateId();

  // Create the group container
  after.elements[groupId] = {
    type: 'Stack',
    props: {
      className: 'gap-2',
      direction: 'vertical',
    },
    children: [...elementIds],
    __editor: {
      name: 'Group',
      collapsed: false,
    },
  };

  // Remove grouped elements from parent and insert group
  after.elements[parentId].children = after.elements[parentId].children.filter(
    (id) => !elementIds.includes(id),
  );
  after.elements[parentId].children.splice(insertIdx, 0, groupId);

  return diffSpec(spec, after);
}

/**
 * Ungroup an element — promote its children to its parent.
 * Returns [forward, reverse] patches.
 */
export function ungroupElement(
  spec: DesignSpec,
  elementId: string,
): [PatchOperation[], PatchOperation[]] {
  const element = spec.elements[elementId];
  if (!element) throw new Error(`Element "${elementId}" not found`);
  if (elementId === spec.root) throw new Error('Cannot ungroup the root element');

  const parentInfo = findParent(spec, elementId);
  if (!parentInfo) throw new Error('Element has no parent');

  const after = clone(spec);

  // Replace the group element with its children in the parent
  const { parentId, index } = parentInfo;
  const children = [...element.children];

  after.elements[parentId].children.splice(index, 1, ...children);

  // Remove the group element itself
  delete after.elements[elementId];

  return diffSpec(spec, after);
}

/**
 * Duplicate an element and all its descendants.
 * Returns [forward, reverse] patches.
 */
export function duplicateElement(
  spec: DesignSpec,
  elementId: string,
): [PatchOperation[], PatchOperation[]] {
  const element = spec.elements[elementId];
  if (!element) throw new Error(`Element "${elementId}" not found`);
  if (elementId === spec.root) throw new Error('Cannot duplicate the root element');

  const parentInfo = findParent(spec, elementId);
  if (!parentInfo) throw new Error('Element has no parent');

  const after = clone(spec);

  // Deep-clone the element tree with new IDs
  const idMap = new Map<string, string>();
  const toDuplicate = [elementId, ...collectDescendants(spec, elementId)];

  for (const id of toDuplicate) {
    idMap.set(id, generateId());
  }

  for (const [oldId, newId] of idMap) {
    const original = clone(spec.elements[oldId]);
    original.children = original.children.map((childId) => idMap.get(childId) ?? childId);

    // Append "Copy" to the editor name if it exists
    if (original.__editor?.name) {
      original.__editor.name = `${original.__editor.name} Copy`;
    }

    after.elements[newId] = original;
  }

  // Insert the duplicate after the original in the parent
  const newRootId = idMap.get(elementId)!;
  after.elements[parentInfo.parentId].children.splice(
    parentInfo.index + 1,
    0,
    newRootId,
  );

  return diffSpec(spec, after);
}

/**
 * Strip all __editor metadata from a spec (for export).
 */
export function stripEditorMeta(spec: DesignSpec): DesignSpec {
  const clean = clone(spec);
  for (const element of Object.values(clean.elements)) {
    delete element.__editor;
  }
  return clean;
}
