/**
 * Component Registry — Maps component types to render functions
 *
 * This is the runtime renderer mapping: given a component type string
 * like "Button", return the actual React component to render.
 *
 * Separated from definitions so headless tools (MCP, CLI) can import
 * definitions without pulling in React/RN.
 *
 * NOTE: This file imports from @next-dev/rn-uniwind. If you only need
 * schemas/metadata, import from @next-dev/catalog/definitions instead.
 */

import type { ComponentType } from './definitions.js';

/**
 * Render function signature for the canvas.
 * The canvas calls registry[type]({ props, children }) to render.
 */
export interface RendererEntry {
  component: React.ComponentType<Record<string, unknown>>;
}

/**
 * The runtime registry will be populated by the editor-ui package,
 * which has access to the actual React components.
 *
 * This is a factory function so we can lazily bind the components
 * without circular dependencies.
 */
export function createRegistry(components: Record<string, React.ComponentType<Record<string, unknown>>>): Record<ComponentType, RendererEntry> {
  const registry = {} as Record<ComponentType, RendererEntry>;

  for (const [type, component] of Object.entries(components)) {
    registry[type as ComponentType] = { component };
  }

  return registry;
}

/**
 * Resolve a component type to its render entry.
 * Falls back to a placeholder for unknown types.
 */
export function resolveComponent(
  registry: Record<string, RendererEntry>,
  type: string,
): RendererEntry | null {
  return registry[type] ?? null;
}
