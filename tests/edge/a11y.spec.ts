import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';

const gamePages = [
  { id: 'E39', path: '/guess-character-name/', ready: waitForHangmanReady },
  { id: 'E40', path: '/guess-spell/', ready: waitForHangmanReady },
  { id: 'E41', path: '/guess-house/', ready: waitForQuizReady },
  { id: 'E42', path: '/who-is-on-photo/', ready: waitForQuizReady },
];

test.describe('Accessibility @edge', () => {
  test('E49: menu page has no serious axe violations', { tag: '@edge' }, async ({ page }) => {
    await given('uživatel otevře hlavní menu', async () => {
      await page.goto('/');
    });

    let serious: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'] = [];
    await when('proběhne axe accessibility scan', async () => {
      const results = await new AxeBuilder({ page }).analyze();
      serious = results.violations.filter(
        violation => violation.impact === 'serious' || violation.impact === 'critical'
      );
    });

    await then('nejsou nalezeny serious ani critical porušení', async () => {
      expect(serious).toEqual([]);
    });
  });

  for (const game of gamePages) {
    test(`${game.id}: ${game.path} has no serious axe violations`, { tag: '@edge' }, async ({ page }) => {
      await given(`hra na adrese ${game.path} je načtená`, async () => {
        await setupGameMocks(page);
        await page.goto(game.path);
        await game.ready(page);
      });

      let serious: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'] = [];
      await when('proběhne axe accessibility scan', async () => {
        const results = await new AxeBuilder({ page }).analyze();
        serious = results.violations.filter(
          violation => violation.impact === 'serious' || violation.impact === 'critical'
        );
      });

      await then('nejsou nalezeny serious ani critical porušení', async () => {
        expect(serious).toEqual([]);
      });
    });
  }
});
