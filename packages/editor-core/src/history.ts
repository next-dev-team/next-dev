/**
 * History — Patch-based Undo/Redo
 *
 * Design:
 * - Each entry stores [forward, reverse] RFC 6902 patches
 * - Push clears the redo stack (standard undo behavior)
 * - Configurable max size to bound memory
 * - Labels for UI display ("Add Button", "Move Card", etc.)
 */

import type { HistoryEntry, PatchOperation } from './types.js';

export interface HistoryOptions {
  /** Maximum number of entries to keep. Default: 100 */
  maxSize?: number;
}

export class History {
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];
  private readonly maxSize: number;

  constructor(options?: HistoryOptions) {
    this.maxSize = options?.maxSize ?? 100;
  }

  /** Push a new action onto the history stack */
  push(forward: PatchOperation[], reverse: PatchOperation[], label: string): void {
    // Skip empty patches (no-op actions)
    if (forward.length === 0 && reverse.length === 0) return;

    this.undoStack.push({
      label,
      forward,
      reverse,
      timestamp: Date.now(),
    });

    // Clear redo stack — branching from this point
    this.redoStack = [];

    // Enforce max size
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
  }

  /**
   * Undo the last action.
   * Returns the reverse patches to apply, or null if nothing to undo.
   */
  undo(): PatchOperation[] | null {
    const entry = this.undoStack.pop();
    if (!entry) return null;

    this.redoStack.push(entry);
    return entry.reverse;
  }

  /**
   * Redo the last undone action.
   * Returns the forward patches to apply, or null if nothing to redo.
   */
  redo(): PatchOperation[] | null {
    const entry = this.redoStack.pop();
    if (!entry) return null;

    this.undoStack.push(entry);
    return entry.forward;
  }

  /** Whether there are actions to undo */
  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /** Whether there are actions to redo */
  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Label of the next undo action (for UI: "Undo: Add Button") */
  get undoLabel(): string | null {
    return this.undoStack.at(-1)?.label ?? null;
  }

  /** Label of the next redo action */
  get redoLabel(): string | null {
    return this.redoStack.at(-1)?.label ?? null;
  }

  /** Number of undo entries */
  get undoCount(): number {
    return this.undoStack.length;
  }

  /** Number of redo entries */
  get redoCount(): number {
    return this.redoStack.length;
  }

  /** Clear all history */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
