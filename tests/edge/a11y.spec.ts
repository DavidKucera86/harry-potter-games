import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, waitForQuizReady } from '../helpers/hangman';
import { waitForRpsReady } from '../helpers/duel';
import { sendMessage, startChat, suggestions, waitForChatReady } from '../helpers/chat';
import { given, when, then } from '../helpers/gwt';

const gamePages = [
  { id: 'E39.01', path: '/guess-character-name/', ready: waitForHangmanReady },
  { id: 'E40.01', path: '/guess-spell/', ready: waitForHangmanReady },
  { id: 'E41.01', path: '/guess-house/', ready: waitForQuizReady },
  { id: 'E42.01', path: '/who-is-on-photo/', ready: waitForQuizReady },
  { id: 'E53.01', path: '/rock-paper-scissors/', ready: waitForRpsReady },
];

test.describe('Accessibility @edge', () => {
  test('E49.01: menu page has no serious axe violations', { tag: '@edge' }, async ({ page }) => {
    await given('uživatel otevře hlavní menu', async () => {
      await page.goto('/');
    });

    let serious: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'] = [];
    await when('proběhne axe accessibility scan', async () => {
      const results = await new AxeBuilder({ page }).analyze();
      serious = results.violations.filter(
        violation => violation.impact === 'serious' || violation.impact === 'critical'
      );
    });

    await then('nejsou nalezeny serious ani critical porušení', async () => {
      expect(serious).toEqual([]);
    });
  });

  test('E56.01: honours prefers-reduced-motion by neutralising animations', { tag: '@edge' }, async ({ page }) => {
    await given('uživatel má v systému zapnuté omezení pohybu', async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/guess-house/');
    });

    await then('nekonečná animace spinneru je potlačená', async () => {
      const durationSeconds = await page.locator('.spinner').evaluate((el) => {
        const value = getComputedStyle(el).animationDuration;
        return value.endsWith('ms') ? parseFloat(value) / 1000 : parseFloat(value);
      });
      expect(durationSeconds).toBeLessThan(0.05);
    });
  });

  // The chat page needs a nickname and a message before its interesting parts
  // exist, so it cannot be driven from the `gamePages` table above.
  test('E59.01: the chat room with suggestion chips has no serious axe violations', { tag: '@edge' }, async ({ page }) => {
    await given('hráč je v chatu s Brumbálem a vidí návrhy otázek', async () => {
      await page.goto('/chat-with-character/');
      await waitForChatReady(page);
      await startChat(page, 'Harry');
      await sendMessage(page, 'Co je viteál?');
      await expect(suggestions(page)).toHaveCount(3);
    });

    let serious: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'] = [];
    await when('proběhne axe accessibility scan', async () => {
      const results = await new AxeBuilder({ page }).analyze();
      serious = results.violations.filter(
        violation => violation.impact === 'serious' || violation.impact === 'critical'
      );
    });

    await then('nejsou nalezeny serious ani critical porušení', async () => {
      expect(serious).toEqual([]);
    });
  });

  for (const game of gamePages) {
    test(`${game.id}: ${game.path} has no serious axe violations`, { tag: '@edge' }, async ({ page }) => {
      await given(`hra na adrese ${game.path} je načtená`, async () => {
        await setupGameMocks(page);
        await page.goto(game.path);
        await game.ready(page);
      });

      let serious: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'] = [];
      await when('proběhne axe accessibility scan', async () => {
        const results = await new AxeBuilder({ page }).analyze();
        serious = results.violations.filter(
          violation => violation.impact === 'serious' || violation.impact === 'critical'
        );
      });

      await then('nejsou nalezeny serious ani critical porušení', async () => {
        expect(serious).toEqual([]);
      });
    });
  }
});
