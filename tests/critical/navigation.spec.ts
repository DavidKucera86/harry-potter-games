import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Navigation @critical', () => {
  test('N1: menu → game → back → another game', { tag: '@critical' }, async ({ page }) => {
    await setupGameMocks(page);

    await page.goto('/');
    await page.locator('a.game-card[href="guess-character-name/"]').click();
    await expect(page).toHaveTitle(/Hádej postavu/);
    await waitForHangmanReady(page);

    await page.locator(selectors.backLink).click();
    await expect(page.locator(selectors.gameCard)).toHaveCount(4);

    await page.locator('a.game-card[href="guess-house/"]').click();
    await expect(page).toHaveTitle(/Hádej kolej/);
    await waitForQuizReady(page);
  });
});
