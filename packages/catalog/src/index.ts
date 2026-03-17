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

// Registry (requires React)
export { createRegistry, resolveComponent } from './registry.js';
export type { RendererEntry } from './registry.js';
