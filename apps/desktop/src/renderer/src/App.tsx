import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store';
import { ChatPanel } from '@/ChatPanel';
import { catalog, getCategorizedComponents, type ComponentType } from '@next-dev/catalog';
import type { DesignSpec } from '@next-dev/editor-core';
import { renderers } from '@next-dev/json-render';
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
} from 'lucide-react';
import { z } from 'zod';

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

      {/* History */}
      <button type="button" className="toolbar-btn" disabled={!canUndo} onClick={undo} title="Undo (Ctrl+Z)">
        <Undo2 size={16} />
      </button>
      <button type="button" className="toolbar-btn" disabled={!canRedo} onClick={redo} title="Redo (Ctrl+Shift+Z)">
        <Redo2 size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Clipboard */}
      <button type="button" className="toolbar-btn" disabled={!hasSelection} onClick={copy} title="Copy">
        <Copy size={16} />
      </button>
      <button type="button" className="toolbar-btn" disabled={!hasSelection} onClick={cut} title="Cut">
        <Scissors size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Element actions */}
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasSelection}
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
        disabled={!hasMultiSelection}
        onClick={() => groupElements(selectedIds)}
        title="Group"
      >
        <Group size={16} />
      </button>
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasSelection}
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
        disabled={!hasSelection}
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

  return (
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
                  onClick={() => handleAdd(type)}
                  title={entry.description}
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

  const isSelected = selectedIds.includes(elementId);
  const isHovered = hoveredId === elementId;
  const hasChildren = element.children.length > 0;
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
        element.children.map((childId) => (
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

function CanvasNode({ elementId, spec }: { elementId: string; spec: DesignSpec }) {
  const element = spec.elements[elementId];
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const select = useEditorStore((s) => s.select);
  const hover = useEditorStore((s) => s.hover);

  if (!element || element.__editor?.hidden) return null;

  const isSelected = selectedIds.includes(elementId);
  const isHovered = hoveredId === elementId;
  const children = element.children.map((cid) => <CanvasNode key={cid} elementId={cid} spec={spec} />);

  const renderElement = () => {
    const props = element.props ?? {};
    const ctx = { scale: 1, interactive: true };
    const renderer = renderers[element.type];
    if (renderer) {
      return renderer(props, children, ctx);
    }
    return <div style={{ padding: '12px', border: '1px dashed var(--color-border-default)', borderRadius: '6px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>{element.type}{children}</div>;
  };

  return (
    <div
      className="canvas-element"
      data-selected={isSelected}
      data-hovered={isHovered && !isSelected}
      onClick={(e) => { e.stopPropagation(); select(elementId, e.shiftKey); }}
      onKeyDown={() => {}}
      role="treeitem"
      tabIndex={0}
      onMouseEnter={(e) => { e.stopPropagation(); hover(elementId); }}
      onMouseLeave={(e) => { e.stopPropagation(); hover(null); }}
    >
      {renderElement()}
    </div>
  );
}

function Canvas() {
  const spec = useEditorStore((s) => s.spec);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const zoom = useEditorStore((s) => s.zoom);

  return (
    <div className="editor-canvas" onClick={() => clearSelection()} onKeyDown={() => {}} role="presentation" tabIndex={-1}>
      <div className="canvas-frame" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <CanvasNode elementId={spec.root} spec={spec} />
      </div>
    </div>
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
  if (inner instanceof z.ZodDefault) inner = inner._def.innerType;
  if (inner instanceof z.ZodNullable) inner = inner._def.innerType;

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

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); useEditorStore.getState().undo(); }
      if (ctrl && e.key === 'z' && e.shiftKey) { e.preventDefault(); useEditorStore.getState().redo(); }
      if (ctrl && e.key === 'c') { e.preventDefault(); useEditorStore.getState().copy(); }
      if (ctrl && e.key === 'x') { e.preventDefault(); useEditorStore.getState().cut(); }
      if (ctrl && e.key === 'v') { e.preventDefault(); const s = useEditorStore.getState(); s.paste(s.selectedIds[0] ?? s.spec.root); }
      if (ctrl && e.key === 'd') { e.preventDefault(); const s = useEditorStore.getState(); if (s.selectedIds.length === 1) s.duplicateElement(s.selectedIds[0]); }
      if (ctrl && e.key === 'n') { e.preventDefault(); useEditorStore.getState().newFile(); }
      if (ctrl && e.key === 'o') { e.preventDefault(); useEditorStore.getState().openFile(); }
      if (ctrl && e.key === 's' && !e.shiftKey) { e.preventDefault(); useEditorStore.getState().saveFile(); }
      if (ctrl && e.key === 's' && e.shiftKey) { e.preventDefault(); useEditorStore.getState().saveAsFile(); }
      if (ctrl && e.key === 'g' && !e.shiftKey) { e.preventDefault(); const s = useEditorStore.getState(); if (s.selectedIds.length > 1) s.groupElements(s.selectedIds); }
      if (ctrl && e.key === 'g' && e.shiftKey) { e.preventDefault(); const s = useEditorStore.getState(); if (s.selectedIds.length === 1) s.ungroupElement(s.selectedIds[0]); }
      if (e.key === 'Escape') { useEditorStore.getState().clearSelection(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault(); const s = useEditorStore.getState(); for (const id of [...s.selectedIds]) s.removeElement(id);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
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
    </>
  );
}
