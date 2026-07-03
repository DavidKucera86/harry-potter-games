import { test, expect } from '@playwright/test';
import { clearSessionStorage } from '../helpers/api';
import { waitForHangmanReady, clickNewGame } from '../helpers/hangman';

test.describe('API retry @edge', () => {
  test('E16: retries after server errors and eventually loads', { tag: '@edge' }, async ({ page }) => {
    let attempts = 0;

    await clearSessionStorage(page);
    await page.route('**/api/characters', (route) => {
      attempts++;
      if (attempts < 3) {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
        return;
      }
      route.fulfill({
        json: [{ id: '1', name: 'Al', house: 'Gryffindor', image: 'https://hp-api.local/al.png' }],
      });
    });

    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
    expect(attempts).toBe(3);
    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);

    await clickNewGame(page);
    await waitForHangmanReady(page);
  });
});
