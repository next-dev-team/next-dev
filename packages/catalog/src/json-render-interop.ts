import {
  applySpecPatch,
  compileSpecStream,
  type JsonPatch,
  type Spec,
} from '@json-render/core';
import {
  normalizeDesignSpec,
  stripEditorMetaFromSpec,
  type DesignSpec,
  type EditorMeta,
} from '@next-dev/editor-core';
import { activeCatalog } from './json-render.js';

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export type JsonRenderSpec = Spec;
export type JsonRenderSpecPatch = JsonPatch;
export type JsonRenderCatalog = typeof activeCatalog;

export function toJsonRenderSpec(spec: DesignSpec): Spec {
  return cloneJson(stripEditorMetaFromSpec(spec)) as Spec;
}

export function fromJsonRenderSpec(
  spec: Pick<Spec, 'root' | 'elements'> & Partial<Pick<Spec, 'state'>>,
  editorNodes: Record<string, EditorMeta> = {},
): DesignSpec {
  const elements = Object.fromEntries(
    Object.entries(spec.elements).map(([id, element]) => {
      const nextElement: DesignSpec['elements'][string] = {
        type: element.type,
        props: { ...(element.props ?? {}) },
        children: Array.isArray(element.children) ? [...element.children] : [],
      };

      const editorMeta = editorNodes[id];
      if (editorMeta) {
        nextElement.__editor = { ...editorMeta };
      }

      return [id, nextElement];
    }),
  ) as DesignSpec['elements'];

  return normalizeDesignSpec({
    version: 1,
    root: spec.root,
    elements,
    state: { ...(spec.state ?? {}) },
  });
}

export function applyJsonRenderPatch(
  spec: DesignSpec,
  patch: JsonPatch,
): DesignSpec {
  return applyJsonRenderPatches(spec, [patch]);
}

export function applyJsonRenderPatches(
  spec: DesignSpec,
  patches: JsonPatch[],
): DesignSpec {
  const nextSpec = cloneJson(spec);

  for (const patch of patches) {
    applySpecPatch(nextSpec as unknown as Spec, patch);
  }

  return normalizeDesignSpec(nextSpec);
}

export function compileJsonRenderSpecStream(
  stream: string,
  editorNodes: Record<string, EditorMeta> = {},
): DesignSpec {
  const compiled = compileSpecStream(stream) as unknown as Spec;
  return fromJsonRenderSpec(compiled, editorNodes);
}

export function validateDesignSpecAgainstCatalog(
  spec: DesignSpec,
  catalog: JsonRenderCatalog = activeCatalog,
) {
  return catalog.validate(toJsonRenderSpec(spec));
}
