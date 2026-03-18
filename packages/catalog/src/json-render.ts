import { defineCatalog } from '@json-render/core';
import {
  standardActionDefinitions,
  standardComponentDefinitions,
} from '@json-render/react-native/catalog';
import { schema } from '@json-render/react-native/schema';
import type { z } from 'zod';
import { catalog, getComponentTypes, type CatalogEntry, type ComponentType } from './definitions.js';

export const RN_UNIWIND_CATALOG_ID = 'rnr-uniwind';
export const LEGACY_RN_UNIWIND_CATALOG_ID = 'rnr-uniwind-v1';

export type DesignForgeCatalogId = typeof RN_UNIWIND_CATALOG_ID;

export interface JsonRenderComponentDefinition {
  props: z.ZodType;
  slots: string[];
  description: string;
  example?: Record<string, unknown>;
}

function toJsonRenderDefinition(entry: CatalogEntry): JsonRenderComponentDefinition {
  return {
    props: entry.schema,
    slots: entry.acceptsChildren ? ['default'] : [],
    description: entry.description,
    example: entry.meta.defaultProps,
  };
}

export const rnUniwindComponentDefinitions = Object.fromEntries(
  getComponentTypes().map((type) => [type, toJsonRenderDefinition(catalog[type])]),
) as Record<ComponentType, JsonRenderComponentDefinition>;

export const rnUniwindJsonRenderCatalog = defineCatalog(schema, {
  components: {
    ...standardComponentDefinitions,
    ...rnUniwindComponentDefinitions,
  },
  actions: {
    ...standardActionDefinitions,
  },
});

export const activeCatalog = rnUniwindJsonRenderCatalog;

export function getActiveCatalogId(): DesignForgeCatalogId {
  return RN_UNIWIND_CATALOG_ID;
}

export function getLegacyCatalogIds(): string[] {
  return [LEGACY_RN_UNIWIND_CATALOG_ID];
}

export function resolveCatalogId(
  catalogId?: string | null,
): DesignForgeCatalogId {
  if (!catalogId || catalogId === RN_UNIWIND_CATALOG_ID || catalogId === LEGACY_RN_UNIWIND_CATALOG_ID) {
    return RN_UNIWIND_CATALOG_ID;
  }

  throw new Error(`Unknown catalog "${catalogId}"`);
}

export function getCatalogContract(catalogId?: string | null) {
  resolveCatalogId(catalogId);
  return activeCatalog;
}

export function activeCatalogToPrompt(): string {
  return activeCatalog.prompt();
}
