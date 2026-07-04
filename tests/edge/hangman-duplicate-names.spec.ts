import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady } from '../helpers/hangman';
import { given, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Hangman duplicate names @edge', () => {
  test('E22.01: dedupes duplicate character names in deck', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená se dvěma postavami se stejným jménem Tom Riddle', async () => {
      await setupGameMocks(page, {
        characters: [
          { id: '1', name: 'Tom Riddle', house: 'Slytherin', image: 'https://hp-api.local/tom1.png' },
          { id: '2', name: 'Tom Riddle', house: 'Slytherin', image: 'https://hp-api.local/tom2.png' },
        ],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await then('počet slotů odpovídá délce deduplikovaného jména', async () => {
      const slotCount = await page.locator(`${selectors.wordDisplay} ${selectors.letterSlot}:not(.space)`).count();
      expect(slotCount).toBe('Tom Riddle'.replace(/ /g, '').length);
    });
  });
});
