import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetters, expectModalOpen } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('XSS safe DOM @edge', () => {
  test('E25: malicious character name is rendered as text in modal', { tag: '@edge' }, async ({ page }) => {
    let dialogShown = false;
    page.on('dialog', () => {
      dialogShown = true;
    });

    await given('hra je načtená s postavou obsahující XSS payload v názvu', async () => {
      await setupGameMocks(page, {
        characters: [
          {
            id: '99',
            name: '<script>alert(1)</script>',
            house: 'Gryffindor',
            image: 'https://hp-api.local/xss.png',
          },
        ],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await when('uživatel prohraje hru', async () => {
      await guessLetters(page, ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'o']);
    });

    await then('payload je v modalu zobrazen jako text a nespustí se alert', async () => {
      await expectModalOpen(page, 'Došly životy!');
      await expect(page.locator(selectors.modalHighlight).first()).toHaveText('<script>alert(1)</script>');
      expect(dialogShown).toBe(false);
    });
  });
});
