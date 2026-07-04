import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetters, expectModalOpen } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Hangman lose @edge', () => {
  test('E4: losing all lives shows defeat modal with answer', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await guessLetters(page, ['q', 'w', 'e', 'r', 't', 'y', 'i', 'o', 'p', 'd']);
    await expectModalOpen(page, 'Došly životy!');
    await expect(page.locator(selectors.modalHighlight).first()).toHaveText('Albus');
  });
});
