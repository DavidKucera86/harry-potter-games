import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  waitForQuizReady,
  guessLetters,
  expectModalOpen,
} from '../helpers/hangman';

const isProduction = (process.env.PLAYWRIGHT_TARGET ?? 'local') === 'production';

test.describe('Visual regression @visual', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(isProduction, 'Visual tests run only against local build');
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('V01: menu page layout', { tag: '@visual' }, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-content .game-grid')).toHaveScreenshot('menu-game-grid.png');
  });

  test('V02: hangman ready state', { tag: '@visual' }, async ({ page }) => {
    await setupGameMocks(page, { random: 0 });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
    await expect(page.locator('.game-container')).toHaveScreenshot('hangman-ready.png');
  });

  test('V03: quiz house ready state', { tag: '@visual' }, async ({ page }) => {
    await setupGameMocks(page, { random: 0 });
    await page.goto('/guess-house/');
    await waitForQuizReady(page);
    await expect(page.locator('.game-container')).toHaveScreenshot('quiz-house-ready.png');
  });

  test('V04: photo quiz ready state', { tag: '@visual' }, async ({ page }) => {
    await setupGameMocks(page, { random: 0 });
    await page.goto('/who-is-on-photo/');
    await waitForQuizReady(page);
    await expect(page.locator('.game-container')).toHaveScreenshot('photo-quiz-ready.png');
  });

  test('V05: hangman lose modal', { tag: '@visual' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
    await guessLetters(page, ['q', 'w', 'e', 'r', 't', 'y', 'i', 'o', 'p', 'd']);
    await expectModalOpen(page, 'Došly životy!');
    await expect(page.locator('#overlay')).toHaveScreenshot('hangman-lose-modal.png');
  });
});
