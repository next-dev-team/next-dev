/**
 * DesignForge Core Types
 *
 * The DesignSpec is a flat, ID-keyed document model designed for:
 * - Efficient RFC 6902 patch generation (flat = shallow paths)
 * - Fast lookups by ID (O(1) element access)
 * - Clean serialization to .dfg files
 * - AI-friendly structure (LLMs can reason about flat maps)
 */

// ─── Element Types ──────────────────────────────────────────────────────────

/** Editor-only metadata, stripped on export */
export interface EditorMeta {
  /** Custom layer name shown in the tree */
  name?: string;
  /** Prevent accidental edits */
  locked?: boolean;
  /** Hide from canvas (still in tree) */
  hidden?: boolean;
  /** Collapse children in layer tree */
  collapsed?: boolean;
}

/** A single element in the design spec */
export interface Element {
  /** Component type from the catalog: "Button", "Card", "Stack", etc. */
  type: string;
  /** Props passed to the component at render time */
  props: Record<string, unknown>;
  /** Ordered child element IDs */
  children: string[];
  /** Editor-only metadata — stripped on export */
  __editor?: EditorMeta;
}

/** Nested element input used by blocks/templates before IDs are assigned. */
export interface ElementBlueprint {
  /** Component type from the catalog: "Button", "Card", "Stack", etc. */
  type: string;
  /** Props passed to the component at render time */
  props: Record<string, unknown>;
  /** Nested child elements */
  children?: ElementBlueprint[];
  /** Editor-only metadata — stripped on export */
  __editor?: EditorMeta;
}

// ─── Spec ───────────────────────────────────────────────────────────────────

/** The DesignSpec is the document. Everything flows from this. */
export interface DesignSpec {
  /** Schema version for migrations */
  version: 1;
  /** ID of the root element */
  root: string;
  /** Flat map of all elements, keyed by ID */
  elements: Record<string, Element>;
  /** Reactive state bindings (for conditional rendering, etc.) */
  state: Record<string, unknown>;
}

// ─── .dfg File Format ───────────────────────────────────────────────────────

/** Editor viewport state (persisted in .dfg, not in spec) */
export interface EditorState {
  zoom: number;
  pan: [number, number];
  selection: string[];
  expandedLayers: string[];
}

/** The complete .dfg file format */
export interface DesignFile {
  /** File format version */
  version: 1;
  /** Which catalog was used: "rnr-uniwind-v1" */
  catalog: string;
  /** Target platforms */
  target: Array<'web' | 'ios' | 'android'>;
  /** The design spec (the actual document) */
  spec: DesignSpec;
  /** Editor viewport state */
  editor: EditorState;
}

// ─── Patches ────────────────────────────────────────────────────────────────

/** RFC 6902 JSON Patch operation */
export interface PatchOperation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: unknown;
  from?: string;
}

// ─── History ────────────────────────────────────────────────────────────────

/** A single history entry with forward + reverse patches */
export interface HistoryEntry {
  /** Human-readable label: "Add Button", "Move Card", etc. */
  label: string;
  /** Patches to apply (redo) */
  forward: PatchOperation[];
  /** Patches to reverse (undo) */
  reverse: PatchOperation[];
  /** Timestamp of the action */
  timestamp: number;
}

// ─── Catalog ────────────────────────────────────────────────────────────────

/** Metadata for a component in the visual editor */
export interface ComponentMeta {
  /** Lucide icon name for the palette */
  icon: string;
  /** Category for grouping: "input", "layout", "display", etc. */
  category: ComponentCategory;
  /** Whether this component can contain children */
  acceptsChildren: boolean;
  /** Default props when dragging from the palette */
  defaultProps: Record<string, unknown>;
  /** Human-readable description for AI context */
  description?: string;
}

/** Component categories for the palette */
export type ComponentCategory =
  | 'layout'
  | 'input'
  | 'display'
  | 'feedback'
  | 'navigation'
  | 'overlay';
