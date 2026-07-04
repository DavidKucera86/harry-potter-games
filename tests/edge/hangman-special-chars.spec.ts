import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  guessLetter,
  expectModalOpen,
} from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Hangman special characters @edge', () => {
  test('E13: auto-revealed apostrophe allows winning', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená s postavou „O\'Brien“', async () => {
      await setupGameMocks(page, {
        characters: [
          { id: '9', name: "O'Brien", house: 'Gryffindor', image: 'https://hp-api.local/obrien.png' },
        ],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await then('apostrof je automaticky odhalený', async () => {
      await expect(page.locator('.letter-slot.revealed')).toHaveCount(1);
      await expect(page.locator('.letter-slot.revealed').first()).toHaveText("'");
    });

    await when('uživatel uhádne zbývající písmena', async () => {
      for (const letter of ['o', 'b', 'r', 'i', 'e', 'n']) {
        await guessLetter(page, letter);
      }
    });

    await then('zobrazí se výherní modal s odpovědí O\'Brien', async () => {
      await expectModalOpen(page, 'Gratulujeme!');
      await expect(page.locator(selectors.modalHighlight).first()).toHaveText("O'Brien");
    });
  });
});
