import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Navigation @critical', () => {
  test('N01.01: menu → game → back → another game', { tag: '@critical' }, async ({ page }) => {
    await given('API je mockované a uživatel je na hlavním menu', async () => {
      await setupGameMocks(page);
      await page.goto('/');
    });

    await when('uživatel přejde do hry Hádej postavu', async () => {
      await page.locator('a.game-card[href="guess-character-name/"]').click();
      await expect(page).toHaveTitle(/Hádej postavu/);
      await waitForHangmanReady(page);
    });

    await when('uživatel se vrátí zpět do menu', async () => {
      await page.locator(selectors.backLink).click();
    });

    await then('zobrazí se menu se čtyřmi kartami', async () => {
      await expect(page.locator(selectors.gameCard)).toHaveCount(4);
    });

    await when('uživatel přejde do hry Hádej kolej', async () => {
      await page.locator('a.game-card[href="guess-house/"]').click();
    });

    await then('hra Hádej kolej se načte a je hratelná', async () => {
      await expect(page).toHaveTitle(/Hádej kolej/);
      await waitForQuizReady(page);
    });
  });
});
