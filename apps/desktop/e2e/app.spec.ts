import { test, expect } from './fixtures';

test.describe('DesignForge Desktop', () => {
  test('app window opens with correct title', async ({ window }) => {
    const title = await window.title();
    expect(title).toContain('DesignForge');
  });

  test('renderer loads without errors', async ({ window }) => {
    // Collect any uncaught errors during load
    const errors: string[] = [];
    window.on('pageerror', (err) => errors.push(err.message));

    // Give the renderer a moment to settle
    await window.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('main process exposes app version via IPC', async ({ electronApp }) => {
    const version = await electronApp.evaluate(async ({ app }) => {
      return app.getVersion();
    });
    expect(version).toBeTruthy();
  });
});
