import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, guessLetter, guessLetters, expectModalOpen } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';

test.describe('Hangman input @edge', () => {
  test.beforeEach(async ({ page }) => {
    await given('hra Hádej postavu je načtená s mockovanou postavou „Albus“', async () => {
      await setupGameMocks(page, {
        characters: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
        random: 0,
      });
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });
  });

  test('E01.01: invalid input shows error message', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel odešle prázdný vstup', async () => {
      await guessLetter(page, '');
    });
    await then('zobrazí se chybová hláška o platném písmenu', async () => {
      await expect(page.locator('#message')).toHaveClass(/error/);
      await expect(page.locator('#message')).toContainText('platné písmeno');
    });

    await when('uživatel odešle číslici', async () => {
      await guessLetter(page, '1');
    });
    await then('zobrazí se stejná chybová hláška', async () => {
      await expect(page.locator('#message')).toContainText('platné písmeno');
    });
  });

  test('E02.01: duplicate letter shows error', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel poprvé uhádne písmeno q', async () => {
      await guessLetter(page, 'q');
    });
    await then('zobrazí se chybová hláška', async () => {
      await expect(page.locator('#message')).toHaveClass(/error/);
    });

    await when('uživatel znovu uhádne písmeno q', async () => {
      await guessLetter(page, 'q');
    });
    await then('zobrazí se hláška, že písmeno už bylo hádáno', async () => {
      await expect(page.locator('#message')).toContainText('už jsi hádal');
    });
  });

  test('E03.01: Enter key submits guess', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel zadá písmeno a a stiskne Enter', async () => {
      await page.locator('#letterInput').fill('a');
      await page.locator('#letterInput').press('Enter');
    });
    await then('tip je úspěšný', async () => {
      await expect(page.locator('#message')).toHaveClass(/success/);
    });
  });

  test('E04.01: win via Enter on last letter keeps modal open', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel uhádne poslední písmeno s klávesou Enter', async () => {
      await guessLetters(page, ['a', 'l', 'b', 'u']);
      await page.locator('#letterInput').fill('s');
      await page.locator('#letterInput').press('Enter');
    });
    await then('zobrazí se výherní modal', async () => {
      await expectModalOpen(page, 'Gratulujeme!');
    });
  });

  test('E05.01: lose via Enter on last wrong letter keeps modal open', { tag: '@edge' }, async ({ page }) => {
    await when('uživatel minul poslední život stiskem Enter', async () => {
      await guessLetters(page, ['q', 'w', 'e', 'r', 't', 'y', 'i', 'o', 'p']);
      await page.locator('#letterInput').fill('d');
      await page.locator('#letterInput').press('Enter');
    });
    await then('zobrazí se proherní modal', async () => {
      await expectModalOpen(page, 'Došly životy!');
    });
  });
});

test.describe('Hangman spell input @edge', () => {
  test('E06.02: win spell via Enter on last letter keeps modal open', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej zaklínadlo je načtená se slovem „Lumos“', async () => {
      await setupGameMocks(page, {
        spells: [{ name: 'Lumos' }],
        random: 0,
      });
      await page.goto('/guess-spell/');
      await waitForHangmanReady(page);
    });

    await when('uživatel uhádne poslední písmeno s klávesou Enter', async () => {
      await guessLetters(page, ['l', 'u', 'm', 'o']);
      await page.locator('#letterInput').fill('s');
      await page.locator('#letterInput').press('Enter');
    });
    await then('zobrazí se výherní modal', async () => {
      await expectModalOpen(page, 'Gratulujeme!');
    });
  });
});
