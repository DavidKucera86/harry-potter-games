import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { houseByName, quizCharacters } from '../helpers/quiz';
import { selectors } from '../helpers/selectors';

test.describe('Deck uniqueness @edge', () => {
  test('E10: no duplicate characters within a deck cycle', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, { characters: quizCharacters, random: 0.1 });
    await page.goto('/guess-house/');
    await waitForQuizReady(page);

    const seen = new Set<string>();

    for (let round = 0; round < 3; round++) {
      const name = await page.locator(selectors.characterName).textContent();
      expect(name).toBeTruthy();
      expect(seen.has(name!)).toBe(false);
      seen.add(name!);

      await page.locator(selectors.choices).filter({ hasText: houseByName[name!] }).click();
      if (round < 2) {
        await expect(page.locator(selectors.choices).first()).toBeEnabled({ timeout: 2000 });
      }
    }
  });
});
