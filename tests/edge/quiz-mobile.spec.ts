import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { houseByName, quizCharacters } from '../helpers/quiz';
import { selectors } from '../helpers/selectors';

test.describe('Quiz mobile viewport @edge', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('E19: guess-house renders four choices on mobile', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, { characters: quizCharacters, random: 0 });
    await page.goto('/guess-house/');
    await waitForQuizReady(page);

    await expect(page.locator(selectors.choices)).toHaveCount(4);
    const name = await page.locator(selectors.characterName).textContent();
    await page.locator(selectors.choices).filter({ hasText: houseByName[name!] }).click();
    await expect(page.locator('#message')).toHaveClass(/success/);
  });

  test('E20: who-is-on-photo renders photo and choices on mobile', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, { characters: quizCharacters, random: 0 });
    await page.goto('/who-is-on-photo/');
    await waitForQuizReady(page);

    await expect(page.locator(selectors.characterPhoto)).toBeVisible();
    await expect(page.locator(selectors.choices)).toHaveCount(4);
    await expect(page.locator(selectors.characterPhoto)).toHaveAttribute(
      'alt',
      'Fotografie postavy — hádej jméno'
    );
  });
});
