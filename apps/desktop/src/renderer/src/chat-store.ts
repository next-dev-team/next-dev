/**
 * Chat Store — real-time message state for the AI chat panel
 *
 * Manages:
 * - Message thread (user + assistant messages)
 * - Streaming state (typing indicator, accumulated text)
 * - Provider configuration (mock / openai / mcp)
 * - Pending operations preview + accept/reject flow
 * - Settings panel visibility
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  createProvider,
  type AIProvider,
  type AIOperation,
  type AIStreamChunk,
  type ProviderConfig,
} from '@/ai-providers';
import { useEditorStore } from '@/store';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  /** Structured operations returned by AI (assistant only) */
  operations?: AIOperation[];
  /** Whether operations have been applied to the canvas */
  applied?: boolean;
  /** Whether the message is still streaming */
  streaming?: boolean;
}

export type ChatMode = 'ask' | 'edit' | 'generate';

export interface ChatState {
  // ─── Messages ────────────────────────────────────────────────────
  messages: ChatMessage[];
  isStreaming: boolean;
  streamText: string;

  // ─── Provider ────────────────────────────────────────────────────
  providerConfig: ProviderConfig;
  provider: AIProvider;

  // ─── UI ──────────────────────────────────────────────────────────
  mode: ChatMode;
  showSettings: boolean;
  inputValue: string;

  // ─── Pending Operations ──────────────────────────────────────────
  pendingOps: AIOperation[] | null;
  pendingMessageId: string | null;

  // ─── Actions ─────────────────────────────────────────────────────
  sendMessage: (content: string) => Promise<void>;
  cancelStream: () => void;
  clearChat: () => void;
  setMode: (mode: ChatMode) => void;
  setShowSettings: (show: boolean) => void;
  setInputValue: (value: string) => void;
  updateProviderConfig: (config: Partial<ProviderConfig>) => void;
  acceptOperations: (messageId: string) => void;
  rejectOperations: (messageId: string) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

let idCounter = 0;
function makeId(): string {
  return `msg-${Date.now()}-${++idCounter}`;
}

function loadProviderConfig(): ProviderConfig {
  try {
    const stored = localStorage.getItem('designforge:ai-provider');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { type: 'mock' };
}

function saveProviderConfig(config: ProviderConfig): void {
  try {
    localStorage.setItem('designforge:ai-provider', JSON.stringify(config));
  } catch { /* ignore */ }
}

// ─── Store ──────────────────────────────────────────────────────────────────

let abortController: AbortController | null = null;

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => {
    const initialConfig = loadProviderConfig();
    const initialProvider = createProvider(initialConfig);

    return {
      messages: [
        {
          id: 'welcome',
          role: 'system',
          content: '👋 Welcome to DesignForge AI! Describe what you want to build and I\'ll generate the components.\n\nTry: "Create a login form" or "Add a button with text \'Submit\'"',
          timestamp: Date.now(),
        },
      ],
      isStreaming: false,
      streamText: '',
      providerConfig: initialConfig,
      provider: initialProvider,
      mode: 'generate',
      showSettings: false,
      inputValue: '',
      pendingOps: null,
      pendingMessageId: null,

      sendMessage: async (content: string) => {
        const state = get();
        if (state.isStreaming || !content.trim()) return;

        const userMsg: ChatMessage = {
          id: makeId(),
          role: 'user',
          content: content.trim(),
          timestamp: Date.now(),
        };

        const assistantId = makeId();
        const assistantMsg: ChatMessage = {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          streaming: true,
        };

        set({
          messages: [...state.messages, userMsg, assistantMsg],
          isStreaming: true,
          streamText: '',
          inputValue: '',
        });

        abortController = new AbortController();

        const spec = useEditorStore.getState().spec;
        let accumulated = '';
        let ops: AIOperation[] = [];

        try {
          await state.provider.stream(content, spec, (chunk: AIStreamChunk) => {
            const current = get();

            switch (chunk.type) {
              case 'text':
                accumulated += chunk.content ?? '';
                set({
                  streamText: accumulated,
                  messages: current.messages.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulated } : m,
                  ),
                });
                break;

              case 'operations':
                ops = chunk.operations ?? [];
                set({
                  pendingOps: ops,
                  pendingMessageId: assistantId,
                  messages: current.messages.map((m) =>
                    m.id === assistantId
                      ? { ...m, operations: ops, content: accumulated }
                      : m,
                  ),
                });
                break;

              case 'error':
                set({
                  messages: current.messages.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: `❌ Error: ${chunk.error}`, streaming: false }
                      : m,
                  ),
                  isStreaming: false,
                });
                break;

              case 'done':
                set({
                  messages: current.messages.map((m) =>
                    m.id === assistantId ? { ...m, streaming: false } : m,
                  ),
                  isStreaming: false,
                });
                break;
            }
          }, abortController.signal);
        } catch (err) {
          const current = get();
          set({
            messages: current.messages.map((m) =>
              m.id === assistantId
                ? { ...m, content: `❌ ${(err as Error).message}`, streaming: false }
                : m,
            ),
            isStreaming: false,
          });
        }

        abortController = null;
      },

      cancelStream: () => {
        abortController?.abort();
        abortController = null;
        set({ isStreaming: false });
      },

      clearChat: () => {
        set({
          messages: [
            {
              id: 'welcome',
              role: 'system',
              content: '👋 Chat cleared. Ready for new prompts!',
              timestamp: Date.now(),
            },
          ],
          pendingOps: null,
          pendingMessageId: null,
          streamText: '',
        });
      },

      setMode: (mode) => set({ mode }),
      setShowSettings: (show) => set({ showSettings: show }),
      setInputValue: (value) => set({ inputValue: value }),

      updateProviderConfig: (partial) => {
        const current = get().providerConfig;
        const next = { ...current, ...partial };
        const provider = createProvider(next);
        saveProviderConfig(next);
        set({ providerConfig: next, provider });
      },

      acceptOperations: (messageId: string) => {
        const state = get();
        const msg = state.messages.find((m) => m.id === messageId);
        if (!msg?.operations) return;

        const editor = useEditorStore.getState();
        for (const op of msg.operations) {
          switch (op.type) {
            case 'add':
              editor.addElement(op.parentId ?? editor.spec.root, {
                type: op.elementType ?? 'Text',
                props: op.props ?? {},
              });
              break;
            case 'remove':
              if (op.elementId) editor.removeElement(op.elementId);
              break;
            case 'updateProps':
              if (op.elementId && op.updatedProps) {
                editor.setProps(op.elementId, op.updatedProps);
              }
              break;
            case 'move':
              if (op.elementId && op.newParentId !== undefined) {
                editor.moveElement(op.elementId, op.newParentId, op.index ?? 0);
              }
              break;
          }
        }

        set({
          messages: state.messages.map((m) =>
            m.id === messageId ? { ...m, applied: true } : m,
          ),
          pendingOps: null,
          pendingMessageId: null,
        });
      },

      rejectOperations: (messageId: string) => {
        const state = get();
        set({
          messages: state.messages.map((m) =>
            m.id === messageId
              ? { ...m, operations: undefined, content: `${m.content}\n\n*(Changes rejected)*` }
              : m,
          ),
          pendingOps: null,
          pendingMessageId: null,
        });
      },
    };
  }),
);
