import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  guessLetters,
  expectModalOpen,
} from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Hangman spell @critical', () => {
  test('H2: win spell hangman game', { tag: '@critical' }, async ({ page }) => {
    await setupGameMocks(page, {
      spells: [{ name: 'Lumos' }],
      random: 0,
    });
    await page.goto('/guess-spell/');
    await waitForHangmanReady(page);

    await expect(page.locator('#message')).toContainText('zaklínadle');

    await guessLetters(page, ['l', 'u', 'm', 'o', 's']);
    await expectModalOpen(page, 'Gratulujeme!');
    await expect(page.locator(selectors.modalText)).toContainText('zaklínadlo');
    await expect(page.locator(selectors.modalHighlight).first()).toHaveText('Lumos');
  });
});
