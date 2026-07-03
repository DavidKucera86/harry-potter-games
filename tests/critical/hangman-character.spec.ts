import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  guessLetter,
  expectModalOpen,
  expectModalClosed,
  clickNewGame,
  expectHeartCount,
} from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Hangman character @critical', () => {
  test.beforeEach(async ({ page }) => {
    await setupGameMocks(page, {
      characters: [{ id: '1', name: 'Al', house: 'Gryffindor', image: 'https://hp-api.local/al.png' }],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
  });

  test('H1: win by guessing all letters', { tag: '@critical' }, async ({ page }) => {
    await expect(page.locator(selectors.wordGroup)).toHaveCount(1);
    await expect(page.locator(`${selectors.wordDisplay} ${selectors.letterSlot}`)).toHaveCount(2);

    await guessLetter(page, 'a');
    await expect(page.locator('#message')).toHaveClass(/success/);
    await expect(page.locator('.letter-slot.revealed')).toHaveCount(1);

    await guessLetter(page, 'l');
    await expectModalOpen(page, 'Gratulujeme!');
    await expect(page.locator(selectors.modalHighlight)).toHaveText('Al');
  });

  test('G1: new game resets state', { tag: '@critical' }, async ({ page }) => {
    await guessLetter(page, 'a');
    await guessLetter(page, 'l');
    await expectModalOpen(page, 'Gratulujeme!');

    await clickNewGame(page);
    await waitForHangmanReady(page);
    await expectModalClosed(page);
    await expectHeartCount(page, 10);
    await expect(page.locator('#wordDisplay .letter-slot.revealed')).toHaveCount(0);
  });
});
