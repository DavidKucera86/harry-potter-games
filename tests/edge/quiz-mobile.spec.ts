import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { houseByName, quizCharacters } from '../helpers/quiz';
import { selectors } from '../helpers/selectors';

test.describe('Quiz mobile viewport @edge', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('E30: guess-house renders four choices on mobile', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej kolej je načtená na mobilním viewportu', async () => {
      await setupGameMocks(page, { characters: quizCharacters, random: 0 });
      await page.goto('/guess-house/');
      await waitForQuizReady(page);
    });

    await then('kvíz zobrazí čtyři možnosti', async () => {
      await expect(page.locator(selectors.choices)).toHaveCount(4);
    });

    await when('uživatel vybere správnou kolej', async () => {
      const name = await page.locator(selectors.characterName).textContent();
      await page.locator(selectors.choices).filter({ hasText: houseByName[name!] }).click();
    });

    await then('odpověď je úspěšná', async () => {
      await expect(page.locator('#message')).toHaveClass(/success/);
    });
  });

  test('E31: who-is-on-photo renders photo and choices on mobile', { tag: '@edge' }, async ({ page }) => {
    await given('hra Kdo je na fotce je načtená na mobilním viewportu', async () => {
      await setupGameMocks(page, { characters: quizCharacters, random: 0 });
      await page.goto('/who-is-on-photo/');
      await waitForQuizReady(page);
    });

    await then('zobrazí se fotka se čtyřmi možnostmi a správným alt textem', async () => {
      await expect(page.locator(selectors.characterPhoto)).toBeVisible();
      await expect(page.locator(selectors.choices)).toHaveCount(4);
      await expect(page.locator(selectors.characterPhoto)).toHaveAttribute(
        'alt',
        'Fotografie postavy — hádej jméno'
      );
    });
  });
});
