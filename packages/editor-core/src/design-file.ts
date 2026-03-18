import type { DesignFile, DesignSpec, EditorMeta, EditorState, Element } from './types.js';
import { normalizeDesignSpec } from './normalize.js';

export type PlatformTarget = 'web' | 'ios' | 'android';
export type RuntimeId = 'react' | 'react-native';

export interface JsonRenderElement {
  type: string;
  props: Record<string, unknown>;
  children: string[];
}

export interface JsonRenderSpecLike {
  root: string;
  elements: Record<string, JsonRenderElement>;
  state?: Record<string, unknown>;
}

export interface DesignDocumentV2 {
  spec: JsonRenderSpecLike;
}

export interface EditorStateV2 extends EditorState {
  nodes: Record<string, EditorMeta>;
}

export interface DesignFileV2 {
  version: 2;
  catalogId: string;
  runtimeId: RuntimeId;
  platforms: PlatformTarget[];
  document: DesignDocumentV2;
  editor: EditorStateV2;
}

export function isDesignFileV2(value: unknown): value is DesignFileV2 {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Partial<DesignFileV2>;
  return candidate.version === 2
    && typeof candidate.catalogId === 'string'
    && typeof candidate.runtimeId === 'string'
    && Array.isArray(candidate.platforms)
    && typeof candidate.document === 'object'
    && candidate.document !== null
    && typeof candidate.editor === 'object'
    && candidate.editor !== null;
}

export function extractEditorNodes(spec: DesignSpec): Record<string, EditorMeta> {
  return Object.fromEntries(
    Object.entries(spec.elements)
      .filter(([, element]) => element.__editor)
      .map(([id, element]) => [id, { ...element.__editor } as EditorMeta]),
  );
}

export function stripEditorMetaFromSpec(spec: DesignSpec): JsonRenderSpecLike {
  return {
    root: spec.root,
    elements: Object.fromEntries(
      Object.entries(spec.elements).map(([id, element]) => {
        const { __editor: _editor, ...rest } = element;
        return [id, { ...rest }];
      }),
    ) as Record<string, JsonRenderElement>,
    state: { ...spec.state },
  };
}

function normalizeCatalogId(catalogId: string): string {
  return catalogId === 'rnr-uniwind-v1' ? 'rnr-uniwind' : catalogId;
}

function denormalizeCatalogId(catalogId: string): string {
  return catalogId === 'rnr-uniwind' ? 'rnr-uniwind-v1' : catalogId;
}

export function migrateLegacyDesignFile(file: DesignFile): DesignFileV2 {
  const normalizedSpec = normalizeDesignSpec(file.spec);

  return {
    version: 2,
    catalogId: normalizeCatalogId(file.catalog),
    runtimeId: 'react-native',
    platforms: [...file.target],
    document: {
      spec: stripEditorMetaFromSpec(normalizedSpec),
    },
    editor: {
      ...file.editor,
      pan: [...file.editor.pan] as [number, number],
      selection: [...file.editor.selection],
      expandedLayers: [...file.editor.expandedLayers],
      nodes: extractEditorNodes(normalizedSpec),
    },
  };
}

export function inflateLegacyDesignFile(file: DesignFileV2): DesignFile {
  const elements = Object.fromEntries(
    Object.entries(file.document.spec.elements).map(([id, element]) => {
      const inflated: Element = {
        type: element.type,
        props: { ...(element.props ?? {}) },
        children: Array.isArray(element.children) ? [...element.children] : [],
      };

      if (file.editor.nodes[id]) {
        inflated.__editor = { ...file.editor.nodes[id] };
      }

      return [id, inflated];
    }),
  ) as Record<string, Element>;

  return {
    version: 1,
    catalog: denormalizeCatalogId(file.catalogId),
    target: [...file.platforms],
    spec: {
      version: 1,
      root: file.document.spec.root,
      elements,
      state: { ...(file.document.spec.state ?? {}) },
    },
    editor: {
      zoom: file.editor.zoom,
      pan: [...file.editor.pan] as [number, number],
      selection: [...file.editor.selection],
      expandedLayers: [...file.editor.expandedLayers],
    },
  };
}
