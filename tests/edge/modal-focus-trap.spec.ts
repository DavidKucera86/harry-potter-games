import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetters, expectModalOpen } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Modal focus trap @edge', () => {
  test('E19: defeat modal has dialog role and focus on action button', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [{ id: '1', name: 'Al', house: 'Gryffindor', image: 'https://hp-api.local/al.png' }],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await guessLetters(page, ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']);
    await expectModalOpen(page, 'Došly životy!');

    await expect(page.locator('.modal[role="dialog"]')).toBeVisible();
    await expect(page.locator(selectors.modalBtn)).toBeFocused();
  });
});
