import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';

const gamePages = [
  { path: '/guess-character-name/', ready: waitForHangmanReady },
  { path: '/guess-spell/', ready: waitForHangmanReady },
  { path: '/guess-house/', ready: waitForQuizReady },
  { path: '/who-is-on-photo/', ready: waitForQuizReady },
];

test.describe('Accessibility @edge', () => {
  for (const game of gamePages) {
    test(`E15: ${game.path} has no serious axe violations`, { tag: '@edge' }, async ({ page }) => {
      await setupGameMocks(page);
      await page.goto(game.path);
      await game.ready(page);

      const results = await new AxeBuilder({ page })
        .analyze();

      const serious = results.violations.filter(
        violation => violation.impact === 'serious' || violation.impact === 'critical'
      );

      expect(serious).toEqual([]);
    });
  }
});
