/**
 * Clipboard — Copy/Cut/Paste support for elements
 *
 * Design:
 * - In-memory clipboard (not system clipboard — that's the HostAdapter's job)
 * - Stores serialized element subtrees for paste
 * - Handles ID regeneration on paste to avoid collisions
 */

import { nanoid } from 'nanoid';
import type { DesignSpec, Element } from './types.js';

/** A subtree of elements ready to be pasted */
export interface ClipboardData {
  /** The root element ID of the copied subtree */
  rootId: string;
  /** All elements in the subtree, keyed by original ID */
  elements: Record<string, Element>;
}

export class Clipboard {
  private data: ClipboardData | null = null;
  private cutSource: string | null = null;

  /** Whether the clipboard has content */
  get hasContent(): boolean {
    return this.data !== null;
  }

  /** Whether the last operation was a cut (for UI feedback) */
  get isCut(): boolean {
    return this.cutSource !== null;
  }

  /**
   * Copy an element subtree to the clipboard.
   */
  copy(spec: DesignSpec, elementId: string): void {
    const elements: Record<string, Element> = {};
    this.collectSubtree(spec, elementId, elements);
    this.data = { rootId: elementId, elements };
    this.cutSource = null;
  }

  /**
   * Cut an element subtree (copy + mark for removal on paste).
   */
  cut(spec: DesignSpec, elementId: string): void {
    this.copy(spec, elementId);
    this.cutSource = elementId;
  }

  /**
   * Get clipboard content with regenerated IDs.
   * Returns the new elements map and the new root ID.
   */
  paste(): { rootId: string; elements: Record<string, Element> } | null {
    if (!this.data) return null;

    const idMap = new Map<string, string>();
    const newElements: Record<string, Element> = {};

    // Generate new IDs for all elements
    for (const oldId of Object.keys(this.data.elements)) {
      idMap.set(oldId, nanoid(12));
    }

    // Clone elements with new IDs and remapped children
    for (const [oldId, newId] of idMap) {
      const original = this.data.elements[oldId];
      newElements[newId] = {
        ...structuredClone(original),
        children: original.children.map((childId) => idMap.get(childId) ?? childId),
      };
    }

    const result = {
      rootId: idMap.get(this.data.rootId)!,
      elements: newElements,
    };

    // If this was a cut, clear the clipboard after paste
    if (this.cutSource) {
      const cutId = this.cutSource;
      this.cutSource = null;
      // The caller should handle removing the cut source element
      return { ...result, cutSourceId: cutId } as typeof result & { cutSourceId: string };
    }

    return result;
  }

  /** Clear clipboard content */
  clear(): void {
    this.data = null;
    this.cutSource = null;
  }

  private collectSubtree(
    spec: DesignSpec,
    elementId: string,
    result: Record<string, Element>,
  ): void {
    const element = spec.elements[elementId];
    if (!element) return;

    result[elementId] = structuredClone(element);
    for (const childId of element.children) {
      this.collectSubtree(spec, childId, result);
    }
  }
}
