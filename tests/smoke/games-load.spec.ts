import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

const gamePages = [
  { path: '/guess-character-name/', wait: waitForHangmanReady },
  { path: '/guess-spell/', wait: waitForHangmanReady },
  { path: '/guess-house/', wait: waitForQuizReady },
  { path: '/who-is-on-photo/', wait: waitForQuizReady },
];

test.describe('Games load @smoke', () => {
  for (const game of gamePages) {
    test(`S3: ${game.path} loads and becomes playable`, { tag: '@smoke' }, async ({ page }) => {
      await setupGameMocks(page);
      await page.goto(game.path);
      await game.wait(page);

      await expect(page.locator(selectors.loadingOverlay)).toBeHidden();
      await expect(page.locator(selectors.hearts)).toHaveCount(10);
      await expect(page.locator(selectors.newGameBtn)).toBeEnabled();
    });
  }

  test('S4: shared scripts load without critical console errors', { tag: '@smoke' }, async ({ page }) => {
    const criticalErrors: string[] = [];

    page.on('pageerror', (error) => {
      criticalErrors.push(error.message);
    });

    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      if (
        text.includes('ReferenceError') ||
        text.includes('Failed to load') ||
        text.includes('is not defined')
      ) {
        criticalErrors.push(text);
      }
    });

    await setupGameMocks(page);

    for (const game of gamePages) {
      await page.goto(game.path);
      await game.wait(page);
    }

    expect(criticalErrors).toEqual([]);
  });

  test('S5: back link returns to menu', { tag: '@smoke' }, async ({ page }) => {
    await setupGameMocks(page);
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await page.locator(selectors.backLink).click();
    await expect(page).toHaveURL(/\/index\.html?$|\/$/);
    await expect(page.locator(selectors.gameCard)).toHaveCount(4);
  });
});
