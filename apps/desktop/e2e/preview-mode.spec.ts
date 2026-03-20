/**
 * Preview Mode — verifies the editor ↔ preview toggle works correctly,
 * including browser chrome, non-interactive elements, and keyboard shortcut.
 */
import { test, expect } from './fixtures';

test.describe('Preview Mode', () => {
  test('clicking preview toggle enters preview mode', async ({ window }) => {
    const toggle = window.locator('.preview-mode-toggle');
    await expect(toggle).toBeVisible();

    // Should NOT be in preview mode initially
    await expect(toggle).not.toHaveClass(/preview-mode-active/);

    // Click to enter preview mode
    await toggle.click();

    // Toggle should now be active
    await expect(toggle).toHaveClass(/preview-mode-active/);

    // Canvas frame should have preview class
    const frame = window.locator('.canvas-frame');
    await expect(frame).toHaveClass(/canvas-frame--preview/);

    // Browser chrome should appear
    await expect(window.locator('.browser-chrome')).toBeVisible();
    await expect(window.locator('.browser-dot--close')).toBeVisible();
    await expect(window.locator('.browser-address-bar')).toBeVisible();

    // Canvas should be in preview mode
    const canvas = window.locator('.editor-canvas');
    await expect(canvas).toHaveAttribute('data-preview-mode', 'true');
  });

  test('clicking preview toggle again exits preview mode', async ({ window }) => {
    const toggle = window.locator('.preview-mode-toggle');

    // Enter preview mode
    await toggle.click();
    await expect(toggle).toHaveClass(/preview-mode-active/);

    // Exit preview mode
    await toggle.click();
    await expect(toggle).not.toHaveClass(/preview-mode-active/);

    // Browser chrome should disappear
    await expect(window.locator('.browser-chrome')).toHaveCount(0);
  });

  test('Ctrl+P toggles preview mode', async ({ window }) => {
    const toggle = window.locator('.preview-mode-toggle');

    // Enter preview mode via keyboard
    await window.keyboard.press('Control+p');
    await expect(toggle).toHaveClass(/preview-mode-active/);

    // Exit via keyboard
    await window.keyboard.press('Control+p');
    await expect(toggle).not.toHaveClass(/preview-mode-active/);
  });

  test('toolbar edit buttons are disabled in preview mode', async ({ window }) => {
    // Add an element so buttons would normally be enabled
    await window.locator('.palette-item').first().click();
    await window.locator('.canvas-element').last().click();

    // Enter preview mode
    await window.locator('.preview-mode-toggle').click();

    // Undo/redo should be disabled
    await expect(window.locator('.toolbar-btn[title*="Undo"]')).toBeDisabled();
    await expect(window.locator('.toolbar-btn[title*="Redo"]')).toBeDisabled();

    // Element action buttons should be disabled
    await expect(window.locator('.toolbar-btn[title="Delete"]')).toBeDisabled();

    // Exit preview mode
    await window.locator('.preview-mode-toggle').click();
  });

  test('canvas elements are non-interactive in preview mode', async ({ window }) => {
    await window.locator('.palette-item').first().click();

    // Enter preview mode
    await window.locator('.preview-mode-toggle').click();

    // Canvas elements should have data-preview="true"
    const previewElements = window.locator('.canvas-element[data-preview="true"]');
    expect(await previewElements.count()).toBeGreaterThan(0);

    // Exit preview mode
    await window.locator('.preview-mode-toggle').click();
  });
});
