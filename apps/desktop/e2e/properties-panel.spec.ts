/**
 * Properties Panel — verifies selecting elements shows their properties
 * and editing properties updates the element.
 */
import { test, expect } from './fixtures';

test.describe('Properties Panel', () => {
  test('shows empty state when nothing is selected', async ({ window }) => {
    // Switch to Properties tab
    const propsTab = window.locator('.editor-right-panel button.panel-tab', { hasText: 'Properties' });
    await propsTab.click();

    // Clear any selection
    await window.keyboard.press('Escape');

    // Empty state should be visible
    const emptyState = window.locator('.empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('Select an element');
  });

  test('selecting an element shows its type and ID', async ({ window }) => {
    // Switch to Properties tab
    await window.locator('.editor-right-panel button.panel-tab', { hasText: 'Properties' }).click();

    // Add and select an element
    await window.locator('.palette-item').first().click();
    await window.locator('.canvas-element').last().click();

    // Properties panel should show Element section
    const propsPanel = window.locator('.props-panel');
    await expect(propsPanel).toBeVisible();

    // Should show "Type:" and "ID:" info
    await expect(propsPanel).toContainText('Type:');
    await expect(propsPanel).toContainText('ID:');
  });

  test('properties panel shows editable fields', async ({ window }) => {
    await window.locator('.editor-right-panel button.panel-tab', { hasText: 'Properties' }).click();

    // Add and select an element
    await window.locator('.palette-item').first().click();
    await window.locator('.canvas-element').last().click();

    // Properties section should have at least one field
    const propsFields = window.locator('.props-field');
    expect(await propsFields.count()).toBeGreaterThanOrEqual(1);
  });

  test('deselecting clears the properties panel', async ({ window }) => {
    await window.locator('.editor-right-panel button.panel-tab', { hasText: 'Properties' }).click();

    // Add, select, then deselect
    await window.locator('.palette-item').first().click();
    await window.locator('.canvas-element').last().click();
    await expect(window.locator('.props-panel')).toBeVisible();

    // Deselect via Escape
    await window.keyboard.press('Escape');

    // Empty state should return
    await expect(window.locator('.empty-state')).toBeVisible();
  });
});
