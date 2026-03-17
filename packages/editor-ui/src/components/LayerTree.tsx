import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '@/store';
import { catalog, type ComponentType } from '@next-dev/catalog';
import type { DesignSpec, Element } from '@next-dev/editor-core';
import * as Icons from 'lucide-react';
import {
  ChevronRight,
  ChevronDown,
  EyeOff,
  Lock,
} from 'lucide-react';
import type { LayerDragData, DropTargetData } from './DndContext';

function getIcon(iconName: string) {
  const IconComponent = (Icons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  >)[iconName];
  return IconComponent ?? Icons.Box;
}

// ─── Drop Gap Indicator ──────────────────────────────────────────────────────

/** A thin drop zone rendered between layer items for precise insertion */
function LayerDropGap({
  parentId,
  index,
  depth,
}: {
  parentId: string;
  index: number;
  depth: number;
}) {
  const dropData: DropTargetData = {
    target: 'layer-gap',
    elementId: parentId,
    index,
    acceptsChildren: true,
  };

  const { isOver, setNodeRef } = useDroppable({
    id: `layer-gap-${parentId}-${index}`,
    data: dropData,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        height: isOver ? '3px' : '2px',
        marginLeft: `${8 + depth * 16}px`,
        marginRight: '8px',
        background: isOver ? 'var(--color-accent, #7c3aed)' : 'transparent',
        borderRadius: '2px',
        transition: 'background 0.15s, height 0.15s',
      }}
    />
  );
}

// ─── Layer Node ──────────────────────────────────────────────────────────────

interface LayerNodeProps {
  elementId: string;
  spec: DesignSpec;
  depth: number;
  parentId: string;
  index: number;
}

function LayerNode({ elementId, spec, depth, parentId, index }: LayerNodeProps) {
  const element = spec.elements[elementId];
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);
  const setEditorMeta = useEditorStore((s) => s.document.setEditorMeta);
  const isDragging = useEditorStore((s) => s.isDragging);
  const isAiPreviewActive = useEditorStore((s) => Boolean(s.pendingAiProposal));

  if (!element) return null;

  const isSelected = selectedIds.includes(elementId);
  const isHovered = hoveredId === elementId;
  const isCollapsed = element.__editor?.collapsed ?? false;
  const isLocked = element.__editor?.locked ?? false;
  const isHidden = element.__editor?.hidden ?? false;
  const hasChildren = element.children.length > 0;
  const displayName = element.__editor?.name ?? element.type;
  const isRoot = elementId === spec.root;

  // Get the catalog icon
  const catalogEntry = catalog[element.type as ComponentType];
  const iconName = catalogEntry?.meta.icon ?? 'Box';
  const IconComp = getIcon(iconName);
  const acceptsChildren = catalogEntry?.meta.acceptsChildren ?? false;

  // Draggable (not for root)
  const dragData: LayerDragData = {
    source: 'layer',
    elementId,
  };

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragRef,
    isDragging: isThisDragging,
  } = useDraggable({
    id: `layer-drag-${elementId}`,
    data: dragData,
    disabled: isRoot || isLocked || isAiPreviewActive,
  });

  // Droppable (the element itself is a drop target)
  const dropData: DropTargetData = {
    target: 'layer-item',
    elementId,
    acceptsChildren,
  };

  const {
    isOver,
    setNodeRef: setDropRef,
  } = useDroppable({
    id: `layer-drop-${elementId}`,
    data: dropData,
  });

  // Combine refs
  const setRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  return (
    <>
      <div
        ref={setRef}
        className="layer-item"
        data-selected={isSelected}
        style={{
          paddingLeft: `${8 + depth * 16}px`,
          backgroundColor: isOver && acceptsChildren && isDragging
            ? 'var(--color-accent-dim, oklch(0.5 0.15 280 / 0.2))'
            : isHovered
              ? 'var(--color-hover-overlay)'
              : undefined,
          opacity: isThisDragging ? 0.35 : 1,
          outline: isOver && acceptsChildren && isDragging
            ? '1px solid var(--color-accent, #7c3aed)'
            : undefined,
          outlineOffset: '-1px',
          borderRadius: isOver && acceptsChildren && isDragging ? '4px' : undefined,
          cursor: isRoot ? 'default' : 'grab',
        }}
        onClick={(e) => {
          if (isAiPreviewActive) return;
          e.stopPropagation();
          select(elementId, e.shiftKey);
        }}
        onMouseEnter={() => {
          if (!isAiPreviewActive) hover(elementId);
        }}
        onMouseLeave={() => {
          if (!isAiPreviewActive) hover(null);
        }}
        {...(isRoot ? {} : dragListeners)}
        {...(isRoot ? {} : dragAttributes)}
      >
        {/* Collapse toggle */}
        {hasChildren ? (
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: isAiPreviewActive ? 'default' : 'pointer',
              padding: 0,
              color: 'inherit',
              display: 'flex',
            }}
            disabled={isAiPreviewActive}
            onClick={(e) => {
              if (isAiPreviewActive) return;
              e.stopPropagation();
              setEditorMeta(elementId, { collapsed: !isCollapsed });
            }}
          >
            {isCollapsed ? (
              <ChevronRight size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
          </button>
        ) : (
          <span className="layer-item-indent" />
        )}

        <IconComp size={14} className="layer-item-icon" />
        <span className="layer-item-name">{displayName}</span>

        {/* Status indicators */}
        {isLocked && <Lock size={10} style={{ opacity: 0.4 }} />}
        {isHidden && <EyeOff size={10} style={{ opacity: 0.4 }} />}
      </div>

      {/* Children (when expanded) */}
      {hasChildren && !isCollapsed && (
        <>
          {/* Gap before first child */}
          <LayerDropGap parentId={elementId} index={0} depth={depth + 1} />

          {element.children.map((childId, i) => (
            <div key={childId} style={{ display: 'contents' }}>
              <LayerNode
                elementId={childId}
                spec={spec}
                depth={depth + 1}
                parentId={elementId}
                index={i}
              />
              {/* Gap after each child */}
              <LayerDropGap parentId={elementId} index={i + 1} depth={depth + 1} />
            </div>
          ))}
        </>
      )}

      {/* If this accepts children but has none and is expanded, show a gap inside */}
      {acceptsChildren && !hasChildren && !isCollapsed && (
        <LayerDropGap parentId={elementId} index={0} depth={depth + 1} />
      )}
    </>
  );
}

export function LayerTree() {
  const spec = useEditorStore((s) => s.previewSpec ?? s.spec);
  const isAiPreviewActive = useEditorStore((s) => Boolean(s.pendingAiProposal));

  return (
    <div className="layer-tree">
      {isAiPreviewActive && (
        <div className="panel-readonly-note">
          Preview mode is active. Accept or reject the AI changes in chat before rearranging layers.
        </div>
      )}
      <LayerNode
        elementId={spec.root}
        spec={spec}
        depth={0}
        parentId=""
        index={0}
      />
    </div>
  );
}
