import type { Components } from '@json-render/react-native';
import { defineRegistry } from '@json-render/react-native';
import * as RnUniWind from '@next-dev/rn-uniwind';
import { getComponentTypes } from './definitions.js';
import { activeCatalog } from './json-render.js';

const registryEntries: Array<[string, unknown]> = [];
for (const type of getComponentTypes()) {
  const component = (RnUniWind as Record<string, unknown>)[type];
  if (component) {
    registryEntries.push([type, component]);
  }
}

const registryComponents = Object.fromEntries(registryEntries) as Components<typeof activeCatalog>;

export const { registry: jsonRenderRegistry } = defineRegistry(activeCatalog, {
  components: registryComponents,
});
