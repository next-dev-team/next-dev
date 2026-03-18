/**
 * @next-dev/editor-core
 *
 * Pure TypeScript document model for DesignForge.
 * Zero UI dependencies — usable everywhere.
 */

// Types
export type {
  ComponentCategory,
  ComponentMeta,
  DesignFile,
  DesignSpec,
  EditorMeta,
  EditorState,
  Element,
  HistoryEntry,
  PatchOperation,
} from './types.js';
export type {
  DesignDocumentV2,
  DesignFileV2,
  EditorStateV2,
  JsonRenderElement,
  JsonRenderSpecLike,
  PlatformTarget,
  RuntimeId,
} from './design-file.js';
export {
  extractEditorNodes,
  inflateLegacyDesignFile,
  isDesignFileV2,
  migrateLegacyDesignFile,
  stripEditorMetaFromSpec,
} from './design-file.js';
export {
  normalizeDesignSpec,
  normalizeElement,
  normalizeDesignSpec as normalizeSpec,
  normalizeElement as normalizeSpecElement,
} from './normalize.js';

// Document controller
export { Document } from './document.js';
export type { DocumentListener, DocumentOptions } from './document.js';

// Operations (pure functions)
export {
  addElement,
  createEmptySpec,
  duplicateElement,
  findParent,
  generateId,
  groupElements,
  moveElement,
  removeElement,
  stripEditorMeta,
  ungroupElement,
  updateEditorMeta,
  updateProps,
} from './operations.js';

// History
export { History } from './history.js';
export type { HistoryOptions } from './history.js';

// Selection
export { Selection } from './selection.js';
export type { SelectionListener } from './selection.js';

// Clipboard
export { Clipboard } from './clipboard.js';
export type { ClipboardData } from './clipboard.js';
