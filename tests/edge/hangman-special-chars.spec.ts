import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  guessLetter,
  expectModalOpen,
} from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Hangman special characters @edge', () => {
  test('E13: auto-revealed apostrophe allows winning', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        { id: '9', name: "O'Brien", house: 'Gryffindor', image: 'https://hp-api.local/obrien.png' },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await expect(page.locator('.letter-slot.revealed')).toHaveCount(1);
    await expect(page.locator('.letter-slot.revealed').first()).toHaveText("'");

    for (const letter of ['o', 'b', 'r', 'i', 'e', 'n']) {
      await guessLetter(page, letter);
    }

    await expectModalOpen(page, 'Gratulujeme!');
    await expect(page.locator(selectors.modalHighlight).first()).toHaveText("O'Brien");
  });
});
