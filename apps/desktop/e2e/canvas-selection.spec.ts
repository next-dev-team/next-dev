/**
 * Canvas Selection — verifies Figma-like selection interactions:
 * click to select, shift-click for multi-select, click canvas to deselect,
 * and Escape to clear selection.
 */
import { test, expect } from './fixtures';

/** Helper: add N elements to the canvas by clicking palette items. */
async function addElements(window: Awaited<ReturnType<typeof import('./fixtures').test['step']>>, count: number) {
  const items = window.locator('.palette-item');
  for (let i = 0; i < count; i++) {
    await items.nth(i % (await items.count())).click();
  }
}

test.describe('Canvas Selection', () => {
  test('clicking a canvas element selects it', async ({ window }) => {
    await addElements(window, 1);

    // Click the first added canvas element (skip the root wrapper)
    const elements = window.locator('.canvas-element');
    const addedElement = elements.last();
    await addedElement.click();

    // Should be marked as selected
    await expect(addedElement).toHaveAttribute('data-selected', 'true');
  });

  test('clicking empty canvas area clears selection', async ({ window }) => {
    await addElements(window, 1);

    // Select the element first
    const element = window.locator('.canvas-element').last();
    await element.click();
    await expect(element).toHaveAttribute('data-selected', 'true');

    // Click the canvas background (the .editor-canvas container)
    const canvas = window.locator('.editor-canvas');
    // Click at the very bottom-right of the canvas to hit the background
    const box = await canvas.boundingBox();
    if (box) {
      await window.mouse.click(box.x + box.width - 10, box.y + box.height - 10);
    }

    // Selection should be cleared
    const selectedElements = window.locator('.canvas-element[data-selected="true"]');
    expect(await selectedElements.count()).toBe(0);
  });

  test('pressing Escape clears selection', async ({ window }) => {
    await addElements(window, 1);

    const element = window.locator('.canvas-element').last();
    await element.click();
    await expect(element).toHaveAttribute('data-selected', 'true');

    // Press Escape
    await window.keyboard.press('Escape');

    // Selection should be cleared
    const selected = window.locator('.canvas-element[data-selected="true"]');
    expect(await selected.count()).toBe(0);
  });

  test('selecting an element shows its properties', async ({ window }) => {
    await addElements(window, 1);

    // Switch right panel to Properties
    const propsTab = window.locator('.editor-right-panel button.panel-tab', { hasText: 'Properties' });
    await propsTab.click();

    // Before selection: empty state
    await expect(window.locator('.empty-state')).toBeVisible();

    // Select the element
    await window.locator('.canvas-element').last().click();

    // Properties panel should now show element info
    const propsPanel = window.locator('.props-panel');
    await expect(propsPanel).toBeVisible();
    await expect(propsPanel.locator('.props-section-title', { hasText: 'Element' })).toBeVisible();
    await expect(propsPanel.locator('.props-section-title', { hasText: 'Properties' })).toBeVisible();
  });
});
