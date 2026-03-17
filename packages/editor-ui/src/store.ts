/**
 * Editor Store
 *
 * Zustand state for the visual builder, including document mutations and
 * preview-first AI interactions.
 */

import {
  Document,
  type DesignSpec,
  type Element,
} from '@next-dev/editor-core';
import { catalogToPrompt } from '@next-dev/catalog';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { getAIService, type AIOperation } from '@/services/ai';

type LeftPanelTab = 'palette' | 'layers';
type RightPanelTab = 'properties' | 'chat';
type ChatRole = 'user' | 'assistant' | 'system';

export interface AIProposal {
  prompt: string;
  description: string;
  operations: AIOperation[];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  status?: 'idle' | 'loading' | 'error';
  operations?: AIOperation[];
}

export interface EditorState {
  document: Document;
  spec: DesignSpec;
  previewSpec: DesignSpec | null;
  pendingAiProposal: AIProposal | null;

  selectedIds: string[];
  hoveredId: string | null;

  activePanel: LeftPanelTab;
  rightPanelTab: RightPanelTab;
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  chatMessages: ChatMessage[];
  isAiWorking: boolean;

  addElement: (
    parentId: string,
    element: Omit<Element, 'children'> & { children?: string[] },
    index?: number,
  ) => void;
  removeElement: (elementId: string) => void;
  moveElement: (elementId: string, newParentId: string, index: number) => void;
  setProps: (elementId: string, props: Record<string, unknown>) => void;
  duplicateElement: (elementId: string) => void;
  groupElements: (elementIds: string[]) => void;
  ungroupElement: (elementId: string) => void;

  select: (id: string, multi?: boolean) => void;
  selectAll: (parentId: string) => void;
  clearSelection: () => void;
  hover: (id: string | null) => void;

  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  copy: () => void;
  cut: () => void;
  paste: (parentId: string) => void;

  setActivePanel: (panel: LeftPanelTab) => void;
  setRightPanelTab: (panel: RightPanelTab) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setDragging: (isDragging: boolean) => void;
  sendAiPrompt: (prompt: string) => Promise<void>;
  acceptAiProposal: () => void;
  rejectAiProposal: () => void;
  clearChat: () => void;

  loadSpec: (spec: DesignSpec) => void;
  loadJSON: (json: string) => void;
  toJSON: () => string;
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => {
    const patchState = (partial: Partial<EditorState>) => set(partial);
    const document = createDocument(patchState);

    return {
      document,
      spec: document.spec,
      previewSpec: null,
      pendingAiProposal: null,
      selectedIds: [],
      hoveredId: null,
      activePanel: 'palette',
      rightPanelTab: 'chat',
      zoom: 1,
      pan: { x: 0, y: 0 },
      isDragging: false,
      chatMessages: [createInitialChatMessage()],
      isAiWorking: false,
      canUndo: false,
      canRedo: false,

      addElement: (parentId, element, index) => {
        if (get().pendingAiProposal) return;
        get().document.add(parentId, element, index);
      },
      removeElement: (elementId) => {
        if (get().pendingAiProposal) return;
        get().document.remove(elementId);
      },
      moveElement: (elementId, newParentId, index) => {
        if (get().pendingAiProposal) return;
        get().document.move(elementId, newParentId, index);
      },
      setProps: (elementId, props) => {
        if (get().pendingAiProposal) return;
        get().document.setProps(elementId, props);
      },
      duplicateElement: (elementId) => {
        if (get().pendingAiProposal) return;
        get().document.duplicate(elementId);
      },
      groupElements: (elementIds) => {
        if (get().pendingAiProposal) return;
        get().document.group(elementIds);
      },
      ungroupElement: (elementId) => {
        if (get().pendingAiProposal) return;
        get().document.ungroup(elementId);
      },

      select: (id, multi) => {
        if (get().pendingAiProposal) return;
        get().document.selection.select(id, multi);
      },
      selectAll: (parentId) => {
        if (get().pendingAiProposal) return;
        const element = get().document.getElement(parentId);
        if (element) {
          get().document.selection.selectAll(element.children);
        }
      },
      clearSelection: () => {
        get().document.selection.clear();
      },
      hover: (id) => {
        if (get().pendingAiProposal) return;
        get().document.selection.hover(id);
      },

      undo: () => {
        if (get().pendingAiProposal) return;
        get().document.undo();
      },
      redo: () => {
        if (get().pendingAiProposal) return;
        get().document.redo();
      },

      copy: () => {
        if (get().pendingAiProposal) return;
        get().document.copySelected();
      },
      cut: () => {
        if (get().pendingAiProposal) return;
        get().document.cutSelected();
      },
      paste: (parentId) => {
        if (get().pendingAiProposal) return;
        get().document.paste(parentId);
      },

      setActivePanel: (panel) => set({ activePanel: panel }),
      setRightPanelTab: (panel) => set({ rightPanelTab: panel }),
      setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
      setPan: (x, y) => set({ pan: { x, y } }),
      setDragging: (isDragging) => set({ isDragging }),
      sendAiPrompt: async (prompt) => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        const userMessage: ChatMessage = {
          id: createMessageId(),
          role: 'user',
          content: trimmedPrompt,
        };
        const pendingMessageId = createMessageId();

        set((state) => ({
          rightPanelTab: 'chat',
          previewSpec: null,
          pendingAiProposal: null,
          isAiWorking: true,
          chatMessages: [
            ...state.chatMessages,
            userMessage,
            {
              id: pendingMessageId,
              role: 'assistant',
              content: 'Thinking...',
              status: 'loading',
            },
          ],
        }));

        try {
          const response = await getAIService().generateOperations({
            prompt: trimmedPrompt,
            currentSpec: get().spec,
            catalog: catalogToPrompt(),
          });

          const hasOperations = response.operations.length > 0;
          const previewSpec = hasOperations
            ? buildPreviewSpec(get().spec, response.operations)
            : null;

          set((state) => ({
            isAiWorking: false,
            previewSpec,
            pendingAiProposal: hasOperations
              ? {
                  prompt: trimmedPrompt,
                  description: response.description,
                  operations: response.operations,
                }
              : null,
            chatMessages: state.chatMessages.map((message) =>
              message.id === pendingMessageId
                ? {
                    ...message,
                    content: response.description,
                    operations: response.operations,
                    status: 'idle',
                  }
                : message,
            ),
          }));
        } catch (error) {
          set((state) => ({
            isAiWorking: false,
            chatMessages: state.chatMessages.map((message) =>
              message.id === pendingMessageId
                ? {
                    ...message,
                    content:
                      error instanceof Error
                        ? error.message
                        : 'The AI request failed.',
                    status: 'error',
                  }
                : message,
            ),
          }));
        }
      },
      acceptAiProposal: () => {
        const proposal = get().pendingAiProposal;
        if (!proposal) return;

        clearAiPreviewState(patchState);
        applyAiOperationsToDocument(get().document, proposal.operations);

        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: createMessageId(),
              role: 'system',
              content: 'Applied AI preview to the live document.',
            },
          ],
        }));
      },
      rejectAiProposal: () => {
        if (!get().pendingAiProposal) return;

        clearAiPreviewState(patchState);
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: createMessageId(),
              role: 'system',
              content: 'Discarded the pending AI preview.',
            },
          ],
        }));
      },
      clearChat: () => {
        set({
          chatMessages: [createInitialChatMessage()],
          isAiWorking: false,
          previewSpec: null,
          pendingAiProposal: null,
        });
      },

      loadSpec: (spec) => {
        const newDoc = createDocument(patchState, spec);
        set({
          document: newDoc,
          spec: newDoc.spec,
          previewSpec: null,
          pendingAiProposal: null,
          selectedIds: [],
          hoveredId: null,
          canUndo: false,
          canRedo: false,
          chatMessages: [createInitialChatMessage()],
          isAiWorking: false,
        });
      },
      loadJSON: (json) => {
        const doc = Document.fromJSON(json);
        get().loadSpec(doc.spec);
      },
      toJSON: () => {
        return get().document.toJSON();
      },
    };
  }),
);

function createDocument(
  setState: (partial: Partial<EditorState>) => void,
  spec?: DesignSpec,
): Document {
  const document = new Document(spec ? { spec } : undefined);

  document.onChange((nextSpec) => {
    setState({
      spec: nextSpec,
      canUndo: document.history.canUndo,
      canRedo: document.history.canRedo,
    });
  });

  document.selection.onChange((selected, hoveredId) => {
    setState({
      selectedIds: [...selected],
      hoveredId,
    });
  });

  return document;
}

function clearAiPreviewState(
  setState: (partial: Partial<EditorState>) => void,
): void {
  setState({
    previewSpec: null,
    pendingAiProposal: null,
  });
}

function createInitialChatMessage(): ChatMessage {
  return {
    id: createMessageId(),
    role: 'system',
    content:
      'Describe a screen or ask for an edit. AI responses now open as a preview first, so you can accept or reject them before the live document changes.',
  };
}

function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildPreviewSpec(
  spec: DesignSpec,
  operations: AIOperation[],
): DesignSpec {
  const previewDoc = new Document({
    spec: JSON.parse(JSON.stringify(spec)) as DesignSpec,
  });

  applyAiOperationsToDocument(previewDoc, operations);
  return previewDoc.spec;
}

function applyAiOperationsToDocument(
  document: Document,
  operations: AIOperation[],
): void {
  for (const operation of operations) {
    switch (operation.type) {
      case 'add':
        if (!operation.elementType) continue;
        document.add(
          operation.parentId ?? document.rootId,
          {
            type: operation.elementType,
            props: operation.props ?? {},
            __editor: {
              name: operation.elementType,
            },
          },
          operation.index,
        );
        break;
      case 'remove':
        if (operation.elementId) {
          document.remove(operation.elementId);
        }
        break;
      case 'move':
        if (operation.elementId && operation.newParentId) {
          document.move(
            operation.elementId,
            operation.newParentId,
            operation.index ?? 0,
          );
        }
        break;
      case 'updateProps':
        if (operation.elementId && operation.updatedProps) {
          document.setProps(operation.elementId, operation.updatedProps);
        }
        break;
      default:
        break;
    }
  }
}

