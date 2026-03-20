/**
 * Component Palette — verifies palette grid, category headings,
 * and adding components to the canvas via click.
 */
import { test, expect } from './fixtures';

test.describe('Component Palette', () => {
  test('palette grid shows categorized components', async ({ window }) => {
    // Ensure the Components tab is active (default)
    const componentsTab = window.locator('button.panel-tab', { hasText: 'Components' });
    await expect(componentsTab).toHaveAttribute('data-active', 'true');

    // Palette grid is visible with at least one category heading
    const paletteGrid = window.locator('.palette-grid');
    await expect(paletteGrid).toBeVisible();

    const categories = paletteGrid.locator('.palette-category');
    expect(await categories.count()).toBeGreaterThan(0);

    // Each category has at least one palette item beneath it
    const items = paletteGrid.locator('.palette-item');
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('palette items are draggable', async ({ window }) => {
    const firstItem = window.locator('.palette-item').first();
    await expect(firstItem).toBeVisible();
    await expect(firstItem).toHaveAttribute('draggable', 'true');
  });

  test('clicking a palette item adds an element to the canvas', async ({ window }) => {
    // Count existing canvas elements before
    const canvasBefore = await window.locator('.canvas-element').count();

    // Click the first palette item
    const firstItem = window.locator('.palette-item').first();
    await firstItem.click();

    // A new canvas element should appear
    const canvasAfter = await window.locator('.canvas-element').count();
    expect(canvasAfter).toBeGreaterThan(canvasBefore);
  });

  test('clicking a palette item adds a layer to the layer tree', async ({ window }) => {
    // Add an element first
    await window.locator('.palette-item').first().click();

    // Switch to Layers tab
    const layersTab = window.locator('.editor-left-panel button.panel-tab', { hasText: 'Layers' });
    await layersTab.click();
    await expect(layersTab).toHaveAttribute('data-active', 'true');

    // Layer tree should have at least 2 items (root + the added element)
    const layerItems = window.locator('.layer-item');
    expect(await layerItems.count()).toBeGreaterThanOrEqual(2);
  });
});
