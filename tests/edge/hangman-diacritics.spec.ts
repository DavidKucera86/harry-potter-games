import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetter } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';

test.describe('Hangman diacritics @edge', () => {
  test('E06.01: normalized letter reveals accented character', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená s postavou „Bélby“', async () => {
      await setupGameMocks(page, {
        characters: [
          { id: '8', name: 'Bélby', house: 'Ravenclaw', image: 'https://hp-api.local/belby.png' },
        ],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await when('uživatel uhádne písmeno e bez diakritiky', async () => {
      await guessLetter(page, 'e');
    });

    await then('odhalí se písmeno É', async () => {
      await expect(page.locator('.letter-slot.revealed').first()).toHaveText('É');
    });
  });
});
