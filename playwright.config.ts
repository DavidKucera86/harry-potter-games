import { defineConfig, devices } from '@playwright/test';

const isProduction = process.env.PLAYWRIGHT_TARGET === 'production';
const baseURL = isProduction
  ? process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173'
  : 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './tests',
  testIgnore: '**/unit/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['github']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    locale: 'cs-CZ',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: isProduction
    ? undefined
    : {
        command: 'npx serve . -l 4173',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
      },
});
