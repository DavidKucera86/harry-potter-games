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
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Hangman character @critical', () => {
  test.beforeEach(async ({ page }) => {
    await given('hra Hádej postavu je načtená s mockovanou postavou „Albus“', async () => {
      await setupGameMocks(page, {
        characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });
  });

  test('H1: win by guessing all letters', { tag: '@critical' }, async ({ page }) => {
    await then('slovo má pět písmen v jedné skupině', async () => {
      await expect(page.locator(selectors.wordGroup)).toHaveCount(1);
      await expect(page.locator(`${selectors.wordDisplay} ${selectors.letterSlot}`)).toHaveCount(5);
    });

    await when('uživatel postupně uhádne písmena a, l, b, u, s', async () => {
      await guessLetter(page, 'a');
      await guessLetter(page, 'l');
      await guessLetter(page, 'b');
      await guessLetter(page, 'u');
      await guessLetter(page, 's');
    });

    await then('zobrazí se výherní modal s odpovědí „Albus“', async () => {
      await expect(page.locator('#message')).toHaveClass(/success/);
      await expectModalOpen(page, 'Gratulujeme!');
      await expect(page.locator(selectors.modalHighlight).first()).toHaveText('Albus');
    });
  });

  test('G1: new game resets state', { tag: '@critical' }, async ({ page }) => {
    await when('uživatel vyhraje hru uhádnutím slova „Albus“', async () => {
      await guessLetter(page, 'a');
      await guessLetter(page, 'l');
      await guessLetter(page, 'b');
      await guessLetter(page, 'u');
      await guessLetter(page, 's');
      await expectModalOpen(page, 'Gratulujeme!');
    });

    await when('uživatel spustí novou hru', async () => {
      await clickNewGame(page);
      await waitForHangmanReady(page);
    });

    await then('stav hry se resetuje — modal zmizí, životy jsou plné, žádné písmeno není odhalené', async () => {
      await expectModalClosed(page);
      await expectHeartCount(page, 10);
      await expect(page.locator('#wordDisplay .letter-slot.revealed')).toHaveCount(0);
    });
  });
});
