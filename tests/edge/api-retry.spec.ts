import { test, expect } from '@playwright/test';
import { waitForHangmanReady, clickNewGame } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';

test.describe('API retry @edge', () => {
  test('E26: retries after server errors and eventually loads', { tag: '@edge' }, async ({ page }) => {
    let attempts = 0;

    await given('API vrací 5xx chyby první dva pokusy', async () => {
      await page.route('**/api/characters', (route) => {
        attempts++;
        if (attempts < 3) {
          route.fulfill({ status: 500, body: 'Internal Server Error' });
          return;
        }
        route.fulfill({
          json: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
        });
      });
      await page.goto('/');
      await page.evaluate(() => sessionStorage.clear());
      await page.goto('/guess-character-name/');
    });

    await then('hra se načte po třetím pokusu', async () => {
      await waitForHangmanReady(page);
      expect(attempts).toBe(3);
      await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
    });

    await when('uživatel spustí novou hru', async () => {
      await clickNewGame(page);
      await waitForHangmanReady(page);
    });

    await then('hra zůstane hratelná', async () => {
      await expect(page.locator('#guessBtn')).toBeEnabled();
    });
  });
});
