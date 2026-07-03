import { test, expect } from '@playwright/test';
import { setupGameMocks, charactersFixture } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

const photoCharacters = charactersFixture.filter(
  (c) => c.id !== '4' && c.id !== '99'
).slice(0, 4);

test.describe('Who is on photo @critical', () => {
  test('Q2: correct name answer increases score', { tag: '@critical' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: photoCharacters,
      random: 0,
    });
    await page.goto('/who-is-on-photo/');
    await waitForQuizReady(page);

    const photoSrc = await page.locator(selectors.characterPhoto).getAttribute('src');
    const correct = photoCharacters.find((character) => character.image === photoSrc);
    expect(correct).toBeTruthy();

    await page.locator(selectors.choices).filter({ hasText: correct!.name }).click();

    await expect(page.locator('#message')).toHaveClass(/success/);
    await expect(page.locator(selectors.score)).toHaveText('1');
  });
});
