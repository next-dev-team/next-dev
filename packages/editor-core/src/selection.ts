/**
 * Selection — Tracks selected and hovered element IDs
 *
 * Design:
 * - Set-based for O(1) membership checks
 * - Multi-select with additive toggle (Shift+click)
 * - Hover tracking for canvas highlight overlays
 * - Event emitter pattern for UI reactivity
 */

export type SelectionListener = (selected: ReadonlySet<string>, hoveredId: string | null) => void;

export class Selection {
  private _selected: Set<string> = new Set();
  private _hoveredId: string | null = null;
  private listeners: Set<SelectionListener> = new Set();

  /** Currently selected element IDs (read-only view) */
  get selected(): ReadonlySet<string> {
    return this._selected;
  }

  /** Currently hovered element ID */
  get hoveredId(): string | null {
    return this._hoveredId;
  }

  /** Array of selected IDs (convenience for serialization) */
  get selectedIds(): string[] {
    return [...this._selected];
  }

  /** Whether a specific element is selected */
  isSelected(id: string): boolean {
    return this._selected.has(id);
  }

  /** Number of selected elements */
  get count(): number {
    return this._selected.size;
  }

  /**
   * Select an element.
   * @param id Element ID to select
   * @param multi If true, toggle selection (add/remove). If false, replace selection.
   */
  select(id: string, multi = false): void {
    if (multi) {
      // Toggle: if already selected, deselect; otherwise add
      if (this._selected.has(id)) {
        this._selected.delete(id);
      } else {
        this._selected.add(id);
      }
    } else {
      // Replace: clear and select only this one
      this._selected.clear();
      this._selected.add(id);
    }
    this.notify();
  }

  /**
   * Select all children of a parent element.
   * @param childIds IDs of children to select
   */
  selectAll(childIds: string[]): void {
    this._selected.clear();
    for (const id of childIds) {
      this._selected.add(id);
    }
    this.notify();
  }

  /** Clear all selection */
  clear(): void {
    if (this._selected.size === 0) return;
    this._selected.clear();
    this.notify();
  }

  /** Set the hovered element (for canvas highlight) */
  hover(id: string | null): void {
    if (this._hoveredId === id) return;
    this._hoveredId = id;
    this.notify();
  }

  /** Subscribe to selection changes */
  onChange(listener: SelectionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Remove elements from selection if they no longer exist */
  prune(existingIds: Set<string>): void {
    let changed = false;
    for (const id of this._selected) {
      if (!existingIds.has(id)) {
        this._selected.delete(id);
        changed = true;
      }
    }
    if (this._hoveredId && !existingIds.has(this._hoveredId)) {
      this._hoveredId = null;
      changed = true;
    }
    if (changed) this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this._selected, this._hoveredId);
    }
  }
}
