import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { quizCharacters } from '../helpers/quiz';
import { selectors } from '../helpers/selectors';

test.describe('Guess house @critical', () => {
  test('Q1: correct house answer increases score and starts new round', { tag: '@critical' }, async ({ page }) => {
    await setupGameMocks(page, { characters: quizCharacters, random: 0 });
    await page.goto('/guess-house/');
    await waitForQuizReady(page);

    await expect(page.locator(selectors.characterName)).not.toBeEmpty();
    const name = await page.locator(selectors.characterName).textContent();
    const house = quizCharacters.find((c) => c.name === name)?.house;
    expect(house).toBeTruthy();

    await page.locator(selectors.choices).filter({ hasText: house! }).click();

    await expect(page.locator('#message')).toHaveClass(/success/);
    await expect(page.locator(selectors.score)).toHaveText('1');

    await expect(page.locator(selectors.choices).first()).toBeEnabled({ timeout: 2000 });
    await expect(page.locator('#message')).toContainText('Vyber kolej');
  });
});
