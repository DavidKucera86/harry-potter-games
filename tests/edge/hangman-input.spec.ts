import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetter, guessLetters, expectModalOpen } from '../helpers/hangman';

test.describe('Hangman input @edge', () => {
  test.beforeEach(async ({ page }) => {
    await setupGameMocks(page, {
      characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
  });

  test('E01: invalid input shows error message', { tag: '@edge' }, async ({ page }) => {
    await guessLetter(page, '');
    await expect(page.locator('#message')).toHaveClass(/error/);
    await expect(page.locator('#message')).toContainText('platné písmeno');

    await guessLetter(page, '1');
    await expect(page.locator('#message')).toContainText('platné písmeno');
  });

  test('E02: duplicate letter shows error', { tag: '@edge' }, async ({ page }) => {
    await guessLetter(page, 'q');
    await expect(page.locator('#message')).toHaveClass(/error/);

    await guessLetter(page, 'q');
    await expect(page.locator('#message')).toContainText('už jsi hádal');
  });

  test('E03: Enter key submits guess', { tag: '@edge' }, async ({ page }) => {
    await page.locator('#letterInput').fill('a');
    await page.locator('#letterInput').press('Enter');
    await expect(page.locator('#message')).toHaveClass(/success/);
  });

  test('E04: win via Enter on last letter keeps modal open', { tag: '@edge' }, async ({ page }) => {
    await guessLetters(page, ['a', 'l', 'b', 'u']);
    await page.locator('#letterInput').fill('s');
    await page.locator('#letterInput').press('Enter');
    await expectModalOpen(page, 'Gratulujeme!');
  });

  test('E05: lose via Enter on last wrong letter keeps modal open', { tag: '@edge' }, async ({ page }) => {
    await guessLetters(page, ['q', 'w', 'e', 'r', 't', 'y', 'i', 'o', 'p']);
    await page.locator('#letterInput').fill('d');
    await page.locator('#letterInput').press('Enter');
    await expectModalOpen(page, 'Došly životy!');
  });
});

test.describe('Hangman spell input @edge', () => {
  test('E06: win spell via Enter on last letter keeps modal open', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      spells: [{ name: 'Lumos' }],
      random: 0,
    });
    await page.goto('/guess-spell/');
    await waitForHangmanReady(page);

    await guessLetters(page, ['l', 'u', 'm', 'o']);
    await page.locator('#letterInput').fill('s');
    await page.locator('#letterInput').press('Enter');
    await expectModalOpen(page, 'Gratulujeme!');
  });
});
