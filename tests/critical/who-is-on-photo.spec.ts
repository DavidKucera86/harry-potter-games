import { test, expect } from '@playwright/test';
import { setupGameMocks, charactersFixture } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

const photoCharacters = charactersFixture.filter(
  (c) => c.id !== '4' && c.id !== '99'
).slice(0, 4);

test.describe('Who is on photo @critical', () => {
  test('Q2: correct name answer increases score', { tag: '@critical' }, async ({ page }) => {
    await given('hra Kdo je na fotce je načtená s mockovanými postavami', async () => {
      await setupGameMocks(page, {
        characters: photoCharacters,
        random: 0,
      });
      await page.goto('/who-is-on-photo/');
      await waitForQuizReady(page);
    });

    await when('uživatel vybere správné jméno postavy na fotce', async () => {
      const photoSrc = await page.locator(selectors.characterPhoto).getAttribute('src');
      const correct = photoCharacters.find((character) => character.image === photoSrc);
      expect(correct).toBeTruthy();
      await page.locator(selectors.choices).filter({ hasText: correct!.name }).click();
    });

    await then('skóre se zvýší na 1', async () => {
      await expect(page.locator('#message')).toHaveClass(/success/);
      await expect(page.locator(selectors.score)).toHaveText('1');
    });
  });
});
