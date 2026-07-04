import { test, expect } from '@playwright/test';
import {
  mockFetchHang,
  mockCharacters,
  mockImages,
  mockFallbackFailure,
  setFetchTimeout,
} from '../helpers/api';
import { clickNewGame, waitForHangmanReady } from '../helpers/hangman';

test.describe('Fetch timeout @edge', () => {
  test('E23: hangman shows timeout error and recovers on new game', { tag: '@edge' }, async ({ page }) => {
    await setFetchTimeout(page, 100);
    await mockFetchHang(page, 'characters');
    await mockFallbackFailure(page, 'characters');
    await mockImages(page);
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/guess-character-name/');

    await expect(page.locator('#message')).toHaveClass(/error/, { timeout: 15000 });
    await expect(page.locator('#message')).toContainText('příliš dlouho');
    await expect(page.locator('#newGameBtn')).toBeEnabled();

    await page.evaluate(() => {
      window.__HP_FETCH_TIMEOUT_MS = 15_000;
    });
    await page.unroute('**/api/characters');
    await page.unroute('**/shared/fixtures/characters.json');
    await mockCharacters(page, [
      { id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' },
    ]);
    await clickNewGame(page);
    await waitForHangmanReady(page);
    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
  });

  test('E24: retries hung requests and loads on later attempt', { tag: '@edge' }, async ({ page }) => {
    let attempts = 0;

    await setFetchTimeout(page, 100);
    await page.route('**/api/characters', async (route) => {
      attempts++;
      if (attempts < 3) {
        await new Promise(() => {});
        return;
      }
      await route.fulfill({
        json: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
      });
    });
    await mockImages(page);
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/guess-character-name/');

    await waitForHangmanReady(page);
    expect(attempts).toBe(3);
    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
  });
});
