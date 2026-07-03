import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  guessLetter,
  expectModalOpen,
  expectModalClosed,
  clickNewGame,
} from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Modal accessibility @edge', () => {
  test.beforeEach(async ({ page }) => {
    await setupGameMocks(page, {
      characters: [{ id: '1', name: 'Al', house: 'Gryffindor', image: 'https://hp-api.local/al.png' }],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
  });

  test('E14: modal has dialog semantics and traps focus', { tag: '@edge' }, async ({ page }) => {
    await guessLetter(page, 'a');
    await guessLetter(page, 'l');
    await expectModalOpen(page, 'Gratulujeme!');

    await expect(page.locator(selectors.modalDialog)).toHaveAttribute('role', 'dialog');
    await expect(page.locator(selectors.modalDialog)).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator(selectors.modalDialog)).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator(selectors.modalBtn)).toBeFocused();
  });

  test('E15: Escape closes modal and starts new game', { tag: '@edge' }, async ({ page }) => {
    await guessLetter(page, 'a');
    await guessLetter(page, 'l');
    await expectModalOpen(page, 'Gratulujeme!');

    await page.keyboard.press('Escape');
    await expectModalClosed(page);
    await waitForHangmanReady(page);
    await expect(page.locator('#wordDisplay .letter-slot.revealed')).toHaveCount(0);
  });

  test('E16: modal button starts new game', { tag: '@edge' }, async ({ page }) => {
    await guessLetter(page, 'a');
    await guessLetter(page, 'l');
    await expectModalOpen(page, 'Gratulujeme!');

    await clickNewGame(page);
    await waitForHangmanReady(page);
    await expectModalClosed(page);
  });
});
