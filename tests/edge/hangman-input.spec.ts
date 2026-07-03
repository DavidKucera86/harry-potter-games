import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetter } from '../helpers/hangman';

test.describe('Hangman input @edge', () => {
  test.beforeEach(async ({ page }) => {
    await setupGameMocks(page, {
      characters: [{ id: '1', name: 'Al', house: 'Gryffindor', image: 'https://hp-api.local/al.png' }],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
  });

  test('E1: invalid input shows error message', { tag: '@edge' }, async ({ page }) => {
    await guessLetter(page, '');
    await expect(page.locator('#message')).toHaveClass(/error/);
    await expect(page.locator('#message')).toContainText('platné písmeno');

    await guessLetter(page, '1');
    await expect(page.locator('#message')).toContainText('platné písmeno');
  });

  test('E2: duplicate letter shows error', { tag: '@edge' }, async ({ page }) => {
    await guessLetter(page, 'q');
    await expect(page.locator('#message')).toHaveClass(/error/);

    await guessLetter(page, 'q');
    await expect(page.locator('#message')).toContainText('už jsi hádal');
  });

  test('E3: Enter key submits guess', { tag: '@edge' }, async ({ page }) => {
    await page.locator('#letterInput').fill('a');
    await page.locator('#letterInput').press('Enter');
    await expect(page.locator('#message')).toHaveClass(/success/);
  });
});
