import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/store';
import { useChatStore } from '@/chat-store';
import { createSelectedElementReference, type SelectedElementReference } from '@/chat-context';
import { ChatPanel } from '@/ChatPanel';
import { CodePreview } from '@/CodePreview';
import {
  catalog,
  getCatalogBlockProviderFamilies,
  getBlockCategories,
  getDefaultCatalogProviderSelection,
  getCatalogBlocksByCategory,
  getCategorizedComponents,
  resolveCatalogProviderSelection,
  type CatalogBlock,
  type CatalogBlockCategory,
  type CatalogBlockCategoryId,
  type CatalogBlockProviderFamily,
  type CatalogBlockProviderFamilyId,
  type CatalogBlockProviderId,
  type CatalogBlockProviderSelection,
  type ComponentType,
} from '@next-dev/catalog';
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
  Code2,
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
  MessageSquare,
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

  return <DragContext.Provider value={{ state, setDragging }}>{children}</DragContext.Provider>;
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
  | { kind: 'replaceSpec'; spec: DesignSpec; filePath?: string | null }
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
              if (
                resolveLiveNodeId(operation.elementId) &&
                resolveLiveNodeId(operation.newParentId) !== undefined
              ) {
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
        editor.loadSpec(request.mutation.spec, {
          filePath: request.mutation.filePath,
        });
        break;
      case 'undo':
        editor.undo();
        break;
      case 'redo':
        editor.redo();
        break;
      case 'setSelection': {
        const nextState = useEditorStore.getState();
        const selectedIds = request.mutation.selectedIds.filter(
          (id) => id in nextState.spec.elements,
        );
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
        — {filename}
        {isDirty ? ' •' : ''}
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
  const exportCode = useEditorStore((s) => s.exportCode);
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
        <button
          type="button"
          className="file-btn"
          onClick={() => {
            void exportCode();
          }}
          title="Export Code (Ctrl+Shift+E)"
        >
          <Code2 size={14} /> Export Code
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
      <button
        type="button"
        className="toolbar-btn"
        onClick={() => openSettings()}
        title="Settings (Ctrl+,)"
      >
        <Settings size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* History */}
      <button
        type="button"
        className="toolbar-btn"
        disabled={!canUndo || isPreviewMode}
        onClick={undo}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={16} />
      </button>
      <button
        type="button"
        className="toolbar-btn"
        disabled={!canRedo || isPreviewMode}
        onClick={redo}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={16} />
      </button>

      <div className="toolbar-separator" />

      {/* Clipboard */}
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasSelection || isPreviewMode}
        onClick={copy}
        title="Copy"
      >
        <Copy size={16} />
      </button>
      <button
        type="button"
        className="toolbar-btn"
        disabled={!hasSelection || isPreviewMode}
        onClick={cut}
        title="Cut"
      >
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
  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>
  )[iconName];
  return IconComponent ?? Icons.Box;
}

function resolveInsertionParentId(spec: DesignSpec, selectedIds: string[], rootId: string): string {
  if (selectedIds.length !== 1) return rootId;

  const selectedId = selectedIds[0];
  const selectedElement = spec.elements[selectedId];
  if (!selectedElement) return rootId;

  const selectedEntry = catalog[selectedElement.type as ComponentType];
  return selectedEntry?.meta.acceptsChildren ? selectedId : rootId;
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
    const targetParentId = resolveInsertionParentId(spec, selectedIds, rootId);

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
      <div ref={ghostRef} className="drag-ghost" style={{ display: 'none' }} />
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

function getSelectedProviderOption(
  providers: CatalogBlockProviderFamily[],
  familyId: CatalogBlockProviderFamilyId,
  selection: CatalogBlockProviderSelection,
) {
  const family = providers.find((provider) => provider.id === familyId);
  if (!family) return null;
  return family.options.find((option) => option.id === selection[family.id]) ?? family.options[0];
}

function BlockCard({
  block,
  category,
  providers,
  selection,
  onConfigureProviders,
  onInsert,
}: {
  block: CatalogBlock;
  category: CatalogBlockCategory;
  providers: CatalogBlockProviderFamily[];
  selection: CatalogBlockProviderSelection;
  onConfigureProviders: () => void;
  onInsert: (block: CatalogBlock) => void;
}) {
  const IconComp = getIcon(block.icon);

  return (
    <article className="block-card">
      <div className="block-card-header">
        <div className="block-card-icon-wrap">
          <IconComp size={18} className="block-card-icon" />
        </div>
        <div className="block-card-copy">
          <span className="block-card-family">{category.name}</span>
          <span className="block-card-title">{block.name}</span>
          <span className="block-card-description">{block.description}</span>
        </div>
      </div>

      <div className="block-card-preview" aria-hidden="true">
        <div className="block-preview-shell">
          <div className="block-preview-pill" />
          <div className="block-preview-heading" />
          <div className="block-preview-text block-preview-text--wide" />
          <div className="block-preview-label" />
          <div className="block-preview-field" />
          <div className="block-preview-label block-preview-label--short" />
          <div className="block-preview-field" />
          <div className="block-preview-inline">
            <span className="block-preview-check" />
            <span className="block-preview-text" />
            <span className="block-preview-link" />
          </div>
          <div className="block-preview-button block-preview-button--primary" />
          <div className="block-preview-divider" />
          <div className="block-preview-actions">
            <span className="block-preview-button" />
            <span className="block-preview-button" />
          </div>
        </div>
      </div>

      <div className="block-card-accent">{block.accent}</div>

      <div className="block-card-provider-summary">
        {providers.map((family) => {
          const selectedProvider = getSelectedProviderOption(providers, family.id, selection);
          return (
            <div key={family.id} className="block-card-provider-row">
              <span className="block-card-provider-label">{family.name}</span>
              <span className="block-card-provider-value">
                {selectedProvider?.name ?? 'Not configured'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="block-card-tags">
        {block.tags.map((tag) => (
          <span key={tag} className="block-card-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="block-card-footer">
        <div className="block-card-selected-provider">
          <span className="block-card-selected-label">Provider config</span>
          <span className="block-card-selected-value">
            Managed globally in the Provider tab. Changing one provider resets the shared
            DesignForge stack.
          </span>
        </div>
        <div className="block-card-actions">
          <button type="button" className="block-card-configure" onClick={onConfigureProviders}>
            Open Provider
          </button>
          <button
            type="button"
            className="block-card-insert"
            onClick={() => onInsert(block)}
            title={`${block.description}\nInsert block`}
          >
            Insert block
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function BlockProviderGroup({
  family,
  selectedProviderId,
  onProviderChange,
}: {
  family: CatalogBlockProviderFamily;
  selectedProviderId: CatalogBlockProviderSelection[CatalogBlockProviderFamilyId];
  onProviderChange: (
    familyId: CatalogBlockProviderFamilyId,
    providerId: CatalogBlockProviderId,
  ) => void;
}) {
  const selectedProvider =
    family.options.find((option) => option.id === selectedProviderId) ?? family.options[0];

  return (
    <div className="block-provider-group">
      <div className="block-provider-top">
        <div className="block-provider-copy">
          <span className="block-provider-name">{family.name}</span>
          <span className="block-provider-description">{family.description}</span>
        </div>
        {!family.mutable && <span className="block-provider-lock">Locked</span>}
      </div>

      <div className="block-provider-options">
        {family.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="block-provider-option"
            data-active={selectedProviderId === option.id}
            disabled={!family.mutable}
            onClick={() => onProviderChange(family.id, option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>

      <div className="block-provider-selected-note">{selectedProvider.description}</div>
    </div>
  );
}

function ProvidersPanel({
  providers,
  providerSelection,
  onProviderChange,
}: {
  providers: CatalogBlockProviderFamily[];
  providerSelection: CatalogBlockProviderSelection;
  onProviderChange: (
    familyId: CatalogBlockProviderFamilyId,
    providerId: CatalogBlockProviderId,
  ) => void;
}) {
  return (
    <div className="blocks-panel providers-panel">
      <div className="blocks-hero providers-hero">
        <span className="blocks-eyebrow">provider config</span>
        <h2 className="blocks-title">Set one global provider stack for DesignForge.</h2>
        <p className="blocks-description">
          These values apply across every block you insert. Changing a mutable provider resets the
          rest of the stack back to the default DesignForge values.
        </p>
      </div>

      <article className="provider-stack-card">
        <div className="provider-stack-header">
          <div className="provider-stack-copy">
            <span className="blocks-section-label">Global stack</span>
            <h3 className="provider-stack-title">DesignForge providers</h3>
            <p className="provider-stack-description">
              Runtime, UI, and validation are configured once here, then reused by every inserted
              block.
            </p>
          </div>
          <span className="provider-stack-badge">Global</span>
        </div>

        <div className="provider-stack-note">
          Confirm before switching a mutable provider. The selected provider stays, and every other
          provider resets back to the default stack.
        </div>

        <div className="block-providers">
          {providers.map((family) => (
            <BlockProviderGroup
              key={family.id}
              family={family}
              selectedProviderId={providerSelection[family.id]}
              onProviderChange={onProviderChange}
            />
          ))}
        </div>
      </article>
    </div>
  );
}

function BlocksPanel({
  providers,
  providerSelection,
  onConfigureProviders,
}: {
  providers: CatalogBlockProviderFamily[];
  providerSelection: CatalogBlockProviderSelection;
  onConfigureProviders: () => void;
}) {
  const insertElementTree = useEditorStore((s) => s.insertElementTree);
  const rootId = useEditorStore((s) => s.spec.root);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const spec = useEditorStore((s) => s.spec);
  const categories = getBlockCategories();
  const [activeCategory, setActiveCategory] = useState<CatalogBlockCategoryId>(
    categories[0]?.id ?? 'auth',
  );
  const blocks = getCatalogBlocksByCategory(activeCategory);
  const category = categories.find((item) => item.id === activeCategory) ?? categories[0];

  const handleInsert = (block: CatalogBlock) => {
    const targetParentId = resolveInsertionParentId(spec, selectedIds, rootId);
    insertElementTree(targetParentId, block.buildTree(providerSelection));
  };

  if (!category) return null;

  return (
    <div className="blocks-panel">
      <div className="blocks-hero">
        <span className="blocks-eyebrow">rn-uniwind blocks</span>
        <h2 className="blocks-title">Browse blocks by product area first.</h2>
        <p className="blocks-description">
          The structure mirrors a block library: category first, then a focused block built from the
          same primitives you already edit by hand. The active Provider tab stack applies to every
          insert.
        </p>
      </div>

      <div className="blocks-nav" role="tablist" aria-label="Block categories">
        {categories.map((item) => {
          const IconComp = getIcon(item.icon);
          return (
            <button
              key={item.id}
              type="button"
              className="blocks-nav-item"
              data-active={item.id === activeCategory}
              onClick={() => setActiveCategory(item.id)}
            >
              <IconComp size={14} />
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="blocks-section">
        <div className="blocks-section-header">
          <div className="blocks-section-copy">
            <span className="blocks-section-label">Category</span>
            <h3 className="blocks-section-title">{category.name}</h3>
            <p className="blocks-section-description">{category.description}</p>
          </div>
          <span className="blocks-section-count">
            {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
          </span>
        </div>

        <div className="blocks-list">
          {blocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              category={category}
              providers={providers}
              selection={providerSelection}
              onConfigureProviders={onConfigureProviders}
              onInsert={handleInsert}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Layer Tree ───────────────────────────────────────────────────────────

function LayerNode({
  elementId,
  spec,
  depth,
}: { elementId: string; spec: DesignSpec; depth: number }) {
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
          isCollapsed ? (
            <ChevronRight size={12} />
          ) : (
            <ChevronDown size={12} />
          )
        ) : (
          <span className="layer-item-indent" />
        )}
        <IconComp size={14} className="layer-item-icon" />
        <span className="layer-item-name">{displayName}</span>
        {isLocked && <Lock size={10} style={{ opacity: 0.4 }} />}
        {isHidden && <EyeOff size={10} style={{ opacity: 0.4 }} />}
      </div>
      {hasChildren &&
        !isCollapsed &&
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

interface CanvasContextMenuRequest {
  elementId: string;
  x: number;
  y: number;
  isPreview: boolean;
}

interface CanvasContextMenuState extends CanvasContextMenuRequest {
  target: SelectedElementReference;
  isRoot: boolean;
}

interface CanvasContextMenuItemProps {
  icon: Icons.LucideIcon;
  label: string;
  hint: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

function CanvasContextMenuItem({
  icon: Icon,
  label,
  hint,
  danger,
  disabled,
  onSelect,
}: CanvasContextMenuItemProps) {
  return (
    <button
      type="button"
      className="canvas-context-menu-item"
      data-danger={danger || undefined}
      disabled={disabled}
      role="menuitem"
      onClick={onSelect}
    >
      <Icon size={15} />
      <span className="canvas-context-menu-item-copy">
        <span className="canvas-context-menu-item-label">{label}</span>
        <span className="canvas-context-menu-item-hint">{hint}</span>
      </span>
    </button>
  );
}

function CanvasContextMenu({
  menu,
  menuRef,
  onInjectToChat,
  onOpenProperties,
  onRevealInLayers,
  onCopyNodeId,
  onDuplicate,
  onDelete,
}: {
  menu: CanvasContextMenuState | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onInjectToChat: () => void;
  onOpenProperties: () => void;
  onRevealInLayers: () => void;
  onCopyNodeId: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  if (!menu) return null;

  const style = {
    '--canvas-context-menu-x': `${menu.x}px`,
    '--canvas-context-menu-y': `${menu.y}px`,
  } as React.CSSProperties;

  return (
    <div
      ref={menuRef}
      className="canvas-context-menu"
      style={style}
      role="menu"
      aria-label={`Actions for ${menu.target.label}`}
    >
      <div className="canvas-context-menu-header">
        <div className="canvas-context-menu-title-row">
          <span className="canvas-context-menu-title">{menu.target.label}</span>
          <span className="canvas-context-menu-meta">{menu.target.shortId}</span>
        </div>
        <div className="canvas-context-menu-subtitle">
          <span>{menu.target.type}</span>
          <span>{menu.isPreview ? 'Preview' : 'Editor'}</span>
        </div>
      </div>

      <CanvasContextMenuItem
        icon={MessageSquare}
        label="Inject to Chat"
        hint="Switch AI Chat into edit mode for this node"
        onSelect={onInjectToChat}
      />
      <CanvasContextMenuItem
        icon={Settings}
        label="Open Properties"
        hint="Inspect and edit the selected node"
        onSelect={onOpenProperties}
      />
      <CanvasContextMenuItem
        icon={Layers}
        label="Reveal in Layers"
        hint="Jump to this selection in the layer tree"
        onSelect={onRevealInLayers}
      />
      <CanvasContextMenuItem
        icon={Clipboard}
        label="Copy Node ID"
        hint={menu.target.elementId}
        onSelect={onCopyNodeId}
      />

      {!menu.isPreview && (
        <>
          <div className="canvas-context-menu-separator" role="separator" />
          <CanvasContextMenuItem
            icon={Copy}
            label="Duplicate"
            hint={
              menu.isRoot ? 'The root node cannot be duplicated here' : 'Create a sibling copy of this node'
            }
            disabled={menu.isRoot}
            onSelect={onDuplicate}
          />
          <CanvasContextMenuItem
            icon={Trash2}
            label="Delete"
            hint={menu.isRoot ? 'The root node cannot be removed' : 'Remove this node from the canvas'}
            danger
            disabled={menu.isRoot}
            onSelect={onDelete}
          />
        </>
      )}
    </div>
  );
}

function CanvasNode({
  elementId,
  spec,
  isPreview,
  onOpenContextMenu,
}: {
  elementId: string;
  spec: DesignSpec;
  isPreview?: boolean;
  onOpenContextMenu: (request: CanvasContextMenuRequest) => void;
}) {
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
  const isSelected = selectedIds.includes(elementId);
  const isHovered = !isPreview && hoveredId === elementId;
  const isEditing = !isPreview && editingId === elementId;
  const children = childIds.map((cid) => (
    <CanvasNode
      key={cid}
      elementId={cid}
      spec={spec}
      isPreview={isPreview}
      onOpenContextMenu={onOpenContextMenu}
    />
  ));

  const renderElement = () => {
    const props = element.props ?? {};
    const ctx = {
      scale: 1,
      interactive: true,
      onPropsChange: !isPreview
        ? (newProps: Record<string, unknown>) => {
            setProps(elementId, newProps);
          }
        : undefined,
      isEditing,
      onStartEdit: !isPreview
        ? () => {
            setEditingId(elementId);
          }
        : undefined,
    };
    const renderer = renderers[element.type];
    if (renderer) {
      return renderer(props, children, ctx);
    }
    return (
      <div
        style={{
          padding: '12px',
          border: '1px dashed var(--color-border-default)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        {element.type}
        {children}
      </div>
    );
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editingId) {
      setEditingId(null);
    }
    select(elementId);
    onOpenContextMenu({
      elementId,
      x: e.clientX,
      y: e.clientY,
      isPreview: Boolean(isPreview),
    });
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
      onContextMenu={handleContextMenu}
      onKeyDown={isPreview ? undefined : () => {}}
      role={isPreview ? undefined : 'treeitem'}
      tabIndex={isPreview ? undefined : 0}
      onMouseEnter={
        isPreview
          ? undefined
          : (e) => {
              e.stopPropagation();
              hover(elementId);
            }
      }
      onMouseLeave={
        isPreview
          ? undefined
          : (e) => {
              e.stopPropagation();
              hover(null);
            }
      }
      onDragOver={isPreview ? undefined : handleDragOver}
      onDragLeave={isPreview ? undefined : handleDragLeave}
      onDrop={isPreview ? undefined : handleDrop}
    >
      {renderElement()}
    </div>
  );
}

function Canvas({
  onInjectToChat,
  onOpenProperties,
  onRevealInLayers,
}: {
  onInjectToChat: () => void;
  onOpenProperties: () => void;
  onRevealInLayers: () => void;
}) {
  const spec = useEditorStore((s) => s.spec);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const addElement = useEditorStore((s) => s.addElement);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const removeElement = useEditorStore((s) => s.removeElement);
  const zoom = useEditorStore((s) => s.zoom);
  const isPreviewMode = useEditorStore((s) => s.isPreviewMode);
  const filePath = useEditorStore((s) => s.filePath);
  const { state: dragState } = useContext(DragContext);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<CanvasContextMenuState | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  // Clear editing state when entering preview mode
  useEffect(() => {
    if (isPreviewMode) setEditingId(null);
  }, [isPreviewMode]);

  useEffect(() => {
    if (!contextMenu) return;
    if (!spec.elements[contextMenu.target.elementId]) {
      setContextMenu(null);
    }
  }, [contextMenu, spec]);

  useEffect(() => {
    if (!contextMenu) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && contextMenuRef.current?.contains(event.target)) {
        return;
      }
      setContextMenu(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenu(null);
      }
    };

    const handleWindowChange = () => {
      setContextMenu(null);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleWindowChange);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleWindowChange);
    };
  }, [contextMenu]);

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
    setContextMenu(null);
    if (isPreviewMode) return;
    setEditingId(null);
    clearSelection();
  };

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu(null);
  };

  const handleOpenContextMenu = useCallback(
    (request: CanvasContextMenuRequest) => {
      const target = createSelectedElementReference(spec, request.elementId);
      if (!target) return;
      setContextMenu({
        ...request,
        target,
        isRoot: request.elementId === spec.root,
      });
    },
    [spec],
  );

  const handleInjectToChat = useCallback(() => {
    setContextMenu(null);
    onInjectToChat();
  }, [onInjectToChat]);

  const handleOpenPropertiesFromMenu = useCallback(() => {
    setContextMenu(null);
    onOpenProperties();
  }, [onOpenProperties]);

  const handleRevealInLayersFromMenu = useCallback(() => {
    setContextMenu(null);
    onRevealInLayers();
  }, [onRevealInLayers]);

  const handleCopyNodeId = useCallback(() => {
    if (!contextMenu) return;
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(contextMenu.target.elementId).catch(() => {});
    }
    setContextMenu(null);
  }, [contextMenu]);

  const handleDuplicateFromMenu = useCallback(() => {
    if (!contextMenu || contextMenu.isPreview || contextMenu.isRoot) return;
    duplicateElement(contextMenu.target.elementId);
    setContextMenu(null);
  }, [contextMenu, duplicateElement]);

  const handleDeleteFromMenu = useCallback(() => {
    if (!contextMenu || contextMenu.isPreview || contextMenu.isRoot) return;
    removeElement(contextMenu.target.elementId);
    setContextMenu(null);
  }, [contextMenu, removeElement]);

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
        onContextMenu={handleCanvasContextMenu}
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
                <button type="button" className="browser-nav-btn" disabled>
                  <ArrowLeft size={13} />
                </button>
                <button type="button" className="browser-nav-btn" disabled>
                  <ArrowRight size={13} />
                </button>
                <button type="button" className="browser-nav-btn" disabled>
                  <RotateCw size={13} />
                </button>
              </div>
              <div className="browser-address-bar">
                <Shield size={12} className="browser-address-icon" />
                <span className="browser-address-text">{displayUrl}</span>
              </div>
            </div>
          )}
          <div className="canvas-frame-content">
            <CanvasNode
              elementId={spec.root}
              spec={spec}
              isPreview={isPreviewMode}
              onOpenContextMenu={handleOpenContextMenu}
            />
          </div>
        </div>
        <CanvasContextMenu
          menu={contextMenu}
          menuRef={contextMenuRef}
          onInjectToChat={handleInjectToChat}
          onOpenProperties={handleOpenPropertiesFromMenu}
          onRevealInLayers={handleRevealInLayersFromMenu}
          onCopyNodeId={handleCopyNodeId}
          onDuplicate={handleDuplicateFromMenu}
          onDelete={handleDeleteFromMenu}
        />
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
    return (
      <div className="empty-state">
        <MousePointer className="empty-state-icon" />
        <p className="empty-state-text">Select an element to edit properties</p>
      </div>
    );
  }
  if (selectedIds.length > 1) {
    return (
      <div className="empty-state">
        <Box className="empty-state-icon" />
        <p className="empty-state-text">{selectedIds.length} elements selected</p>
      </div>
    );
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
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
          {element.__editor?.name ?? element.type}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Type: {element.type} · ID: {elementId.slice(0, 8)}…
        </div>
      </div>
      <div className="props-section">
        <div className="props-section-title">Properties</div>
        {schema
          ? Object.entries(schema.shape).map(([key, field]) => (
              <SchemaField
                key={key}
                fieldKey={key}
                field={field as z.ZodType}
                value={element.props[key]}
                onChange={(k, v) => setProps(elementId, { [k]: v })}
              />
            ))
          : Object.entries(element.props).map(([key, value]) => (
              <div key={key} className="props-field">
                <label className="props-label" htmlFor={`prop-${key}`}>
                  {key}
                </label>
                <input
                  id={`prop-${key}`}
                  className="props-input"
                  value={String(value ?? '')}
                  onChange={(e) => setProps(elementId, { [key]: e.target.value })}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

function SchemaField({
  fieldKey,
  field,
  value,
  onChange,
}: {
  fieldKey: string;
  field: z.ZodType;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  let inner = field;
  while (inner instanceof z.ZodDefault || inner instanceof z.ZodNullable) {
    inner = inner.unwrap() as z.ZodType;
  }

  const id = `prop-${fieldKey}`;

  if (inner instanceof z.ZodEnum) {
    return (
      <div className="props-field">
        <label className="props-label" htmlFor={id}>
          {fieldKey}
        </label>
        <select
          id={id}
          className="props-select"
          value={String(value ?? '')}
          onChange={(e) => onChange(fieldKey, e.target.value)}
        >
          {(inner.options as string[]).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
  if (inner instanceof z.ZodBoolean) {
    return (
      <div className="props-field">
        <div className="props-checkbox-row">
          <input
            id={id}
            type="checkbox"
            className="props-checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(fieldKey, e.target.checked)}
          />
          <label className="props-label" htmlFor={id}>
            {fieldKey}
          </label>
        </div>
      </div>
    );
  }
  if (inner instanceof z.ZodNumber) {
    return (
      <div className="props-field">
        <label className="props-label" htmlFor={id}>
          {fieldKey}
        </label>
        <input
          id={id}
          type="number"
          className="props-input"
          value={Number(value ?? 0)}
          onChange={(e) => onChange(fieldKey, Number(e.target.value))}
        />
      </div>
    );
  }
  return (
    <div className="props-field">
      <label className="props-label" htmlFor={id}>
        {fieldKey}
      </label>
      <input
        id={id}
        className="props-input"
        value={String(value ?? '')}
        onChange={(e) => onChange(fieldKey, e.target.value)}
      />
    </div>
  );
}

// ─── Resize Handle ────────────────────────────────────────────────────────

const MIN_PANEL_WIDTH = 160;
const MAX_PANEL_RATIO = 0.4; // 40% of window width
const DEFAULT_LEFT_WIDTH = 280;
const DEFAULT_RIGHT_WIDTH = 320;

function ResizeHandle({
  side,
  onResize,
}: {
  side: 'left' | 'right';
  onResize: (delta: number) => void;
}) {
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        onResize(side === 'left' ? delta : -delta);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [side, onResize],
  );

  return (
    <div
      ref={handleRef}
      className={`resize-handle resize-handle--${side}`}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
      tabIndex={0}
    />
  );
}

// ─── App ──────────────────────────────────────────────────────────────────

export function App() {
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const setChatMode = useChatStore((s) => s.setMode);
  const [rightTab, setRightTab] = useState<'properties' | 'chat' | 'code'>('chat');
  const providerFamiliesRef = useRef(getCatalogBlockProviderFamilies());
  const providerFamilies = providerFamiliesRef.current;
  const [providerSelection, setProviderSelection] = useState<CatalogBlockProviderSelection>(() =>
    getDefaultCatalogProviderSelection(),
  );

  const handleProviderChange = useCallback(
    (familyId: CatalogBlockProviderFamilyId, providerId: CatalogBlockProviderId) => {
      const family = providerFamilies.find((item) => item.id === familyId);
      if (!family) return;

      if (providerSelection[familyId] === providerId) return;

      const providerLabel =
        family.options.find((option) => option.id === providerId)?.name ?? providerId;

      if (
        family.mutable &&
        !window.confirm(
          `Switch the global ${family.name} provider to ${providerLabel}?\n\nChanging this provider resets the rest of the shared DesignForge provider stack back to its default values.`,
        )
      ) {
        return;
      }

      setProviderSelection(
        resolveCatalogProviderSelection({
          [familyId]: providerId,
        }),
      );
    },
    [providerFamilies, providerSelection],
  );

  // Resizable panel widths — persisted to localStorage
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem('df:leftPanelWidth');
    return saved ? Number(saved) || DEFAULT_LEFT_WIDTH : DEFAULT_LEFT_WIDTH;
  });
  const [rightWidth, setRightWidth] = useState(() => {
    const saved = localStorage.getItem('df:rightPanelWidth');
    return saved ? Number(saved) || DEFAULT_RIGHT_WIDTH : DEFAULT_RIGHT_WIDTH;
  });
  const leftBaseRef = useRef(leftWidth);
  const rightBaseRef = useRef(rightWidth);

  const handleLeftResize = useCallback((delta: number) => {
    const max = window.innerWidth * MAX_PANEL_RATIO;
    setLeftWidth(Math.max(MIN_PANEL_WIDTH, Math.min(max, leftBaseRef.current + delta)));
  }, []);

  const handleRightResize = useCallback((delta: number) => {
    const max = window.innerWidth * MAX_PANEL_RATIO;
    setRightWidth(Math.max(MIN_PANEL_WIDTH, Math.min(max, rightBaseRef.current + delta)));
  }, []);

  const handleInjectSelectionToChat = useCallback(() => {
    setRightTab('chat');
    setChatMode('edit');
  }, [setChatMode]);

  const handleOpenPropertiesPanel = useCallback(() => {
    setRightTab('properties');
  }, []);

  const handleRevealSelectionInLayers = useCallback(() => {
    setActivePanel('layers');
  }, [setActivePanel]);

  // Sync base refs + persist to localStorage on mouseup
  useEffect(() => {
    const handler = () => {
      leftBaseRef.current = leftWidth;
      rightBaseRef.current = rightWidth;
      localStorage.setItem('df:leftPanelWidth', String(leftWidth));
      localStorage.setItem('df:rightPanelWidth', String(rightWidth));
    };
    window.addEventListener('mouseup', handler);
    return () => window.removeEventListener('mouseup', handler);
  }, [leftWidth, rightWidth]);

  // ─── Live MCP File Watcher ───────────────────────────────────────────
  // Listens for spec changes pushed from the main process file watcher.
  // When an external MCP agent edits via --file mode, the canvas updates live.
  useEffect(() => {
    const api = (
      window as unknown as {
        designforge?: { watch?: { onSpecChanged: (cb: (spec: DesignSpec) => void) => () => void } };
      }
    ).designforge;
    if (!api?.watch?.onSpecChanged) return;

    const unsubscribe = api.watch.onSpecChanged((spec: DesignSpec) => {
      useEditorStore.getState().loadSpec(spec);
    });
    return unsubscribe;
  }, []);

  // Publish the live editor context so external MCP clients can join the desktop channel.
  useEffect(() => {
    const api = (
      window as unknown as {
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
      }
    ).designforge;

    if (!api?.mcp?.publishContext) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const publish = () => {
      const state = useEditorStore.getState();
      void api
        .mcp!.publishContext({
          filePath: state.filePath,
          spec: state.spec,
          selectedIds: state.selectedIds,
          hoveredId: state.hoveredId,
          zoom: state.zoom,
          pan: [0, 0],
        })
        .catch((error) => {
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
    const api = (
      window as unknown as {
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
      }
    ).designforge;

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

      if (ctrl && e.key === 'z' && !e.shiftKey && !isTextEditable) {
        e.preventDefault();
        useEditorStore.getState().undo();
      }
      if (ctrl && e.key === 'z' && e.shiftKey && !isTextEditable) {
        e.preventDefault();
        useEditorStore.getState().redo();
      }

      // Clipboard shortcuts: only intercept when NOT in a text-editable field
      if (!isTextEditable) {
        if (ctrl && e.key === 'c') {
          e.preventDefault();
          useEditorStore.getState().copy();
        }
        if (ctrl && e.key === 'x') {
          e.preventDefault();
          useEditorStore.getState().cut();
        }
        if (ctrl && e.key === 'v') {
          e.preventDefault();
          const s = useEditorStore.getState();
          s.paste(s.selectedIds[0] ?? s.spec.root);
        }
        if (ctrl && e.key === 'd') {
          e.preventDefault();
          const s = useEditorStore.getState();
          if (s.selectedIds.length === 1) s.duplicateElement(s.selectedIds[0]);
        }
      }

      if (ctrl && e.key === 'n') {
        e.preventDefault();
        useEditorStore.getState().newFile();
      }
      if (ctrl && e.key === 'o') {
        e.preventDefault();
        useEditorStore.getState().openFile();
      }
      if (ctrl && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().saveFile();
      }
      if (ctrl && e.key === 's' && e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().saveAsFile();
      }
      if (ctrl && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        void useEditorStore.getState().exportCode();
      }
      if (ctrl && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        const s = useEditorStore.getState();
        if (s.selectedIds.length > 1) s.groupElements(s.selectedIds);
      }
      if (ctrl && e.key === 'g' && e.shiftKey) {
        e.preventDefault();
        const s = useEditorStore.getState();
        if (s.selectedIds.length === 1) s.ungroupElement(s.selectedIds[0]);
      }
      if (e.key === 'Escape') {
        useEditorStore.getState().clearSelection();
      }
      if (ctrl && e.key === ',') {
        e.preventDefault();
        useSettingsStore.getState().toggleSettings();
      }
      if (ctrl && e.key === 'p') {
        e.preventDefault();
        useEditorStore.getState().togglePreviewMode();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTextEditable) {
        e.preventDefault();
        const s = useEditorStore.getState();
        for (const id of [...s.selectedIds]) s.removeElement(id);
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
      <div
        className="editor-layout"
        style={{
          gridTemplateColumns: `${leftWidth}px auto 1fr auto ${rightWidth}px`,
          gridTemplateAreas: `"toolbar toolbar toolbar toolbar toolbar" "left handle-left canvas handle-right right"`,
        }}
      >
        <Toolbar />

        <div className="editor-left-panel">
          <div className="panel-tabs">
            <button
              type="button"
              className="panel-tab"
              data-active={activePanel === 'providers'}
              onClick={() => setActivePanel('providers')}
            >
              Provider
            </button>
            <button
              type="button"
              className="panel-tab"
              data-active={activePanel === 'palette'}
              onClick={() => setActivePanel('palette')}
            >
              Components
            </button>
            <button
              type="button"
              className="panel-tab"
              data-active={activePanel === 'blocks'}
              onClick={() => setActivePanel('blocks')}
            >
              Blocks
            </button>
            <button
              type="button"
              className="panel-tab"
              data-active={activePanel === 'layers'}
              onClick={() => setActivePanel('layers')}
            >
              Layers
            </button>
          </div>
          {activePanel === 'providers' && (
            <ProvidersPanel
              providers={providerFamilies}
              providerSelection={providerSelection}
              onProviderChange={handleProviderChange}
            />
          )}
          {activePanel === 'palette' && <ComponentPalette />}
          {activePanel === 'blocks' && (
            <BlocksPanel
              providers={providerFamilies}
              providerSelection={providerSelection}
              onConfigureProviders={() => setActivePanel('providers')}
            />
          )}
          {activePanel === 'layers' && <LayerTree />}
        </div>

        <ResizeHandle side="left" onResize={handleLeftResize} />

        <Canvas
          onInjectToChat={handleInjectSelectionToChat}
          onOpenProperties={handleOpenPropertiesPanel}
          onRevealInLayers={handleRevealSelectionInLayers}
        />

        <ResizeHandle side="right" onResize={handleRightResize} />

        <div className="editor-right-panel">
          <div className="panel-tabs">
            <button
              type="button"
              className="panel-tab"
              data-active={rightTab === 'properties'}
              onClick={() => setRightTab('properties')}
            >
              Properties
            </button>
            <button
              type="button"
              className="panel-tab"
              data-active={rightTab === 'code'}
              onClick={() => setRightTab('code')}
            >
              Code
            </button>
            <button
              type="button"
              className="panel-tab"
              data-active={rightTab === 'chat'}
              onClick={() => setRightTab('chat')}
            >
              AI Chat
            </button>
          </div>
          {rightTab === 'properties' && <PropsPanel />}
          {rightTab === 'code' && <CodePreview />}
          {rightTab === 'chat' && <ChatPanel providerSelection={providerSelection} />}
        </div>
      </div>
      <SettingsPage />
    </DragProvider>
  );
}
