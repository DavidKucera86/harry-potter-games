import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetter } from '../helpers/hangman';

test.describe('Hangman diacritics @edge', () => {
  test('E4: normalized letter reveals accented character', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        { id: '8', name: 'Bélby', house: 'Ravenclaw', image: 'https://hp-api.local/belby.png' },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await guessLetter(page, 'e');
    await expect(page.locator('.letter-slot.revealed').first()).toHaveText('É');
  });
});
