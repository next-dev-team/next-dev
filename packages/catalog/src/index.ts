/**
 * @next-dev/catalog
 *
 * Component catalog for DesignForge — Zod schemas, editor metadata,
 * and runtime registry mapping for UniWind components.
 */

// Definitions (schemaless, headless-friendly)
export {
  catalog,
  catalogToPrompt,
  componentSchemas,
  getCategorizedComponents,
  getComponentsByCategory,
  getComponentTypes,
} from './definitions.js';
export type { CatalogEntry, ComponentType } from './definitions.js';

export {
  activeCatalog,
  activeCatalogToPrompt,
  getActiveCatalogId,
  getCatalogContract,
  getLegacyCatalogIds,
  activeCatalogToPrompt as jsonRenderCatalogToPrompt,
  getCatalogContract as getJsonRenderCatalogContract,
  getLegacyCatalogIds as getJsonRenderLegacyCatalogIds,
  resolveCatalogId,
  resolveCatalogId as resolveJsonRenderCatalogId,
  rnUniwindJsonRenderCatalog,
  RN_UNIWIND_CATALOG_ID,
  RN_UNIWIND_CATALOG_ID as ACTIVE_CATALOG_ID,
} from './json-render.js';
export { generateReactViteProject } from './code-export.js';
export type { ExportCodeOptions, GeneratedCodeProject } from './code-export.js';

// Registry (requires React)
export { createRegistry, resolveComponent } from './registry.js';
export type { RendererEntry } from './registry.js';
