import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  guessLetter,
  expectModalOpen,
  expectModalClosed,
  clickNewGame,
} from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

async function winAlbus(page: import('@playwright/test').Page) {
  for (const letter of ['a', 'l', 'b', 'u', 's']) {
    await guessLetter(page, letter);
  }
}

test.describe('Modal accessibility @edge', () => {
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

  test('E18.01: modal has dialog semantics and traps focus', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel vyhraje hru', async () => {
      await winAlbus(page);
      await expectModalOpen(page, 'Gratulujeme!');
    });

    await then('modal má správné ARIA atributy a zachycený focus', async () => {
      await expect(page.locator(selectors.modalDialog)).toHaveAttribute('role', 'dialog');
      await expect(page.locator(selectors.modalDialog)).toHaveAttribute('aria-modal', 'true');
      await expect(page.locator(selectors.modalDialog)).toHaveAttribute('aria-hidden', 'false');
      await expect(page.locator(selectors.modalBtn)).toBeFocused();
    });
  });

  test('E19.01: Escape closes modal and starts new game', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel vyhraje hru a stiskne Escape', async () => {
      await winAlbus(page);
      await expectModalOpen(page, 'Gratulujeme!');
      await page.keyboard.press('Escape');
    });

    await then('modal se zavře a spustí se nová hra', async () => {
      await expectModalClosed(page);
      await waitForHangmanReady(page);
      await expect(page.locator('#wordDisplay .letter-slot.revealed')).toHaveCount(0);
    });
  });

  test('E20.01: modal button starts new game', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel vyhraje hru a klikne na tlačítko v modalu', async () => {
      await winAlbus(page);
      await expectModalOpen(page, 'Gratulujeme!');
      await clickNewGame(page);
      await waitForHangmanReady(page);
    });

    await then('modal se zavře a hra pokračuje', async () => {
      await expectModalClosed(page);
    });
  });
});
