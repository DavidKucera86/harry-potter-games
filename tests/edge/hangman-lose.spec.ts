import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetters, expectModalOpen } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Hangman lose @edge', () => {
  test('E04.02: losing all lives shows defeat modal with answer', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej postavu je načtená s mockovanou postavou „Albus“', async () => {
      await setupGameMocks(page, {
        characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await when('uživatel minul všech deset životů', async () => {
      await guessLetters(page, ['q', 'w', 'e', 'r', 't', 'y', 'i', 'o', 'p', 'd']);
    });

    await then('zobrazí se proherní modal s odpovědí a seznamem špatných písmen', async () => {
      await expectModalOpen(page, 'Došly životy!');
      await expect(page.locator(selectors.modalHighlight).first()).toHaveText('Albus');
      await expect(page.locator('#modalText')).toContainText('Špatná písmena:');
      await expect(page.locator(selectors.modalHighlight).nth(2)).toHaveText('Q W E R T Y I O P D');
    });
  });
});
