
import { defineConfig, devices } from '@playwright/test';

const PORT = 3001;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Optional: configure other browsers
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
  webServer: {
    command: `npx serve . -l ${PORT} --no-clipboard -C '{ "headers": [{ "source": "**", "headers": [{"key": "Cache-Control", "value": "no-cache"}] }] }'`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    timeout: 120 * 1000, // 2 minutes
  },
});
