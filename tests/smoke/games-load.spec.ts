import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { waitForRpsReady } from '../helpers/duel';
import { given, when, then } from '../helpers/gwt';
import { selectors } from '../helpers/selectors';
import { testId } from '../helpers/testId';

const gamePages = [
  { path: '/guess-character-name/', wait: waitForHangmanReady },
  { path: '/guess-spell/', wait: waitForHangmanReady },
  { path: '/guess-house/', wait: waitForQuizReady },
  { path: '/who-is-on-photo/', wait: waitForQuizReady },
];

const allGamePages = [
  ...gamePages,
  { path: '/rock-paper-scissors/', wait: waitForRpsReady },
];

test.describe('Games load @smoke', () => {
  gamePages.forEach((game, i) => {
    test(`${testId('S', 3, i + 1)}: ${game.path} loads and becomes playable`, { tag: '@smoke' }, async ({ page }) => {
      await given(`hra na adrese ${game.path} je načtená s mockovanými daty`, async () => {
        await setupGameMocks(page);
        await page.goto(game.path);
        await game.wait(page);
      });

      await then('hra je hratelná se skrytým loading overlay a deseti životy', async () => {
        await expect(page.locator(selectors.loadingOverlay)).toBeHidden();
        await expect(page.locator(selectors.hearts)).toHaveCount(10);
        await expect(page.locator(selectors.newGameBtn)).toBeEnabled();
      });
    });
  });

  test('S04.01: shared scripts load without critical console errors', { tag: '@smoke' }, async ({ page }) => {
    const criticalErrors: string[] = [];

    page.on('pageerror', (error) => {
      criticalErrors.push(error.message);
    });

    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      if (
        text.includes('ReferenceError') ||
        text.includes('Failed to load') ||
        text.includes('is not defined')
      ) {
        criticalErrors.push(text);
      }
    });

    await given('uživatel postupně navštíví všechny hry', async () => {
      await setupGameMocks(page);

      for (const game of allGamePages) {
        await page.goto(game.path);
        await game.wait(page);
      }
    });

    await then('v konzoli se neobjeví kritické chyby', async () => {
      expect(criticalErrors).toEqual([]);
    });
  });

  test('S05.01: back link returns to menu', { tag: '@smoke' }, async ({ page }) => {
    await given('hra Hádej postavu je načtená', async () => {
      await setupGameMocks(page);
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
    });

    await when('uživatel klikne na odkaz zpět do menu', async () => {
      await page.locator(selectors.backLink).click();
    });

    await then('zobrazí se hlavní menu s pěti kartami her', async () => {
      await expect(page).toHaveURL(/\/index\.html?$|\/$/);
      await expect(page.locator(selectors.gameCard)).toHaveCount(5);
    });
  });

  test('S06.01: /rock-paper-scissors/ loads with a fresh scoreboard and three moves', { tag: '@smoke' }, async ({ page }) => {
    await given('hra Kámen–nůžky–papír je načtená s mockovanými daty', async () => {
      await setupGameMocks(page, { random: 0 });
      await page.goto('/rock-paper-scissors/');
      await waitForRpsReady(page);
    });

    await then('hra nabízí tři tahy a skóre je 0:0', async () => {
      await expect(page.locator(selectors.loadingOverlay)).toBeHidden();
      await expect(page.locator(selectors.moves)).toHaveCount(3);
      await expect(page.locator(selectors.playerScore)).toHaveText('0');
      await expect(page.locator(selectors.opponentScore)).toHaveText('0');
      await expect(page.locator(selectors.newGameBtn)).toBeEnabled();
    });
  });
});
