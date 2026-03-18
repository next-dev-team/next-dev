/**
 * Playwright config for DesignForge Electron E2E tests.
 *
 * This project uses Playwright's Electron support (_electron.launch()).
 * Tests MUST import { test, expect } from './fixtures' which provides
 * the `electronApp` and `window` fixtures — never open a standalone browser.
 *
 * @see https://playwright.dev/docs/api/class-electron
 * @see e2e/fixtures.ts
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,

  /* Electron tests must run serially — only one app instance at a time */
  workers: 1,
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],

  outputDir: 'test-results',

  /*
   * No "projects" block — we intentionally skip browser projects.
   * Electron launches its own Chromium via _electron.launch() in fixtures.ts.
   * No baseURL is needed; the renderer loads from the built Electron app.
   */
});
