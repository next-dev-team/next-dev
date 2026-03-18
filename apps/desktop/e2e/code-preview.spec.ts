import { test, expect } from './fixtures';

test('Code tab shows Monaco editor with generated code', async ({ window }) => {
  // Wait for the app to fully render
  await window.waitForSelector('.panel-tabs', { timeout: 15000 });

  // Click the Code tab
  const codeTab = window.locator('button.panel-tab').filter({ hasText: 'Code' });
  await expect(codeTab).toBeVisible();
  await codeTab.click();

  // Verify the IDE preview panel appears
  const idePreview = window.locator('.ide-preview');
  await expect(idePreview).toBeVisible();

  // Verify tab bar with App.tsx default active
  const activeTab = window.locator('.ide-tab[data-active="true"]');
  await expect(activeTab).toBeVisible();
  await expect(activeTab).toContainText('App.tsx');

  // Verify action buttons exist (copy, word wrap)
  const actionBar = window.locator('.ide-action-bar');
  await expect(actionBar).toBeVisible();

  // Wait for Monaco editor to load (can be slow in Electron builds)
  const editor = window.locator('.ide-editor .monaco-editor');
  await expect(editor).toBeVisible({ timeout: 30000 });

  // Verify status bar is visible with language info
  const statusBar = window.locator('.ide-status-bar');
  await expect(statusBar).toBeVisible();
  await expect(statusBar).toContainText('TypeScript');
  await expect(statusBar).toContainText('line');

  // Take a screenshot of the code preview
  await window.screenshot({ path: 'test-results/code-preview.png', fullPage: false });
});

test('Code tab file selector via tab bar works', async ({ window }) => {
  await window.waitForSelector('.panel-tabs', { timeout: 15000 });

  // Switch to Code tab
  await window.locator('button.panel-tab').filter({ hasText: 'Code' }).click();
  await expect(window.locator('.ide-preview')).toBeVisible();

  // Wait for Monaco to load
  await expect(window.locator('.ide-editor .monaco-editor')).toBeVisible({ timeout: 30000 });

  // Click the design-spec.ts tab
  const specTab = window.locator('.ide-tab').filter({ hasText: 'design-spec.ts' });
  await specTab.click();

  // Verify it's now active
  await expect(specTab).toHaveAttribute('data-active', 'true');

  // Verify the status bar updated to TypeScript
  await expect(window.locator('.ide-status-bar')).toContainText('TypeScript');
});
