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
        // Same category as sw.ts and script.ts: bootstraps with no logic of their own,
        // exercised by E2E because that is the only place they can run. Named here
        // because vitest 4 made them visible — under v8's old range counting they were
        // diluted into invisibility by the data modules (see the note on thresholds).
        // registerSw.ts    -> pwa-offline.spec.ts, sw-update.spec.ts
        // prefetchGameData -> sw-update.spec.ts (E48.01), fetch-timeout.spec.ts
        // initLocale.ts    -> i18n.spec.ts
        'src/shared/registerSw.ts',
        'src/shared/prefetchGameData.ts',
        'src/shared/initLocale.ts',
        // Locale files are data, not logic; i18n/index.ts itself stays instrumented.
        'src/shared/i18n/locales/**',
        // Bootstraps that instantiate a game on import — E2E territory by design
        // (see the split rule in CLAUDE.md § Architecture).
        'src/**/script.ts',
        'src/shared/types.ts',
      ],
      // Baseline measured 2026-08-26 on vitest 4 (77.55 / 54.58 / 79.92 / 80.04).
      // Rule: round down to the nearest 5, but never leave under 2 points of cushion.
      // Ratchet up, never down. A gate set above what the suite actually achieves gets
      // switched off, and then nothing is gated at all.
      //
      // These are LOWER than the 85/75/85/85 that stood until 2026-08-26, and that is
      // not a loosened gate — it is a changed instrument. vitest 3's v8 provider counted
      // coverage from byte ranges, so every line of a data module counted as a covered
      // statement merely because the module was imported: topics.ts and followUps.ts
      // alone contributed ~2300 statements at 100%. vitest 4 counts by AST, and those
      // files collapse to one statement each. The old 87.74% was logic coverage diluted
      // by content; 77.55% is the logic on its own. Numbers before and after the switch
      // are not comparable — see docs/SUITE-HEALTH.md.
      thresholds: {
        statements: 75,
        branches: 50,
        functions: 75,
        lines: 75,
        autoUpdate: false,
      },
    },
  },
});
