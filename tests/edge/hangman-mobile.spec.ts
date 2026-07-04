import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  expectNoHorizontalOverflow,
  expectFullyInViewport,
  expectLetterSlotsInViewport,
  expectLetterSlotSizes,
} from '../helpers/hangman';
import { selectors } from '../helpers/selectors';

test.describe('Hangman mobile viewport @edge', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('E32: character long name fits without horizontal overflow', { tag: '@edge' }, async ({ page }) => {
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

  test('E33: character long single word fits without overflow', { tag: '@edge' }, async ({ page }) => {
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

  test('E34: spell long word fits without horizontal overflow', { tag: '@edge' }, async ({ page }) => {
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

  test('E35: input and guess button fully visible on mobile', { tag: '@edge' }, async ({ page }) => {
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

  test('E36: short viewport with focused input has no horizontal overflow', { tag: '@edge' }, async ({ page }) => {
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

  test('E37: short word has readable slot size on mobile', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page, {
      characters: [
        {
          id: '1',
          name: 'Severus',
          house: 'Slytherin',
          image: 'https://hp-api.local/severus.png',
        },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await expectLetterSlotSizes(page, { min: 32 });
    await expectNoHorizontalOverflow(page);
    await expectLetterSlotsInViewport(page);
  });

  test('E38: short word has larger slot size on desktop', { tag: '@edge' }, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await setupGameMocks(page, {
      characters: [
        {
          id: '1',
          name: 'Severus',
          house: 'Slytherin',
          image: 'https://hp-api.local/severus.png',
        },
      ],
      random: 0,
    });
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);

    await expectLetterSlotSizes(page, { min: 40, max: 54 });
    await expectNoHorizontalOverflow(page);
  });
});
