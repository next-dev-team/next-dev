/**
 * Editor Layout — verifies the Figma-like shell renders correctly.
 *
 * Covers: titlebar, toolbar, left panel (Components/Layers tabs),
 * canvas, right panel (Properties/Code/AI Chat tabs), and resize handles.
 */
import { test, expect } from './fixtures';

test.describe('Editor Layout', () => {
  test('titlebar shows app name and file indicator', async ({ window }) => {
    const titlebar = window.locator('.titlebar');
    await expect(titlebar).toBeVisible();
    await expect(titlebar).toContainText('DesignForge');
  });

  test('toolbar renders with all action groups', async ({ window }) => {
    const toolbar = window.locator('.editor-toolbar');
    await expect(toolbar).toBeVisible();

    // File actions
    await expect(window.locator('.file-btn', { hasText: 'New' })).toBeVisible();
    await expect(window.locator('.file-btn', { hasText: 'Open' })).toBeVisible();
    await expect(window.locator('.file-btn', { hasText: 'Save' })).toBeVisible();
    await expect(window.locator('.file-btn', { hasText: 'Export Code' })).toBeVisible();

    // History buttons (undo / redo)
    await expect(window.locator('.toolbar-btn[title*="Undo"]')).toBeVisible();
    await expect(window.locator('.toolbar-btn[title*="Redo"]')).toBeVisible();

    // Preview toggle
    await expect(window.locator('.preview-mode-toggle')).toBeVisible();

    // Settings
    await expect(window.locator('.toolbar-btn[title*="Settings"]')).toBeVisible();
  });

  test('left panel shows Components and Layers tabs', async ({ window }) => {
    const leftPanel = window.locator('.editor-left-panel');
    await expect(leftPanel).toBeVisible();

    const componentsTab = leftPanel.locator('button.panel-tab', { hasText: 'Components' });
    const layersTab = leftPanel.locator('button.panel-tab', { hasText: 'Layers' });

    await expect(componentsTab).toBeVisible();
    await expect(layersTab).toBeVisible();

    // Components tab is active by default
    await expect(componentsTab).toHaveAttribute('data-active', 'true');
  });

  test('right panel shows Properties, Code, and AI Chat tabs', async ({ window }) => {
    const rightPanel = window.locator('.editor-right-panel');
    await expect(rightPanel).toBeVisible();

    await expect(rightPanel.locator('button.panel-tab', { hasText: 'Properties' })).toBeVisible();
    await expect(rightPanel.locator('button.panel-tab', { hasText: 'Code' })).toBeVisible();
    await expect(rightPanel.locator('button.panel-tab', { hasText: 'AI Chat' })).toBeVisible();
  });

  test('canvas area is visible between panels', async ({ window }) => {
    const canvas = window.locator('.editor-canvas');
    await expect(canvas).toBeVisible();

    // Canvas frame exists inside
    const frame = window.locator('.canvas-frame');
    await expect(frame).toBeVisible();
  });

  test('both resize handles are present', async ({ window }) => {
    await expect(window.locator('.resize-handle--left')).toBeVisible();
    await expect(window.locator('.resize-handle--right')).toBeVisible();
  });
});
