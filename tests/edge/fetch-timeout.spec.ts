import { test, expect } from '@playwright/test';
import {
  mockFetchHang,
  mockCharacters,
  mockImages,
  mockFallbackFailure,
  setFetchTimeout,
  clearSessionStorage,
} from '../helpers/api';
import { clickNewGame, waitForHangmanReady } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';
import { GAME_CONFIG } from '../../src/shared/config';

test.describe('Fetch timeout @edge', () => {
  test('E23.01: hangman shows timeout error and recovers on new game', { tag: '@edge' }, async ({ page }) => {
    await given('API request visí a fallback selže', async () => {
      await setFetchTimeout(page, 100);
      await mockFetchHang(page, 'characters');
      await mockFallbackFailure(page, 'characters');
      await mockImages(page);
      await page.goto('/');
      await page.evaluate(() => sessionStorage.clear());
      await page.goto('/guess-character-name/');
    });

    await then('zobrazí se chybová hláška o timeoutu', async () => {
      await expect(page.locator('#message')).toHaveClass(/error/, { timeout: 15000 });
      await expect(page.locator('#message')).toContainText('příliš dlouho');
      await expect(page.locator('#newGameBtn')).toBeEnabled();
    });

    await when('timeout se prodlouží, API se obnoví a uživatel spustí novou hru', async () => {
      await page.evaluate(() => {
        // The budget bounds the whole load, so raising only the per-attempt timeout
        // would leave the retry with no room to run in.
        window.__HP_FETCH_TIMEOUT_MS = 15_000;
        window.__HP_API_BUDGET_MS = 15_000;
      });
      // The load-rate cooldown is measured from when the *previous* load started, and
      // that one now fails in a fraction of a second instead of grinding through three
      // timeouts. Clicking straight away lands inside the cooldown and is refused —
      // correctly, but it is not what this test is about.
      await page.waitForTimeout(GAME_CONFIG.NEW_GAME_COOLDOWN_MS);
      await page.unroute('**/api/characters');
      await page.unroute('**/shared/fixtures/characters.json');
      await mockCharacters(page, [
        { id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' },
      ]);
      await clickNewGame(page);
      await waitForHangmanReady(page);
    });

    await then('hra se načte a je hratelná', async () => {
      await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
    });
  });

  // Retries exist for a connection that drops fast — that one fails, costs almost
  // nothing, and fits inside the budget with room for every attempt.
  test('E24.01: retries a fast-failing request and loads on a later attempt', { tag: '@edge' }, async ({ page }) => {
    let attempts = 0;

    await given('první dva API requesty spadnou hned a třetí uspěje', async () => {
      await setFetchTimeout(page, 100, 10_000);
      await page.route('**/api/characters', async (route) => {
        attempts++;
        if (attempts < 3) {
          await route.abort('failed');
          return;
        }
        await route.fulfill({
          json: [{ id: '1', name: 'Albus', house: 'Gryffindor', image: 'https://hp-api.local/albus.png' }],
        });
      });
      await mockImages(page);
      await page.goto('/');
      await page.evaluate(() => sessionStorage.clear());
      await page.goto('/guess-character-name/');
    });

    await then('hra se načte po třetím pokusu', async () => {
      await waitForHangmanReady(page);
      expect(attempts).toBe(3);
      await expect(page.locator('#wordDisplay .word-group')).toHaveCount(1);
    });
  });

  // A hung connection is the opposite case: one attempt eats the whole budget, so
  // there is nothing left to retry with and the fixtures answer instead. Retrying it
  // three times is what left the player on a spinner for 48 s (charter #1).
  test('E24.02: does not retry a hung request, it falls back instead', { tag: '@edge' }, async ({ page }) => {
    let attempts = 0;

    await given('API visí a rozpočet je stejný jako timeout, jako v produkci', async () => {
      await setFetchTimeout(page, 300);
      await page.route('**/api/characters', async () => {
        attempts++;
        await new Promise(() => {});
      });
      await mockImages(page);
      // Straight to the game: the menu prefetches game data, and that request would be
      // counted here as an attempt the game page never made.
      await clearSessionStorage(page);
      await page.goto('/guess-character-name/');
    });

    await then('proběhl jediný pokus a hra běží z fixtures', async () => {
      await waitForHangmanReady(page);
      expect(attempts).toBe(1);
      // The fixtures pick their own character, so assert the round is playable rather
      // than pinning a word shape that belongs to a mock.
      await expect(page.locator('#wordDisplay .letter-slot').first()).toBeVisible();
    });
  });
});
