import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  expectNoHorizontalOverflow,
  expectFullyInViewport,
  expectLetterSlotsInViewport,
} from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Hangman mobile viewport @edge', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('E21: character long name fits without horizontal overflow', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        {
          id: '2',
          name: 'Nearly Headless Nick',
          house: 'Gryffindor',
          image: 'https://hp-api.local/nick.png',
        },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await expectNoHorizontalOverflow(page);
    await expectLetterSlotsInViewport(page);
    await expectFullyInViewport(page, selectors.guessBtn);
    await expectFullyInViewport(page, selectors.letterInput);
  });

  test('E22: character long single word fits without overflow', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        {
          id: '1',
          name: 'Bellatrix Lestrange',
          house: 'Slytherin',
          image: 'https://hp-api.local/bellatrix.png',
        },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await expectNoHorizontalOverflow(page);
    await expectLetterSlotsInViewport(page);
    await expect(page.locator(selectors.wordGroup)).toHaveCount(2);
  });

  test('E23: spell long word fits without horizontal overflow', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      spells: [{ name: 'Expelliarmus' }],
      random: 0,
    });
    await page.goto('/guess-spell/');
    await waitForHangmanReady(page);

    await expectNoHorizontalOverflow(page);
    await expectLetterSlotsInViewport(page);
    await expect(page.locator(selectors.wordGroup)).toHaveCount(1);
    await expect(page.locator(`${selectors.wordGroup} .letter-slot:not(.space)`)).toHaveCount(12);
  });

  test('E24: input and guess button fully visible on mobile', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        {
          id: '1',
          name: 'Harry Potter',
          house: 'Gryffindor',
          image: 'https://hp-api.local/harry.png',
        },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await expect(page.locator(selectors.guessBtn)).toBeVisible();
    await expect(page.locator(selectors.letterInput)).toBeVisible();
    await expectFullyInViewport(page, selectors.guessBtn);
    await expectFullyInViewport(page, selectors.letterInput);
    await expectNoHorizontalOverflow(page);
  });

  test('E25: short viewport with focused input has no horizontal overflow', { tag: '@edge' }, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 400 });
    await setupGameMocks(page, {
      spells: [{ name: 'Expelliarmus' }],
      random: 0,
    });
    await page.goto('/guess-spell/');
    await waitForHangmanReady(page);

    await page.locator(selectors.letterInput).focus();
    await expectNoHorizontalOverflow(page);
    await expectLetterSlotsInViewport(page);
    await expectFullyInViewport(page, selectors.guessBtn);
  });
});
