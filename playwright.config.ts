import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

const target = process.env.PLAYWRIGHT_TARGET ?? 'local';
const isProduction = target === 'production';
const baseURL = isProduction
  ? process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173'
  : 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './tests',
  testIgnore: '**/unit/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    },
  },
  // PLAYWRIGHT_CATALOG=1 attaches the Given-When-Then catalog reporter to a normal suite
  // run, so docs/E2E-TEST-CATALOG.md is a by-product of the tests we already run rather
  // than a second full run. CI regenerates it this way and then fails on `git diff` —
  // the catalog is a History oracle, and a hook that silently rewrites it is not one.
  reporter: [
    ...(process.env.CI
      ? [['list'], ['html', { open: 'never' }], ['github']]
      : [['list'], ['html', { open: 'never' }]]),
    ...(process.env.PLAYWRIGHT_CATALOG
      ? [['./scripts/gwt-catalog-reporter.ts']]
      : []),
  ] as NonNullable<PlaywrightTestConfig['reporter']>,
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
