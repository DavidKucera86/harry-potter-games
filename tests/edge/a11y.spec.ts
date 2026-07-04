import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';

const gamePages = [
  { id: 'E39', path: '/guess-character-name/', ready: waitForHangmanReady },
  { id: 'E40', path: '/guess-spell/', ready: waitForHangmanReady },
  { id: 'E41', path: '/guess-house/', ready: waitForQuizReady },
  { id: 'E42', path: '/who-is-on-photo/', ready: waitForQuizReady },
];

test.describe('Accessibility @edge', () => {
  test('E49: menu page has no serious axe violations', { tag: '@edge' }, async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      violation => violation.impact === 'serious' || violation.impact === 'critical'
    );

    expect(serious).toEqual([]);
  });

  for (const game of gamePages) {
    test(`${game.id}: ${game.path} has no serious axe violations`, { tag: '@edge' }, async ({ page }) => {
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
