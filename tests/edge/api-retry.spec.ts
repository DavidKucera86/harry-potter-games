import { test, expect } from '@playwright/test';
import { waitForHangmanReady, clickNewGame } from '../helpers/hangman';

test.describe('API retry @edge', () => {
  test('E26: retries after server errors and eventually loads', { tag: '@edge' }, async ({ page }) => {
    let attempts = 0;

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
    await waitForHangmanReady(page);
    expect(attempts).toBe(3);
    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);

    await clickNewGame(page);
    await waitForHangmanReady(page);
  });
});
