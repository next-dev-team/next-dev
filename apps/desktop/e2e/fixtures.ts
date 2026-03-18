/**
 * Electron test fixtures for Playwright.
 *
 * Provides `electronApp` and `window` fixtures that launch the built
 * DesignForge Electron app before each test and tear it down after.
 *
 * Usage:
 *   import { test, expect } from './fixtures';
 *   test('window title', async ({ window }) => {
 *     expect(await window.title()).toContain('DesignForge');
 *   });
 */

import { test as base, type Page } from '@playwright/test';
import { _electron as electron, type ElectronApplication } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to the built main process entry point
const MAIN_ENTRY = resolve(__dirname, '../out/main/index.js');

type ElectronFixtures = {
  electronApp: ElectronApplication;
  window: Page;
};

export const test = base.extend<ElectronFixtures>({
  // biome-ignore lint: Playwright fixture signature requires destructured use
  electronApp: async ({}, use) => {
    const app = await electron.launch({
      args: [MAIN_ENTRY],
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    });
    await use(app);
    await app.close();
  },

  window: async ({ electronApp }, use) => {
    // Wait for the first BrowserWindow to open
    const window = await electronApp.firstWindow();
    // Wait until the renderer has fully loaded
    await window.waitForLoadState('domcontentloaded');
    await use(window);
  },
});

export { expect } from '@playwright/test';
