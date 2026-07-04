import { test, expect } from '@playwright/test';
import { charactersFixture, setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';
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

test.describe('SW update @edge', () => {
  test('E46.01: update banner appears after SW update message', { tag: '@edge' }, async ({ page }) => {
    await given('service worker je registrovaný na hlavní stránce', async () => {
      await setupGameMocks(page);
      await page.goto('/');
      await waitForServiceWorker(page);
    });

    await when('service worker pošle zprávu o aktualizaci', async () => {
      await page.evaluate(() => {
        navigator.serviceWorker.dispatchEvent(
          new MessageEvent('message', { data: { type: 'SW_UPDATED' } })
        );
      });
    });

    await then('zobrazí se banner s tlačítkem pro reload', async () => {
      await expect(page.locator('#swUpdateBanner')).toBeVisible();
      await expect(page.locator('#swUpdateMessage')).not.toBeEmpty();
      await expect(page.locator('#swUpdateReloadBtn')).toBeVisible();
    });
  });

  test('E47.01: HTML navigation uses network-first content', { tag: '@edge' }, async ({ page }) => {
    await given('service worker je registrovaný', async () => {
      await setupGameMocks(page);
      await page.goto('/');
      await waitForServiceWorker(page);
    });

    await when('uživatel naviguje na index.html a síť vrátí nový obsah', async () => {
      await page.route('**/index.html', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<!DOCTYPE html><html lang="cs"><body><main id="main-content"><h1 id="network-first-marker">Network First Marker</h1></main></body></html>',
        });
      });
      await page.goto('/index.html');
    });

    await then('zobrazí se obsah ze sítě, ne z cache', async () => {
      await expect(page.locator('#network-first-marker')).toHaveText('Network First Marker');
    });
  });
});

test.describe('Prefetch cache @edge', () => {
  test('E48.01: menu prefetch warms cache before entering game', { tag: '@edge' }, async ({ page }) => {
    let charactersApiCalls = 0;

    let callsAfterPrefetch = 0;

    await given('menu prefetch načte data postav do session cache', async () => {
      await page.route('**/api/characters', (route) => {
        charactersApiCalls += 1;
        route.fulfill({ json: charactersFixture });
      });
      await page.route('**/api/spells', (route) => {
        route.fulfill({ json: [{ name: 'Lumos' }] });
      });

      await page.goto('/');
      await page.waitForFunction(() => {
        return sessionStorage.getItem('hp-games-characters-v5') !== null;
      });
      callsAfterPrefetch = charactersApiCalls;
    });

    await when('uživatel přejde do hry Hádej kolej', async () => {
      await page.goto('/guess-house/');
      await waitForQuizReady(page);
    });

    await then('počet API volání se nezvýší oproti prefetchi', async () => {
      expect(charactersApiCalls).toBe(callsAfterPrefetch);
    });
  });
});
