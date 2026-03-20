/**
 * Document — The unified controller for a DesignForge document
 *
 * Wires together: DesignSpec + History + Selection + Clipboard
 * Provides a single API surface for all document operations.
 *
 * This is the object that:
 * - editor-ui uses for canvas interactions
 * - mcp-server uses for AI-driven edits
 * - agent-cli uses for headless operations
 */

import jsonpatch from 'fast-json-patch';
const { applyPatch } = jsonpatch;
import type { Operation } from 'fast-json-patch';
import { Clipboard } from './clipboard.js';
import {
  inflateLegacyDesignFile,
  isDesignFileV2,
  migrateLegacyDesignFile,
  type DesignFileV2,
} from './design-file.js';
import { History, type HistoryOptions } from './history.js';
import {
  addElement,
  addSubtree,
  createEmptySpec,
  duplicateElement,
  groupElements,
  moveElement,
  removeElement,
  stripEditorMeta,
  ungroupElement,
  updateEditorMeta,
  updateProps,
} from './operations.js';
import { normalizeDesignSpec } from './normalize.js';
import { Selection } from './selection.js';
import type {
  DesignFile,
  DesignSpec,
  EditorState,
  Element,
  ElementBlueprint,
  PatchOperation,
} from './types.js';

export type DocumentListener = (spec: DesignSpec) => void;

export interface DocumentOptions extends HistoryOptions {
  /** Initial spec to load */
  spec?: DesignSpec;
}

export class Document {
  private _spec: DesignSpec;
  readonly history: History;
  readonly selection: Selection;
  readonly clipboard: Clipboard;
  private listeners: Set<DocumentListener> = new Set();

  constructor(options?: DocumentOptions) {
    this._spec = normalizeDesignSpec(options?.spec ?? createEmptySpec());
    this.history = new History(options);
    this.selection = new Selection();
    this.clipboard = new Clipboard();
  }

  /** Current spec state (read-only) */
  get spec(): DesignSpec {
    return this._spec;
  }

  /** Root element ID */
  get rootId(): string {
    return this._spec.root;
  }

  // ─── Element Access ─────────────────────────────────────────────────

  /** Get an element by ID */
  getElement(id: string): Element | undefined {
    return this._spec.elements[id];
  }

  /** Get all element IDs */
  getAllIds(): string[] {
    return Object.keys(this._spec.elements);
  }

  /** Check if an element exists */
  hasElement(id: string): boolean {
    return id in this._spec.elements;
  }

  // ─── Patch Application ──────────────────────────────────────────────

  /**
   * Apply RFC 6902 patches directly.
   * Used for undo/redo and external patch sources (MCP, AI).
   */
  applyPatches(patches: PatchOperation[]): void {
    const result = applyPatch(this._spec, patches as Operation[], false, true);
    this._spec = normalizeDesignSpec(result.newDocument as DesignSpec);
    this.pruneSelection();
    this.notify();
  }

  /**
   * Execute an operation, push to history, and notify.
   */
  private execute(operationFn: () => [PatchOperation[], PatchOperation[]], label: string): void {
    const [forward, reverse] = operationFn();
    if (forward.length === 0) return;

    this.history.push(forward, reverse, label);
    this.applyPatches(forward);
  }

  // ─── Operations ─────────────────────────────────────────────────────

  /** Add a new element to a parent */
  add(
    parentId: string,
    element: Omit<Element, 'children'> & { children?: string[] },
    index?: number,
  ): void {
    const typeName = element.type;
    this.execute(() => addElement(this._spec, parentId, element, index), `Add ${typeName}`);
  }

  /** Add a nested subtree to a parent */
  addTree(parentId: string, blueprint: ElementBlueprint, index?: number): void {
    const label = blueprint.__editor?.name ?? blueprint.type;
    this.execute(() => addSubtree(this._spec, parentId, blueprint, index), `Add ${label}`);
  }

  /** Remove an element and its descendants */
  remove(elementId: string): void {
    const element = this._spec.elements[elementId];
    const label = element?.__editor?.name ?? element?.type ?? 'element';
    this.execute(() => removeElement(this._spec, elementId), `Remove ${label}`);
  }

  /** Move an element to a new parent */
  move(elementId: string, newParentId: string, index: number): void {
    this.execute(() => moveElement(this._spec, elementId, newParentId, index), 'Move element');
  }

  /** Update props on an element */
  setProps(elementId: string, props: Record<string, unknown>): void {
    this.execute(() => updateProps(this._spec, elementId, props), 'Update props');
  }

  /** Update editor metadata */
  setEditorMeta(elementId: string, meta: Partial<Element['__editor']>): void {
    this.execute(() => updateEditorMeta(this._spec, elementId, meta), 'Update metadata');
  }

  /** Group selected elements into a Stack */
  group(elementIds: string[]): void {
    this.execute(
      () => groupElements(this._spec, elementIds),
      `Group ${elementIds.length} elements`,
    );
  }

  /** Ungroup an element, promoting its children */
  ungroup(elementId: string): void {
    this.execute(() => ungroupElement(this._spec, elementId), 'Ungroup');
  }

  /** Duplicate an element */
  duplicate(elementId: string): void {
    this.execute(() => duplicateElement(this._spec, elementId), 'Duplicate');
  }

  // ─── Undo/Redo ──────────────────────────────────────────────────────

  /** Undo the last action */
  undo(): boolean {
    const patches = this.history.undo();
    if (!patches) return false;
    this.applyPatches(patches);
    return true;
  }

  /** Redo the last undone action */
  redo(): boolean {
    const patches = this.history.redo();
    if (!patches) return false;
    this.applyPatches(patches);
    return true;
  }

  // ─── Clipboard ──────────────────────────────────────────────────────

  /** Copy selected element(s) */
  copySelected(): void {
    const selected = [...this.selection.selected];
    if (selected.length === 0) return;
    // Copy only the first selected element (multi-element copy is complex)
    this.clipboard.copy(this._spec, selected[0]);
  }

  /** Cut selected element(s) */
  cutSelected(): void {
    const selected = [...this.selection.selected];
    if (selected.length === 0) return;
    this.clipboard.cut(this._spec, selected[0]);
  }

  /** Paste clipboard content into the targeted parent */
  paste(parentId: string, index?: number): void {
    const content = this.clipboard.paste();
    if (!content) return;

    // Add all pasted elements to the spec
    const pastedElements = content.elements;
    const pastedRootId = content.rootId;
    const rootElement = pastedElements[pastedRootId];

    if (!rootElement) return;

    // Add the pasted subtree
    this.add(parentId, rootElement, index);

    // If this was a cut, remove the original
    if ('cutSourceId' in content) {
      const cutSourceId = (content as { cutSourceId: string }).cutSourceId;
      if (this._spec.elements[cutSourceId]) {
        this.remove(cutSourceId);
      }
    }
  }

  // ─── Serialization ─────────────────────────────────────────────────

  /** Serialize to .dfg file format */
  toFile(editorState?: Partial<EditorState>): DesignFile {
    return {
      version: 1,
      catalog: 'rnr-uniwind-v1',
      target: ['web', 'ios', 'android'],
      spec: this._spec,
      editor: {
        zoom: 1,
        pan: [0, 0],
        selection: this.selection.selectedIds,
        expandedLayers: [],
        ...editorState,
      },
    };
  }

  /** Load from .dfg file */
  static fromFile(file: DesignFile | DesignFileV2): Document {
    if (isDesignFileV2(file)) {
      return Document.fromFile(inflateLegacyDesignFile(file));
    }

    const doc = new Document({ spec: file.spec });
    // Restore selection from file
    if (file.editor?.selection) {
      doc.selection.selectAll(file.editor.selection);
    }
    return doc;
  }

  /** Serialize spec to JSON (for file saving) */
  toJSON(): string {
    return JSON.stringify(this.toFile(), null, 2);
  }

  /** Serialize to the v2 DesignForge file format */
  toFileV2(editorState?: Partial<EditorState>): DesignFileV2 {
    return migrateLegacyDesignFile(this.toFile(editorState));
  }

  /** Serialize the v2 file format to JSON */
  toJSONV2(editorState?: Partial<EditorState>): string {
    return JSON.stringify(this.toFileV2(editorState), null, 2);
  }

  /** Parse a .dfg JSON string */
  static fromJSON(json: string): Document {
    const parsed = JSON.parse(json) as DesignFile | DesignFileV2;
    return Document.fromFile(parsed);
  }

  /** Get a clean spec for code export (no editor metadata) */
  toExportSpec(): DesignSpec {
    return stripEditorMeta(this._spec);
  }

  // ─── Subscriptions ──────────────────────────────────────────────────

  /** Subscribe to spec changes */
  onChange(listener: DocumentListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this._spec);
    }
  }

  private pruneSelection(): void {
    const existingIds = new Set(Object.keys(this._spec.elements));
    this.selection.prune(existingIds);
  }
}
