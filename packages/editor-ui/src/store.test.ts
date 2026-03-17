import { createEmptySpec } from '@next-dev/editor-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useEditorStore } from './store';
import { MockAIService, setAIService, type AIService } from '@/services/ai';

function resetStore() {
  useEditorStore.getState().loadSpec(createEmptySpec());
}

describe('editor store AI preview flow', () => {
  beforeEach(() => {
    resetStore();
    setAIService(new MockAIService());
  });

  afterEach(() => {
    resetStore();
    setAIService(new MockAIService());
  });

  it('stages AI operations in preview without mutating the live spec', async () => {
    const rootId = useEditorStore.getState().spec.root;

    const aiService: AIService = {
      async generateOperations() {
        return {
          description: 'Added a checkbox to the form.',
          operations: [
            {
              type: 'add',
              parentId: rootId,
              elementType: 'Checkbox',
              props: {
                checked: true,
                disabled: false,
                className: null,
              },
            },
          ],
        };
      },
    };

    setAIService(aiService);

    await useEditorStore.getState().sendAiPrompt('Add a checkbox');

    const state = useEditorStore.getState();
    expect(state.isAiWorking).toBe(false);
    expect(state.pendingAiProposal?.description).toBe('Added a checkbox to the form.');
    expect(state.spec.elements[rootId].children).toHaveLength(0);
    expect(state.previewSpec).not.toBeNull();
    expect(state.previewSpec?.elements[state.previewSpec.root].children).toHaveLength(1);

    const previewChildId = state.previewSpec!.elements[state.previewSpec!.root].children[0];
    expect(state.previewSpec?.elements[previewChildId].type).toBe('Checkbox');
    expect(state.rightPanelTab).toBe('chat');
  });

  it('accepts a pending AI proposal into the live document', async () => {
    const rootId = useEditorStore.getState().spec.root;

    setAIService({
      async generateOperations() {
        return {
          description: 'Added a textarea.',
          operations: [
            {
              type: 'add',
              parentId: rootId,
              elementType: 'Textarea',
              props: {
                placeholder: 'Notes',
                disabled: false,
                numberOfLines: 5,
                className: null,
              },
            },
          ],
        };
      },
    });

    await useEditorStore.getState().sendAiPrompt('Add a textarea');
    useEditorStore.getState().acceptAiProposal();

    const state = useEditorStore.getState();
    expect(state.pendingAiProposal).toBeNull();
    expect(state.previewSpec).toBeNull();
    expect(state.spec.elements[rootId].children).toHaveLength(1);

    const childId = state.spec.elements[rootId].children[0];
    expect(state.spec.elements[childId].type).toBe('Textarea');
    expect(state.chatMessages.at(-1)?.content).toBe(
      'Applied AI preview to the live document.',
    );
  });

  it('rejects a pending AI proposal without touching the live document', async () => {
    const rootId = useEditorStore.getState().spec.root;

    setAIService({
      async generateOperations() {
        return {
          description: 'Added a switch.',
          operations: [
            {
              type: 'add',
              parentId: rootId,
              elementType: 'Switch',
              props: {
                checked: true,
                disabled: false,
                className: null,
              },
            },
          ],
        };
      },
    });

    await useEditorStore.getState().sendAiPrompt('Add a switch');
    useEditorStore.getState().rejectAiProposal();

    const state = useEditorStore.getState();
    expect(state.pendingAiProposal).toBeNull();
    expect(state.previewSpec).toBeNull();
    expect(state.spec.elements[rootId].children).toHaveLength(0);
    expect(state.chatMessages.at(-1)?.content).toBe(
      'Discarded the pending AI preview.',
    );
  });

  it('blocks direct document edits while a preview is pending', async () => {
    const rootId = useEditorStore.getState().spec.root;

    setAIService({
      async generateOperations() {
        return {
          description: 'Added a popover.',
          operations: [
            {
              type: 'add',
              parentId: rootId,
              elementType: 'Popover',
              props: { open: false },
            },
          ],
        };
      },
    });

    await useEditorStore.getState().sendAiPrompt('Add a popover');

    useEditorStore.getState().addElement(rootId, {
      type: 'Button',
      props: { children: 'Manual add' },
    });

    const state = useEditorStore.getState();
    expect(state.pendingAiProposal).not.toBeNull();
    expect(state.spec.elements[rootId].children).toHaveLength(0);
    expect(state.previewSpec?.elements[state.previewSpec.root].children).toHaveLength(1);
  });
});
