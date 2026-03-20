/**
 * Keyboard Shortcuts — verifies the Figma-like keybindings work correctly.
 */
import { test, expect } from './fixtures';

test.describe('Keyboard Shortcuts', () => {
  test('Ctrl+D duplicates the selected element', async ({ window }) => {
    // Add an element
    await window.locator('.palette-item').first().click();
    const countAfterAdd = await window.locator('.canvas-element').count();

    // Select the element
    await window.locator('.canvas-element').last().click();

    // Ctrl+D to duplicate
    await window.keyboard.press('Control+d');

    const countAfterDuplicate = await window.locator('.canvas-element').count();
    expect(countAfterDuplicate).toBeGreaterThan(countAfterAdd);
  });

  test('Ctrl+A selects all elements', async ({ window }) => {
    // Add two elements
    await window.locator('.palette-item').first().click();
    await window.locator('.palette-item').nth(1).click();

    // Ctrl+A to select all
    await window.keyboard.press('Control+a');

    // Multiple elements should be selected (data-selected="true")
    const selectedCount = await window.locator('.canvas-element[data-selected="true"]').count();
    expect(selectedCount).toBeGreaterThanOrEqual(2);
  });

  test('Escape clears selection', async ({ window }) => {
    await window.locator('.palette-item').first().click();
    await window.locator('.canvas-element').last().click();

    // Verify something is selected
    expect(await window.locator('.canvas-element[data-selected="true"]').count()).toBeGreaterThanOrEqual(1);

    // Escape to clear
    await window.keyboard.press('Escape');

    expect(await window.locator('.canvas-element[data-selected="true"]').count()).toBe(0);
  });

  test('Delete/Backspace removes selected element', async ({ window }) => {
    await window.locator('.palette-item').first().click();
    const countBefore = await window.locator('.canvas-element').count();

    await window.locator('.canvas-element').last().click();
    await window.keyboard.press('Backspace');

    const countAfter = await window.locator('.canvas-element').count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('Ctrl+, opens settings', async ({ window }) => {
    await window.keyboard.press('Control+,');

    // Settings page/overlay should appear
    // (the SettingsPage component is rendered by the App)
    await window.waitForTimeout(500);

    // Look for settings-related content
    const settingsVisible = await window.locator('[class*="settings"]').first().isVisible().catch(() => false);
    expect(settingsVisible).toBe(true);
  });
});
