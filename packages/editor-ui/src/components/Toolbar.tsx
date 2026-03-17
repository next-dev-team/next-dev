import {
  Undo2,
  Redo2,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Group,
  Ungroup,
  Layers,
} from 'lucide-react';
import { useEditorStore } from '@/store';

export function Toolbar() {
  const canUndo = useEditorStore((s) => s.canUndo);
  const canRedo = useEditorStore((s) => s.canRedo);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copy = useEditorStore((s) => s.copy);
  const cut = useEditorStore((s) => s.cut);
  const removeElement = useEditorStore((s) => s.removeElement);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const groupElements = useEditorStore((s) => s.groupElements);
  const ungroupElement = useEditorStore((s) => s.ungroupElement);
  const hasAiPreview = useEditorStore((s) => Boolean(s.pendingAiProposal));

  const hasSelection = selectedIds.length > 0;
  const hasMultiSelection = selectedIds.length > 1;

  return (
    <div className="editor-toolbar">
      <div className="toolbar-title">
        <Layers className="toolbar-title-icon" />
        DesignForge
      </div>

      {/* History */}
      <button
        className="toolbar-btn"
        disabled={!canUndo || hasAiPreview}
        onClick={undo}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={16} />
      </button>
      <button
        className="toolbar-btn"
        disabled={!canRedo || hasAiPreview}
        onClick={redo}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Clipboard */}
      <button
        className="toolbar-btn"
        disabled={!hasSelection || hasAiPreview}
        onClick={copy}
        title="Copy (Ctrl+C)"
      >
        <Copy size={16} />
      </button>
      <button
        className="toolbar-btn"
        disabled={!hasSelection || hasAiPreview}
        onClick={cut}
        title="Cut (Ctrl+X)"
      >
        <Scissors size={16} />
      </button>
      <button
        className="toolbar-btn"
        disabled={hasAiPreview}
        title="Paste (Ctrl+V)"
      >
        <Clipboard size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Element actions */}
      <button
        className="toolbar-btn"
        disabled={!hasSelection || hasAiPreview}
        onClick={() => {
          if (selectedIds.length === 1) {
            duplicateElement(selectedIds[0]);
          }
        }}
        title="Duplicate (Ctrl+D)"
      >
        <Copy size={16} />
      </button>
      <button
        className="toolbar-btn"
        disabled={!hasMultiSelection || hasAiPreview}
        onClick={() => groupElements(selectedIds)}
        title="Group (Ctrl+G)"
      >
        <Group size={16} />
      </button>
      <button
        className="toolbar-btn"
        disabled={!hasSelection || hasAiPreview}
        onClick={() => {
          if (selectedIds.length === 1) {
            ungroupElement(selectedIds[0]);
          }
        }}
        title="Ungroup (Ctrl+Shift+G)"
      >
        <Ungroup size={16} />
      </button>
      <button
        className="toolbar-btn"
        disabled={!hasSelection || hasAiPreview}
        onClick={() => {
          for (const id of selectedIds) {
            removeElement(id);
          }
        }}
        title="Delete (Del)"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
