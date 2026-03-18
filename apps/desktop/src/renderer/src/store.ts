/**
 * Desktop Editor Store
 *
 * Extends the base editor store with file system integration
 * powered by the Electron host adapter.
 */

import { generateReactViteProject } from '@next-dev/catalog';
import { Document, type DesignSpec } from '@next-dev/editor-core';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const SESSION_STORAGE_KEY = 'designforge:editor-session';
const DEFAULT_EXPORT_PROJECT_NAME = 'untitled-project';

interface PersistedEditorSession {
  version: 1;
  spec: DesignSpec;
  filePath: string | null;
  isDirty: boolean;
  activePanel: 'palette' | 'layers';
  zoom: number;
  isPreviewMode: boolean;
}

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function loadPersistedSession(): PersistedEditorSession | null {
  const storage = getSessionStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PersistedEditorSession>;
    if (parsed.version !== 1) return null;
    if (!parsed.spec || typeof parsed.spec !== 'object') return null;
    if (typeof parsed.spec.root !== 'string') return null;
    if (!parsed.spec.elements || typeof parsed.spec.elements !== 'object') return null;

    return {
      version: 1,
      spec: parsed.spec,
      filePath: typeof parsed.filePath === 'string' ? parsed.filePath : null,
      isDirty: parsed.isDirty === true,
      activePanel: parsed.activePanel === 'layers' ? 'layers' : 'palette',
      zoom: typeof parsed.zoom === 'number' ? parsed.zoom : 1,
      isPreviewMode: parsed.isPreviewMode === true,
    };
  } catch {
    storage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function persistSession(
  state: Pick<
    DesktopEditorState,
    'spec' | 'filePath' | 'isDirty' | 'activePanel' | 'zoom' | 'isPreviewMode'
  >,
): void {
  const storage = getSessionStorage();
  if (!storage) return;

  const payload: PersistedEditorSession = {
    version: 1,
    spec: state.spec,
    filePath: state.filePath,
    isDirty: state.isDirty,
    activePanel: state.activePanel,
    zoom: state.zoom,
    isPreviewMode: state.isPreviewMode,
  };

  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
}

function attachDocumentListeners(
  doc: Document,
  set: (partial: Partial<DesktopEditorState>) => void,
): void {
  doc.onChange((spec) => {
    set({
      spec,
      isDirty: true,
      canUndo: doc.history.canUndo,
      canRedo: doc.history.canRedo,
    });
  });

  doc.selection.onChange((selected, hoveredId) => {
    set({
      selectedIds: [...selected],
      hoveredId,
    });
  });
}

function getProjectNameFromFilePath(filePath: string | null): string | null {
  const filename = filePath?.split(/[\\/]/).pop() ?? '';
  const stem = filename.replace(/\.[^.]+$/, '').trim();
  return stem.length > 0 ? stem : null;
}

function promptForProjectName(defaultName = DEFAULT_EXPORT_PROJECT_NAME): string {
  // window.prompt() is not available in Electron — return the default name.
  // The project name is already derived from the file path when one exists.
  return defaultName;
}

function buildExportOutputPath(baseDirectory: string, packageName: string): string {
  const normalizedBaseDirectory = baseDirectory.replace(/[\\/]+$/, '');
  const outputDirectoryName = packageName.endsWith('-export')
    ? packageName
    : `${packageName}-export`;
  return `${normalizedBaseDirectory}/${outputDirectoryName}`;
}

function notifyUser(message: string): void {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return;
  }

  const show = () => {
    try {
      new Notification('DesignForge', { body: message });
    } catch {
      // Ignore notification failures in browsers that block them.
    }
  };

  if (Notification.permission === 'granted') {
    show();
    return;
  }

  if (Notification.permission === 'default') {
    void Notification.requestPermission().then((permission) => {
      if (permission === 'granted') show();
    });
  }
}

export interface DesktopEditorState {
  // ─── Document ───────────────────────────────────────────────────────
  document: Document;
  spec: DesignSpec;

  // ─── File ───────────────────────────────────────────────────────────
  filePath: string | null;
  isDirty: boolean;

  // ─── Selection ──────────────────────────────────────────────────────
  selectedIds: string[];
  hoveredId: string | null;

  // ─── UI State ───────────────────────────────────────────────────────
  activePanel: 'palette' | 'layers';
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  isPreviewMode: boolean;

  // ─── Element Actions ────────────────────────────────────────────────
  addElement: (
    parentId: string,
    element: { type: string; props: Record<string, unknown>; __editor?: Record<string, unknown> },
    index?: number,
  ) => void;
  removeElement: (elementId: string) => void;
  moveElement: (elementId: string, newParentId: string, index: number) => void;
  setProps: (elementId: string, props: Record<string, unknown>) => void;
  duplicateElement: (elementId: string) => void;
  groupElements: (elementIds: string[]) => void;
  ungroupElement: (elementId: string) => void;

  // ─── Selection ──────────────────────────────────────────────────────
  select: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  hover: (id: string | null) => void;

  // ─── History ────────────────────────────────────────────────────────
  undo: () => void;
  redo: () => void;

  // ─── Clipboard ──────────────────────────────────────────────────────
  copy: () => void;
  cut: () => void;
  paste: (parentId: string) => void;

  // ─── UI ─────────────────────────────────────────────────────────────
  setActivePanel: (panel: 'palette' | 'layers') => void;
  setZoom: (zoom: number) => void;
  togglePreviewMode: () => void;

  // ─── File Operations ────────────────────────────────────────────────
  newFile: () => void;
  openFile: () => Promise<void>;
  saveFile: () => Promise<void>;
  saveAsFile: () => Promise<void>;
  exportCode: () => Promise<string | null>;
  loadSpec: (spec: DesignSpec, options?: { filePath?: string | null; isDirty?: boolean }) => void;
}

const restoredSession = loadPersistedSession();

export const useEditorStore = create<DesktopEditorState>()(
  subscribeWithSelector((set, get) => {
    const document = new Document(restoredSession ? { spec: restoredSession.spec } : undefined);
    attachDocumentListeners(document, set);

    return {
      document,
      spec: document.spec,
      filePath: restoredSession?.filePath ?? null,
      isDirty: restoredSession?.isDirty ?? false,
      selectedIds: [],
      hoveredId: null,
      activePanel: restoredSession?.activePanel ?? 'palette',
      zoom: restoredSession?.zoom ?? 1,
      canUndo: false,
      canRedo: false,
      isPreviewMode: restoredSession?.isPreviewMode ?? false,

      // Element operations
      addElement: (parentId, element, index) => {
        get().document.add(parentId, element, index);
      },
      removeElement: (elementId) => {
        get().document.remove(elementId);
      },
      moveElement: (elementId, newParentId, index) => {
        get().document.move(elementId, newParentId, index);
      },
      setProps: (elementId, props) => {
        get().document.setProps(elementId, props);
      },
      duplicateElement: (elementId) => {
        get().document.duplicate(elementId);
      },
      groupElements: (elementIds) => {
        get().document.group(elementIds);
      },
      ungroupElement: (elementId) => {
        get().document.ungroup(elementId);
      },

      // Selection
      select: (id, multi) => get().document.selection.select(id, multi),
      clearSelection: () => get().document.selection.clear(),
      hover: (id) => get().document.selection.hover(id),

      // History
      undo: () => get().document.undo(),
      redo: () => get().document.redo(),

      // Clipboard
      copy: () => get().document.copySelected(),
      cut: () => get().document.cutSelected(),
      paste: (parentId) => get().document.paste(parentId),

      // UI
      setActivePanel: (panel) => set({ activePanel: panel }),
      setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
      togglePreviewMode: () => {
        const current = get().isPreviewMode;
        if (!current) get().clearSelection();
        set({ isPreviewMode: !current });
      },

      // ─── File Operations ────────────────────────────────────────────
      newFile: () => {
        const newDoc = new Document();
        attachDocumentListeners(newDoc, set);
        set({
          document: newDoc,
          spec: newDoc.spec,
          filePath: null,
          isDirty: false,
          selectedIds: [],
          hoveredId: null,
          canUndo: false,
          canRedo: false,
        });
      },

      openFile: async () => {
        const api = window.designforge;
        const path = await api.fs.pick();
        if (!path) return;

        const content = await api.fs.read(path);
        const doc = Document.fromJSON(content);

        attachDocumentListeners(doc, set);

        set({
          document: doc,
          spec: doc.spec,
          filePath: path,
          isDirty: false,
          selectedIds: [],
          hoveredId: null,
          canUndo: false,
          canRedo: false,
        });
      },

      saveFile: async () => {
        const state = get();
        const api = window.designforge;

        let path = state.filePath;
        if (!path) {
          path = await api.fs.saveDialog();
          if (!path) return;
        }

        const json = state.document.toJSON();
        await api.fs.write(path, json);
        set({ filePath: path, isDirty: false });
      },

      saveAsFile: async () => {
        const api = window.designforge;
        const path = await api.fs.saveDialog();
        if (!path) return;

        const json = get().document.toJSON();
        await api.fs.write(path, json);
        set({ filePath: path, isDirty: false });
      },

      exportCode: async () => {
        try {
          const api = window.designforge;
          const state = get();
          const projectName = getProjectNameFromFilePath(state.filePath) ?? promptForProjectName();
          if (!projectName) return null;

          const outputRoot = await api.fs.pickDirectory();
          if (!outputRoot) return null;

          const project = generateReactViteProject(state.spec, {
            projectName,
          });
          const outputPath = buildExportOutputPath(outputRoot, project.packageName);
          await api.fs.writeBatch(outputPath, project.files);

          const placeholderNote =
            project.unsupportedComponents.length > 0
              ? ` ${project.unsupportedComponents.length} component types were exported as placeholders.`
              : '';
          notifyUser(`Code exported to ${outputPath}.${placeholderNote}`);
          return outputPath;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.error('[DesignForge] Code export failed', error);
          notifyUser(`Code export failed: ${message}`);
          return null;
        }
      },

      loadSpec: (spec, options) => {
        const newDoc = new Document({ spec });
        attachDocumentListeners(newDoc, set);
        set({
          document: newDoc,
          spec: newDoc.spec,
          filePath: options?.filePath === undefined ? get().filePath : options.filePath,
          isDirty: options?.isDirty ?? false,
          selectedIds: [],
          hoveredId: null,
          canUndo: false,
          canRedo: false,
        });
      },
    };
  }),
);

let persistTimer: ReturnType<typeof setTimeout> | null = null;

useEditorStore.subscribe(
  (state) => ({
    spec: state.spec,
    filePath: state.filePath,
    isDirty: state.isDirty,
    activePanel: state.activePanel,
    zoom: state.zoom,
    isPreviewMode: state.isPreviewMode,
  }),
  (snapshot) => {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      persistSession(snapshot);
    }, 50);
  },
);

persistSession(useEditorStore.getState());
