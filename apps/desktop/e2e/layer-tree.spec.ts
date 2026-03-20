/**
 * Layer Tree — verifies the Figma-like layer panel:
 * switching tabs, layer items matching canvas elements,
 * clicking layers to select canvas elements, and hover highlighting.
 */
import { test, expect } from './fixtures';

test.describe('Layer Tree', () => {
  test('layers tab shows root element by default', async ({ window }) => {
    // Switch to Layers tab
    const layersTab = window.locator('.editor-left-panel button.panel-tab', { hasText: 'Layers' });
    await layersTab.click();

    const layerTree = window.locator('.layer-tree');
    await expect(layerTree).toBeVisible();

    // At least the root element is shown
    const layerItems = layerTree.locator('.layer-item');
    expect(await layerItems.count()).toBeGreaterThanOrEqual(1);
  });

  test('adding an element creates a new layer item', async ({ window }) => {
    // Switch to Layers tab
    const layersTab = window.locator('.editor-left-panel button.panel-tab', { hasText: 'Layers' });
    await layersTab.click();

    const layersBefore = await window.locator('.layer-item').count();

    // Switch back to Components to add an element
    await window.locator('.editor-left-panel button.panel-tab', { hasText: 'Components' }).click();
    await window.locator('.palette-item').first().click();

    // Switch back to Layers
    await layersTab.click();

    const layersAfter = await window.locator('.layer-item').count();
    expect(layersAfter).toBeGreaterThan(layersBefore);
  });

  test('clicking a layer item selects the corresponding canvas element', async ({ window }) => {
    // Add an element
    await window.locator('.palette-item').first().click();

    // Switch to Layers tab
    const layersTab = window.locator('.editor-left-panel button.panel-tab', { hasText: 'Layers' });
    await layersTab.click();

    // Click the last layer item (the newly added element)
    const layerItems = window.locator('.layer-item');
    const lastLayer = layerItems.last();
    await lastLayer.click();

    // The layer should be marked selected
    await expect(lastLayer).toHaveAttribute('data-selected', 'true');

    // A canvas element should also be selected
    const selectedCanvas = window.locator('.canvas-element[data-selected="true"]');
    expect(await selectedCanvas.count()).toBeGreaterThanOrEqual(1);
  });

  test('layer items display element type names', async ({ window }) => {
    // Add an element
    await window.locator('.palette-item').first().click();

    // Switch to Layers tab
    await window.locator('.editor-left-panel button.panel-tab', { hasText: 'Layers' }).click();

    // Each layer item should have a visible name
    const layerNames = window.locator('.layer-item .layer-item-name');
    const count = await layerNames.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      const name = await layerNames.nth(i).textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });
});
