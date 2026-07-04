import { test, expect } from '@playwright/test';
import { charactersFixture, setupGameMocks } from '../helpers/api';
import { waitForQuizReady } from '../helpers/hangman';

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
  test('E46: update banner appears after SW update message', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page);
    await page.goto('/');
    await waitForServiceWorker(page);

    await page.evaluate(() => {
      navigator.serviceWorker.dispatchEvent(
        new MessageEvent('message', { data: { type: 'SW_UPDATED' } })
      );
    });

    await expect(page.locator('#swUpdateBanner')).toBeVisible();
    await expect(page.locator('#swUpdateMessage')).not.toBeEmpty();
    await expect(page.locator('#swUpdateReloadBtn')).toBeVisible();
  });

  test('E47: HTML navigation uses network-first content', { tag: '@edge' }, async ({ page }) => {
    await setupGameMocks(page);
    await page.goto('/');
    await waitForServiceWorker(page);

    await page.route('**/index.html', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!DOCTYPE html><html lang="cs"><body><main id="main-content"><h1 id="network-first-marker">Network First Marker</h1></main></body></html>',
      });
    });

    await page.goto('/index.html');
    await expect(page.locator('#network-first-marker')).toHaveText('Network First Marker');
  });
});

test.describe('Prefetch cache @edge', () => {
  test('E48: menu prefetch warms cache before entering game', { tag: '@edge' }, async ({ page }) => {
    let charactersApiCalls = 0;

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

    const callsAfterPrefetch = charactersApiCalls;
    await page.goto('/guess-house/');
    await waitForQuizReady(page);

    expect(charactersApiCalls).toBe(callsAfterPrefetch);
  });
});
