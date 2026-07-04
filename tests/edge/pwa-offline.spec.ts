import { test, expect } from '@playwright/test';
import { setupGameMocks } from '../helpers/api';
import { waitForHangmanReady, clickNewGame } from '../helpers/hangman';
import { given, when, then } from '../helpers/gwt';

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
  test('E44.01: game remains playable offline after initial load', { tag: '@edge' }, async ({ page, context }) => {
    await given('hra je načtená a service worker je aktivní', async () => {
      await setupGameMocks(page);
      await page.goto('/guess-character-name/');
      await waitForHangmanReady(page);
      await waitForServiceWorker(page);
    });

    await when('prohlížeč přejde do offline režimu a uživatel spustí novou hru', async () => {
      await context.setOffline(true);
      await clickNewGame(page);
      await waitForHangmanReady(page);
    });

    await then('hra zůstane hratelná', async () => {
      await expect(page.locator('#guessBtn')).toBeEnabled();
    });
  });

  test('E45.01: service worker registers successfully', { tag: '@edge' }, async ({ page }) => {
    await given('uživatel otevře hlavní menu', async () => {
      await setupGameMocks(page);
      await page.goto('/');
    });

    await then('service worker se úspěšně zaregistruje', async () => {
      await waitForServiceWorker(page);
    });
  });
});
