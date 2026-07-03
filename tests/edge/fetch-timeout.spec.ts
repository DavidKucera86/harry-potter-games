import { test, expect } from '@playwright/test';
import {
  clearSessionStorage,
  mockFetchHang,
  mockCharacters,
  mockImages,
  mockFallbackFailure,
  setFetchTimeout,
} from '../helpers/api';
import { clickNewGame, waitForHangmanReady } from '../helpers/hangman';

test.describe('Fetch timeout @edge', () => {
  test('E17: hangman shows timeout error and recovers on new game', { tag: '@edge' }, async ({ page }) => {
    await clearSessionStorage(page);
    await setFetchTimeout(page, 100);
    await mockFetchHang(page, 'characters');
    await mockFallbackFailure(page, 'characters');
    await mockImages(page);
    await page.goto('/guess-character-name/');

    await expect(page.locator('#message')).toHaveClass(/error/, { timeout: 10000 });
    await expect(page.locator('#message')).toContainText('příliš dlouho');
    await expect(page.locator('#newGameBtn')).toBeEnabled();

    await page.evaluate(() => {
      window.__HP_FETCH_TIMEOUT_MS = 15_000;
    });
    await page.unroute('**/api/characters');
    await page.unroute('**/shared/fixtures/characters.json');
    await mockCharacters(page, [
      { id: '1', name: 'Al', house: 'Gryffindor', image: 'https://hp-api.local/al.png' },
    ]);
    await clickNewGame(page);
    await waitForHangmanReady(page);
    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
  });
});
