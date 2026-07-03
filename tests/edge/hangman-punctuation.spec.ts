import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetter, expectModalOpen } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Hangman punctuation @edge', () => {
  test('E18: punctuation is auto-revealed and word can be won', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        {
          id: '9',
          name: 'Tom Riddle Jr.',
          house: 'Slytherin',
          image: 'https://hp-api.local/riddle.png',
        },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await expect(page.locator('.letter-slot.revealed').filter({ hasText: '.' })).toHaveCount(1);

    for (const letter of ['t', 'o', 'm', 'r', 'i', 'd', 'l', 'e', 'j']) {
      await guessLetter(page, letter);
    }

    await expectModalOpen(page, 'Gratulujeme!');
    await expect(page.locator(selectors.modalHighlight)).toHaveText('Tom Riddle Jr.');
  });
});
