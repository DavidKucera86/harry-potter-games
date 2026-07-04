import { test, expect } from '@playwright/test';
import { mockApiFailure, mockCharacters, mockImages } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady, clickNewGame } from '../helpers/hangman';
import { quizCharacters } from '../helpers/quiz';

async function mockFallbackFailure(page: import('@playwright/test').Page) {
  await page.route('**/shared/fixtures/characters.json', (route) => {
    route.fulfill({ status: 500, body: 'Fallback unavailable' });
  });
}

test.describe('API failure @edge', () => {
  test('E10: hangman shows error and recovers on new game', { tag: '@edge' }, async ({ page }) => {
    await mockApiFailure(page, 'characters');
    await mockFallbackFailure(page);
    await mockImages(page);
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/guess-character-name/');

    await expect(page.locator('#message')).toHaveClass(/error/, { timeout: 10000 });
    await expect(page.locator('#message')).toContainText('Nepodařilo se načíst');
    await expect(page.locator('#newGameBtn')).toBeEnabled();

    await page.unroute('**/api/characters');
    await page.unroute('**/shared/fixtures/characters.json');
    await mockCharacters(page, [
      { id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' },
    ]);
    await clickNewGame(page);
    await waitForHangmanReady(page);
    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
  });

  test('E11: guess-house shows error and recovers on new game', { tag: '@edge' }, async ({ page }) => {
    await mockApiFailure(page, 'characters');
    await mockFallbackFailure(page);
    await mockImages(page);
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/guess-house/');

    await expect(page.locator('#message')).toHaveClass(/error/, { timeout: 10000 });
    await expect(page.locator('#newGameBtn')).toBeEnabled();

    await page.unroute('**/api/characters');
    await page.unroute('**/shared/fixtures/characters.json');
    await mockCharacters(page, quizCharacters);
    await clickNewGame(page);
    await waitForQuizReady(page);
  });
});
