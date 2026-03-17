import { useDraggable } from '@dnd-kit/core';
import { useEditorStore } from '@/store';
import { catalog, getCategorizedComponents, type ComponentType } from '@next-dev/catalog';
import * as Icons from 'lucide-react';
import type { PaletteDragData } from './DndContext';

/** Map icon names from catalog to lucide-react components */
function getIcon(iconName: string) {
  const IconComponent = (Icons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  >)[iconName];
  return IconComponent ?? Icons.Box;
}

/** Draggable palette item */
function PaletteItem({ type }: { type: ComponentType }) {
  const entry = catalog[type];
  const addElement = useEditorStore((s) => s.addElement);
  const rootId = useEditorStore((s) => s.spec.root);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const spec = useEditorStore((s) => s.spec);
  const isAiPreviewActive = useEditorStore((s) => Boolean(s.pendingAiProposal));

  const dragData: PaletteDragData = {
    source: 'palette',
    type,
    entry,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: dragData,
    disabled: isAiPreviewActive,
  });

  const IconComp = getIcon(entry.meta.icon);

  const handleClick = () => {
    if (isAiPreviewActive) return;
    // Add to selected parent, or root
    const parentId = selectedIds.length === 1 ? selectedIds[0] : rootId;

    // If the selected element accepts children, add inside it; otherwise add as sibling
    const selectedElement = spec.elements[parentId];
    const targetParentId =
      selectedElement && entry.meta.acceptsChildren
        ? parentId
        : rootId;

    addElement(targetParentId, {
      type,
      props: { ...entry.meta.defaultProps },
      __editor: {
        name: type,
      },
    });
  };

  return (
    <button
      ref={setNodeRef}
      className="palette-item"
      onClick={handleClick}
      title={entry.description}
      disabled={isAiPreviewActive}
      style={{
        opacity: isDragging ? 0.4 : isAiPreviewActive ? 0.45 : 1,
        cursor: isAiPreviewActive ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
      }}
      {...listeners}
      {...attributes}
    >
      <IconComp size={20} className="palette-item-icon" />
      <span className="palette-item-label">{type}</span>
    </button>
  );
}

export function ComponentPalette() {
  const categories = getCategorizedComponents();
  const isAiPreviewActive = useEditorStore((s) => Boolean(s.pendingAiProposal));

  return (
    <div className="palette-grid">
      {isAiPreviewActive && (
        <div className="panel-readonly-note">
          Preview mode is active. Accept or reject the AI changes in chat before editing.
        </div>
      )}
      {Object.entries(categories).map(([category, components]) => {
        if (components.length === 0) return null;
        return (
          <div key={category} style={{ display: 'contents' }}>
            <div className="palette-category">
              {category}
            </div>
            {components.map(([type]) => (
              <PaletteItem key={type} type={type} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
