import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import {
  waitForHangmanReady,
  expectNoHorizontalOverflow,
  expectFullyInViewport,
  expectLetterSlotsInViewport,
  expectLetterSlotSizes,
} from '../helpers/hangman';
import { given, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';

test.describe('Hangman mobile viewport @edge', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('E32.01: character long name fits without horizontal overflow', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená s dlouhým jménem na mobilním viewportu', async () => {
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
    });

    await then('rozhraní se vejde bez horizontálního přetečení', async () => {
      await expectNoHorizontalOverflow(page);
      await expectLetterSlotsInViewport(page);
      await expectFullyInViewport(page, selectors.guessBtn);
      await expectFullyInViewport(page, selectors.letterInput);
    });
  });

  test('E33.01: character long single word fits without overflow', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená s dlouhým jednoslovným jménem', async () => {
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
    });

    await then('slovo se zobrazí ve dvou skupinách bez přetečení', async () => {
      await expectNoHorizontalOverflow(page);
      await expectLetterSlotsInViewport(page);
      await expect(page.locator(selectors.wordGroup)).toHaveCount(2);
    });
  });

  test('E34.01: spell long word fits without horizontal overflow', { tag: '@edge' }, async ({ page }) => {
    await given('hra Hádej zaklínadlo je načtená s dlouhým slovem Expelliarmus', async () => {
      await setupGameMocks(page, {
        spells: [{ name: 'Expelliarmus' }],
        random: 0,
      });
      await page.goto('/guess-spell/');
      await waitForHangmanReady(page);
    });

    await then('zaklínadlo se vejde bez horizontálního přetečení', async () => {
      await expectNoHorizontalOverflow(page);
      await expectLetterSlotsInViewport(page);
      await expect(page.locator(selectors.wordGroup)).toHaveCount(1);
      await expect(page.locator(`${selectors.wordGroup} .letter-slot:not(.space)`)).toHaveCount(12);
    });
  });

  test('E35.01: input and guess button fully visible on mobile', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená na mobilním viewportu', async () => {
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
    });

    await then('vstup a tlačítko Hádat jsou plně viditelné', async () => {
      await expect(page.locator(selectors.guessBtn)).toBeVisible();
      await expect(page.locator(selectors.letterInput)).toBeVisible();
      await expectFullyInViewport(page, selectors.guessBtn);
      await expectFullyInViewport(page, selectors.letterInput);
      await expectNoHorizontalOverflow(page);
    });
  });

  test('E36.01: short viewport with focused input has no horizontal overflow', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená na krátkém mobilním viewportu se zaměřeným vstupem', async () => {
      await page.setViewportSize({ width: 375, height: 400 });
      await setupGameMocks(page, {
        spells: [{ name: 'Expelliarmus' }],
        random: 0,
      });
      await page.goto('/guess-spell/');
      await waitForHangmanReady(page);
      await page.locator(selectors.letterInput).focus();
    });

    await then('rozhraní nemá horizontální přetečení', async () => {
      await expectNoHorizontalOverflow(page);
      await expectLetterSlotsInViewport(page);
      await expectFullyInViewport(page, selectors.guessBtn);
    });
  });

  test('E37.01: short word has readable slot size on mobile', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená s krátkým slovem Severus na mobilu', async () => {
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
    });

    await then('sloty písmen mají čitelnou minimální velikost', async () => {
      await expectLetterSlotSizes(page, { min: 32 });
      await expectNoHorizontalOverflow(page);
      await expectLetterSlotsInViewport(page);
    });
  });

  test('E38.01: short word has larger slot size on desktop', { tag: '@edge' }, async ({ page }) => {
    await given('hra je načtená s krátkým slovem Severus na desktopu', async () => {
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
    });

    await then('sloty písmen mají větší velikost než na mobilu', async () => {
      await expectLetterSlotSizes(page, { min: 40, max: 54 });
      await expectNoHorizontalOverflow(page);
    });
  });
});
