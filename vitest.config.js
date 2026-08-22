import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html', 'json-summary'],
      reportsDirectory: 'coverage',
      // Only the TypeScript source is instrumented. The committed esbuild artifacts
      // (shared/*.js, <game>/script.js) are generated output, not code we author.
      include: ['src/**/*.ts'],
      exclude: [
        // Service worker: runs in a worker scope, covered by tests/edge/pwa-offline
        // and sw-update rather than by unit tests.
        'src/shared/sw.ts',
        // Locale files are data, not logic; i18n/index.ts itself stays instrumented.
        'src/shared/i18n/locales/**',
        // Bootstraps that instantiate a game on import — E2E territory by design
        // (see the split rule in CLAUDE.md § Architecture).
        'src/**/script.ts',
        'src/shared/types.ts',
      ],
      // Baseline measured 2026-08-22 (87.74 / 78.67 / 85.10 / 87.74), rounded down.
      // Ratchet up, never down.
      // A gate set above what the suite actually achieves gets switched off, and then
      // nothing is gated at all.
      thresholds: {
        statements: 85,
        branches: 75,
        functions: 85,
        lines: 85,
        autoUpdate: false,
      },
    },
  },
});
