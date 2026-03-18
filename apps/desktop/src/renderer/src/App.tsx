import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/store';
import { ChatPanel } from '@/ChatPanel';
import { catalog, getCategorizedComponents, type ComponentType } from '@next-dev/catalog';
import type { DesignSpec } from '@next-dev/editor-core';
import { renderers } from '@next-dev/json-render';
import { SettingsPage } from '@/SettingsPage';
import { useSettingsStore } from '@/settings-store';
import * as Icons from 'lucide-react';
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
  FolderOpen,
  Save,
  FilePlus,
  ChevronRight,
  ChevronDown,
  Lock,
  EyeOff,
  MousePointer,
  Box,
  Settings,
  Eye,
  Pencil,
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shield,
} from 'lucide-react';
import { z } from 'zod';

// ─── Drag & Drop Context ──────────────────────────────────────────────────

interface DragState {
  isDragging: boolean;
  dragType: ComponentType | null;
}

const DragContext = createContext<{
  state: DragState;
  setDragging: (type: ComponentType | null) => void;
}>({
  state: { isDragging: false, dragType: null },
  setDragging: () => {},
});

function DragProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DragState>({ isDragging: false, dragType: null });

  const setDragging = useCallback((type: ComponentType | null) => {
    setState(type ? { isDragging: true, dragType: type } : { isDragging: false, dragType: null });
  }, []);

  return (
    <DragContext.Provider value={{ state, setDragging }}>
      {children}
    </DragContext.Provider>
  );
}

const DRAG_DATA_KEY = 'application/x-designforge-component';

interface LiveMutationOperation {
  type: 'add' | 'remove' | 'move' | 'updateProps' | 'duplicate' | 'group' | 'ungroup';
  parentId?: string;
  elementType?: string;
  props?: Record<string, unknown>;
  index?: number;
  elementId?: string;
  newParentId?: string;
  elementIds?: string[];
}

type LiveMutation =
  | { kind: 'applyOperations'; operations: LiveMutationOperation[] }
  | { kind: 'replaceSpec'; spec: DesignSpec }
  | { kind: 'undo' }
  | { kind: 'redo' }
  | { kind: 'setSelection'; selectedIds: string[] };

interface LiveMutationRequest {
  requestId: string;
  channelId: string;
  mutation: LiveMutation;
}

function getLiveContextSnapshot() {
  const state = useEditorStore.getState();
  return {
    filePath: state.filePath,
    spec: state.spec,
    selectedIds: state.selectedIds,
    hoveredId: state.hoveredId,
    zoom: state.zoom,
    pan: [0, 0] as [number, number],
  };
}

function applyLiveMutationRequest(request: LiveMutationRequest): {
  success: boolean;
  error?: string;
  context?: ReturnType<typeof getLiveContextSnapshot>;
} {
  try {
    const editor = useEditorStore.getState();
    const resolveLiveNodeId = (id: string | undefined) => (id === '_root' ? editor.spec.root : id);

    switch (request.mutation.kind) {
      case 'applyOperations':
        for (const operation of request.mutation.operations) {
          switch (operation.type) {
            case 'add':
              editor.addElement(
                resolveLiveNodeId(operation.parentId) ?? editor.spec.root,
                {
                  type: operation.elementType ?? 'Text',
                  props: operation.props ?? {},
                },
                operation.index,
              );
              break;
            case 'remove':
              if (resolveLiveNodeId(operation.elementId)) {
                editor.removeElement(resolveLiveNodeId(operation.elementId)!);
              }
              break;
            case 'move':
              if (resolveLiveNodeId(operation.elementId) && resolveLiveNodeId(operation.newParentId) !== undefined) {
                editor.moveElement(
                  resolveLiveNodeId(operation.elementId)!,
                  resolveLiveNodeId(operation.newParentId)!,
                  operation.index ?? 0,
                );
              }
              break;
            case 'updateProps':
              if (resolveLiveNodeId(operation.elementId) && operation.props) {
                editor.setProps(resolveLiveNodeId(operation.elementId)!, operation.props);
              }
              break;
            case 'duplicate':
              if (resolveLiveNodeId(operation.elementId)) {
                editor.duplicateElement(resolveLiveNodeId(operation.elementId)!);
              }
              break;
            case 'group':
              if (operation.elementIds && operation.elementIds.length > 1) {
                editor.groupElements(operation.elementIds.map((id) => resolveLiveNodeId(id) ?? id));
              }
              break;
            case 'ungroup':
              if (resolveLiveNodeId(operation.elementId)) {
                editor.ungroupElement(resolveLiveNodeId(operation.elementId)!);
              }
              break;
          }
        }
        break;
      case 'replaceSpec':
        editor.loadSpec(request.mutation.spec);
        break;
      case 'undo':
        editor.undo();
        break;
      case 'redo':
        editor.redo();
        break;
      case 'setSelection': {
        const nextState = useEditorStore.getState();
        const selectedIds = request.mutation.selectedIds.filter((id) => id in nextState.spec.elements);
        nextState.document.selection.selectAll(selectedIds);
        break;
      }
    }

    return {
      success: true,
      context: getLiveContextSnapshot(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ─── Titlebar ─────────────────────────────────────────────────────────────

function Titlebar() {
  const filePath = useEditorStore((s) => s.filePath);
  const isDirty = useEditorStore((s) => s.isDirty);

  const filename = filePath?.split(/[\\/]/).pop() ?? 'Untitled';

  return (
    <div className="titlebar">
      DesignForge
      <span className="titlebar-file">
        — {filename}{isDirty ? ' •' : ''}
      </span>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────

function Toolbar() {
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
  const newFile = useEditorStore((s) => s.newFile);
  const openFile = useEditorStore((s) => s.openFile);
  const saveFile = useEditorStore((s) => s.saveFile);
  const openSettings = useSettingsStore((s) => s.openSettings);
  const isPreviewMode = useEditorStore((s) => s.isPreviewMode);
  const togglePreview = useEditorStore((s) => s.togglePreviewMode);

  const hasSelection = selectedIds.length > 0;
  const hasMultiSelection = selectedIds.length > 1;

  return (
    <div className="editor-toolbar">
      <div className="toolbar-title">
        <Layers className="toolbar-title-icon" />
        DesignForge
      </div>

      {/* File actions */}
      <div className="file-actions">
        <button type="button" className="file-btn" onClick={newFile} title="New (Ctrl+N)">
          <FilePlus size={14} /> New
        </button>
        <button type="button" className="file-btn" onClick={openFile} title="Open (Ctrl+O)">
          <FolderOpen size={14} /> Open
        </button>
        <button type="button" className="file-btn" onClick={saveFile} title="Save (Ctrl+S)">
          <Save size={14} /> Save
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Preview / Editor mode toggle */}
      <button
        type="button"
        className={`toolbar-btn preview-mode-toggle ${isPreviewMode ? 'preview-mode-active' : ''}`}
        onClick={togglePreview}
        title={isPreviewMode ? 'Switch to Editor (Ctrl+P)' : 'Switch to Preview (Ctrl+P)'}
      >
        {isPreviewMode ? <Pencil size={16} /> : <Eye size={16} />}
      </button>

      <div className="toolbar-separator" />

      {/* Settings */}
      <button type="button" className="toolbar-btn" onClick={() => openSettings()} title="Settings (Ctrl+,)">
        <Settings size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* History */}
      <button type="button" className="toolbar-btn" disabled={!canUndo || isPreviewMode} onClick={undo} title="Undo (Ctrl+Z)">
        <Undo2 size={16} />
      </button>
      <button type="button" className="toolbar-btn" disabled={!canRedo || isPreviewMode} onClick={redo} title="Redo (Ctrl+Shift+Z)">
        <Redo2 size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Clipboard */}
      <button type="button" className="toolbar-btn" disabled={!hasSelection || isPreviewMode} onClick={copy} title="Copy">
        <Copy size={16} />
      </button>
      <button type="button" className="toolbar-btn" disabled={!hasSelection || isPreviewMode} onClick={cut} title="Cut">
        <Scissors size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Element actions */}
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasSelection || isPreviewMode}
        onClick={() => {
          if (selectedIds.length === 1) duplicateElement(selectedIds[0]);
        }}
        title="Duplicate"
      >
        <Copy size={16} />
      </button>
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasMultiSelection || isPreviewMode}
        onClick={() => groupElements(selectedIds)}
        title="Group"
      >
        <Group size={16} />
      </button>
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasSelection || isPreviewMode}
        onClick={() => {
          if (selectedIds.length === 1) ungroupElement(selectedIds[0]);
        }}
        title="Ungroup"
      >
        <Ungroup size={16} />
      </button>
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasSelection || isPreviewMode}
        onClick={() => {
          for (const id of selectedIds) removeElement(id);
        }}
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// ─── Component Palette ────────────────────────────────────────────────────

function getIcon(iconName: string) {
  const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
  return IconComponent ?? Icons.Box;
}

function ComponentPalette() {
  const addElement = useEditorStore((s) => s.addElement);
  const rootId = useEditorStore((s) => s.spec.root);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const spec = useEditorStore((s) => s.spec);
  const categories = getCategorizedComponents();
  const { setDragging } = useContext(DragContext);
  const ghostRef = useRef<HTMLDivElement>(null);

  const handleAdd = (type: ComponentType) => {
    const entry = catalog[type];
    if (!entry) return;
    const parentId = selectedIds.length === 1 ? selectedIds[0] : rootId;
    const selectedElement = spec.elements[parentId];
    const targetParentId = selectedElement ? parentId : rootId;

    addElement(targetParentId, {
      type,
      props: { ...entry.meta.defaultProps },
      __editor: { name: type },
    });
  };

  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData(DRAG_DATA_KEY, type);
    e.dataTransfer.effectAllowed = 'copy';
    setDragging(type);

    // Create a custom drag ghost
    if (ghostRef.current) {
      const ghost = ghostRef.current;
      ghost.textContent = '';

      // Render a mini preview into the ghost
      const icon = document.createElement('span');
      icon.textContent = '⊕';
      icon.style.cssText = 'font-size: 16px; margin-right: 6px;';
      const label = document.createElement('span');
      label.textContent = type;
      ghost.appendChild(icon);
      ghost.appendChild(label);
      ghost.style.display = 'flex';

      e.dataTransfer.setDragImage(ghost, 24, 18);

      // Hide ghost after the browser captures it
      requestAnimationFrame(() => {
        ghost.style.display = 'none';
      });
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  return (
    <>
      {/* Off-screen drag ghost element */}
      <div
        ref={ghostRef}
        className="drag-ghost"
        style={{ display: 'none' }}
      />
      <div className="palette-grid">
        {Object.entries(categories).map(([category, components]) => {
          if (components.length === 0) return null;
          return (
            <div key={category} style={{ display: 'contents' }}>
              <div className="palette-category">{category}</div>
              {components.map(([type, entry]) => {
                const IconComp = getIcon(entry.meta.icon);
                return (
                  <button
                    type="button"
                    key={type}
                    className="palette-item"
                    draggable
                    onClick={() => handleAdd(type)}
                    onDragStart={(e) => handleDragStart(e, type)}
                    onDragEnd={handleDragEnd}
                    title={`${entry.description}\nDrag to canvas or click to add`}
                  >
                    <IconComp size={20} className="palette-item-icon" />
                    <span className="palette-item-label">{type}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Layer Tree ───────────────────────────────────────────────────────────

function LayerNode({ elementId, spec, depth }: { elementId: string; spec: DesignSpec; depth: number }) {
  const element = spec.elements[elementId];
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);

  if (!element) return null;

  const childIds = Array.isArray(element.children) ? element.children : [];
  const isSelected = selectedIds.includes(elementId);
  const isHovered = hoveredId === elementId;
  const hasChildren = childIds.length > 0;
  const displayName = element.__editor?.name ?? element.type;
  const isCollapsed = element.__editor?.collapsed ?? false;
  const isLocked = element.__editor?.locked ?? false;
  const isHidden = element.__editor?.hidden ?? false;

  const catalogEntry = catalog[element.type as ComponentType];
  const iconName = catalogEntry?.meta.icon ?? 'Box';
  const IconComp = getIcon(iconName);

  return (
    <>
      <div
        className="layer-item"
        data-selected={isSelected}
        style={{
          paddingLeft: `${8 + depth * 16}px`,
          backgroundColor: isHovered ? 'var(--color-hover-overlay)' : undefined,
        }}
        onClick={(e) => select(elementId, e.shiftKey)}
        onKeyDown={() => {}}
        role="treeitem"
        tabIndex={0}
        onMouseEnter={() => hover(elementId)}
        onMouseLeave={() => hover(null)}
      >
        {hasChildren ? (
          isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />
        ) : (
          <span className="layer-item-indent" />
        )}
        <IconComp size={14} className="layer-item-icon" />
        <span className="layer-item-name">{displayName}</span>
        {isLocked && <Lock size={10} style={{ opacity: 0.4 }} />}
        {isHidden && <EyeOff size={10} style={{ opacity: 0.4 }} />}
      </div>
      {hasChildren && !isCollapsed &&
        childIds.map((childId) => (
          <LayerNode key={childId} elementId={childId} spec={spec} depth={depth + 1} />
        ))}
    </>
  );
}

function LayerTree() {
  const spec = useEditorStore((s) => s.spec);
  return (
    <div className="layer-tree">
      <LayerNode elementId={spec.root} spec={spec} depth={0} />
    </div>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────

// Context to track which element is currently being inline-edited
const EditingContext = createContext<{
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}>({
  editingId: null,
  setEditingId: () => {},
});

function CanvasNode({ elementId, spec, isPreview }: { elementId: string; spec: DesignSpec; isPreview?: boolean }) {
  const element = spec.elements[elementId];
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);
  const setProps = useEditorStore((s) => s.setProps);
  const addElement = useEditorStore((s) => s.addElement);
  const { state: dragState } = useContext(DragContext);
  const { editingId, setEditingId } = useContext(EditingContext);
  const [isDropTarget, setIsDropTarget] = useState(false);

  if (!element || element.__editor?.hidden) return null;

  const childIds = Array.isArray(element.children) ? element.children : [];
  const isSelected = !isPreview && selectedIds.includes(elementId);
  const isHovered = !isPreview && hoveredId === elementId;
  const isEditing = !isPreview && editingId === elementId;
  const children = childIds.map((cid) => <CanvasNode key={cid} elementId={cid} spec={spec} isPreview={isPreview} />);

  const renderElement = () => {
    const props = element.props ?? {};
    const ctx = {
      scale: 1,
      interactive: !isPreview,
      onPropsChange: !isPreview ? (newProps: Record<string, unknown>) => {
        setProps(elementId, newProps);
      } : undefined,
      isEditing,
      onStartEdit: !isPreview ? () => {
        setEditingId(elementId);
      } : undefined,
    };
    const renderer = renderers[element.type];
    if (renderer) {
      return renderer(props, children, ctx);
    }
    return <div style={{ padding: '12px', border: '1px dashed var(--color-border-default)', borderRadius: '6px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>{element.type}{children}</div>;
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isPreview) return;
    if (!e.dataTransfer.types.includes(DRAG_DATA_KEY)) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
    const componentType = e.dataTransfer.getData(DRAG_DATA_KEY) as ComponentType;
    if (!componentType) return;
    const entry = catalog[componentType];
    if (!entry) return;
    addElement(elementId, {
      type: componentType,
      props: { ...entry.meta.defaultProps },
      __editor: { name: componentType },
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    // If we're editing this element, don't re-select (let contentEditable handle clicks)
    if (isEditing) return;
    // Exit any other editing if clicking a different element
    if (editingId && editingId !== elementId) {
      setEditingId(null);
    }
    select(elementId, e.shiftKey);
  };

  return (
    <div
      className="canvas-element"
      data-selected={isSelected}
      data-hovered={isHovered && !isSelected}
      data-drop-target={!isPreview && isDropTarget}
      data-drag-active={!isPreview && dragState.isDragging}
      data-preview={isPreview}
      data-editing={isEditing}
      onClick={isPreview ? undefined : handleClick}
      onKeyDown={isPreview ? undefined : () => {}}
      role={isPreview ? undefined : 'treeitem'}
      tabIndex={isPreview ? undefined : 0}
      onMouseEnter={isPreview ? undefined : (e) => { e.stopPropagation(); hover(elementId); }}
      onMouseLeave={isPreview ? undefined : (e) => { e.stopPropagation(); hover(null); }}
      onDragOver={isPreview ? undefined : handleDragOver}
      onDragLeave={isPreview ? undefined : handleDragLeave}
      onDrop={isPreview ? undefined : handleDrop}
    >
      {renderElement()}
    </div>
  );
}

function Canvas() {
  const spec = useEditorStore((s) => s.spec);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const addElement = useEditorStore((s) => s.addElement);
  const zoom = useEditorStore((s) => s.zoom);
  const isPreviewMode = useEditorStore((s) => s.isPreviewMode);
  const filePath = useEditorStore((s) => s.filePath);
  const { state: dragState } = useContext(DragContext);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Clear editing state when entering preview mode
  useEffect(() => {
    if (isPreviewMode) setEditingId(null);
  }, [isPreviewMode]);

  const handleDragOver = (e: React.DragEvent) => {
    if (isPreviewMode) return;
    if (!e.dataTransfer.types.includes(DRAG_DATA_KEY)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDropTarget(true);
  };

  const handleDragLeave = () => {
    if (isPreviewMode) return;
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isPreviewMode) return;
    e.preventDefault();
    setIsDropTarget(false);
    const componentType = e.dataTransfer.getData(DRAG_DATA_KEY) as ComponentType;
    if (!componentType) return;
    const entry = catalog[componentType];
    if (!entry) return;
    addElement(spec.root, {
      type: componentType,
      props: { ...entry.meta.defaultProps },
      __editor: { name: componentType },
    });
  };

  const handleCanvasClick = () => {
    if (isPreviewMode) return;
    setEditingId(null);
    clearSelection();
  };

  const displayUrl = filePath
    ? `designforge://localhost/${filePath.split(/[\\/]/).pop()}`
    : 'designforge://localhost/untitled';

  return (
    <EditingContext.Provider value={{ editingId, setEditingId }}>
      <div
        className="editor-canvas"
        data-drop-target={!isPreviewMode && isDropTarget}
        data-drag-active={!isPreviewMode && dragState.isDragging}
        data-preview-mode={isPreviewMode}
        onClick={isPreviewMode ? undefined : handleCanvasClick}
        onKeyDown={isPreviewMode ? undefined : () => {}}
        role="presentation"
        tabIndex={-1}
        onDragOver={isPreviewMode ? undefined : handleDragOver}
        onDragLeave={isPreviewMode ? undefined : handleDragLeave}
        onDrop={isPreviewMode ? undefined : handleDrop}
      >
        <div
          className={`canvas-frame ${isPreviewMode ? 'canvas-frame--preview' : ''}`}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Browser-like chrome in preview mode */}
          {isPreviewMode && (
            <div className="browser-chrome">
              <div className="browser-chrome-dots">
                <span className="browser-dot browser-dot--close" />
                <span className="browser-dot browser-dot--minimize" />
                <span className="browser-dot browser-dot--maximize" />
              </div>
              <div className="browser-chrome-nav">
                <button type="button" className="browser-nav-btn" disabled><ArrowLeft size={13} /></button>
                <button type="button" className="browser-nav-btn" disabled><ArrowRight size={13} /></button>
                <button type="button" className="browser-nav-btn" disabled><RotateCw size={13} /></button>
              </div>
              <div className="browser-address-bar">
                <Shield size={12} className="browser-address-icon" />
                <span className="browser-address-text">{displayUrl}</span>
              </div>
            </div>
          )}
          <div className="canvas-frame-content">
            <CanvasNode elementId={spec.root} spec={spec} isPreview={isPreviewMode} />
          </div>
        </div>
      </div>
    </EditingContext.Provider>
  );
}

// ─── Props Panel ──────────────────────────────────────────────────────────

function PropsPanel() {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const spec = useEditorStore((s) => s.spec);
  const setProps = useEditorStore((s) => s.setProps);

  if (selectedIds.length === 0) {
    return <div className="empty-state"><MousePointer className="empty-state-icon" /><p className="empty-state-text">Select an element to edit properties</p></div>;
  }
  if (selectedIds.length > 1) {
    return <div className="empty-state"><Box className="empty-state-icon" /><p className="empty-state-text">{selectedIds.length} elements selected</p></div>;
  }

  const elementId = selectedIds[0];
  const element = spec.elements[elementId];
  if (!element) return null;

  const catalogEntry = catalog[element.type as ComponentType];
  const schema = catalogEntry?.schema;

  return (
    <div className="props-panel animate-fade-in">
      <div className="props-section">
        <div className="props-section-title">Element</div>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{element.__editor?.name ?? element.type}</div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Type: {element.type} · ID: {elementId.slice(0, 8)}…</div>
      </div>
      <div className="props-section">
        <div className="props-section-title">Properties</div>
        {schema
          ? Object.entries(schema.shape).map(([key, field]) => (
              <SchemaField key={key} fieldKey={key} field={field as z.ZodType} value={element.props[key]} onChange={(k, v) => setProps(elementId, { [k]: v })} />
            ))
          : Object.entries(element.props).map(([key, value]) => (
              <div key={key} className="props-field">
                <label className="props-label" htmlFor={`prop-${key}`}>{key}</label>
                <input id={`prop-${key}`} className="props-input" value={String(value ?? '')} onChange={(e) => setProps(elementId, { [key]: e.target.value })} />
              </div>
            ))}
      </div>
    </div>
  );
}

function SchemaField({ fieldKey, field, value, onChange }: { fieldKey: string; field: z.ZodType; value: unknown; onChange: (key: string, value: unknown) => void }) {
  let inner = field;
  while (inner instanceof z.ZodDefault || inner instanceof z.ZodNullable) {
    inner = inner.unwrap() as z.ZodType;
  }

  const id = `prop-${fieldKey}`;

  if (inner instanceof z.ZodEnum) {
    return (
      <div className="props-field">
        <label className="props-label" htmlFor={id}>{fieldKey}</label>
        <select id={id} className="props-select" value={String(value ?? '')} onChange={(e) => onChange(fieldKey, e.target.value)}>
          {(inner.options as string[]).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
  }
  if (inner instanceof z.ZodBoolean) {
    return (
      <div className="props-field">
        <div className="props-checkbox-row">
          <input id={id} type="checkbox" className="props-checkbox" checked={Boolean(value)} onChange={(e) => onChange(fieldKey, e.target.checked)} />
          <label className="props-label" htmlFor={id}>{fieldKey}</label>
        </div>
      </div>
    );
  }
  if (inner instanceof z.ZodNumber) {
    return (
      <div className="props-field">
        <label className="props-label" htmlFor={id}>{fieldKey}</label>
        <input id={id} type="number" className="props-input" value={Number(value ?? 0)} onChange={(e) => onChange(fieldKey, Number(e.target.value))} />
      </div>
    );
  }
  return (
    <div className="props-field">
      <label className="props-label" htmlFor={id}>{fieldKey}</label>
      <input id={id} className="props-input" value={String(value ?? '')} onChange={(e) => onChange(fieldKey, e.target.value)} />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────

export function App() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const [rightTab, setRightTab] = useState<'properties' | 'chat'>('chat');

  // ─── Live MCP File Watcher ───────────────────────────────────────────
  // Listens for spec changes pushed from the main process file watcher.
  // When an external MCP agent edits via --file mode, the canvas updates live.
  useEffect(() => {
    const api = (window as unknown as { designforge?: { watch?: { onSpecChanged: (cb: (spec: DesignSpec) => void) => () => void } } }).designforge;
    if (!api?.watch?.onSpecChanged) return;

    const unsubscribe = api.watch.onSpecChanged((spec: DesignSpec) => {
      useEditorStore.getState().loadSpec(spec);
    });
    return unsubscribe;
  }, []);

  // Publish the live editor context so external MCP clients can join the desktop channel.
  useEffect(() => {
    const api = (window as unknown as {
      designforge?: {
        mcp?: {
          publishContext: (snapshot: {
            filePath: string | null;
            spec: DesignSpec;
            selectedIds: string[];
            hoveredId: string | null;
            zoom: number;
            pan: [number, number];
          }) => Promise<unknown>;
        };
      };
    }).designforge;

    if (!api?.mcp?.publishContext) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const publish = () => {
      const state = useEditorStore.getState();
      void api.mcp!.publishContext({
        filePath: state.filePath,
        spec: state.spec,
        selectedIds: state.selectedIds,
        hoveredId: state.hoveredId,
        zoom: state.zoom,
        pan: [0, 0],
      }).catch((error) => {
        console.warn('[MCP] Failed to publish live context', error);
      });
    };

    const schedulePublish = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        publish();
      }, 50);
    };

    const unsubscribe = useEditorStore.subscribe(
      (state) => ({
        spec: state.spec,
        selectedIds: state.selectedIds,
        hoveredId: state.hoveredId,
        zoom: state.zoom,
        filePath: state.filePath,
      }),
      schedulePublish,
    );

    schedulePublish();

    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Apply live mutation requests coming from the spawned MCP server.
  useEffect(() => {
    const api = (window as unknown as {
      designforge?: {
        mcp?: {
          onApplyLiveMutation: (cb: (request: LiveMutationRequest) => void) => () => void;
          respondMutationResult: (
            requestId: string,
            result: {
              success: boolean;
              error?: string;
              context?: ReturnType<typeof getLiveContextSnapshot>;
            },
          ) => Promise<unknown>;
        };
      };
    }).designforge;

    if (!api?.mcp?.onApplyLiveMutation || !api?.mcp?.respondMutationResult) return;

    const unsubscribe = api.mcp.onApplyLiveMutation((request) => {
      const result = applyLiveMutationRequest(request);
      void api.mcp!.respondMutationResult(request.requestId, result).catch((error) => {
        console.warn('[MCP] Failed to acknowledge live mutation', error);
      });
    });

    return unsubscribe;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // Check if focus is on a text-editable element (input, textarea, contenteditable).
      // If so, let the browser handle clipboard/delete shortcuts natively so text
      // copy-paste works in inputs, the chat panel, etc.
      const target = e.target as HTMLElement;
      const isTextEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;

      if (ctrl && e.key === 'z' && !e.shiftKey && !isTextEditable) { e.preventDefault(); useEditorStore.getState().undo(); }
      if (ctrl && e.key === 'z' && e.shiftKey && !isTextEditable) { e.preventDefault(); useEditorStore.getState().redo(); }

      // Clipboard shortcuts: only intercept when NOT in a text-editable field
      if (!isTextEditable) {
        if (ctrl && e.key === 'c') { e.preventDefault(); useEditorStore.getState().copy(); }
        if (ctrl && e.key === 'x') { e.preventDefault(); useEditorStore.getState().cut(); }
        if (ctrl && e.key === 'v') { e.preventDefault(); const s = useEditorStore.getState(); s.paste(s.selectedIds[0] ?? s.spec.root); }
        if (ctrl && e.key === 'd') { e.preventDefault(); const s = useEditorStore.getState(); if (s.selectedIds.length === 1) s.duplicateElement(s.selectedIds[0]); }
      }

      if (ctrl && e.key === 'n') { e.preventDefault(); useEditorStore.getState().newFile(); }
      if (ctrl && e.key === 'o') { e.preventDefault(); useEditorStore.getState().openFile(); }
      if (ctrl && e.key === 's' && !e.shiftKey) { e.preventDefault(); useEditorStore.getState().saveFile(); }
      if (ctrl && e.key === 's' && e.shiftKey) { e.preventDefault(); useEditorStore.getState().saveAsFile(); }
      if (ctrl && e.key === 'g' && !e.shiftKey) { e.preventDefault(); const s = useEditorStore.getState(); if (s.selectedIds.length > 1) s.groupElements(s.selectedIds); }
      if (ctrl && e.key === 'g' && e.shiftKey) { e.preventDefault(); const s = useEditorStore.getState(); if (s.selectedIds.length === 1) s.ungroupElement(s.selectedIds[0]); }
      if (e.key === 'Escape') { useEditorStore.getState().clearSelection(); }
      if (ctrl && e.key === ',') { e.preventDefault(); useSettingsStore.getState().toggleSettings(); }
      if (ctrl && e.key === 'p') { e.preventDefault(); useEditorStore.getState().togglePreviewMode(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTextEditable) {
        e.preventDefault(); const s = useEditorStore.getState(); for (const id of [...s.selectedIds]) s.removeElement(id);
      }
      // Ctrl+A: select all design elements only when not in a text field
      if (ctrl && e.key === 'a' && !isTextEditable) {
        e.preventDefault();
        const s = useEditorStore.getState();
        const allIds = Object.keys(s.spec.elements).filter((id) => id !== s.spec.root);
        s.document.selection.selectAll(allIds);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <DragProvider>
      <Titlebar />
      <div className="editor-layout">
        <Toolbar />

        <div className="editor-left-panel">
          <div className="panel-tabs">
            <button type="button" className="panel-tab" data-active={activePanel === 'palette'} onClick={() => setActivePanel('palette')}>Components</button>
            <button type="button" className="panel-tab" data-active={activePanel === 'layers'} onClick={() => setActivePanel('layers')}>Layers</button>
          </div>
          {activePanel === 'palette' ? <ComponentPalette /> : <LayerTree />}
        </div>

        <Canvas />

        <div className="editor-right-panel">
          <div className="panel-tabs">
            <button type="button" className="panel-tab" data-active={rightTab === 'properties'} onClick={() => setRightTab('properties')}>Properties</button>
            <button type="button" className="panel-tab" data-active={rightTab === 'chat'} onClick={() => setRightTab('chat')}>AI Chat</button>
          </div>
          {rightTab === 'properties' ? <PropsPanel /> : <ChatPanel />}
        </div>
      </div>
      <SettingsPage />
    </DragProvider>
  );
}
