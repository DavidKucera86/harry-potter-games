import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  guessLetters,
  expectModalOpen,
} from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Hangman spell @critical', () => {
  test('H02.01: win spell hangman game', { tag: '@critical' }, async ({ page }) => {
    await given('hra Hádej zaklínadlo je načtená se slovem „Lumos“', async () => {
      await setupGameMocks(page, {
        spells: [{ name: 'Lumos' }],
        random: 0,
      });
      await page.goto('/guess-spell/');
      await waitForHangmanReady(page);
    });

    await then('zobrazí se výzva k hádání zaklínadla', async () => {
      await expect(page.locator('#message')).toContainText('zaklínadle');
    });

    await when('uživatel uhádne všechna písmena zaklínadla Lumos', async () => {
      await guessLetters(page, ['l', 'u', 'm', 'o', 's']);
    });

    await then('zobrazí se výherní modal se správným zaklínadlem', async () => {
      await expectModalOpen(page, 'Gratulujeme!');
      await expect(page.locator(selectors.modalText)).toContainText('zaklínadlo');
      await expect(page.locator(selectors.modalHighlight).first()).toHaveText('Lumos');
    });
  });
});
