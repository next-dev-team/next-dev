import { useEffect } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { ComponentPalette } from '@/components/ComponentPalette';
import { LayerTree } from '@/components/LayerTree';
import { Canvas } from '@/components/Canvas';
import { PropsPanel } from '@/components/PropsPanel';
import { AIChatPanel } from '@/components/AIChatPanel';
import { useEditorStore } from '@/store';

export function App() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const rightPanelTab = useEditorStore((s) => s.rightPanelTab);
  const setRightPanelTab = useEditorStore((s) => s.setRightPanelTab);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const state = useEditorStore.getState();

      if (state.pendingAiProposal) {
        if (e.key === 'Escape') {
          e.preventDefault();
          state.rejectAiProposal();
        }
        return;
      }

      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        state.undo();
      }

      if (ctrl && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        state.redo();
      }

      if (ctrl && e.key === 'c') {
        e.preventDefault();
        state.copy();
      }

      if (ctrl && e.key === 'x') {
        e.preventDefault();
        state.cut();
      }

      if (ctrl && e.key === 'v') {
        e.preventDefault();
        const parentId = state.selectedIds[0] ?? state.spec.root;
        state.paste(parentId);
      }

      if (ctrl && e.key === 'd') {
        e.preventDefault();
        if (state.selectedIds.length === 1) {
          state.duplicateElement(state.selectedIds[0]);
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        for (const id of [...state.selectedIds]) {
          state.removeElement(id);
        }
      }

      if (ctrl && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        if (state.selectedIds.length > 1) {
          state.groupElements(state.selectedIds);
        }
      }

      if (ctrl && e.key === 'g' && e.shiftKey) {
        e.preventDefault();
        if (state.selectedIds.length === 1) {
          state.ungroupElement(state.selectedIds[0]);
        }
      }

      if (e.key === 'Escape') {
        state.clearSelection();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="editor-layout">
      <Toolbar />

      <div className="editor-left-panel">
        <div className="panel-tabs">
          <button
            className="panel-tab"
            data-active={activePanel === 'palette'}
            onClick={() => setActivePanel('palette')}
          >
            Components
          </button>
          <button
            className="panel-tab"
            data-active={activePanel === 'layers'}
            onClick={() => setActivePanel('layers')}
          >
            Layers
          </button>
        </div>
        {activePanel === 'palette' ? <ComponentPalette /> : <LayerTree />}
      </div>

      <Canvas />

      <div className="editor-right-panel">
        <div className="panel-tabs">
          <button
            className="panel-tab"
            data-active={rightPanelTab === 'properties'}
            onClick={() => setRightPanelTab('properties')}
          >
            Properties
          </button>
          <button
            className="panel-tab"
            data-active={rightPanelTab === 'chat'}
            onClick={() => setRightPanelTab('chat')}
          >
            Chat
          </button>
        </div>
        {rightPanelTab === 'properties' ? <PropsPanel /> : <AIChatPanel />}
      </div>
    </div>
  );
}
