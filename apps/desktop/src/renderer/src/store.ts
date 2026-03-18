/**
 * Desktop Editor Store
 *
 * Extends the base editor store with file system integration
 * powered by the Electron host adapter.
 */

import { Document, type DesignSpec } from '@next-dev/editor-core';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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
  loadSpec: (spec: DesignSpec) => void;
}

export const useEditorStore = create<DesktopEditorState>()(
  subscribeWithSelector((set, get) => {
    const document = new Document();

    document.onChange((spec) => {
      set({
        spec,
        isDirty: true,
        canUndo: document.history.canUndo,
        canRedo: document.history.canRedo,
      });
    });

    document.selection.onChange((selected, hoveredId) => {
      set({
        selectedIds: [...selected],
        hoveredId,
      });
    });

    return {
      document,
      spec: document.spec,
      filePath: null,
      isDirty: false,
      selectedIds: [],
      hoveredId: null,
      activePanel: 'palette',
      zoom: 1,
      canUndo: false,
      canRedo: false,
      isPreviewMode: false,

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
        newDoc.onChange((spec) => {
          set({
            spec,
            isDirty: true,
            canUndo: newDoc.history.canUndo,
            canRedo: newDoc.history.canRedo,
          });
        });
        newDoc.selection.onChange((selected, hoveredId) => {
          set({ selectedIds: [...selected], hoveredId });
        });
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

        doc.onChange((spec) => {
          set({
            spec,
            isDirty: true,
            canUndo: doc.history.canUndo,
            canRedo: doc.history.canRedo,
          });
        });
        doc.selection.onChange((selected, hoveredId) => {
          set({ selectedIds: [...selected], hoveredId });
        });

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

      loadSpec: (spec) => {
        const newDoc = new Document({ spec });
        newDoc.onChange((s) => {
          set({
            spec: s,
            isDirty: true,
            canUndo: newDoc.history.canUndo,
            canRedo: newDoc.history.canRedo,
          });
        });
        newDoc.selection.onChange((selected, hoveredId) => {
          set({ selectedIds: [...selected], hoveredId });
        });
        set({
          document: newDoc,
          spec: newDoc.spec,
          selectedIds: [],
          hoveredId: null,
          canUndo: false,
          canRedo: false,
        });
      },
    };
  }),
);
