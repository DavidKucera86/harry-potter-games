import { test, expect } from '@playwright/test';
import { clearSessionStorage, mockApiFailure, mockCharacters, mockImages } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady, clickNewGame } from '../helpers/hangman';
import { quizCharacters } from '../helpers/quiz';

test.describe('API failure @edge', () => {
  test('E7: hangman shows error and recovers on new game', { tag: '@edge' }, async ({ page }) => {
    await clearSessionStorage(page);
    await mockApiFailure(page, 'characters');
    await mockImages(page);
    await page.goto('/guess-character-name/');

    await expect(page.locator('#message')).toHaveClass(/error/, { timeout: 10000 });
    await expect(page.locator('#message')).toContainText('Nepodařilo se načíst');
    await expect(page.locator('#newGameBtn')).toBeEnabled();

    await mockCharacters(page, [
      { id: '1', name: 'Al', house: 'Gryffindor', image: 'https://hp-api.local/al.png' },
    ]);
    await clickNewGame(page);
    await waitForHangmanReady(page);
    await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
  });

  test('E7: guess-house shows error and recovers on new game', { tag: '@edge' }, async ({ page }) => {
    await clearSessionStorage(page);
    await mockApiFailure(page, 'characters');
    await mockImages(page);
    await page.goto('/guess-house/');

    await expect(page.locator('#message')).toHaveClass(/error/, { timeout: 10000 });
    await expect(page.locator('#newGameBtn')).toBeEnabled();

    await mockCharacters(page, quizCharacters);
    await clickNewGame(page);
    await waitForQuizReady(page);
  });
});
