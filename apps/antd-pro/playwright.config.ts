import { defineConfig, devices } from '@playwright/test';
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const BASE = process.env.PW_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  use: { baseURL: BASE },
  webServer: {
    command: `cross-env PORT=${PORT} pnpm dev`,
    port: PORT,
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
  ],
});