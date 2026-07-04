import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, clickNewGame } from '../helpers/hangman';

async function waitForServiceWorker(page: import('@playwright/test').Page) {
  await page.waitForFunction(async () => {
    if (!('serviceWorker' in navigator)) {
      return false;
    }
    const registration = await navigator.serviceWorker.getRegistration('/shared/sw.js');
    return Boolean(registration?.active);
  });
}

test.describe('PWA offline @edge', () => {
  test('E44: game remains playable offline after initial load', { tag: '@edge' }, async ({ page, context }) => {
    await setupGameMocks(page);
    await page.goto('/guess-character-name/');
    await waitForHangmanReady(page);
    await waitForServiceWorker(page);

    await context.setOffline(true);
    await clickNewGame(page);
    await waitForHangmanReady(page);
    await expect(page.locator('#guessBtn')).toBeEnabled();
  });

  test('E45: service worker registers successfully', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page);
    await page.goto('/');
    await waitForServiceWorker(page);
  });
});
