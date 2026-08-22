import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { waitForRpsReady } from '../helpers/duel';
import { waitForChatReady } from '../helpers/chat';
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
  { path: '/chat-with-character/', wait: waitForChatReady },
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

  /**
   * Deny by default. Anything not named below fails the test.
   *
   * The previous version did the opposite: it flagged only messages containing
   * 'ReferenceError', 'Failed to load' or 'is not defined', so an ordinary
   * "TypeError: Cannot read properties of undefined" went straight through. An
   * allowlist of three substrings is a sieve, not a check.
   *
   * This test owns the console-error signal for the whole app, which is why the
   * matching Lighthouse audit (errors-in-console) is switched off in
   * lighthouserc.json: Lighthouse can only say "there was an error", this can say
   * which one is expected and why.
   */
  const EXPECTED_CONSOLE_ERRORS = [
    // Logged once per page load, and harmless. 'frame-ancestors' is spec'd to be
    // ignored in a <meta> CSP — it binds only as an HTTP header, and netlify.toml
    // and docker/nginx.conf both send it, so the clickjacking protection is real.
    // The meta copy carries the directive because the policy has a single source of
    // truth (scripts/security-headers.mjs); splitting it in two to silence one log
    // line would be the worse trade.
    "The Content Security Policy directive 'frame-ancestors' is ignored",
  ];

  test('S04.01: shared scripts load without unexpected console errors', { tag: '@smoke' }, async ({ page }) => {
    const unexpected: string[] = [];

    // An uncaught exception is never expected, whatever it says.
    page.on('pageerror', (error) => {
      unexpected.push(`[pageerror] ${error.message}`);
    });

    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      if (EXPECTED_CONSOLE_ERRORS.some(expected => text.includes(expected))) return;
      unexpected.push(text);
    });

    await given('uživatel postupně navštíví všechny hry', async () => {
      await setupGameMocks(page);

      for (const game of allGamePages) {
        await page.goto(game.path);
        await game.wait(page);
      }
    });

    await then('v konzoli se neobjeví žádná neočekávaná chyba', async () => {
      expect(unexpected).toEqual([]);
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

    await then('zobrazí se hlavní menu se šesti kartami her', async () => {
      await expect(page).toHaveURL(/\/index\.html?$|\/$/);
      await expect(page.locator(selectors.gameCard)).toHaveCount(6);
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
